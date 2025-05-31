import { useState } from 'react';
import { useResume } from '../context/ResumeContext';

export default function PdfUploader() {
  const { resumeText, setResumeText, jobRole, setJobRole } = useResume();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  async function handleFileChange(e) {
    setError(null);
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result.split(',')[1];

      try {
        setLoading(true);
        const res = await fetch('/api/parseResume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pdfBase64: base64 }),
        });

        const data = await res.json();
        setResumeText(data.text);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  }

  async function handleAnalyzeClick() {
    if (!resumeText || !jobRole) {
      setError('Missing resume text or job role');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/analyzeResume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobRole }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || 'Analysis failed');
      } else {
        setAnalysis(result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h2>Smart Resume Analyzer</h2>

      <input type="file" accept="application/pdf" onChange={handleFileChange} />

      <div className="input-group">
        <label htmlFor="jobRole">Enter Job Role:</label>
        <input
            type="text"
            id="jobRole"
            placeholder="e.g., Data Analyst"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
        />
    </div>


      {resumeText && (
        <button onClick={handleAnalyzeClick} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      )}

      {loading && <p>Processing...</p>}
      {error && <p className="error">Error: {error}</p>}

      {analysis && (
        <div className="result-box">
          <h3>Resume Analysis</h3>
          <p><strong>Score:</strong> {analysis.score}/100</p>

          <div>
            <h4>Strengths</h4>
            <ul>{analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>

          <div>
            <h4>Weaknesses</h4>
            <ul>{analysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}</ul>
          </div>

          <div>
            <h4>Suggestions</h4>
            <ul>{analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 700px;
          margin: 2rem auto;
          background: #121212;
          padding: 2rem;
          border-radius: 12px;
          color: #f1f1f1;
          font-family: 'Segoe UI', sans-serif;
        }

        h2 {
          color: #90caf9;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        input[type="file"] {
          background: #1f1f1f;
          border: 1px solid #333;
          padding: 12px;
          width: 100%;
          color: #ccc;
          border-radius: 8px;
        }

        .input-group {
          margin-top: 1rem;
        }

        select {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          background: #1f1f1f;
          color: #eee;
          border: 1px solid #333;
          margin-top: 0.5rem;
        }

        button {
          margin-top: 1.5rem;
          background: #2196f3;
          color: white;
          padding: 12px;
          width: 100%;
          font-size: 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        button:disabled {
          background: #444;
        }

        .error {
          color: #f44336;
          font-weight: bold;
        }

        .result-box {
          background: #1c1c1c;
          padding: 1.5rem;
          border-radius: 10px;
          margin-top: 2rem;
        }

        h3 {
          color: #64b5f6;
          margin-bottom: 1rem;
        }

        h4 {
          margin-top: 1rem;
          color: #81c784;
        }

        ul {
          padding-left: 1.2rem;
        }

        li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}

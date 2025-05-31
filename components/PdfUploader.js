import { useState } from 'react';

export default function PdfUploader() {
  const [resumeText, setResumeText] = useState('');
  const [jobRole, setJobRole] = useState('Data Analyst');
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
    <div>
      <h2>Upload Resume (PDF)</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />

      <div style={{ marginTop: '1rem' }}>
        <label>Select Job Role: </label>
        <select value={jobRole} onChange={(e) => setJobRole(e.target.value)}>
          <option value="Data Analyst">Data Analyst</option>
          <option value="Software Engineer">Software Engineer</option>
          <option value="Product Manager">Product Manager</option>
          {/* Add more roles as needed */}
        </select>
      </div>

      {resumeText && (
        <div style={{ marginTop: '1rem' }}>
          <button onClick={handleAnalyzeClick}>Analyze Resume</button>
        </div>
      )}

      {loading && <p>Processing...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {analysis && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Resume Analysis</h3>
          <p><strong>Score:</strong> {analysis.score}/100</p>

          <h4>Strengths</h4>
          <ul>
            {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>

          <h4>Weaknesses</h4>
          <ul>
            {analysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
          </ul>

          <h4>Suggestions</h4>
          <ul>
            {analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

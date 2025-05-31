import { useState } from 'react';
import { useResume } from '../context/ResumeContext';

export default function MockInterviewPage() {
  const { resumeText, jobRole } = useResume();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function generateQuestions() {
    setError(null);
    if (!resumeText || !jobRole) {
      setError('Resume or job role is missing.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/mockInterview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setQuestions(data.questions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: 'auto', color: '#f1f1f1' }}>
      <h1>Mock Interview Questions</h1>
      <p style={{ color: '#aaa' }}>
        Based on your resume and selected role: <strong>{jobRole || 'N/A'}</strong>
      </p>

      <button onClick={generateQuestions} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Questions'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ marginTop: '2rem' }}>
        {questions.map((q, i) => (
          <li key={i} style={{ marginBottom: '1rem' }}>{q}</li>
        ))}
      </ul>
    </div>
  );
}

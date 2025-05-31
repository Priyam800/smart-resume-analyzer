export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { resumeText, jobRole } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!resumeText || !jobRole || !apiKey) {
    return res.status(400).json({ message: 'Missing input or API key' });
  }

  const prompt = `
You are a technical interviewer.

Based on the following resume and role "${jobRole}", generate 5 technical and 2 behavioral interview questions.

Only return a valid JSON like:
{
  "questions": [
    "Technical question 1?",
    "Technical question 2?",
    "Behavioral question 1?",
    ...
  ]
}

Resume:
"""
${resumeText.slice(0, 3000)}
"""
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const result = await response.json();

    const raw = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!raw || typeof raw !== 'string') {
      console.error('Gemini did not return expected text:', result);
      return res.status(500).json({ message: 'Gemini returned no usable output' });
    }

    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    const jsonString = raw.slice(jsonStart, jsonEnd + 1);

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error('Failed to parse JSON:', raw);
      return res.status(500).json({ message: 'Failed to parse questions from Gemini' });
    }

    if (!parsed.questions) {
      return res.status(500).json({ message: 'No questions found in Gemini output' });
    }

    res.status(200).json(parsed);
  } catch (err) {
    console.error('Mock Interview Error:', err);
    res.status(500).json({ message: 'Failed to generate questions' });
  }
}

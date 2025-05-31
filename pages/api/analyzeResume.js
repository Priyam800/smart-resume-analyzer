export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { resumeText, jobRole } = req.body;

  if (!resumeText || !jobRole) {
    return res.status(400).json({ message: 'Missing resume text or job role' });
  }

  try {
    const prompt = generatePrompt(resumeText, jobRole);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Missing Gemini API key' });
    }

    const response = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    })
  });


    const result = await response.json();
    // console.log('Gemini full response:', JSON.stringify(result, null, 2));

    const output = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!output) {
      return res.status(500).json({
        message: 'Gemini returned no usable output',
        raw: result,
      });
    }

    // Try to extract just the JSON part
    const start = output.indexOf('{');
    const end = output.lastIndexOf('}');
    const jsonString = output.slice(start, end + 1);

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (err) {
      return res.status(500).json({
        message: 'Failed to parse JSON from Gemini response',
        rawOutput: output,
      });
    }

    res.status(200).json(parsed);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Unexpected server error', error: error.message });
  }
}

function generatePrompt(resumeText, jobRole) {
  const truncatedText = resumeText.slice(0, 3000);

  return `
You are an expert resume reviewer.

Analyze the following resume for the role of "${jobRole}".

Only return a valid JSON object and nothing else. No explanations. No markdown. No backticks.

Format:
{
  "score": number (out of 100),
  "strengths": [array of 3-5 strong points],
  "weaknesses": [array of 3-5 weak points],
  "suggestions": [array of 3-5 specific improvements]
}

Resume:
"""
${truncatedText}
"""
`;
}

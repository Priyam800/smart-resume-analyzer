import pdf from 'pdf-parse';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb', // Increase if you expect large PDFs
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // The PDF file is sent as base64 string from the frontend
    const { pdfBase64 } = req.body;
    if (!pdfBase64) {
      return res.status(400).json({ message: 'No PDF data provided' });
    }

    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    const data = await pdf(pdfBuffer);

    res.status(200).json({ text: data.text });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

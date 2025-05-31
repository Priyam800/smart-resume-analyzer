import PdfUploader from '../components/PdfUploader';

export default function Home() {
  return (
    <main style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Smart Resume Analyzer</h1>
      <PdfUploader />
    </main>
  );
}

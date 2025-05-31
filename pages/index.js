import Head from 'next/head'
import PdfUploader from '../components/PdfUploader'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Resume Analyzer</title>
      </Head>

      <main className="container">
        <h1>AI Resume Analyzer</h1>
        <p className="subtitle">Upload your resume and get instant feedback tailored to your job role.</p>

        <PdfUploader />

        <div className="mock-link">
          <Link href="/mock-interview">👉 Try Mock Interview</Link>
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 2rem 1rem;
          max-width: 800px;
          margin: 0 auto;
          background-color: #121212;
          color: #f1f1f1;
          font-family: sans-serif;
        }

        h1 {
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 1rem;
          color: #cccccc;
        }

        .mock-link {
          text-align: center;
          margin-top: 3rem;
        }

        .mock-link a {
          color: #66ccff;
          font-weight: bold;
          text-decoration: none;
          border: 1px solid #66ccff;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          transition: 0.2s ease;
        }

        .mock-link a:hover {
          background-color: #1e1e1e;
        }
      `}</style>
    </>
  )
}

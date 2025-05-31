import { ResumeProvider } from '../context/ResumeContext';
import '../styles/globals.css'; // if you have one

export default function App({ Component, pageProps }) {
  return (
    <ResumeProvider>
      <Component {...pageProps} />
    </ResumeProvider>
  );
}

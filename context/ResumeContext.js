import { createContext, useContext, useState } from 'react';

const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const [resumeText, setResumeText] = useState('');
  const [jobRole, setJobRole] = useState('');

  return (
    <ResumeContext.Provider value={{ resumeText, setResumeText, jobRole, setJobRole }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);

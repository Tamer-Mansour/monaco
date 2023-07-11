import MonacoEditor from "react-monaco-editor";
import React, { useState, useEffect } from 'react';



const IDE = () => {
  const [code, setCode] = useState('');
  const [file, setFile] = useState();
  const [language, setLanguage] = useState('javascript');
  const handleFileChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    if (file) {
      var reader = new FileReader();
      reader.onload = async (e) => {
        setCode(e.target.result);
      };
      reader.readAsText(file);
      let newLanguage = 'javascript';
      const extension = file.name.split('.').pop();
      if (['css', 'html', 'python', 'dart'].includes(extension)) {
        newLanguage = extension;
      }
      setLanguage(newLanguage);
    }
  }, [file]);

// The Options object goes here and is passed to the editor below

  return (
    <div>
      <div>
        <input type="file" onChange={handleFileChange} /> 
      </div>
      <hr />
      <MonacoEditor
         height="90vh"
         defaultLanguage="javascript"
         defaultValue="// let's write some broken code 😈"
         onValidate={handleEditorValidation}
      />
      
    </div>
  );
};

export default IDE;

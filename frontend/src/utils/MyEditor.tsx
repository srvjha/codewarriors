import type { BeforeMount } from "@monaco-editor/react";
import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";

interface MyEditorProps {
  codeSnippet: string;
  language: string;
}

const MyEditor: React.FC<MyEditorProps> = ({ codeSnippet,language }) => {
  console.log("language: ",language.toLowerCase());
  const [code, setCode] = useState(codeSnippet);
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  // Update code when prop changes
  useEffect(() => {
    setCode(codeSnippet);
    setSelectedLanguage(language);
  }, [codeSnippet, language]);

  const handleBeforeMount: BeforeMount = (monacoInstance) => {
    monacoInstance.editor.defineTheme("chaicode", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "", background: "1E1E1E" },
        { token: "comment", foreground: "6A9955" },
        { token: "keyword", foreground: "C586C0" },
        { token: "string", foreground: "CE9178" },
        { token: "number", foreground: "B5CEA8" },
        { token: "identifier", foreground: "9CDCFE" },
      ],
      colors: {
        "editor.background": "#1e1e1e",
        "editor.foreground": "#ffffff",
      },
    });
  };

  return (
    <Editor
      height="80%"
      language={selectedLanguage.toLowerCase()} 
      value={code}
      onChange={(value) => setCode(value || "")}
      theme="chaicode"
      beforeMount={handleBeforeMount}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
};

export default MyEditor;

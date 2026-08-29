import React, { useState } from 'react';

interface CodeEditorProps {
  initialCode: string;
  onChange: (code: string) => void;
  readOnly?: boolean;
  language?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  onChange,
  readOnly = false,
  language = 'javascript',
}) => {
  const [code, setCode] = useState(initialCode);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onChange(newCode);
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
        <span className="text-sm font-mono text-gray-400">
          {language === 'typescript' ? 'TypeScript' : 'JavaScript'}
        </span>
        <span className="text-xs text-gray-500">{code.length} characters</span>
      </div>
      <textarea
        value={code}
        onChange={handleChange}
        readOnly={readOnly}
        className="w-full h-64 bg-gray-900 text-gray-100 font-mono text-sm p-4 resize-none focus:outline-none border-0"
        spellCheck="false"
        style={{
          lineHeight: '1.5',
          fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
        }}
      />
    </div>
  );
};
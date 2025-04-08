import { useRef } from 'react';
import { Editor as MonacoEditor } from '@monaco-editor/react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

export function Editor({ value, onChange, language = 'javascript' }: EditorProps) {
  const editorRef = useRef(null);

  const beforeMount = (monaco: any) => {
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'regexp', foreground: 'D16969' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'class', foreground: '4EC9B0' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
        { token: 'constant', foreground: '4FC1FF' },
      ],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.foreground': '#D4D4D4',
        'editor.lineHighlightBackground': '#2F3337',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41',
        'editorLineNumber.foreground': '#858585',
        'editorLineNumber.activeForeground': '#C6C6C6',
      },
    });
  };

  return (
    <MonacoEditor
      height="100%"
      language={language}
      value={value}
      onChange={(value) => onChange(value || '')}
      theme="custom-dark"
      beforeMount={beforeMount}
      options={{
        minimap: { enabled: true },
        fontSize: 14,
        fontFamily: "'SF Mono', Menlo, Monaco, 'Courier New', monospace",
        wordWrap: 'on',
        automaticLayout: true,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        cursorStyle: 'line',
        renderLineHighlight: 'all',
        scrollbar: {
          useShadows: false,
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
        overviewRulerBorder: false,
      }}
      onMount={(editor) => {
        editorRef.current = editor;
      }}
    />
  );
}
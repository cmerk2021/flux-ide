import React, { useState, useEffect } from 'react';
import { Play, Square } from 'lucide-react';
import { Editor } from './components/Editor';
import { Terminal } from './components/Terminal';
import { Output } from './components/Output';
import { useWebContainer } from './hooks/useWebContainer';

function App() {
  const [code, setCode] = useState(() => localStorage.getItem('code') || '// Write your code here\n');
  const [isRunning, setIsRunning] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved'>('saved');
  const { output, executeCommand, setOutput } = useWebContainer();

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('code', code);
      setSaveStatus('saved');
    }, 2000);

    setSaveStatus('unsaved');
    return () => clearTimeout(timeout);
  }, [code]);

  const handleRunCode = async () => {
    if (isRunning) return;

    setIsRunning(true);
    try {
      setOutput('');
      await executeCommand(`echo '${code.replace(/'/g, "'\\''")}' > temp.js && node temp.js`, true);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      <div className="mx-2 py-2">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-semibold text-white/90">Flux IDE</h1>
          <div className="flex items-center gap-4">
            <span
              className={`text-sm font-medium ${
                saveStatus === 'saved' ? 'text-green-500' : 'text-yellow-500'
              }`}
            >
              {saveStatus === 'saved' ? 'Saved' : 'Unsaved'}
            </span>
            <button
              onClick={handleRunCode}
              className={`flex items-center px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                isRunning
                  ? 'bg-red-600/90 hover:bg-red-700 text-white/90'
                  : 'bg-green-600/90 hover:bg-green-700 text-white/90'
              }`}
            >
              {isRunning ? (
                <>
                  <Square size={14} className="mr-1.5" />
                  Stop
                </>
              ) : (
                <>
                  <Play size={14} className="mr-1.5" />
                  Run
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-2 h-[calc(100vh-4rem)]">
          <div className="w-1/2 rounded overflow-hidden border border-[#313131]">
            <div className="h-7 bg-[#252526] px-3 flex items-center">
              <span className="text-xs font-medium text-white/70">Code Editor</span>
            </div>
            <div className="h-[calc(100%-1.75rem)]">
              <Editor value={code} onChange={setCode} language="javascript" />
            </div>
          </div>

          <div className="w-1/2 flex flex-col gap-2">
            <div className="h-[65%] rounded overflow-hidden border border-[#313131]">
              <div className="h-7 bg-[#252526] px-3 flex items-center">
                <span className="text-xs font-medium text-white/70">Output</span>
              </div>
              <div className="h-[calc(100%-1.75rem)]">
                <Output content={output} />
              </div>
            </div>

            <div className="flex-1 rounded overflow-hidden border border-[#313131]">
              <div className="h-7 bg-[#252526] px-3 flex items-center">
                <span className="text-xs font-medium text-white/70">Terminal</span>
              </div>
              <div className="h-[calc(100%-1.75rem)]">
                <Terminal
                  onCommand={async (command) => {
                    console.log('Command received:', command);
                    const output = await executeCommand(command);
                    return output;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
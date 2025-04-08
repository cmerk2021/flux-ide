import { useState } from 'react';

interface TerminalProps {
  onCommand: (command: string) => Promise<string>; // Assume async command execution
}

export function Terminal({ onCommand }: TerminalProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const trimmedInput = currentInput.trim();
      if (trimmedInput) {
        setHistory((prev) => [...prev, `$ ${trimmedInput}`]); // Add the command to history
        setCurrentInput(''); // Clear the input field
        const output = await onCommand(trimmedInput); // Execute the command
        if (output) {
          const lines = output.split('\n'); // Split output into lines
          setHistory((prev) => [...prev, ...lines]); // Add each line to the history
        }
      }
    }
  };

  return (
    <div className="h-full bg-[#1e1e1e] text-white p-2 font-mono text-sm overflow-auto">
      <div>
        {history.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      <textarea
        className="w-full bg-transparent border-none outline-none resize-none text-white"
        rows={1}
        value={currentInput}
        onChange={(e) => setCurrentInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a command..."
      />
    </div>
  );
}
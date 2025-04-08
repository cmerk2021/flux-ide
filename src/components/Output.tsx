import React from 'react';

interface OutputProps {
  content: string;
}

export function Output({ content }: OutputProps) {
  return (
    <pre className="p-2 font-mono text-sm overflow-auto bg-[#1E1E1E] text-white/90 h-full">
      {content}
    </pre>
  );
}
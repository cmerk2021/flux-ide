import { useState, useEffect, useCallback } from 'react';
import { WebContainer } from '@webcontainer/api';
import stripAnsi from 'strip-ansi';

// Static flag to track WebContainer initialization across hook instances
let isWebContainerBooted = false;

export function useWebContainer() {
  const [webcontainerInstance, setWebcontainerInstance] = useState<WebContainer | null>(null);
  const [output, setOutput] = useState<string>('');

  useEffect(() => {
    const bootWebContainer = async () => {
      if (isWebContainerBooted) return;

      try {
        isWebContainerBooted = true;
        const instance = await WebContainer.boot();
        setWebcontainerInstance(instance);
        
        await instance.mount({
          'package.json': {
            file: {
              contents: JSON.stringify({
                name: 'example-project',
                type: 'module',
                dependencies: {},
              }),
            },
          },
        });
      } catch (error) {
        isWebContainerBooted = false;
        console.error('Failed to boot WebContainer:', error);
        setOutput('Failed to initialize WebContainer');
      }
    };

    bootWebContainer();

    return () => {
      if (webcontainerInstance) {
        setWebcontainerInstance(null);
      }
    };
  }, []);

  const executeCommand = useCallback(async (command: string, isScript: boolean = false) => {
    if (!webcontainerInstance) return '';

    try {
      const process = await webcontainerInstance.spawn('sh', ['-c', command]);

      let cleanOutput = '';
      process.output.pipeTo(
        new WritableStream({
          write(data) {
            cleanOutput += stripAnsi(data).replace(/\r?\n/g, '\n'); // Clean up ANSI codes and normalize newlines
            if (isScript) {
              setOutput((prev) => prev + stripAnsi(data)); // Append to the Output component for scripts
            }
          },
        })
      );

      const exitCode = await process.exit;
      if (exitCode !== 0) {
        cleanOutput += `\nProcess exited with code ${exitCode}\n`;
        if (isScript) {
          setOutput((prev) => prev + `\nProcess exited with code ${exitCode}\n`);
        }
      }
      return cleanOutput; // Return the cleaned output for terminal commands
    } catch (error) {
      console.error('Failed to execute command:', error);
      if (isScript) {
        setOutput((prev) => prev + '\nFailed to execute command\n');
      }
      return 'Failed to execute command\n';
    }
  }, [webcontainerInstance, setOutput]);

  return { webcontainerInstance, output, executeCommand, setOutput };
}
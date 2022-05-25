import Sandbox from 'websandbox';

const sandboxContainer = document.getElementById(
  'sandbox-container',
) as HTMLElement;

const TIMEOUT_MS = 5000;

/**
 * Runs a given piece of JS code inside a Web Worker, which is
 * inside a sandboxed iframe.
 */
export const sandbox = async <T>(code: string): Promise<T> => {
  let resolve: (v: T) => void;
  let reject: (e: Error) => void;
  const sandboxReturn = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const hostApi = {
    resolve: async (v: T) => resolve(v),
    reject: async (e: Error) => reject(e),
  };

  const sandboxInstance = await Sandbox.create(hostApi, {
    frameContainer: sandboxContainer,
  }).promise;

  sandboxInstance.run(`
    let worker, timeoutId;
    const { resolve, reject } = Websandbox.connection.remote;
    
    const cleanUp = () => {
      if (worker) worker.terminate();
      clearTimeout(timeoutId);
    };
    
    try {
      timeoutId = setTimeout(() => {
        reject(
          new Error('Code execution took more than ${TIMEOUT_MS} ms.'),
        );
      }, ${TIMEOUT_MS});
    
      const blob = new Blob([\`
          const result = (function () {
            const self = {};
            ${code.replaceAll('`', '\\`').replaceAll('$', '\\$')}
          }).call({});
          const sendMessage = async () => {
            self.postMessage(await result);
          };
          sendMessage();
        \`,
      ]);
    
      worker = new Worker(URL.createObjectURL(blob));
    
      worker.onmessage = (message) => {
        resolve(message.data);
        cleanUp();
      };
      worker.onerror = (error) => {
        reject(new Error(error.message));
        cleanUp();
      };
    } catch (error) {
      reject(new Error(error.message));
      cleanUp();
    }
  `);

  sandboxReturn.finally(() => sandboxInstance.destroy());

  return sandboxReturn;
};

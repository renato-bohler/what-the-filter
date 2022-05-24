import Sandbox from 'websandbox';

const sandboxContainer = document.getElementById(
  'sandbox-container',
) as HTMLElement;

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
    try {
      Websandbox.connection.remote.resolve((() => {${code}})());
    } catch (error) {
      Websandbox.connection.remote.reject(error);
    }
  `);

  sandboxReturn.finally(() => sandboxInstance.destroy());

  return sandboxReturn;
};

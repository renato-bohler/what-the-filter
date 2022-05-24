import '@testing-library/jest-dom/extend-expect';

// matchMedia is not implemented in JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: query === '(hover: none) and (pointer: coarse)',
  }),
});

// Sandboxed JS execution does not work on test ENV
jest.mock('./execute/utils/sandbox', () => ({
  sandbox: (code: string) =>
    new Function(`
      const result = (() => {${code}})();
      return result;
    `)(),
}));

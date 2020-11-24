import '@testing-library/jest-dom/extend-expect';

// matchMedia is not implemented in JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: query === '(hover: none) and (pointer: coarse)',
  }),
});

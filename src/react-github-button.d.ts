declare module 'react-github-button' {
  type Props = {
    type: string;
    namespace: string;
    repo: string;
  };

  const Component: React.FC<Props>;

  export default Component;
}

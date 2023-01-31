import type { FC } from 'react';
import type { AppProps } from 'next/app';
import 'normalize.css';
import '~/styles/app.scss';

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};
export default App;

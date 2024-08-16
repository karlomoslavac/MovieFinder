import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Navbar from '../components/Navbar';
import { QueryClient, QueryClientProvider } from 'react-query';
import Head from 'next/head';

const queryClient = new QueryClient();

function MovieFinder({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>Movie Finder</title>
        <meta name="description" content="Find your favorite movies and keep track of your favorites." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MovieFinder;

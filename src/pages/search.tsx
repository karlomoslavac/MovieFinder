import React from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import { GetServerSideProps } from 'next';
import { Movie } from '../types';
import { useRouter } from 'next/router';

interface Props {
  movies: Movie[];
  query: string;
}

const SearchPage: React.FC<Props> = ({ movies, query }) => {
  const router = useRouter();

  const handleMovieClick = (id: number) => {
    console.log(`Navigating to movie with ID: ${id}`);
    router.push(`/movie/${id}`);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <main className="container mx-auto p-8 space-y-8">
        <section className="text-center mb-12">
          <h2 className="text-6xl font-bold bg-gray-800 inline-block py-2 px-4 rounded">
            Search Results
          </h2>
          <p className="text-3xl mt-4">
            Showing results for "{query}"
          </p>
        </section>

        <section className="text-center mb-8">
          {movies.length === 0 ? (
            <p className="text-xl">No movies found for "{query}".</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onMovieClick={handleMovieClick}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.query.query as string || '';
  console.log(`Fetching movies for query: ${query}`);

  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
        query
      }
    });
    console.log('API response:', response.data);
    return { props: { movies: response.data.results || [], query } };
  } catch (error) {
    console.error('Error fetching movies:', error);
    return { props: { movies: [], query } };
  }
};

export default SearchPage;

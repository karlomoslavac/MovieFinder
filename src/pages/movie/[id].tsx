import { GetServerSideProps } from 'next';
import axios from 'axios';
import MovieDetails from '../../components/MovieDetails';
import Head from 'next/head';
import { Movie } from '../../types';

interface Props {
  movie: Movie | null;
}

const MoviePage: React.FC<Props> = ({ movie }) => {
  return (
    <div>
      <Head>
        <title>{movie ? movie.title : 'Movie Finder'}</title>
      </Head>
      {movie ? (
        <MovieDetails movie={movie} />
      ) : (
        <div className="container mx-auto p-4 text-center text-white">
          No movie details available.
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  try {
    console.log('Fetching movie details for ID:', id);
    const movieDetailsResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}`,
      {
        params: {
          api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
          append_to_response: 'credits',
        },
      }
    );
    console.log('Movie details fetched:', movieDetailsResponse.data);

    return {
      props: {
        movie: movieDetailsResponse.data,
      },
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return {
      props: {
        movie: null,
      },
    };
  }
};

export default MoviePage;

import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import MovieCard from '../components/MovieCard';
import MoviesSlider from '../components/MovieSlider';

const fetchMovies = async (endpoint: string, params = {}) => {
  console.log(`Fetching movies from endpoint: ${endpoint} with params:`, params);
  const res = await axios.get(
    `https://api.themoviedb.org/3/${endpoint}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`,
    { params }
  );
  console.log('API response:', res.data.results);
  return res.data.results;
};

const Home = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('8');
  const [selectedGenre, setSelectedGenre] = useState(28);
  const [isClicked, setIsClicked] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: newestMovies } = useQuery('newestMovies', () => fetchMovies('movie/now_playing'));

  useQuery(['movieDetails'], () => fetchMovies('movie/now_playing'), {
    enabled: false,
    onSuccess: (data) => {
      console.log('Prefetching movie details for:', data);
      data.forEach((movie: any) => {
        queryClient.prefetchQuery(['movieDetails', movie.id], () =>
          fetchMovies(`movie/${movie.id}`)
        );
      });
    }
  });

  const { data: topMoviesByPlatform } = useQuery(
    ['topMoviesByPlatform', selectedPlatform],
    () =>
      fetchMovies('discover/movie', {
        with_watch_providers: selectedPlatform,
        watch_region: 'US',
        sort_by: 'vote_average.desc',
        page: 1,
      }),
    { enabled: !!selectedPlatform }
  );

  const { data: popularMoviesByGenre } = useQuery(
    ['popularMoviesByGenre', selectedGenre],
    () =>
      fetchMovies('discover/movie', {
        with_genres: selectedGenre,
        sort_by: 'popularity.desc',
        page: 1,
      }),
    { enabled: !!selectedGenre }
  );

  const streamingPlatforms: { [key: string]: string } = {
    Netflix: '8',
    Hulu: '15',
    Amazon: '9',
    Disney: '337',
    AppleTV: '350',
  };

  const popularGenres = [
    { name: 'Action', id: 28 },
    { name: 'Comedy', id: 35 },
    { name: 'Drama', id: 18 },
    { name: 'Horror', id: 27 },
    { name: 'Romance', id: 10749 },
    { name: 'Science Fiction', id: 878 },
    { name: 'Thriller', id: 53 },
    { name: 'Animation', id: 16 },
  ];

  const handleMovieClick = (movieId: number) => {
    console.log(`Navigating to movie with ID: ${movieId}`);
    router.push(`/movie/${movieId}`);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <main className="container mx-auto p-4 md:p-8 space-y-8">
        <section className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold bg-gray-800 inline-block py-2 px-4 rounded">
            Welcome to Movie Finder
          </h2>
          <p className="text-xl md:text-3xl mt-4">
            Discover the latest movies and find your favorites across all streaming platforms.
          </p>
        </section>

        <section className="text-center mb-8 relative">
          <button
            onClick={() => {
              console.log('Button "Most Watched Movies" clicked');
              router.push('/most-watched');
              setIsClicked(true);
              setTimeout(() => setIsClicked(false), 500);
            }}
            className={`relative text-lg md:text-2xl font-bold mb-4 text-center inline-block py-2 px-4 rounded bg-gray-800 hover:bg-gray-600 transition-transform transform ${
              isClicked ? 'animate-pulse' : ''
            }`}
          >
            <span className="flex items-center justify-center">
              Most Watched Movies
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`ml-2 w-4 h-4 md:w-6 md:h-6 transform ${
                  isClicked ? 'rotate-45' : 'rotate-0'
                } transition-transform duration-300`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
          <p className="text-sm md:text-xl mt-4">
            Explore the most watched movies of all time and discover what everyone is talking about.
          </p>
        </section>

        <section className="text-center mb-8">
          <h2 className="text-lg md:text-2xl font-bold mb-4 text-center bg-gray-800 inline-block py-2 px-4 rounded">
            Newest Movies
          </h2>
          {newestMovies && (
            <MoviesSlider
              movies={newestMovies}
              itemsToShow={Math.min(newestMovies.length, 6)}
              onMovieClick={handleMovieClick}
            />
          )}
        </section>

        <section className="text-center mb-8">
          <h2 className="text-lg md:text-2xl font-bold mb-4 text-center bg-gray-800 inline-block py-2 px-4 rounded">
            Top Movies by Streaming Platform
          </h2>
          <div className="flex flex-wrap gap-4 justify-center mb-4">
            {Object.keys(streamingPlatforms).map((platform) => (
              <button
                key={platform}
                onClick={() => {
                  console.log(`Platform selected: ${platform}`);
                  setSelectedPlatform(streamingPlatforms[platform]);
                }}
                className={`p-2 border-b-2 ${
                  selectedPlatform === streamingPlatforms[platform]
                    ? 'border-white'
                    : 'border-transparent'
                } hover:border-white`}
              >
                {platform}
              </button>
            ))}
          </div>
          {topMoviesByPlatform && (
            <div className="flex flex-wrap justify-center gap-4 overflow-auto">
              {topMoviesByPlatform.slice(0, 3).map((movie: any) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onMovieClick={handleMovieClick}
                />
              ))}
            </div>
          )}
        </section>

        <section className="text-center mb-8">
          <h2 className="text-lg md:text-2xl font-bold mb-4 text-center bg-gray-800 inline-block py-2 px-4 rounded">
            Popular Movies by Genre
          </h2>
          <div className="flex flex-wrap gap-4 justify-center mb-4">
            {popularGenres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => {
                  console.log(`Genre selected: ${genre.name}`);
                  setSelectedGenre(genre.id);
                }}
                className={`p-2 border-b-2 ${
                  selectedGenre === genre.id ? 'border-white' : 'border-transparent'
                } hover:border-white`}
              >
                {genre.name}
              </button>
            ))}
          </div>
          {popularMoviesByGenre && (
            <MoviesSlider
              movies={popularMoviesByGenre}
              itemsToShow={Math.min(popularMoviesByGenre.length, 6)}
              onMovieClick={handleMovieClick}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import MovieCard from '../components/MovieCard'; // Adjust path as needed
import { Movie } from '../types'; // Adjust path as needed

const fetchMovies = async (endpoint: string, params = {}, page: number = 1) => {
  console.log(`Fetching movies from endpoint: ${endpoint} with params:`, params, `and page: ${page}`);
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/${endpoint}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`,
      { params: { ...params, page } }
    );
    console.log('API response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw new Error('Error fetching movies');
  }
};

const MostWatched = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const loader = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError } = useInfiniteQuery(
    ['mostWatchedMovies', selectedYear, selectedGenre, selectedScore],
    ({ pageParam = 1 }) =>
      fetchMovies('discover/movie', {
        sort_by: 'watch_count.desc',
        'release_date.gte': selectedYear ? `${selectedYear}-01-01` : undefined,
        with_genres: selectedGenre,
        'vote_average.gte': selectedScore,
      }, pageParam),
    {
      getNextPageParam: (lastPage) => {
        const nextPage = lastPage.page + 1;
        console.log('Next page:', nextPage);
        return nextPage <= lastPage.total_pages ? nextPage : undefined;
      },
      onSuccess: (data) => {
        console.log('Successful data fetch:', data);
        data.pages.forEach((page: any) => {
          page.results.forEach((movie: any) => {
            console.log('Prefetching movie details for:', movie.id);
            queryClient.prefetchQuery(['movieDetails', movie.id], () =>
              fetchMovies(`movie/${movie.id}`)
            );
          });
        });
      }
    }
  );

  const handleMovieClick = (movieId: number) => {
    console.log(`Navigating to movie with ID: ${movieId}`);
    router.push(`/movie/${movieId}`);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          console.log('Loader element is in view, fetching next page');
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [fetchNextPage, hasNextPage]);

  const movies = data ? data.pages.flatMap((page: any) => page.results) : [];
  const years = Array.from({ length: 2024 - 1980 + 1 }, (_, index) => 2024 - index);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <main className="container mx-auto p-8 space-y-8">
        <section className="text-center mb-12">
          <h2 className="text-6xl font-bold bg-gray-800 inline-block py-2 px-4 rounded">
            Most Watched Movies
          </h2>
          <p className="text-3xl mt-4">
            Discover the most watched movies right now.
          </p>
        </section>

        {isError && (
          <section className="text-center mb-8">
            <p className="text-red-500">Error loading movies. Please try again later.</p>
          </section>
        )}

        <section className="mb-8">
          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            <select
              value={selectedYear || ''}
              onChange={(e) => {
                const year = e.target.value ? parseInt(e.target.value) : null;
                console.log(`Selected year: ${year}`);
                setSelectedYear(year);
              }}
              className="bg-gray-800 text-white p-2 rounded"
            >
              <option value="">Release Year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={selectedGenre || ''}
              onChange={(e) => {
                const genre = e.target.value ? parseInt(e.target.value) : null;
                console.log(`Selected genre: ${genre}`);
                setSelectedGenre(genre);
              }}
              className="bg-gray-800 text-white p-2 rounded"
            >
              <option value="">Genre</option>
              <option value={28}>Action</option>
              <option value={35}>Comedy</option>
              <option value={18}>Drama</option>
              <option value={27}>Horror</option>
              <option value={10749}>Romance</option>
              <option value={878}>Science Fiction</option>
              <option value={53}>Thriller</option>
              <option value={16}>Animation</option>
            </select>

            <select
              value={selectedScore || ''}
              onChange={(e) => {
                const score = e.target.value ? parseInt(e.target.value) : null;
                console.log(`Selected score: ${score}`);
                setSelectedScore(score);
              }}
              className="bg-gray-800 text-white p-2 rounded"
            >
              <option value="">Score</option>
              {[9, 8, 7, 6, 5].map(score => (
                <option key={score} value={score}>{score}+</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onMovieClick={handleMovieClick}
              />
            ))}
          </div>
        </section>

        <div ref={loader} className="text-center py-4">
          {isFetchingNextPage ? (
            <p>Loading more...</p>
          ) : hasNextPage ? (
            <p>Scroll down to load more</p>
          ) : (
            <p>No more movies to load</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default MostWatched;

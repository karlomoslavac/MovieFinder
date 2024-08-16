import React from 'react';
import FavoriteHeart from './FavoriteHeart';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onMovieClick: (movieId: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = React.memo(({ movie, onMovieClick }) => {
  console.log(`Rendering MovieCard for movie ID: ${movie.id}, Title: ${movie.title}`);

  return (
    <div
      onClick={() => {
        console.log(`Movie clicked: ID ${movie.id}, Title: ${movie.title}`);
        onMovieClick(movie.id);
      }}
      className="relative cursor-pointer w-[200px] max-w-[200px] flex-shrink-0"
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        loading="lazy"
        className="w-full h-80 object-cover rounded-lg shadow-md"
      />
      <div className="absolute top-2 right-2 flex items-center justify-center">
        <FavoriteHeart movie={movie} />
      </div>
      <h3 className="text-center text-lg font-medium h-24 overflow-hidden">
        {movie.title}
      </h3>
    </div>
  );
});

export default MovieCard;

import React, { useState } from 'react';
import MovieCard from './MovieCard';
import { Movie } from '../types';

interface Props {
  movies: Movie[];
  itemsToShow: number;
  onMovieClick: (movieId: number) => void;
}

const MovieSlider: React.FC<Props> = ({ movies, itemsToShow, onMovieClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? movies.length - itemsToShow : prevIndex - 1;
      console.log('Previous Slide - New Index:', newIndex);
      return newIndex;
    });
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + itemsToShow >= movies.length ? 0 : prevIndex + 1;
      console.log('Next Slide - New Index:', newIndex);
      return newIndex;
    });
  };

  console.log('Current Index:', currentIndex);

  return (
    <div className="relative">
      <button
        onClick={prevSlide}
        className="absolute left-0 transform -translate-x-1/2 z-10 bg-black text-white p-2 rounded-full"
        style={{ left: '20px', top: '40%', transform: 'translateY(-50%)' }}
      >
        &lt;
      </button>
      <div className="flex overflow-x-auto space-x-4 justify-center">
        {movies
          .slice(currentIndex, currentIndex + itemsToShow)
          .map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onMovieClick={onMovieClick}
            />
          ))}
      </div>
      <button
        onClick={nextSlide}
        className="absolute right-0 transform translate-x-1/2 z-10 bg-black text-white p-2 rounded-full"
        style={{ right: '20px', top: '40%', transform: 'translateY(-50%)' }}
      >
        &gt;
      </button>
    </div>
  );
};

export default MovieSlider;

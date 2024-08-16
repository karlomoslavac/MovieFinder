import React, { useState, useEffect } from 'react';
import { Movie } from '../types'; 

interface Props {
  movie: Movie;
}

const FavoriteHeart: React.FC<Props> = ({ movie }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    console.log(`Checking if movie (ID: ${movie.id}) is in favorites...`);

    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isFav = savedFavorites.some((fav: Movie) => fav.id === movie.id);

    console.log(`Movie (ID: ${movie.id}) is ${isFav ? '' : 'not '}in favorites.`);
    setIsFavorite(isFav);
  }, [movie.id]);

  const toggleFavorite = () => {
    console.log(`Toggling favorite status for movie (ID: ${movie.id})...`);

    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let updatedFavorites;

    if (isFavorite) {
      console.log(`Removing movie (ID: ${movie.id}) from favorites...`);
      updatedFavorites = savedFavorites.filter((fav: Movie) => fav.id !== movie.id);
    } else {
      console.log(`Adding movie (ID: ${movie.id}) to favorites...`);
      updatedFavorites = [...savedFavorites, movie];
    }

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    console.log(`Updated favorites:`, updatedFavorites);

    setIsFavorite(!isFavorite);
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); 
        toggleFavorite(); 
      }}
      className={`p-1 rounded-full ${isFavorite ? 'bg-transparent' : 'bg-transparent'}`}
      style={{ borderRadius: '50%', padding: '4px' }}
    >
      <svg
        width="24"
        height="24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-colors ${isFavorite ? 'text-red-500' : 'text-white'}`}
        style={{ stroke: 'black', strokeWidth: 2 }} 
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
};

export default FavoriteHeart;

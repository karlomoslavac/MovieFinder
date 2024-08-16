import React from 'react';
import { Movie } from '../types/';
import FavoriteHeart from '../components/FavoriteHeart';

interface Props {
  movie: Movie | null;
}

const MovieDetails: React.FC<Props> = ({ movie }) => {
  if (!movie) {
    return <div className="container mx-auto p-4 text-center text-white">No movie details available.</div>;
  }

  console.log('Movie Details:', movie);

  const {
    title,
    poster_path,
    backdrop_path,
    overview,
    vote_average,
    genres,
    runtime,
    production_countries,
    credits = { cast: [] },
  } = movie;

  return (
    <div className="relative min-h-screen bg-black">
      <div className="absolute inset-0">
        <img
          src={`https://image.tmdb.org/t/p/original${backdrop_path}`}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-6 bg-gray-800 bg-opacity-70 shadow-md z-10 rounded-none">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>

          <div className="relative flex flex-col md:flex-row items-start">
            <div className="w-full md:w-1/4 flex-shrink-0 mb-4 md:mb-0 relative">
              <img
                src={`https://image.tmdb.org/t/p/w342${poster_path}`}
                alt={title}
                className="w-full object-cover rounded-lg border border-gray-700"
              />
              <div className="absolute top-2 right-2">
                <FavoriteHeart movie={movie} />
              </div>
            </div>

            <div className="w-full md:w-3/4 md:ml-6">
              <p className="text-lg mb-4 text-white">{overview}</p>

              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white mb-2">Details</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-600 text-white">
                    <tbody>
                      <tr className="border-b border-gray-600">
                        <td className="px-4 py-2 font-semibold text-sm border-r border-gray-600">Rating:</td>
                        <td className="px-4 py-2 text-sm">{vote_average}</td>
                      </tr>
                      <tr className="border-b border-gray-600">
                        <td className="px-4 py-2 font-semibold text-sm border-r border-gray-600">Genres:</td>
                        <td className="px-4 py-2 text-sm">
                          {genres.map((genre: { name: string }) => genre.name).join(', ')}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-600">
                        <td className="px-4 py-2 font-semibold text-sm border-r border-gray-600">Runtime:</td>
                        <td className="px-4 py-2 text-sm">{runtime} minutes</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-semibold text-sm border-r border-gray-600">Production Countries:</td>
                        <td className="px-4 py-2 text-sm">
                          {production_countries.map((country: { name: string }) => country.name).join(', ')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white mb-2">Cast</h2>
                <ul className="list-none grid grid-cols-2 md:grid-cols-3 gap-4">
                  {credits.cast.slice(0, 6).map((actor: any, index: number) => {
                    console.log(`Actor: ${actor.name}, Character: ${actor.character}`);
                    return (
                      <li key={index} className="flex items-center bg-gray-700 p-3 rounded-lg">
                        {actor.profile_path && (
                          <img
                            src={`https://image.tmdb.org/t/p/w154${actor.profile_path}`}
                            alt={actor.name}
                            className="w-16 h-16 object-cover rounded-full border border-gray-600"
                          />
                        )}
                        <div className="ml-4">
                          <p className="font-semibold text-lg text-white">{actor.name}</p>
                          <p className="text-gray-300 text-sm">as {actor.character}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;

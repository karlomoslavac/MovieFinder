import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [noResults, setNoResults] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const favoritesRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
    console.log('Loaded favorites from localStorage:', storedFavorites);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const fetchResults = async () => {
        try {
          const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
            params: {
              api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
              query: searchQuery,
            },
          });
          const results = response.data.results;
          setSearchResults(results);
          setNoResults(results.length === 0);
          setShowResults(true);
          console.log('Search results:', results);
          console.log('No results:', results.length === 0);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      };
      fetchResults();
    } else {
      setSearchResults([]);
      setShowResults(false);
      setNoResults(false);
    }
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    console.log('Search query changed:', e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex((prev) => {
        const newIndex = prev === null ? 0 : Math.min(prev + 1, searchResults.length - 1);
        console.log('ArrowDown - New Index:', newIndex);
        return newIndex;
      });
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prev) => {
        const newIndex = prev === null ? searchResults.length - 1 : Math.max(prev - 1, 0);
        console.log('ArrowUp - New Index:', newIndex);
        return newIndex;
      });
    } else if (e.key === 'Enter') {
      if (selectedIndex !== null) {
        handleResultClick(searchResults[selectedIndex].id);
      } else {
        handleSearchSubmit(e);
      }
    }
  };

  const handleResultClick = (id: number) => {
    setShowResults(false);
    setShowFavorites(false);
    console.log('Navigating to movie with ID:', id);
    router.push(`/movie/${id}`);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      setShowFavorites(false);
      console.log('Submitting search with query:', searchQuery);
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      if (searchInputRef.current) {
        searchInputRef.current.value = '';
      }
    }
  };

  const toggleFavoritesMenu = () => {
    setShowFavorites((prev) => !prev);
    setShowResults(false);
    console.log('Toggling favorites menu:', !showFavorites);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target as Node) &&
      searchResultsRef.current &&
      !searchResultsRef.current.contains(event.target as Node)
    ) {
      setShowResults(false);
      console.log('Clicked outside of search results');
    }
    if (
      favoritesRef.current &&
      !favoritesRef.current.contains(event.target as Node)
    ) {
      setShowFavorites(false);
      console.log('Clicked outside of favorites menu');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    console.log('Route changed, clearing search query');
  }, [router.asPath]);

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center relative">
      <Link href="/" className="text-white text-3xl cursor-pointer mr-6">
        Movie Finder
      </Link>
      <div className="flex-1 flex justify-center relative">
        <div className="w-full max-w-md relative">
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder="Search movies..."
              className="p-2 w-full rounded-l-lg border border-gray-300"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-r-lg border border-blue-600"
            >
              Search
            </button>
          </form>
          {showResults && (
            <div
              ref={searchResultsRef}
              className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded border border-gray-200 w-full max-w-md z-50 overflow-y-auto"
              style={{ maxHeight: '300px' }}
            >
              {noResults ? (
                <div className="p-4 text-center text-gray-700">No results found</div>
              ) : (
                <ul>
                  {searchResults.map((result) => (
                    <li
                      key={result.id}
                      className={`p-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer flex items-center ${
                        result.id === selectedIndex ? 'bg-gray-200' : ''
                      }`}
                      onClick={() => handleResultClick(result.id)}
                    >
                      {result.poster_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                          alt={result.title}
                          className="w-10 h-14 object-cover mr-2"
                        />
                      )}
                      <div className="flex-1 truncate">{result.title}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="relative flex items-center ml-6">
        <button
          onClick={toggleFavoritesMenu}
          className="text-white text-3xl whitespace-normal"
        >
          Favorites
        </button>
        {showFavorites && favorites.length > 0 && (
          <div
            ref={favoritesRef}
            className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded border border-gray-200 w-72 max-w-md z-50 p-2 overflow-y-auto"
            style={{ maxHeight: '300px' }}
          >
            <ul>
              {favorites.map((favorite) => (
                <li
                  key={favorite.id}
                  className="p-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => handleResultClick(favorite.id)}
                >
                  {favorite.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${favorite.poster_path}`}
                      alt={favorite.title}
                      className="w-10 h-14 object-cover mr-2"
                    />
                  )}
                  <div className="flex-1 truncate">{favorite.title}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

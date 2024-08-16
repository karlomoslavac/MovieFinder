export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
    vote_average: number;
    genres: { name: string }[];
    runtime: number;
    production_countries: { name: string }[];
    credits?: {
      cast: Cast[];
    };
  }
  
  export interface Cast {
    name: string;
    character: string;
    profile_path?: string;
  }
  
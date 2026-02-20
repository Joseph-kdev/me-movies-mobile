import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiResponse } from "../components/FilterComponent";
import firestore, {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "@react-native-firebase/firestore";
import { User } from "@react-native-google-signin/google-signin";

const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3/",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_KEY}`,
  },
};

// const cacheMovieDetails = async(movieId: number, data: any, type: string) => {
//     try {
//         await AsyncStorage.setItem(`${type}-${movieId}`, JSON.stringify(data))
//     } catch (error) {
//         console.log("Error occurred setting to asyncstorage", error)
//     }
// }

// const getCachedMovieDetails = async(movieId: number, type: string) => {
//     const data = await AsyncStorage.getItem(`${type}-${movieId}`)
//     return data ? JSON.parse(data) : null
// }

export const fetchMovies = async (query: string) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}search/multi?query=${query}`
    : `${TMDB_CONFIG.BASE_URL}trending/all/day`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    console.log("Failed to fetch movies");
    return [];
  }

  const data = await response.json();
  return data.results;
};

export const getTopRated = async (type: string) => {
  const response = await fetch(`${TMDB_CONFIG.BASE_URL}${type}/top_rated`, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    console.log("Failed to fetch movies");
    return [];
  }

  const data = await response.json();
  return data.results;
};

export const fetchMovieDetails = async ({
  id,
  type,
}: {
  id: number;
  type: string;
}) => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}${type}/${id}?api_key=${TMDB_CONFIG.API_KEY}&append_to_response=videos,credits`;

  // const cached = await getCachedMovieDetails(id, type)
  // if (cached) return cached

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    console.log("Failed to fetch movie details");
    return [];
  }

  const data = await response.json();
  // await cacheMovieDetails(id, data, type)
  return data;
};

export const fetchTopRated = async ({ type }: { type: string }) => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}${type}/top_rated?api_key=${TMDB_CONFIG.API_KEY}`,
  );
  if (!response.ok) {
    console.log("Error fetching top rated movies");
    return;
  }
  const data = await response.json();
  return data.results;
};

export const fetchByGenre = async ({
  type,
  genre,
  page,
}: {
  type: string;
  genre: number[];
  page: number;
}): Promise<ApiResponse> => {
  const genresQuery = genre.length > 0 ? `&with_genres=${genre.join(",")}` : "";

  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/discover/${type}?api_key=${TMDB_CONFIG.API_KEY}&sort_by=popularity.desc${genresQuery}&page=${page}`,
    {
      headers: TMDB_CONFIG.headers,
    },
  );

  if (!response.ok) {
    console.log("Error fetching this genre(s)");
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();
  return {
    results: data.results || [],
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
  };
};

export const userLists = async (listType: string, userId: string) => {
  if (!userId) return;
  const db = getFirestore();
  const collectionRef = collection(db, `users/${userId}/${listType}`);
  const snapshot = await getDocs(collectionRef);

  const retrievedData = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return retrievedData;
};

export interface UserStats {
  watched: number;
  favorites: number;
  watchlist: number;
}

export const getUserStats = async (userId: string): Promise<UserStats> => {
  if (!userId) return { watched: 0, favorites: 0, watchlist: 0 };

  const db = getFirestore();

  const [watchedSnap, favoritesSnap, watchlistSnap] = await Promise.all([
    getDocs(collection(db, `users/${userId}/watched`)),
    getDocs(collection(db, `users/${userId}/favorites`)),
    getDocs(collection(db, `users/${userId}/watchlist`)),
  ]);

  return {
    watched: watchedSnap.size,
    favorites: favoritesSnap.size,
    watchlist: watchlistSnap.size,
  };
};

export const getSimilarMovies = async (id: number | string, type: string): Promise<any[]> => {
  if (!id) return [];

  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}${type}/${id}/similar?language=en-US&page=1`,
    {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    }
  );

  if (!response.ok) {
    console.log(`Failed to fetch similar movies for ID ${id}:`, response.status);
    throw new Error("Error fetching similar")
  }

  const data = await response.json();
  return data.results || [];
};
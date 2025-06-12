import AsyncStorage from '@react-native-async-storage/async-storage';

const TMDB_CONFIG = {
    BASE_URL: "https://api.themoviedb.org/3/",
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_KEY}`
    }
}

const cacheMovieDetails = async(movieId: number, data: any) => {
    try {
        await AsyncStorage.setItem(`movie-${movieId}`, JSON.stringify(data))
    } catch (error) {
        console.log("Error occurred setting to asyncstorage", error)
    }
}

const getCachedMovieDetails = async(movieId: number) => {
    const data = await AsyncStorage.getItem(`movie-${movieId}`)
    return data ? JSON.parse(data) : null
}

export const fetchMovies = async({query} : {query: string}) => {
    const endpoint = query ? `${TMDB_CONFIG.BASE_URL}search/multi?query=${query}` : `${TMDB_CONFIG.BASE_URL}trending/all/day`

    const response = await fetch(endpoint, {
        method: "GET",
        headers: TMDB_CONFIG.headers,
    })

    if (!response.ok) {
        console.log("Failed to fetch movies")
        return []
    }

    const data = await response.json()
    return data.results
}

export const fetchMovieDetails = async({id} : {id:number}) => {
    const endpoint = `${TMDB_CONFIG.BASE_URL}movie/${id}?api_key=${TMDB_CONFIG.API_KEY}`

    const cached = await getCachedMovieDetails(id)
    if (cached) return cached

    const response = await fetch(endpoint, {
        method: "GET",
        headers: TMDB_CONFIG.headers
    })

    if (!response.ok) {
        console.log("Failed to fetch movie details")
        return []
    }

    const data = await response.json()
    await cacheMovieDetails(id, data)
    return data
}
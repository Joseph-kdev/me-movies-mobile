import AsyncStorage from '@react-native-async-storage/async-storage';

const TMDB_CONFIG = {
    BASE_URL: "https://api.themoviedb.org/3/",
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_KEY}`
    }
}

const cacheMovieDetails = async(movieId: number, data: any, type: string) => {
    try {
        await AsyncStorage.setItem(`${type}-${movieId}`, JSON.stringify(data))
    } catch (error) {
        console.log("Error occurred setting to asyncstorage", error)
    }
}

const getCachedMovieDetails = async(movieId: number, type: string) => {
    const data = await AsyncStorage.getItem(`${type}-${movieId}`)
    console.log("returned from cached")
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

export const fetchMovieDetails = async({id, type} : {id:number; type: string;}) => {
    const endpoint = `${TMDB_CONFIG.BASE_URL}${type}/${id}?api_key=${TMDB_CONFIG.API_KEY}`

    const cached = await getCachedMovieDetails(id, type)
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
    await cacheMovieDetails(id, data, type)
    return data
}

export const fetchTopRated = async({type} : {type: string}) => {
    const response = await fetch(`${TMDB_CONFIG.BASE_URL}${type}/top_rated?api_key=${TMDB_CONFIG.API_KEY}`)
    if (!response.ok) {
        console.log("Error fetching top rated movies")
        return
    }
    const data = await response.json()
    return data.results
}
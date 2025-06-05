const TMDB_CONFIG = {
    BASE_URL: "https://api.themoviedb.org/3/",
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_KEY}`
    }
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

    const response = await fetch(endpoint, {
        method: "GET",
        headers: TMDB_CONFIG.headers
    })

    if (!response.ok) {
        console.log("Failed to fetch movie details")
        return []
    }

    const data = await response.json()
    return data
}
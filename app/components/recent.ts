import { createMMKV } from "react-native-mmkv";
import { Movie } from "./MovieCard";

export const storage = createMMKV({
    id: "memovies-storage",
})

export const addToRecent = (newMovie: Movie) => {
    const raw = storage.getString('recentMovies')
    let recents: Movie[] = raw ? JSON.parse(raw) : []

    recents = recents.filter(m => m.id !== newMovie.id)

    recents.unshift(newMovie)

    if (recents.length > 15) {
        recents = recents.slice(0, 15)
    }

    storage.set('recentMovies', JSON.stringify(recents))
}

export const getRecentMovies = () => {
    const raw = storage.getString('recentMovies')
    return raw ? JSON.parse(raw) : []
}
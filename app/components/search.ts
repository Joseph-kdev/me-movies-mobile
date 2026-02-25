import Fuse from "fuse.js";
import { Movie } from "./MovieCard";

export const search = (query: string, movies: Movie[]) => {
    if (movies.length === 0 || !query.trim()) {
        return [];
    }
    
    const fuse = new Fuse(movies, {
        keys: ['title', 'original_title', 'name', 'original_name'],
        threshold: 0.3,
    });

    return fuse.search(query).map(result => result.item);
}
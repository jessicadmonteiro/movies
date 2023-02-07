import { QueryResult } from "pg"

type MoviesRequirendKeys = "name" | "description" | "duration" | "price"

interface iMoviesRequest {
    name: string
    description: string | null
    duration: number
    price: number
}

interface iMovies extends iMoviesRequest {
    id: number
}

type MoviesResult = QueryResult<iMovies> 

export {iMoviesRequest, iMovies, MoviesResult, MoviesRequirendKeys}
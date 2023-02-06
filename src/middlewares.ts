import { Request, Response, NextFunction } from "express"
import { QueryConfig } from "pg"
import { client } from "./database"
import { MoviesResult } from "./interfaces"

const ensureMoviesExists = async( request:Request, response:Response, next: NextFunction): Promise<Response | void> => {
    const id: number = parseInt(request.params.id)
    const queryString: string = `
        SELECT
            *
        FROM
            movies
        WHERE
            id = $1
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    const queryResult: MoviesResult = await client.query(queryConfig)

    if(!queryResult.rowCount){
        return response.status(404).json({
            message: "Movie not found!"
        })
    }

    next()
}

const movieNameUnique = async(request: Request, response:Response, next: NextFunction): Promise<Response | void> =>{
    const dataBase: string= `
            SELECT 
                *
            FROM 
                movies;
         `
    const listMovies: MoviesResult = await client.query(dataBase)
    const name = listMovies.rows.map((element) => element.name).find((element) => element === request.body.name)
    
    if(name !== undefined){
    return response.status(409).json({
        message: "Movie already exists"
    })
    }

    next()
}

export { ensureMoviesExists, movieNameUnique }
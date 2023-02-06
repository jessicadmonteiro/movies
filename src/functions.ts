import { Request, Response } from "express"
import { QueryConfig } from "pg"
import format from "pg-format"
import { client } from "./database"
import { iMovies, iMoviesRequest, MoviesRequirendKeys, MoviesResult } from "./interfaces"

const validateData = (dataMovies: any): iMoviesRequest => {

    const dataMoviesKeys: string[] = Object.keys(dataMovies)
    const MoviesRequiredKeys: MoviesRequirendKeys[] = ["name", "duration", "price"]
  
    const hasRequiredKeys: boolean = MoviesRequiredKeys.every((key: string) => dataMoviesKeys.includes(key))

  
    if (!hasRequiredKeys ) {
      const joinedkeys: string = MoviesRequiredKeys.join(", ")
      throw new Error (`Required keys are: ${joinedkeys}.`)
    }
   
    return dataMovies
}

const createMovies = async( request:Request, response: Response): Promise<Response> => {

    try {

        const moviesDataRequest: iMoviesRequest = validateData(request.body)

        const queryString: string= format(`
        
            INSERT INTO
                movies(%I)
            VALUES 
                (%L)
            RETURNING *;
            `,
            Object.keys(moviesDataRequest),
            Object.values(moviesDataRequest)
        )
    
        const queryResult: MoviesResult = await client.query(queryString)
        const newMovies: iMovies = queryResult.rows[0]
    
        return response.status(201).json(newMovies)
        
    } catch (error: unknown) {

      if (error instanceof Error) {
      return response.status(400).json({ message: error.message })
    }

    console.error(error);
    return response.status(500).json({ message: error })
    }

   
}

const readMovies = async(request: Request, response: Response): Promise<Response> => {
    try {
        let page = Number(request.query.page) | 1
    let perPage = Number(request.query.perPage) | 5

    if( perPage > 5){
        perPage = 5
    }

    const queryString: string= `
        SELECT 
            *
        FROM 
            movies
        OFFSET $1 LIMIT $2 ;
        
    `
    
    const baseUrl: string  = `http://localhost:3000//movies`
    let prevPage: string = `${baseUrl}?page=${page - 1}&perPage=${perPage}`
    let nextPage: string = `${baseUrl}?page=${page +1}&perPage=${perPage}`
    
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [perPage  * (page -1), perPage]
    }

    const queryResult: MoviesResult = await client.query(queryConfig)
    const count: number = queryResult.rowCount

    const indexLast: number = queryResult.rows.length -1
    const dataLast = queryResult.rows[indexLast].id


    if(page <= 1){
        prevPage = "null"
    }

    const dataBase: string= `
            SELECT 
                *
            FROM 
                movies;
         `
    const listMovies: MoviesResult = await client.query(dataBase)
    const index = listMovies.rows.length -1

    if(listMovies.rows[index].id === dataLast){
        nextPage = "null"
    }


    const pagination = {
        prevPage,
        nextPage,
        count,
        data: queryResult.rows,
    }
   
    return response.status(200).json(pagination)
        
    } catch (error: unknown) {
        return response.status(404).json({message: 
            "Page has no movies"})
    }
}

const retrieveMovies = async(request: Request, response:Response): Promise<Response> => {
    const id: number = parseInt(request.params.id)
    
    const queryString: string = `
        SELECT 
            *
        FROM
            movies
        WHERE
            id = $1;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    const queryResult: MoviesResult = await client.query(queryConfig)
  
    return response.status(200).json(queryResult.rows[0])
}

const updateMovies = async(request: Request, response: Response): Promise<Response> => {

    if(request.body.id){
        return response.status(400).json({
            message: "Erro updating id"
        })
    }

    const id: number = parseInt(request.params.id)
    const moviesData = Object.values(request.body)
    const moviesKeys = Object.keys(request.body)

    const queryString: string = format(`
        UPDATE
            movies
        SET(%I) = ROW(%L)
        WHERE
            id = $1
        RETURNING *;    
    `,
        moviesKeys,
        moviesData
    )

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    } 

    const queryResult: MoviesResult = await client.query(queryConfig)
    
    return response.status(200).json(queryResult.rows[0])
}

const deleteMovies = async( request: Request, response: Response): Promise<Response> => {
    const id: number = parseInt(request.params.id)
    
    const queryString: string = `
        DELETE FROM 
            movies
        WHERE
            id = $1;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    await client.query(queryConfig)
  
    return response.status(204).send()
}
  
export {
    createMovies, 
    readMovies,
    retrieveMovies,
    updateMovies,
    deleteMovies
}
import express, {Application} from "express"
import { startDatabase } from "./database"
import { createMovies, deleteMovies, readMovies, retrieveMovies, updateMovies } from "./functions"
import { ensureMoviesExists, movieNameUnique } from "./middlewares"

const app: Application = express()
app.use(express.json())

app.post("/movies", movieNameUnique, createMovies)
app.get("/movies", readMovies)
app.get("/movies/:id", ensureMoviesExists, retrieveMovies)
app.patch("/movies/:id", movieNameUnique, ensureMoviesExists, updateMovies )
app.delete("/movies/:id", ensureMoviesExists, deleteMovies)

const PORT: number = 3000
const runningMsg: string = `Server running on http://localhost:${PORT}`

app.listen(PORT, async() => {
    await startDatabase()
    console.log(runningMsg)
})

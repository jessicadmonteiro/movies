import { Client } from "pg"

const client: Client = new Client ({
    user: "willi",
    password: "1516Jess",
    host: "localhost",
    database: "movies",
    port: 5432
})

const startDatabase = async(): Promise<void> => {
    await client.connect()
    console.log("Database conected!")
}

export {client, startDatabase}

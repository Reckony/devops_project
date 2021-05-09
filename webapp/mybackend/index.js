const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// REDIS
const redis = require('redis');

const redisClient = redis.createClient({
    host: 'myredis',
    port: 6379
});

redisClient.on('connect', () => {
    console.log('Connected to Redis server');
});

// POSTGRES
const { Pool } = require('pg');

const pgClient = new Pool({
    user: "postgres",
    password: "1qaz2wsx",
    database: "postgres",
    host: "mypostgres",
    port: "5432"
});

pgClient.on('error', () => {
    console.log("Postgres not connected");
});

pgClient
.pgClient
.query('CREATE TABLE IF NOT EXISTS jewelry (id SERIAL PRIMARY KEY, name TEXT, number INT)')
.catch( (err) => {
    console.log(err);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log('API listening on port ${PORT}');
});

var global_id = 1

// REST
const PORT = 5000;

// GET ALL
app.get('/jewels', (request, response) => {
    console.log(`Executed endpoint /jewels. Get all data`);

    pgClient.query('SELECT * FROM jewelry;', (pgError, queryResult) => {
        if (!queryResult.rows){
            response.json([]);
        }
        else{
            response.status(200).json(queryResult.rows);
        }
    });
})

// GET ID
app.get('/jewels/:id', (request, response) => {
    const id = request.params.id;
    console.log(`Executed endpoint /jewels/${id}. Get jewelry by id.`);

    pgClient.query('SELECT * FROM jewelry WHERE id = $1;', [id], (pgError, queryResult) => {
        if (!queryResult.rows){
            response.json([]);
        }
        else{
            response.status(200).json(queryResult.rows);
        }
    });
})

// POST
app.post('/add_jewel', (request, response) =>{
    console.log('Executed endpoint /add_jewel.);
    const jewel = request.body.jewel;
    const number = request.body.number;

    redisClient.get(number, (err, cachedResult) => {
            pgClient
            .query('INSERT INTO jewelry (jewel, number) VALUES ($1, $2)', [jewel, number])
            .catch(pgError => console.log(pgError));
            response.status(200).send(`Added new jewelry`)
        }
    });

// DELETE
app.delete('/jewels/:id', (request, response) => {
    const id = request.params.id;
    console.log(`Executed endpoint DELETE /jewels/${id}. Get jewelry by id.`);

    pgClient
        .query('DELETE FROM jewelry WHERE id = $1', [id])
        .catch(pgError => console.log(pgError))
    response.status(204);
});

// UPDATE
app.put('/jewels/:id', (request, response) => {
    const id = request.params.id;
    const {jewels, result} = request.body;
    console.log(`Executed endpoint PUT /jewels. Update data of jewel with id ${id}. New data: ${jewels}`);

    pgClient
        .query('UPDATE jewels SET jewel = $1, number = $2 WHERE id = $3', [jewel, number, id])
        .catch(pgError => console.log(pgError));
    response.status(201).send(`Updated jewel with ID: ${id}. New data: ${jewel}, ${number}`);
});

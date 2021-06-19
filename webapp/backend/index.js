const keys = require("./keys");
const express = require("express");
const {v4: uuidv4} = require('uuid');
const cors = require("cors");
const redis = require("redis");
const { Pool } = require("pg");
// API PORT
const PORT = 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// REDIS
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort
});

redisClient.on('connect', () => {
    console.log("Connected to Redis server");
});

redisClient.on('error', (error) => {
    console.log(error);
});

// POSTGRES
const pgClient = new Pool({
//    user: "postgres",
//    password: "1qaz2wsx",
//    database: "postgres",
//    host: "mypostgres",
//    port: "5432"
    user: keys.pgUser,
    password: keys.pgPassword,
    database: keys.pgDatabase,
    host: keys.pgHost,
    port: keys.pgPort
});

pgClient.on('error', () => {
    console.log("Postgres not connected");
});

pgClient
.query('CREATE TABLE IF NOT EXISTS jewelry (id UUID UNIQUE, name TEXT, price INT, PRIMARY KEY (id))')
.catch( (err) => {
    console.log(err);
});

//var global_id = 1

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

// GET by ID
app.get('/jewels/:id', (request, response) => {
    const id = request.params.id;

    redisClient.exists(id, (err, responseExist) => {
        if (responseExist == 1) {
            redisClient.hgetall(id, (err, responseRedis) => {
                if (err) {
                    console.log(err)
                } else {
                    const data = responseRedis;
                    console.log(`Executed endpoint GET /jewels/${id}. From cache: ${data.name}`);
                    response.status(200).send(responseRedis);
                }
            });
        } else {
            pgClient.query('SELECT * FROM jewelry WHERE id = $1;', [id], (pgError, queryResult) => {
                if (pgError) {
                    console.log("No data found in postgres database");
                    response.status(404).send("No data found in postgres database")
                } else {
                    const data = queryResult.rows[0];
                    console.log(`Executed endpoint GET /jewels/${id}. From database ${data.name}`);
                    response.status(200).json(queryResult.rows[0]);
                }
            });
        }
    })
})

// POST
app.post('/jewels', (request, response) => {
    console.log('Executed endpoint POST /jewels with name' + request.body.name);
    const Id = uuidv4();
    const name = request.body.name;
    const price = request.body.price;

    redisClient.hmset(`${Id}`, {'name': `${name}`, 'price': `${price}`});
    pgClient
        .query('INSERT INTO jewelry (id, name, price) VALUES ($1, $2, $3)', [Id, name, price])
        .catch(pgError => console.log(pgError));
    response.status(201).send(`Added jewel name ${name}, price ${price}`);
});

// DELETE
app.delete('/jewels/:id', (request, response) => {
    const id = request.params.id;
    console.log(`Executed endpoint DELETE /jewels. Removed data of db with id ${id}`);

    pgClient
        .query('DELETE FROM jewelry WHERE id = $1', [id])
        .catch(pgError => console.log(pgError))
    response.status(204);
});

// UPDATE
app.put('/jewels/:id', (request, response) => {
    const id = request.params.id;
    const {name, price} = request.body;
    console.log(`Executed endpoint PUT /jewels. Update jewel with id ${id}. New data: ${name}, ${price}`);

    pgClient
        .query('UPDATE jewelry SET name = $1, price = $2 WHERE id = $3', [name, price, id])
        .catch(pgError => console.log(pgError));
    response.status(201).send(`Updated jewel with ID: ${id}. New data: ${name}, ${price}`);
});

app.get('/', (req, res) => {
    res.send("Server ready");
});

app.listen(PORT, () => {
    console.log(`Backend ok on port ${PORT}`);
    console.log(keys);
})

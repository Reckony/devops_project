const express = require("express");
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
    host: "myredis",
    port: 6379
});

redisClient.on('connect', () => {
    console.log("Connected to Redis server");
});

redisClient.on('error', (error) => {
    console.log(error);
});

// POSTGRES
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
.query('CREATE TABLE IF NOT EXISTS jewelry (id SERIAL PRIMARY KEY, name TEXT, number INT, price DECIMAL(10, 2));')
.catch( (err) => {
    console.log(err);
});

app.get('/', (req, res) => {
    res.send("Server ready");
});

app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
});

var global_id = 1

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

//// GET ID
//app.get('/jewels/:id', (request, response) => {
//    const id = request.params.id;
//    console.log(`Executed endpoint /jewels/${id}. Get jewelry by id.`);
//
//    pgClient.query('SELECT * FROM jewelry WHERE id = $1;', [id], (pgError, queryResult) => {
//        if (!queryResult.rows){
//            response.json([]);
//        }
//        else{
//            response.status(200).json(queryResult.rows);
//        }
//    });
//})

// GET ID another
app.get('/jewels/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);

        redisClient.get(id, async (error, result) => {
            if (result) {
                return res.status(200).send({
                    error: false,
                    message: `Result for ${id} from the cache`,
                    data: JSON.parse(result)
                })
            } else {
                pgClient.query('SELECT * FROM jewelry WHERE id = $1;', [id], (err, result) => {
                    if (err) {
                        throw err;
                    }

                    const rows = JSON.stringify(result.rows);
                    console.log(`id: ${id}, data: ${rows}`);

                    redisClient.setex(id, 600, rows);
                    return res.status(200).send({
                        error: false,
                        message: `Reading id: ${id}`,
                        data: JSON.parse(rows)
                    })
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
});


//// POST
//app.post('/add_jewel', (request, response) =>{
//    console.log('Executed endpoint /add_jewel.);
//    const { jewel, number, price } = req.body;
//    console.log(`${req.body.jewel} ${number} ${price}`);
//
//    redisClient.get(number, (err, cachedResult) => {
//            pgClient
//            .query('INSERT INTO jewelry (jewel, number, price) VALUES ($1, $2, $3) RETURNING id;', [jewel, number, price])
//            .catch(pgError => console.log(pgError));
//            response.status(200).send(`Added new jewelry`)
//        }
//    });

// POST another
app.post('/jewel', (req, res) => {
    console.log('Executed POST on endpoint /jewel.');
    const { name, number, price } = req.body;
    console.log('${req.body.name} ${number} ${price}');

    pgClient.query('INSERT INTO jewelry (name, number, price) VALUES ($1, $2, $3) RETURNING id;', [name, number, price], (err, result)=>{
        if (err) {
            throw err;
        }
        const id = result.rows[0].id;
        redisClient.setex(id, 600, JSON.stringify([{id: id, ...req.body}]));
        res.status(201).json({
            message: 'Record added to database',
            jewel: {id: result.rows[0].id, name: name, number: number, price: price}
        });
    })
});

// DELETE
app.delete('/jewel/:id', (request, response) => {
    const id = request.params.id;
    console.log('Executed endpoint DELETE /jewel/${id}. Get jewelry by id.');

    pgClient
        .query('DELETE FROM jewelry WHERE id = $1', [id])
        .catch(pgError => console.log(pgError))
    response.status(204);
});

// UPDATE
app.put('/jewel/:id', (request, response) => {
    const id = request.params.id;
    const { name, number, price } = req.body;
    console.log('Executed PUT on endpoint /jewel. Update data of jewel with id ${id}. New data: ${name}, ${number}, ${price}');

    pgClient
        .query('UPDATE jewels SET name = $1, number = $2, price = $3 WHERE id = $4', [name, number, price, id])
        .catch(pgError => console.log(pgError));
    response.status(201).send(`Updated jewel with ID: ${id}. New data: ${name}, ${number}, ${price}`);
});

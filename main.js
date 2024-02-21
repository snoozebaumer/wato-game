const bodyParser = require("body-parser");
const express = require("express");
const {MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
require("dotenv").config();
require("log-timestamp");

const server = express();
const port = 4566;


server.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

server.post('/game', async (req, res) => {
    try {
        await client.connect();
        const db = await client.db(process.env.DB_NAME);
        const id = (await db.collection("challenge").insertOne(req.body)).insertedId;
        console.log("GAME: created challenge with id: " + id)
        res.send({"id": id.toString()});
    }   catch (e) {
        console.log(`GAME: could not create challenge with error: `, e.message);
        res.status(500).send(e);
    }
    finally {
        await client.close();
        res.end();
    }
});

server.get('/game/:id', async(req, res) => {
    const id = req.params.id;

    try {
        await client.connect();
        const db = await client.db(process.env.DB_NAME);
        const user = await db.collection("challenge").findOne({_id: new ObjectId(id)});
        console.log("GAME: fetched challenge with id: " + id);
        res.send(user);
    }   catch (e) {
        console.log(`GAME: could not fetch challenge with id: ${id} with error: `, e.message);
        res.status(404).send(e);
    }
    finally {
        await client.close();
        res.end();
    }
});

server.put("/game/:id", async (req, res) => {
    console.log(req.params.id);


    res.status(200);
    res.end();
});

server.listen(port, () => {
    console.log("GAME: listening on port ", port);
});
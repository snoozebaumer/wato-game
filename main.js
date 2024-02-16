const bodyParser = require("body-parser");
const express = require("express");
const {MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
require('dotenv').config();

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
    const {challenger, challenge} = req.body;
    try {
        await client.connect();
        const db = await client.db(process.env.DB_NAME);
        const id = (await db.collection("challenge").insertOne({challenger: challenger, description: challenge})).insertedId;
        res.send({"id": id.toString()});
    }   catch (e) {
        res.status(500).send(e);
    }
    finally {
        await client.close();
        res.end();
    }
});

server.get('/game/:id', async(req, res) => {
    console.log(req.params.id);

    const result = "Post with id " + req.params.id + " found.";
    if (result) {
        res.send(result);
    } else {
        res.status(404);
    }

    res.end();
});

server.put("/game/:id", async (req, res) => {
    console.log(req.params.id);


    res.status(200);
    res.end();
});

server.listen(port, () => {
    console.log("GAME: listening on port ", port);
});
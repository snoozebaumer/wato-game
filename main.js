const bodyParser = require("body-parser");
const express = require("express");
const server = express();
require('dotenv').config();


server.use(bodyParser.json());

server.post('/game', async (req, res) => {
    console.log(req.body);
    res.send("Game posted");
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

server.listen(4566);
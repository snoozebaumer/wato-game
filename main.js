const bodyParser = require('body-parser');
const express = require('express');
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
require('dotenv').config();
require('log-timestamp');
const {ChallengeStatus} = require('./models/challenge-status');

const server = express();
const port = 4566;


server.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

server.post('/game', async (req, res) => {
    try {
        await client.connect();
        const db = await client.db(process.env.DB_NAME);
        const id = (await db.collection('challenge').insertOne(req.body)).insertedId;
        console.log('GAME: created challenge with id: ' + id)
        res.send({'id': id.toString()});
    } catch (e) {
        console.error(`GAME: could not create challenge with error: `, e.message);
        res.status(500).send(e);
    } finally {
        res.end();
    }
});

server.get('/game/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await client.connect();
        const db = await client.db(process.env.DB_NAME);
        const challenge = await db.collection('challenge').findOne({_id: new ObjectId(id)});
        console.log('GAME: fetched challenge with id: ' + id);
        res.send(challenge);
    } catch (e) {
        console.error(`GAME: could not fetch challenge with id: ${id} with error: `, e.message);
        res.status(404).send(e);
    } finally {
        res.end();
    }
});

/*
    breaking with REST: put is supposed to be idempotent, which this is not. This is due to the game rules:
    we don't want the challenger to be able to edit the challengeeNumber by directly calling put /api/challenges in gateway, for example.
    Thus we have to script which fields you are able to edit in which challengeStatus.
    NEW -> maxRange, challengeeId; GUESS_TO_BE_SET -> challengeeNumber; CHALLENGER_TO_MOVE -> challengerNumber

    EDIT after research: this should be changed to PATCH on refactor
* */
server.put('/game/:id', async (req, res) => {
    const id = req.params.id;
    let newStatus;

    try {
        await client.connect();
        const db = await client.db(process.env.DB_NAME);
        let challenge = await db.collection('challenge').findOne({_id: new ObjectId(id)});
        if (challenge.challengeStatus === ChallengeStatus.NEW && req.body.maxRange) {
            newStatus = ChallengeStatus.GUESS_TO_BE_SET;
            challenge = await db.collection('challenge').findOneAndUpdate({_id: new ObjectId(id)},
                {
                    "$set": {
                        challengeeId: req.body.challengeeId,
                        maxRange: req.body.maxRange,
                        challengeStatus: newStatus
                    }
                }, { returnDocument: 'after'});
        } else if (challenge.challengeStatus === ChallengeStatus.GUESS_TO_BE_SET && req.body.challengeeNumber) {
            newStatus = ChallengeStatus.CHALLENGER_TO_MOVE;
            challenge = await db.collection('challenge').findOneAndUpdate({_id: new ObjectId(id)},
                {
                    "$set": {
                        challengeeNumber: req.body.challengeeNumber,
                        challengeStatus: newStatus
                    }
                }, { returnDocument: 'after'});
        } else if (challenge.challengeStatus === ChallengeStatus.CHALLENGER_TO_MOVE && req.body.challengerNumber) {
            newStatus = challenge.challengeeNumber === req.body.challengerNumber ? ChallengeStatus.SUCCESS : ChallengeStatus.FAILURE;
            challenge = await db.collection('challenge').findOneAndUpdate({_id: new ObjectId(id)},
                {
                    "$set": {
                        challengerNumber: req.body.challengerNumber,
                        challengeStatus: newStatus
                    }
                }, { returnDocument: 'after'});
        }
        else {
            return res.status(403).send("Challenge status cannot be changed.");
        }

        console.log(`GAME: changed challenge status for id: ${id}. New status: ${newStatus}, edited values: ${JSON.stringify(req.body)}`)
        res.send(challenge);
    } catch (e) {
        console.error(`GAME: could not edit challenge with id: ${id} and change: ${JSON.stringify(req.body)} with error: `, e.message);
        res.status(500).send(e);
    }

    res.status(200);
    res.end();
});

server.listen(port, () => {
    console.log('GAME: listening on port ', port);
});
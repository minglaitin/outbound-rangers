const express = require('express')
const server = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('bson').ObjectId
const serveStatic = require('serve-static')

require('dotenv').config({ path: ".env.local" })
const uri = process.env.MONGODB_URI

server.use(cors())
server.use(bodyParser.json())
server.use(serveStatic(__dirname + '/dist'))

const port = process.env.PORT || 4040
let database;

server.listen(port, "::", () => {
    console.log('Server listening on port ' + port)
    MongoClient.connect(uri, (err, client) => {
        database = client.db("database");
        console.log('Database connection successful.');
    })
});

server.get("/itemsdata", (req, res) => {
    database.collection("items").find({}).toArray((err, result) => {
        res.send(result);
    })
})

server.get("/usersdata", (req, res) => {
    database.collection("users").find({}).toArray((err, result) => {
        res.send(result);
    })
})

server.post("/usersdata/update/:_id", (req, res) => {
    const query = {"_id": ObjectId(req.params._id)};
    const newValue = {$set: req.body};
    try {
        database.collection("users").updateOne(query, newValue);
        res.send(req.body);
    } catch (error) {
        console.log(error, "in server.js")
    }
})

server.post("/usersdata/create", (req, res) => {
    database.collection("users").insertOne(req.body);
    res.send(req.body);
})

// future todo: do not load all users from database
// suggestion: export database, maybe database.collection("users").find({input})

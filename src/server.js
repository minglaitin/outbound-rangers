const express = require('express')
const server = express()
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const userRoute = require('./server/routes/user.route.js')
const itemRoute = require('./server/routes/item.route.js')
require('dotenv').config({ path: ".env.local" })
const uri = process.env.MONGODB_URI
const ObjectId = require('bson').ObjectId

server.use(cors())
server.use(bodyParser.json())
server.use('/userdata', userRoute)
server.use('/itemdata', itemRoute)

const port = process.env.PORT || 4040

//Connecting to database
mongoose.Promise = global.Promise
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then(() => {
    console.log('MongoDB database with mongoose connected.')
}).catch((error) =>{
    console.log(error)
})

let database;

server.listen(port, () => {
    console.log('Server listening on port ' + port)
    MongoClient.connect(uri, (err, client) => {
        database = client.db("database");
        console.log('Database connection through MongoClient successful.');
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

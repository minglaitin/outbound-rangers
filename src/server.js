const express = require('express')
const server = express()
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const userRoute = require('./server/routes/user.route.js')
const itemRoute = require('./server/routes/item.route.js')
const ownershipRoute = require('./server/routes/ownership.route.js')

server.use(cors())
server.use(bodyParser.json())
server.use('/userdata', userRoute)
server.use('/itemdata', itemRoute)
server.use('/ownership', ownershipRoute)

const port = process.env.PORT || 4040

//Connecting to database
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then(() => {
    console.log('MongoDB database connected.')
}).catch((error) =>{
    console.log(error)
})

server.listen(port, () => console.log('Server listening on port ' + port))

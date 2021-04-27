const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    userID: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        default: ""
    },
    lastActiveTime:{
        type: Date,
        default: Date.now()
    },
    highestScore:{
        type: Number,
        default: 0
    },
    accumulatedScore:{
        type: Number,
        default: 0
    },
    coins:{
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        default: "avatar_default.png"
    },
    skin: {
        type: String,
        default: "skin_default.svg"
    },
    friendsID: {
        type: Array,
        default: []
    },
}, {
    collection: 'users'
})

module.exports = mongoose.model('User', userSchema)
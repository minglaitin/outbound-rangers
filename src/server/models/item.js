const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let itemSchema = new Schema({
    itemID: {
        type: Number,
        default: 1000
    },
    itemType: {
        type: String,
        default: "Avatar"
    },
    itemName: {
        type: String,
        default: "Empty"
    },
    itemImage: {
        type: String,
        default: "null.png"
    },
    cost:{
        type: Number,
        default: 10
    },
}, {
    collection: 'items'
})

module.exports = mongoose.model('Item', itemSchema)
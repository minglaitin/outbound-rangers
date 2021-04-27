const express = require('express')
const itemRoute = express.Router()

// User model
let itemModel = require('../models/item.js')

itemRoute.route('/').get((req, res, next) => {
    itemModel.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

itemRoute.route('/create').post((req, res, next) => {
    itemModel.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

// itemRoute.route('/edit/:id').get((req, res, next) => {
//     itemModel.findById(req.params.id, (error, data) => {
//         if (error) {
//             return next(error)
//         } else {
//             res.json(data)
//         }
//     })
// })

// Update item
itemRoute.route('/update/:id').post((req, res, next) => {
    itemModel.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
            console.log('User successfully updated!')
        }
    })
})

// Delete item
itemRoute.route('/delete/:id').delete((req, res, next) => {
    itemModel.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

module.exports = itemRoute;
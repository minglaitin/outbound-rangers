const express = require('express')
const ownershipRoute = express.Router()

// Ownership model
let ownshipModel = require('../models/ownership.js')

ownershipRoute.route('/').get((req, res, next) => {
    ownshipModel.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

ownershipRoute.route('/create').post((req, res, next) => {
    ownshipModel.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

// ownershipRoute.route('/edit/:id').get((req, res, next) => {
//     ownshipModel.findById(req.params.id, (error, data) => {
//         if (error) {
//             return next(error)
//         } else {
//             res.json(data)
//         }
//     })
// })

// Update ownership
ownershipRoute.route('/update/:id').post((req, res, next) => {
    ownshipModel.findByIdAndUpdate(req.params.id, {
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

// Delete ownership
ownershipRoute.route('/delete/:id').delete((req, res, next) => {
    ownshipModel.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

module.exports = ownershipRoute
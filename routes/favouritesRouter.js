const express = require('express')
const bodyParser = require('body-parser')
const Favourites = require('../models/favourites')
const favRouter = express.Router()
const authenticate = require('../authenticate')
const cors = require('./cors')

favRouter.use(bodyParser.json())

favRouter.route('/')
    .options(cors.corsWithOption, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
        console.log(req.user._id)
        Favourites.findOne({ "user": req.user._id }).populate('user').populate('dishes').then((favourite) => {
            if (favourite != null) {
                res.status = 200
                res.setHeader('Content-Type', "application/json")
                res.json(favourite)
            }
            else {
                next()
            }
        })

    })
    .post(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ "user": req.user._id }).then((favourite) => {
            if (favourite != null) {
                res.status = 200
                res.setHeader('Content-Type', "application/json")
                for (let i of req.body) {
                    favourite.dishes.push(i._id);
                }
                favourite.save().then((favourite) => {
                    Favourites.findById(favourite._id)
                        .populate('user').populate('dishes').then((favourite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', "application/json")
                            res.json(favourite)
                        })
                }, err => next(err)).catch((err) =>
                    next(err)
                )
            }
            else {
                req.body.user = req.user._id
                Favourites.create(req.body)
                    .then(favourite => {
                        console.log("Favoutite list created,", favourite)
                        res.statusCode = 200
                        res.setHeader('Content-Type', "application/json")
                        for (let i of req.body) {
                            favourite.dishes.push(i._id);
                        }
                        favourite.save().then((favourite) => {
                            Favourites.findById(favourite._id)
                                .populate('user').populate('dishes').then((favourite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', "application/json")
                                    res.json(favourite)
                                })
                        }, err => next(err))
                    }, (err) => next(err))
                    .catch((err) =>
                        next(err)
                    )
            }
        })
    }).put(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ "user": req.user._id }).then((favourite) => {
            if (favourite != null) {
                if (req.body.dishes) {
                    favourite.dishes = req.body.dishes
                }
                favourite.save()
                    .then((favourite) => {
                        Favourites.findById(favourite._id).populate('user').populate('dishes').then((favourite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', "application/json")
                            console.log("Successfully updated favourites")
                            res.json(favourite)
                        })
                    }, (err) => next(err))
                    .catch((err) =>
                        next(err)
                    )

            } else {
                err = new Error("User " + req.user._id + " does not have anyfavourites")
                err.status = 404;
                return next(err)
            }
        })
    })
    .delete(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ "user": req.user._id }).populate('user').then((favourite) => {
            if (favourite != null) {
                favourite.dishes = []
                favourite.save().then((favourite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json')
                    res.json(favourite)
                })
            }
            else {
                err = new Error("User " + req.user._id + " does not have any favourites")
                err.status = 404;
                return next(err)
            }
        }).catch((err) => next(err))

    })
favRouter.route('/:dishId').options(cors.corsWithOption, (req, res) => {
    res.sendStatus(200)
})
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("GET operation not supported on /favourites/"
            + req.params.dishId)
    })
    .post(cors.corsWithOption, authenticate.verifyUser, (req, res) => {
        Favourites.findOne({ "user": req.user._id }).then((favourite) => {
            console.log(req.params.dishId)
            if (favourite != null) {
                res.status = 200
                res.setHeader('Content-Type', "application/json")
                favourite.dishes.push(req.params.dishId);
                favourite.save().then((favourite) => {
                    Favourites.findById(favourite._id)
                        .populate('user').populate('dishes').then((favourite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', "application/json")
                            res.json(favourite)
                        })
                }, err => next(err)).catch((err) =>
                    next(err)
                )
            }
            else {
                req.body.user = req.user._id
                req.body.dishes = [req.body.dishId]
                Favourites.create(req.body)
                    .then(favourite => {
                        console.log("Favoutite list created,", favourite)
                        res.statusCode = 200
                        res.setHeader('Content-Type', "application/json")
                        res.json(favourite)
                    }, (err) => next(err))
                    .catch((err) =>
                        next(err)
                    )
            }
        }).catch((err) => next(err))
    })

    .put(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /favourites/"
            + req.params.dishId)
    }
    )
    .delete(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ "user": req.user._id }).then((favourite) => {
            console.log(req.params.dishId)
            if (favourite != null) {
                res.status = 200
                res.setHeader('Content-Type', "application/json")
                favourite.dishes = favourite.dishes.filter((dishid) => dishid._id.toString() !== req.params.dishId);
                favourite.save().then((favourite) => {
                    Favourites.findById(favourite._id)
                        .populate('user').populate('dishes').then((favourite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', "application/json")
                            res.json(favourite)
                        })
                }, err => next(err)).catch((err) =>
                    next(err)
                )
            }
            else {
                err = new Error("User " + req.user._id + "does not have any favourites")
                err.status = 404;
                return next(err)
            }
        }).catch((err) => next(err))
    })

module.exports = favRouter
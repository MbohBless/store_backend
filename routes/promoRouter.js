const express = require('express')
const bodyParser = require('body-parser')
const Promos = require('../models/promotions')
const authenticate = require("../authenticate")
const promoRouter = express.Router()
const cors = require('./cors')
promoRouter.use(bodyParser.json())
promoRouter.route('/')
    .options(cors.corsWithOption, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.cors, (req, res, next) => {
        Promos.find({}).then((promotions) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', "application/json")
            res.json(promotions)
        }, (err) => next(err)).catch((err) => next(err))
    }).post(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promos.create(
            req.body
        ).then((promotion) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json")
            res.json(promotion)
        }, err => next(err))
            .catch((err) => {
                console.log(err);
                next(err)
            })
        // res.end("Will add the promotion: " + req.body.name + " with details: " + req.body.description)
    }).put(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403
        res.end("put operation not supported on /Promotions")
    }).delete(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promos.remove({}).then((resp) => {
            res.statusCode = 200
            res.setHeader('Content-Type', "application/json")
            res.json(resp)
        }, err => next(err)).catch(err => next(err))

    });
promoRouter.route('/:promoId').options(cors.corsWithOption, (req, res) => {
    res.sendStatus(200)
}).get(cors.cors, (req, res, next) => {
    Promos.findById(req.params.promotionId)
        .then((promotion) => {
            res.statusCode = 200
            res.setHeader("Content-Type", "application/json")
        }, err => next(err)).catch(err => next(err))
})
    .post(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on /Promos/" + req.params.promoId)
    })
    .put(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promos.findByIdAndUpdate(req.params.promoId, {
            $set: req.body
        }, { new: true })
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', "application/json")
                res.json(promotion)
            }
                , err => next(err)).catch(err => next(err))
    })
    .delete(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promos.findByIdAnddelete(cors.corsWithOption, req.params.promoId).then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', "application/json")
            res.json(resp)
        },
            err => next(err)).catch(err => next(err))
    })


module.exports = promoRouter;
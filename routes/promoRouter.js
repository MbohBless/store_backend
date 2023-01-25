const express = require('express')
const bodyParser = require('body-parser')
const Promos = require('../models/promotions')
const promoRouter = express.Router()
promoRouter.use(bodyParser.json())
promoRouter.route('/')
    .get((req, res, next) => {
        Promos.find({}).then((promotions) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', "application/json")
            res.json(promotions)
        }, (err) => next(err)).catch((err) => next(err))
    }).post((req, res, next) => {

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
    }).put((req, res, next) => {
        res.statusCode = 403
        res.end("put operation not supported on /Promotions")
    }).delete((req, res, next) => {
        Promos.remove({}).then((resp) => {
            res.statusCode = 200
            res.setHeader('Content-Type', "application/json")
            res.json(resp)
        }, err => next(err)).catch(err => next(err))

    });
promoRouter.route('/:promoId').get((req, res, next) => {
    Promos.findById(req.params.promotionId)
        .then((promotion) => {
            res.statusCode = 200
            res.setHeader("Content-Type", "application/json")
        }, err => next(err)).catch(err => next(err))
})
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on /Promos/" + req.params.promoId)
    })
    .put((req, res, next) => {
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
    .delete((req, res, next) => {
        Promos.findByIdAndDelete(req.params.promoId).then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', "application/json")
            res.json(resp)
        },
            err => next(err)).catch(err => next(err))
    })


module.exports = promoRouter;
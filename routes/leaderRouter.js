const express = require('express')
const bodyParser = require('body-parser')
const Leaders = require('../models/leaders')
const authenticate = require('../authenticate')
const leaderRouter = express.Router()
const cors = require('./cors')
leaderRouter.use(bodyParser.json())
leaderRouter.route('/')
    .options(cors.corsWithOption, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.cors, (req, res, next) => {
        Leaders.find({}).then((leaders) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', "application/json")
            res.json(leaders)
        }, (err) => next(err)).catch((err) => {
            console.log(err)
            next(err)
        })
    }).post(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
        console.log(req.body);
        Leaders.create(
            req.body
        ).then((leader) => {
            console.log("Leader created", leader);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json")
            res.json(leader)
        }, err => next(err))
            .catch((err) => {
                console.log(err)
                next(err)
            })
        // res.end("Will add the leader: " + req.body.name + " with details: " + req.body.description)
    }).put(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403
        res.end("put operation not supported on /leaders")
    }).delete(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
        Leaders.remove({}).then((resp) => {
            res.statusCode = 200
            res.setHeader('Content-Type', "application/json")
            res.json(resp)
        }, err => next(err)).catch(err => next(err))

    });
leaderRouter.route('/:leaderId')
    .options(cors.corsWithOption, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.cors, (req, res, next) => {
        Leaders.findById(req.params.leaderId)
            .then((leader) => {
                res.statusCode = 200
                res.setHeader("Content-Type", "application/json")
                res.json(leader)
            }, err => next(err)).catch(err => next(err))
    })
    .post(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on /leaders/" + req.params.leaderId)

    })
    .put(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.findByIdAndUpdate(req.params.leaderId, {
            $set: req.body
        }, { new: true })
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', "application/json")
                res.json(leader)
            })
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.findByIdAnddelete(req.params.leaderId).then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', "application/json")
            res.json(resp)
        },
            err => next(err)).catch(err => next(err))
    })

module.exports = leaderRouter;
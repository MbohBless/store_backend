const express = require('express')
const authenticate = require("../authenticate")
const bodyParser = require('body-parser')
const multer = require('multer')
const cors = require('./cors')
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/imahes');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/.\(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("You can upload only image files"), false)
    }
    cb(null, true);
}

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

const uploadRouter = express.Router()
uploadRouter.use(bodyParser)
uploadRouter.route('/')
    .options(cors.corsWithOption, (req, res) => {
        res.sendStatus(200)
    })
    .post(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file)
    })
    .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("GET operation not supported on /imageUpload")
    })
    .put(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /imageUpload")
    })
    .delete(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("DELETE operation not supported on /imageUpload")
    })

module.exports = uploadRouter;

var express = require('express');
const user = require('../models/user');

var bodyParser = require("body-parser")
var router = express.Router();
var User = require('../models/user')
var passport = require('passport');
var authenticate = require('../authenticate')


router.use(bodyParser.json())
/* GET users listing. */

router.route("/").get(authenticate.verifyAdmin, (req, res, next) => {
  User.find({}).then((users) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users)
  }).catch((err) => {
    next(err)
  })

});

router.post("/signup", (req, res, next) => {
  console.log(req.body)
  User.register(new User({ username: req.body.username }),
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      }
      else {
        if (req.body.lastname) {
          user.firstname = req.body.firstname
        }
        if (req.body.firstname) {
          user.lastname = req.body.lastname
        }
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500
            res.setHeader('COntent-Type', 'application/json')
            res.json({ err: err })
            return
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Registration Successful!' });
          });
        })

    }
  });
})
router.post('/login', passport.authenticate('local'), (req, res) => {
  console.log(req)
  var token = authenticate.getToken({ _id: req.user._id })
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, status: 'You are successfully logged in!', token: token });
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/')
  }
  else {
    var err = new Error('You are not logged in');
    err.status = 403
    next(err)
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Thought = require('../models/thought');
const Reaction = require('../models/reaction');
const Friend = require('../models/friend');
const moment = require('moment');

router.post('/users', function(req, res) {
  const user = new User(req.body);
  user.save(function(err) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(user);
    }
  });
});

router.get('/users', function(req, res) {
  User.find({})
    .populate('thoughts')
    .populate('friends')
    .exec(function(err, users) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(users);
      }
    });
});

router.post('/thoughts', function(req, res) {
  const thought = new Thought(req.body);
  thought.save(function(err) {
    if (err) {
      res.status(500).send(err);
    } else {
      User.findByIdAndUpdate(
        req.body.userId,
        { $push: { thoughts: thought } },
        function(err) {
          if (err) {
            res.status(500).send(err);
          } else {
            res.send(thought);
          }
        }
      );
    }
  });
});

router.get('/thoughts', function(req, res) {
  Thought.find({})
    .populate('reactions')
    .exec(function(err, thoughts) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(thoughts);
      }
    });
});

// Define other endpoints for reactions and friends
// ...

module.exports = router;

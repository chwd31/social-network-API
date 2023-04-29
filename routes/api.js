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
            const formattedDate = moment(thought.createdAt).format('YYYY-MM-DD');
            thought.createdAt = formattedDate;
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
        thoughts = thoughts.map(thought => {
            const formattedDate = moment(thought.createdAt).format('YYYY-MM-DD');
            thought.createdAt = formattedDate;
            return thought;
          });
          res.send(thoughts);
      }  
    });
});

// Define other endpoints for reactions and friends
router.post('/friends', function(req, res) {
  const { userId, friendId } = req.body;
  const friend = new Friend({ userId, friendId });
  friend.save(function(err) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(friend);
    }
  });
});

router.post('/thoughts/:thoughtId/reactions', function(req, res) {
  const { thoughtId } = req.params;
  const { reactionBody, username } = req.body;

  const reaction = new Reaction({ reactionBody, username });
  reaction.save(function(err) {
    if (err) {
      res.status(500).send(err);
    } else {
      Thought.findByIdAndUpdate(
        thoughtId,
        { $push: { reactions: reaction } },
        function(err) {
          if (err) {
            res.status(500).send(err);
          } else {
            const formattedDate = moment(thought.updatedAt).format('YYYY-MM-DD');
            thought.updatedAt = formattedDate;
            res.send(reaction);
          }
        }
      );
    }
  });
});



module.exports = router;

var express = require('express');
var router = express.Router({mergeParams: true});
var Collection = require('../models/collection');
var Comment = require('../models/comment');
// ===============
// COMMENTS
// ===============

// NON EXISTENT --------------------------
// TODO Delete this in the future
router.get('/comments/new', isLoggedIn, function(req, res) {
  res.render('comments/new');
});

// CREATE - add new comment into the DB.
router.post('/comments', isLoggedIn, function(req, res) {
  var newComment = req.body.comment;
  var id = req.params.id;

  Collection.findById(id, function(err, foundCollection) {
    if(err) {
      console.log(err);
    } else {
      Comment.create(newComment, function(err, newComment) {
        if(err) {
          console.log(err);
        } else {
          newComment.author._id = req.user._id;
          newComment.author.username = req.user.username;
          newComment.save();
          foundCollection.comments.push(newComment._id);
          foundCollection.save();
          console.log(foundCollection);
          // TODO delete this aha moments! poppulating
          // console.log(newComment);
          // console.log('===========================');
          // Comment.findById(newComment._id).populate('author.id').exec(function(err, comment) {
          //   console.log(comment);
          // });
          res.redirect('/collections/' + foundCollection._id);
        }
      });
    }
  });

});

//DESTROY - remove a spcific comment in the DB
router.delete('/comments', isLoggedIn, function(req, res) {
  var commentId = req.body.id;
  var CollectionId = req.params.id;

  Comment.findByIdAndRemove(commentId, function(err, foundComment) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/collections/' + CollectionId);
    }
  });

});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;

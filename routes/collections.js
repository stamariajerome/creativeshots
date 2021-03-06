var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Collection = require('../models/collection');
var middleware = require('../middleware');

// ===============
// COLLECTIONS
// ===============
// INDEX - show all collections in the DB
router.get('', function(req, res) {
  Collection.find({}, function(err, collections) {
    if(err) {
      console.log(err);
    } else {
      res.render('collections/index', { Collections: collections });
    }
  });

});

// NEW - show new collection form
router.get('/new', middleware.isLoggedIn, function(req, res) {
  res.render('collections/new');
});

// CREATE - add new collection into the DB
router.post('', middleware.isLoggedIn, function(req, res) {
  var newCollection = req.body.collection;

  Collection.create(newCollection, function(err, newCollection) {
    if(err) {
      console.log(err);
    } else {
      newCollection.author.id = req.user._id;
      newCollection.author.username = req.user.username;
      newCollection.save();
      res.redirect('/collections');
    }
  });

});

// EDIT - edit a collection in the DB
router.get('/:id/edit', middleware.checkOwnershipCollection, function(req, res) {
  var id = req.params.id;

  Collection.findById(id, function(err, foundCollection) {
    if(err) {
      return res.redirect('/collections/' + id + '/edit');
    }
    res.render('collections/edit', { Collection: foundCollection });
  });

});

// SHOW - Show information about the collection
router.get('/:id', function(req, res) {
  var id = req.params.id;

  Collection.findById(id, function(err, foundCollection) {
    if(err) {
      console.log(err);
    } else {
      Collection.findById(foundCollection._id).populate('comments').exec(function(err, foundComments) {
        if(err) {
          console.log(err);
        } else {
          res.render('collections/show', {Comments: foundComments.comments, Collection: foundCollection});
        }
      });
    }
  });

});

//UPDATE - Update information of a collection in the DB
router.put('/:id', middleware.checkOwnershipCollection, function(req, res) {
  var id = req.params.id;
  var update = req.body.collection;

  Collection.findByIdAndUpdate(id, update, function(err, foundCollection) {
    if(err) {
      return res.redirect('/collections/' + id + '/edit');
    }
    res.redirect('/collections/' + id);
  });

});

//DESTROY - Delete a particular collection in the DB
router.delete('/:id', middleware.checkOwnershipCollection, function(req, res) {
  var id = req.params.id;

  Collection.findByIdAndRemove(id, function(err, foundCollection) {
    if(err) {
      console.log(err);
      return res.redirect('/collections');
    }
    return res.redirect('/collections');
  });

});


module.exports = router;

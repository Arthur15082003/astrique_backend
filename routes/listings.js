var express = require('express');

var Listings = require('../models/listings')
var Collection = require('../models/collections');
const jwt = require('jsonwebtoken')
var Author = require('../models/authors');

var router = express.Router();

router.post('/', function(req, res, next) {
  jwt.verify(req.body.listing.token, 'cHrgAh4565$58|@56!aAhjAbnbWrT454Hw3rr55f4aG#%()4a1g5Ha', function(verifyErr) {
    if (verifyErr) {
      return res.status(403).json({
        success: false,
        error: 'You don\'t have access'
      });
    }
    if (!req.body.listing) {
      return res.status(400).json({
        success: false,
        message: 'Listing must be sent in request body'
      });
    }
    Collection.findOne({id: req.body.listing.collectionId}, function(collectionErr, collection) {
      Author.findOne({id: req.body.listing.authorId}, function(authorErr, author) {
        if (collectionErr || !collection) {
          return res.status(400).json({
            success: false,
            error: 'Could not find listing'
          });
        }

        if (authorErr || !author) {
          return res.status(400).json({
            success: false,
            error: 'Could not find Author'
          });
        }

        Listings.create({
          name: req.body.listing.name,
          authorId: author.id,
          photo: req.body.listing.photo,
          collectionId: collection.id
        }, function (err, listing) {
            if (err) {
              return res.status(400).json({
                success: false,
                error: 'Could not create Listing'
              });
            }
          return res.status(201).json({
            data: listing,
            success: true
          });
        });
      });
    });
  });
});

router.get('/', function(req, res, next) {
  Listings.find({}, function(err, listing) {
    if (err) {
      return res.status(400).json({
        success: false,
        error: 'Could not get Listing'
      });
    }
    return res.status(200).json({
      data: listing,
      success: true
    });
  });
});

router.delete('/', function(req, res , next) {
  jwt.verify(req.collection.token, 'cHrgAh4565$58|@56!aAhjAbnbWrT454Hw3rr55f4aG#%()4a1g5Ha', function(verifyErr) {
    if (verifyErr) {
      return res.status(403).json({
        success: false,
        error: 'You don\'t have access'
      });
    }
    Listings.remove({id: req.body.listing.id}, function(err) {
      if (err) {
        return res.status(400).json({
          sucess: false,
          error: 'Could not delete Listing'
        });
      }
      return res.status(200).json({
        success: true
      });
    });
  });
});

router.put('/', function(req, res, next) {
  jwt.verify(req.collection.token, 'cHrgAh4565$58|@56!aAhjAbnbWrT454Hw3rr55f4aG#%()4a1g5Ha', function(verifyErr) {
    if (verifyErr) {
      return res.status(403).json({
        success: false,
        error: 'You don\'t have access'
      });
    }
    Listings.findOne({id: req.body.listing.id}, function(err, listing) {
      if (err) {
        return res.status(400).json({
          success: false,
          error: 'Could not edit Listing'
        });
      }

      if (req.body.listing.name) {
        listing.name = req.body.listing.name;
      }

      if (req.body.listing.authorId) {
        listing.authorId = req.body.listing.authorId
      }

      if (req.body.listing.photo) {
        listing.photo = req.body.listing.photo;
      }

      if (req.body.listing.collectionId) {
        listing.collectionId = req.body.listing.collectionId;
      }

      listing.save(function(err) {
        if (err) {
          return res.status(400).json({
            success: false,
            error: 'Could not save'
          });
        }
        res.status(200).json({
          data: listing,
          success: true
        });
      });
    });
  });
});


module.exports = router;
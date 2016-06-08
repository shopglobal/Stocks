/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/products              ->  index
 * POST    /api/products              ->  create
 * GET     /api/products/:id          ->  show
 * PUT     /api/products/:id          ->  update
 * DELETE  /api/products/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Stock = require('./stock.model');
var path = require('path');
//var Catalog = require('../catalog/catalog.model'); REMOVED

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    console.error(err, statusCode);
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(function(updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(function() {
          res.status(204).end();
        });
    }
  };
}

function saveFile(res, file) {
  return function(entity){
    var newPath = '/assets/uploads/' + path.basename(file.path);
    entity.imageUrl = newPath;
    return entity.saveAsync().spread(function(updated) {
      return updated;
    });
  }
}

//REMOVED
function stocksInCategory(catalog) {
  var catalog_ids = [catalog._id].concat(catalog.children);
  return Stock
   .find({'categories': { $in: catalog_ids } })
    .populate('categories')
    .exec();
}

// Gets a list of Stocks
exports.index = function(req, res) {
  Stock.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Stock from the DB
exports.show = function(req, res) {
  Stock.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Stock in the DB
exports.create = function(req, res) {
  Stock.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Stock in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Stock.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Stock from the DB
exports.destroy = function(req, res) {
  Stock.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};

// Uploads a new Stock's image in the DB
exports.upload = function(req, res) {
  var file = req.files.file;
  if(!file){
    return handleError(res)('File not provided');
  }

  Stock.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveFile(res, file))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

//REMOVED
exports.catalog = function(req, res) {
  Catalog
    .findOne({ slug: req.params.slug })
    .execAsync()
    .then(stocksInCategory)
    .then(responseWithResult(res))
    .catch(handleError(res));
};

exports.search = function(req, res) {
  Stock
    .find({ $text: { $search: req.params.term }})
    .populate('categories')
    .execAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

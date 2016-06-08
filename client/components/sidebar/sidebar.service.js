'use strict';

angular.module('stocksApp')
  .factory('Catalog', function ($resource) {
    return $resource('/api/catalogs/:id');
  });

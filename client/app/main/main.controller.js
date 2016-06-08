'use strict';

angular.module('stocksApp')
  .controller('MainCtrl', function($scope, $http, socket, Stock) { //socket, Product removed
    $scope.stocks = Stock.query();

  });

'use strict';

var errorHandler, uploadHander;

angular.module('stocksApp')

  .controller('StocksCtrl', function ($scope, Stock) {
    $scope.stocks = Stock.query();

    $scope.$on('search:term', function (event, data) {
      if(data.length) {
        $scope.stocks = Stock.search({id: data});
        $scope.query = data;
      } else {
        $scope.stocks = Stock.query();
        $scope.query = '';
      }
    });
  })

  .controller('StockCatalogCtrl', function ($scope, $stateParams, Stock) {
    $scope.stocks = Stock.catalog({id: $stateParams.slug});
    $scope.query = $stateParams.slug;
  })

  .controller('StockViewCtrl', function ($scope, $state, $stateParams, Stock, Auth) {
    $scope.stock = Stock.get({id: $stateParams.id});
    $scope.user = Auth.getCurrentUser();
    $scope.deleteStock = function(){
      Stock.delete({id: $scope.stock._id}, function success(/* value, responseHeaders */) {
        $state.go('stocks');
      }, errorHandler($scope));
    };
  })

  .controller('StockNewCtrl', function ($scope, $state, Stock) {
    $scope.stock = {}; // create a new instance
    $scope.addStock = function(){
      return Stock.save($scope.stock).$promise.then(function (stock) {
        return Stock.upload($scope.stock.picture, stock._id);
      }).then(function (stock) {
        $state.go('viewStock', {id: stock._id});
      }).catch(errorHandler($scope));
    };
  })

  .controller('StockEditCtrl', function ($scope, $state, $stateParams, Stock, Upload, $timeout) {
    $scope.stock = Stock.get({id: $stateParams.id});
    $scope.editStock = function(){
      return Stock.update({id: $scope.stock._id}, $scope.stock).$promise.then(function (stock) {
        return Stock.upload($scope.stock.picture, stock._id);
      }).then(function (stock) {
        $state.go('viewStock', {id: stock._id});
      }).catch(errorHandler($scope));
    };

    $scope.upload = uploadHander($scope, Upload, $timeout);
  })

  .constant('clientTokenPath', '/api/braintree/client_token')

/*  .controller('StockCheckoutCtrl',
    function($scope, $http, $state, ngCart){
    $scope.errors = '';

    $scope.paymentOptions = {
      onPaymentMethodReceived: function(payload) {
        angular.merge(payload, ngCart.toObject());
        payload.total = payload.totalCost;
        $http.post('/api/orders', payload)
        .then(function success () {
          ngCart.empty(true);
          $state.go('stocks');
        }, function error (res) {
          $scope.errors = res;
        });
      }
    };
  });
*/

errorHandler = function ($scope){
  return function error(httpResponse){
    console.log('failed: ', httpResponse);
    $scope.errors = httpResponse;
  };
};

/*uploadHander = function ($scope, Upload, $timeout) {
  return function(file) {
    if (file && !file.$error) {
      $scope.file = file;
      file.upload = Upload.upload({
        url: '/api/stocks/'+$scope.stock._id+'/upload',
        file: file
      });

      file.upload.then(function (response) {
        $timeout(function () {
          file.result = response.data;
        });
      }, function (response) {
        if (response.status > 0){
          console.log(response.status + ': ' + response.data);
          errorHandler($scope)(response.status + ': ' + response.data);
        }
      });

      file.upload.progress(function (evt) {
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    }
  };
};
*/

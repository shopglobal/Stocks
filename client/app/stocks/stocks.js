'use strict';

angular.module('stocksApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('stocks', {
        url: '/stocks',
        templateUrl: 'app/stocks/templates/stock-list.html',
        controller: 'StocksCtrl'
      })

      .state('newStock', {
        url: '/stocks/new',
        templateUrl: 'app/stocks/templates/stock-new.html',
        controller: 'StockNewCtrl',
        authenticate: 'admin'
      })

      .state('viewStock', {
        url: '/stocks/:id/view',
        templateUrl: 'app/stocks/templates/stock-view.html',
        controller: 'StockViewCtrl'
      })

      .state('editStock', {
        url: '/stocks/:id/edit',
        templateUrl: 'app/stocks/templates/stock-edit.html',
        controller: 'StockEditCtrl',
        authenticate: 'admin'
      })

      .state('checkout', {
        url: '/checkout',
        templateUrl: 'app/stocks/templates/stocks-checkout.html',
        controller: 'StockCheckoutCtrl'
      })

      .state('stockCatalog', {
        url: '/stocks/:slug/catalog',
        templateUrl: 'app/stocks/templates/stock-list.html',
        controller: 'StockCatalogCtrl'
      });
  });

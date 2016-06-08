/*jshint expr: true*/

'use strict';

describe('Service: Stock', function () {

  // load the service's module
  beforeEach(module('meanshopApp'));
  beforeEach(module('stateMock'));
  beforeEach(module('socketMock'));

  // instantiate service
  var Stock,
      $httpBackend,
      validAttributes = [
        {title: 'Stock1', price: 123.45 },
        {title: 'Stock2', price: 678.90 }
      ],
      newAttributes = {title: 'Stock3', price: 1000 },
      stockWithId = angular.extend({}, newAttributes, {id: 123});

  beforeEach(inject(function (_Stock_, _$httpBackend_) {
    Stock = _Stock_;
    $httpBackend = _$httpBackend_;
  }));

  describe('#index', function() {
    it('should fetch stocks with HTTP GET request', function() {
      $httpBackend.expectGET('/api/stocks').respond(validAttributes);
      Stock.query(function (stocks) {
        expect(stocks).to.equal(validAttributes);
      });
    });

    it('should work with empty data', function () {
      $httpBackend.expectGET('/api/stocks').respond([]);
      Stock.query(function (stocks) {
        expect(stocks).to.equal([]);
      });
    });
  });

  describe('#show', function() {
    it('should get a single stock by id', function() {
      $httpBackend
        .expectGET('/api/stocks/1')
        .respond(validAttributes[0]);
      Stock.get({id: 1}, function(stock){
        expect(stock).to.equal(validAttributes[0]);
      });
    });
  });

  describe('#create', function() {
    beforeEach(function() {
      $httpBackend
        .expect('POST', '/api/stocks', JSON.stringify(newAttributes))
        .respond(stockWithId);
    });

    it('should create a new Stock from the class', function() {
      var newStock = Stock.save(newAttributes, successCb(stockWithId));
      expect(toJson(newStock)).to.eql(newAttributes);
    });

    it('should create a new stock from the instance', function() {
      var stock = new Stock();
      stock.title = 'Stock3';
      stock.price = 1000;

      stock.$save(successCb(stockWithId));
      expect(toJson(stock)).to.eql(newAttributes);
    });

  });

  describe('#update', function() {
    var updatedValues = {title: 'new title', price: 987};

    it('should update attributes with PUT', function() {
      $httpBackend
        .expectPUT('/api/stocks/123', updatedValues)
        .respond(angular.extend({}, updatedValues, {id: 123}));

      Stock.update({id: 123}, updatedValues, function(stock){
        expect(stock.id).to.be(123);
        expect(stock.price).to.be(987);
        expect(stock.title).to.be('new title');
      });
    });
  });

  describe('#delete', function() {
    it('should delete stock', function() {
      $httpBackend
        .expectDELETE('/api/stocks/123')
        .respond({});
      Stock.remove({id: 123}, successCb);
    });
  });

  function toJson(obj){
    return JSON.parse(JSON.stringify(obj));
  }

  function successCb(match){
    return function(value/*, responseHeaders*/){
      expect(value).to.equal(match);
    };
  }
});

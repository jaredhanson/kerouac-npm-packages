/* global describe, it, expect */

var expect = require('chai').expect;
var factory = require('../../../app/api/www/site');


describe('api/www/site', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.deep.equal('http://i.kerouacjs.org/Site');
    expect(factory['@path']).to.equal('/');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  it('should create service', function() {
    function dbHandler() {};
    function packageHandler() {};
  
    var service = factory(dbHandler, packageHandler);
    
    expect(service).to.be.a('function');
    expect(service.length).to.equal(2);
  });
  
});

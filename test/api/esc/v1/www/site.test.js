/* global describe, it, expect */

var expect = require('chai').expect;
var factory = require('../../../../../app/api/esc/v1/www/site');


describe('api/esc/v1/www/site', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.deep.equal('http://i.kerouacjs.org/Site');
    expect(factory['@path']).to.equal('/-/v1');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  it('should create service', function() {
    function allHandler() {};
  
    var service = factory(allHandler);
    
    expect(service).to.be.a('function');
    expect(service.length).to.equal(2);
  });
  
});

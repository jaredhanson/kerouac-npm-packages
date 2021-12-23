/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');


describe('kerouac-npm-packages', function() {
  
  describe('package.json', function() {
    var json = require('../package.json');
    
    it('should have assembly metadata', function() {
      expect(json.assembly.namespace).to.equal('io.modulate/comp/lang/javascript/packages/registry');
      
      expect(json.assembly.components).to.have.length(2);
      expect(json.assembly.components).to.include('www/site');
      expect(json.assembly.components).to.include('packages/registry/local');
    });
  });
  
  /*
  it('should throw if required', function() {
    expect(function() {
      var pkg = require('..');
    }).to.throw(Error).with.property('code', 'MODULE_NOT_FOUND');
  });
  */
  
});

afterEach(function() {
  //if (sinon.restore) { sinon.restore(); }
  //sinon.restore();
});

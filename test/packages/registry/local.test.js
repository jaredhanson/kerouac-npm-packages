/* global describe, it, expect */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/packages/registry/local');
var LocalCuratedRegistry = require('../../../lib/localcuratedregistry');
var NpmRegistry = require('../../../lib/npmregistry');


describe('packages/registry/local', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://schemas.modulate.io/js/comp/lang/javascript/PackageRegistry');
    expect(factory['@singleton']).to.be.true;
  });
  
  describe('creating', function() {
    var LocalCuratedRegistrySpy = sinon.spy(LocalCuratedRegistry);
    var NpmRegistrySpy = sinon.spy(NpmRegistry);
    
    var factory = $require('../../../app/packages/registry/local',
      { '../../../lib/localcuratedregistry': LocalCuratedRegistry,
        '../../../lib/npmregistry': NpmRegistry });
    var registry = factory();
    
    it('should construct npm registry', function() {
      expect(NpmRegistrySpy).to.have.been.calledWithNew;
    });
    
    it('should construct locally curated registry', function() {
      expect(LocalCuratedRegistrySpy).to.have.been.calledWithNew;
    });
    
    it('should return registry', function() {
      expect(registry).to.be.an.instanceOf(LocalCuratedRegistry);
    });
  }); // creating
  
});

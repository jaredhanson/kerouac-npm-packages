/* global describe, it */

var $require = require('proxyquire');
var factory = require('../app/site');
var MockSite = require('./mocks/site');
var MockQueue = require('./mocks/queue');


describe('www/site', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.deep.equal([
      'http://i.kerouacjs.org/Site',
      'http://schemas.modulate.io/js/comp/lang/javascript/packages/registry/WWWSite'
    ]);
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('create', function() {
    function kerouac() {
      return new MockSite();
    }
    var factory = $require('../app/site', { 'kerouac': kerouac });

    var packageRegistry = {
      read: function(){}
    };
    
    function showHandler() {};
    function allHandler() {};
    function featuredHandler() {};
    var site = factory(showHandler, allHandler, featuredHandler, packageRegistry);
  
    it('should add pages', function() {
      expect(site._pages.length).to.equal(4);
      expect(site._pages[0].path).to.equal('/:name.html');
      expect(site._pages[0].handler).to.equal(showHandler);
      expect(site._pages[1].path).to.equal('/-/v1/all.json');
      expect(site._pages[1].handler).to.equal(allHandler);
      expect(site._pages[2].path).to.equal('/-/v1/all/:page.json');
      expect(site._pages[2].handler).to.equal(allHandler);
      expect(site._pages[3].path).to.equal('/sitemap.xml');
    });
  });
  
});




/*
describe('kerouac-npm-packages', function() {
  
  describe('binding to directory containing packages implementing federation protocols', function() {
    var site = packages('test/fixtures/federation-protocols');
    var queue = new Queue();
    
    before(function(done) {
      site._blocks[0].call(queue, function(err) {
        if (err) { return done(err); }
        return done();
      });
    });
    
    it('should bind pages', function() {
      expect(site._spaths).to.have.length(2);
      expect(site._spaths[0]).to.equal('/-/v1/all.json');
      expect(site._spaths[1]).to.equal('/sitemap.xml');
    });
    
    it('should queue pages', function() {
      expect(queue._q).to.have.length(3);
      expect(queue._q[0]).to.equal('/passport-oauth.html');
      expect(queue._q[1]).to.equal('/passport-openid.html');
      expect(queue._q[2]).to.equal('/passport-saml.html');
    });
  });
  
});
*/

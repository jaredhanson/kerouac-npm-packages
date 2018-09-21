/* global describe, it */

var $require = require('proxyquire');
var sinon = require('sinon');
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
  
  describe('create with one package', function() {
    function kerouac() {
      return new MockSite();
    }
    var factory = $require('../app/site', { 'kerouac': kerouac });

    var packageRegistry = {
      list: sinon.stub().yields(null, [
        { name: 'passport-facebook' }
      ])
    };
    
    function showHandler() {};
    function allHandler() {};
    function featuredHandler() {};
    var site = factory(showHandler, allHandler, featuredHandler, packageRegistry);
  
    it('should add routes', function() {
      expect(site._routes.length).to.equal(4);
      expect(site._routes[0].path).to.equal('/:name.html');
      expect(site._routes[0].handler).to.equal(showHandler);
      expect(site._routes[1].path).to.equal('/-/v1/all.json');
      expect(site._routes[1].handler).to.equal(allHandler);
      expect(site._routes[2].path).to.equal('/-/v1/all/:page.json');
      expect(site._routes[2].handler).to.equal(allHandler);
      expect(site._routes[3].path).to.equal('/sitemap.xml');
    });
    
    describe('and then binding content', function() {
      var queue = new MockQueue();
      
      before(function(done) {
        site._bind.call(queue, function(err) {
          if (err) { return done(err); }
          return done();
        });
      });
      
      it('should queue content', function() {
        expect(queue._q).to.have.length(1);
        expect(queue._q[0]).to.equal('/passport-facebook.html');
      });
    }); // and then binding content
    
  }); // create with one package
  
  describe('create with three packages', function() {
    function kerouac() {
      return new MockSite();
    }
    var factory = $require('../app/site', { 'kerouac': kerouac });

    var packageRegistry = {
      list: sinon.stub().yields(null, [
        { name: 'passport-oauth' },
        { name: 'passport-openid' },
        { name: 'passport-saml' }
      ])
    };
    
    function showHandler() {};
    function allHandler() {};
    function featuredHandler() {};
    var site = factory(showHandler, allHandler, featuredHandler, packageRegistry);
  
    it('should add routes', function() {
      expect(site._routes.length).to.equal(4);
      expect(site._routes[0].path).to.equal('/:name.html');
      expect(site._routes[0].handler).to.equal(showHandler);
      expect(site._routes[1].path).to.equal('/-/v1/all.json');
      expect(site._routes[1].handler).to.equal(allHandler);
      expect(site._routes[2].path).to.equal('/-/v1/all/:page.json');
      expect(site._routes[2].handler).to.equal(allHandler);
      expect(site._routes[3].path).to.equal('/sitemap.xml');
    });
    
    describe('and then binding content', function() {
      var queue = new MockQueue();
      
      before(function(done) {
        site._bind.call(queue, function(err) {
          if (err) { return done(err); }
          return done();
        });
      });
      
      it('should queue content', function() {
        expect(queue._q).to.have.length(3);
        expect(queue._q[0]).to.equal('/passport-oauth.html');
        expect(queue._q[1]).to.equal('/passport-openid.html');
        expect(queue._q[2]).to.equal('/passport-saml.html');
      });
    }); // and then binding content
    
  }); // create with three packages
  
});

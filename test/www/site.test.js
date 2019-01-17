/* global describe, it */

var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../app/www/site');
var MockSite = require('../mocks/site');
var MockQueue = require('../mocks/queue');


describe('www/site', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.deep.equal('http://i.kerouacjs.org/Site');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('create with one package', function() {
    function kerouac() {
      return new MockSite();
    }
    var factory = $require('../../app/www/site', { 'kerouac': kerouac });

    var packageRegistry = {
      list: sinon.stub().yields(null, [
        { name: 'passport-facebook' }
      ])
    };
    
    function showHandler() {};
    function api_allHandler() {};
    function api_v1_allHandler() {};
    function api_v1_promotedHandler() {};
    var site = factory(showHandler, api_allHandler, api_v1_allHandler, api_v1_promotedHandler, packageRegistry);
  
    it('should add routes', function() {
      expect(site._routes.length).to.equal(6);
      expect(site._routes[0].path).to.equal('/:name.html');
      expect(site._routes[0].handler).to.equal(showHandler);
      expect(site._routes[1].path).to.equal('/-/all.json');
      expect(site._routes[1].handler).to.equal(api_allHandler);
      expect(site._routes[2].path).to.equal('/-/v1/all.json');
      expect(site._routes[2].handler).to.equal(api_v1_allHandler);
      expect(site._routes[3].path).to.equal('/-/v1/all/:page.json');
      expect(site._routes[3].handler).to.equal(api_v1_allHandler);
      expect(site._routes[4].path).to.equal('/-/v1/promoted.json');
      expect(site._routes[4].handler).to.equal(api_v1_promotedHandler);
      expect(site._routes[5].path).to.equal('/sitemap.xml');
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
    var factory = $require('../../app/www/site', { 'kerouac': kerouac });

    var packageRegistry = {
      list: sinon.stub().yields(null, [
        { name: 'passport-oauth' },
        { name: 'passport-openid' },
        { name: 'passport-saml' }
      ])
    };
    
    function showHandler() {};
    function api_allHandler() {};
    function api_v1_allHandler() {};
    function api_v1_promotedHandler() {};
    var site = factory(showHandler, api_allHandler, api_v1_allHandler, api_v1_promotedHandler, packageRegistry);
    
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
  
  describe('create with 25 packages', function() {
    function kerouac() {
      return new MockSite();
    }
    var factory = $require('../../app/www/site', { 'kerouac': kerouac });

    var packageRegistry = {
      list: sinon.stub().yields(null, [
        { name: 'foo-01' },
        { name: 'foo-02' },
        { name: 'foo-03' },
        { name: 'foo-04' },
        { name: 'foo-05' },
        { name: 'foo-06' },
        { name: 'foo-07' },
        { name: 'foo-08' },
        { name: 'foo-09' },
        { name: 'foo-10' },
        { name: 'foo-11' },
        { name: 'foo-12' },
        { name: 'foo-13' },
        { name: 'foo-14' },
        { name: 'foo-15' },
        { name: 'foo-16' },
        { name: 'foo-17' },
        { name: 'foo-18' },
        { name: 'foo-19' },
        { name: 'foo-20' },
        { name: 'foo-21' },
        { name: 'foo-22' },
        { name: 'foo-23' },
        { name: 'foo-24' },
        { name: 'foo-25' }
      ])
    };
    
    function showHandler() {};
    function api_allHandler() {};
    function api_v1_allHandler() {};
    function api_v1_promotedHandler() {};
    var site = factory(showHandler, api_allHandler, api_v1_allHandler, api_v1_promotedHandler, packageRegistry);
    
    describe('and then binding content', function() {
      var queue = new MockQueue();
      
      before(function(done) {
        site._bind.call(queue, function(err) {
          if (err) { return done(err); }
          return done();
        });
      });
      
      it('should queue content', function() {
        expect(queue._q).to.have.length(25);
      });
    }); // and then binding content
    
  }); // create with 25 packages
  
  describe('create with 26 packages', function() {
    function kerouac() {
      return new MockSite();
    }
    var factory = $require('../../app/www/site', { 'kerouac': kerouac });

    var packageRegistry = {
      list: sinon.stub().yields(null, [
        { name: 'foo-01' },
        { name: 'foo-02' },
        { name: 'foo-03' },
        { name: 'foo-04' },
        { name: 'foo-05' },
        { name: 'foo-06' },
        { name: 'foo-07' },
        { name: 'foo-08' },
        { name: 'foo-09' },
        { name: 'foo-10' },
        { name: 'foo-11' },
        { name: 'foo-12' },
        { name: 'foo-13' },
        { name: 'foo-14' },
        { name: 'foo-15' },
        { name: 'foo-16' },
        { name: 'foo-17' },
        { name: 'foo-18' },
        { name: 'foo-19' },
        { name: 'foo-20' },
        { name: 'foo-21' },
        { name: 'foo-22' },
        { name: 'foo-23' },
        { name: 'foo-24' },
        { name: 'foo-25' },
        { name: 'foo-26' }
      ])
    };
    
    function showHandler() {};
    function api_allHandler() {};
    function api_v1_allHandler() {};
    function api_v1_promotedHandler() {};
    var site = factory(showHandler, api_allHandler, api_v1_allHandler, api_v1_promotedHandler, packageRegistry);
    
    describe('and then binding content', function() {
      var queue = new MockQueue();
      
      before(function(done) {
        site._bind.call(queue, function(err) {
          if (err) { return done(err); }
          return done();
        });
      });
      
      it('should queue content', function() {
        expect(queue._q).to.have.length(27);
        expect(queue._q[25]).to.equal('/foo-26.html');
        expect(queue._q[26]).to.equal('/-/v1/all/2.json');
      });
    }); // and then binding content
    
  }); // create with 26 packages
  
  describe('create with 50 packages', function() {
    function kerouac() {
      return new MockSite();
    }
    var factory = $require('../../app/www/site', { 'kerouac': kerouac });

    var packageRegistry = {
      list: sinon.stub().yields(null, [
        { name: 'foo-01' },
        { name: 'foo-02' },
        { name: 'foo-03' },
        { name: 'foo-04' },
        { name: 'foo-05' },
        { name: 'foo-06' },
        { name: 'foo-07' },
        { name: 'foo-08' },
        { name: 'foo-09' },
        { name: 'foo-10' },
        { name: 'foo-11' },
        { name: 'foo-12' },
        { name: 'foo-13' },
        { name: 'foo-14' },
        { name: 'foo-15' },
        { name: 'foo-16' },
        { name: 'foo-17' },
        { name: 'foo-18' },
        { name: 'foo-19' },
        { name: 'foo-20' },
        { name: 'foo-21' },
        { name: 'foo-22' },
        { name: 'foo-23' },
        { name: 'foo-24' },
        { name: 'foo-25' },
        { name: 'foo-26' },
        { name: 'foo-27' },
        { name: 'foo-28' },
        { name: 'foo-29' },
        { name: 'foo-30' },
        { name: 'foo-31' },
        { name: 'foo-32' },
        { name: 'foo-33' },
        { name: 'foo-34' },
        { name: 'foo-35' },
        { name: 'foo-36' },
        { name: 'foo-37' },
        { name: 'foo-38' },
        { name: 'foo-39' },
        { name: 'foo-40' },
        { name: 'foo-41' },
        { name: 'foo-42' },
        { name: 'foo-43' },
        { name: 'foo-44' },
        { name: 'foo-45' },
        { name: 'foo-46' },
        { name: 'foo-47' },
        { name: 'foo-48' },
        { name: 'foo-49' },
        { name: 'foo-50' }
      ])
    };
    
    function showHandler() {};
    function api_allHandler() {};
    function api_v1_allHandler() {};
    function api_v1_promotedHandler() {};
    var site = factory(showHandler, api_allHandler, api_v1_allHandler, api_v1_promotedHandler, packageRegistry);
    
    describe('and then binding content', function() {
      var queue = new MockQueue();
      
      before(function(done) {
        site._bind.call(queue, function(err) {
          if (err) { return done(err); }
          return done();
        });
      });
      
      it('should queue content', function() {
        expect(queue._q).to.have.length(51);
        expect(queue._q[49]).to.equal('/foo-50.html');
        expect(queue._q[50]).to.equal('/-/v1/all/2.json');
      });
    }); // and then binding content
    
  }); // create with 50 packages
  
  describe('create with 51 packages', function() {
    function kerouac() {
      return new MockSite();
    }
    var factory = $require('../../app/www/site', { 'kerouac': kerouac });

    var packageRegistry = {
      list: sinon.stub().yields(null, [
        { name: 'foo-01' },
        { name: 'foo-02' },
        { name: 'foo-03' },
        { name: 'foo-04' },
        { name: 'foo-05' },
        { name: 'foo-06' },
        { name: 'foo-07' },
        { name: 'foo-08' },
        { name: 'foo-09' },
        { name: 'foo-10' },
        { name: 'foo-11' },
        { name: 'foo-12' },
        { name: 'foo-13' },
        { name: 'foo-14' },
        { name: 'foo-15' },
        { name: 'foo-16' },
        { name: 'foo-17' },
        { name: 'foo-18' },
        { name: 'foo-19' },
        { name: 'foo-20' },
        { name: 'foo-21' },
        { name: 'foo-22' },
        { name: 'foo-23' },
        { name: 'foo-24' },
        { name: 'foo-25' },
        { name: 'foo-26' },
        { name: 'foo-27' },
        { name: 'foo-28' },
        { name: 'foo-29' },
        { name: 'foo-30' },
        { name: 'foo-31' },
        { name: 'foo-32' },
        { name: 'foo-33' },
        { name: 'foo-34' },
        { name: 'foo-35' },
        { name: 'foo-36' },
        { name: 'foo-37' },
        { name: 'foo-38' },
        { name: 'foo-39' },
        { name: 'foo-40' },
        { name: 'foo-41' },
        { name: 'foo-42' },
        { name: 'foo-43' },
        { name: 'foo-44' },
        { name: 'foo-45' },
        { name: 'foo-46' },
        { name: 'foo-47' },
        { name: 'foo-48' },
        { name: 'foo-49' },
        { name: 'foo-50' },
        { name: 'foo-51' }
      ])
    };
    
    function showHandler() {};
    function api_allHandler() {};
    function api_v1_allHandler() {};
    function api_v1_promotedHandler() {};
    var site = factory(showHandler, api_allHandler, api_v1_allHandler, api_v1_promotedHandler, packageRegistry);
    
    describe('and then binding content', function() {
      var queue = new MockQueue();
      
      before(function(done) {
        site._bind.call(queue, function(err) {
          if (err) { return done(err); }
          return done();
        });
      });
      
      it('should queue content', function() {
        expect(queue._q).to.have.length(53);
        expect(queue._q[50]).to.equal('/foo-51.html');
        expect(queue._q[51]).to.equal('/-/v1/all/2.json');
        expect(queue._q[52]).to.equal('/-/v1/all/3.json');
      });
    }); // and then binding content
    
  }); // create with 51 packages
  
});

var $require = require('proxyquire');
var chai = require('chai');
var sinon = require('sinon');
var kerouac = require('kerouac')
var handler = require('../../lib/handlers/show');


describe('handlers/show', function() {
  var site = kerouac();
  
  describe('package with metadata loaded from npm', function() {
    var packageJsonStub = sinon.stub().resolves({
      name: 'passport-openid',
      description: 'OpenID authentication strategy for Passport.',
      'dist-tags': {
        latest: '0.4.0'
      },
      time: {
        modified: '2017-08-30T14:29:54.769Z',
        created: '2011-11-04T00:28:17.973Z',
      },
      repository: {
        type: 'git',
        url: 'git://github.com/jaredhanson/passport-openid.git'
      },
      readme: '# Passport-OpenID\n\n[Passport](https://github.com/jaredhanson/passport) strategy for authenticating\nwith [OpenID](http://openid.net/).\n\nThis module lets you authenticate using OpenID in your Node.js applications.  By\nplugging into Passport, OpenID authentication can be easily and unobtrusively\nintegrated into any application or framework that supports\n[Connect](http://www.senchalabs.org/connect/)-style middleware, including\n[Express](http://expressjs.com/).\n\n',
      homepage: 'https://github.com/jaredhanson/passport-openid',
      keywords: [
        'openid'
      ],
      bugs: {
        url: 'http://github.com/jaredhanson/passport-openid/issues'
      }
    });
    
    var scmStub = { get: function(opts, cb){} }
    sinon.stub(scmStub, 'get').yields(null, {
      homepage: 'https://github.com/jaredhanson/passport-openid',
      url: 'git://github.com/jaredhanson/passport-openid.git',
      favoriteCount: 57,
      subscriberCount: 7,
      forkCount: 66,
      createdAt: new Date(Date.parse('2011-11-03T05:26:46.000Z')),
      modifiedAt: new Date(Date.parse('2017-09-16T23:34:19.000Z'))
    });
    
    var handler = $require('../../lib/handlers/show',
      { 'package-json': packageJsonStub, '../scm/github': scmStub });
    
    
    var page, layout, err;
    
    before(function(done) {
      chai.kerouac.handler(handler('test/fixtures/federation-protocols'))
        .page(function(page) {
          page.site = site;
          page.params = { name: 'passport-openid' };
        })
        .render(function(p, l) {
          page = p;
          layout = l;
          done();
        })
        .dispatch();
    });
    
    it('should load metadata from npm', function() {
      expect(packageJsonStub.getCall(0).args[0]).to.equal('passport-openid');
    });
  
    it('should set metadata', function() {
      expect(page.package).to.equal(true);
    });
    
    it('should render with locals', function() {
      expect(page.locals.name).to.equal('passport-openid');
      //expect(page.locals.content).to.equal('<p>This post was written using Markdown.</p>\n');
    });
  });
  
});

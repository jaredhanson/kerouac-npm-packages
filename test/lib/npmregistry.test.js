var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var NpmRegistry = require('../../lib/npmregistry');


describe('NpmRegistry', function() {
  
  it('should export constructor', function() {
    expect(NpmRegistry).to.be.a('function');
  });
  
  describe('#read', function() {
    
    describe('package', function() {
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
          'passport', 'openid', 'identity'
        ],
        bugs: {
          url: 'http://github.com/jaredhanson/passport-openid/issues'
        }
      });
      
      var NpmRegistry = $require('../../lib/npmregistry',
        { 'package-json': packageJsonStub });
      var registry = new NpmRegistry();
      
      
      var pkg;
      before(function(done) {

        registry.read('foo', function(err, p) {
          if (err) { return done(err); }
          pkg = p;
          done();
        })
      })
      
      it('should read package', function() {
        expect(pkg).to.deep.equal({
          name: 'passport-openid',
          description: 'OpenID authentication strategy for Passport.',
          versions: {},
          readme: '# Passport-OpenID\n\n[Passport](https://github.com/jaredhanson/passport) strategy for authenticating\nwith [OpenID](http://openid.net/).\n\nThis module lets you authenticate using OpenID in your Node.js applications.  By\nplugging into Passport, OpenID authentication can be easily and unobtrusively\nintegrated into any application or framework that supports\n[Connect](http://www.senchalabs.org/connect/)-style middleware, including\n[Express](http://expressjs.com/).\n\n',
          ctime: new Date('2011-11-04T00:28:17.973Z'),
          mtime: new Date('2017-08-30T14:29:54.769Z')
        });
      });
    });
    
  }); // #read
    
  
});

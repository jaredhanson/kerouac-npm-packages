var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var NpmRegistry = require('../../lib/npmregistry');


describe('NpmRegistry', function() {
  
  it('should export constructor', function() {
    expect(NpmRegistry).to.be.a('function');
  });
  
  describe('#read', function() {
    
    describe('package without versions', function() {
      var packageJsonStub = sinon.stub().resolves({
        name: 'passport-openid',
        description: 'OpenID authentication strategy for Passport.',
        time: {
          modified: '2017-08-30T14:29:54.769Z',
          created: '2011-11-04T00:28:17.973Z',
        },
        author: {
          name: 'Jared Hanson',
          email: 'jaredhanson@gmail.com',
          url: 'http://www.jaredhanson.net/'
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
        registry.read('passport-openid', function(err, p) {
          if (err) { return done(err); }
          pkg = p;
          done();
        })
      })
      
      it('should call package-json correctly', function() {
        expect(packageJsonStub.callCount).to.equal(1);
        var call = packageJsonStub.getCall(0)
        expect(call.args[0]).to.equal('passport-openid');
        expect(call.args[1]).to.deep.equal({ fullMetadata: true, allVersions: true });
      });
      
      it('should read package', function() {
        expect(pkg).to.deep.equal({
          name: 'passport-openid',
          description: 'OpenID authentication strategy for Passport.',
          keywords: [ 'passport', 'openid', 'identity' ],
          versions: {},
          homepage: 'https://github.com/jaredhanson/passport-openid',
          author: {
            name: 'Jared Hanson',
            email: 'jaredhanson@gmail.com',
            url: 'http://www.jaredhanson.net/'
          },
          readme: '# Passport-OpenID\n\n[Passport](https://github.com/jaredhanson/passport) strategy for authenticating\nwith [OpenID](http://openid.net/).\n\nThis module lets you authenticate using OpenID in your Node.js applications.  By\nplugging into Passport, OpenID authentication can be easily and unobtrusively\nintegrated into any application or framework that supports\n[Connect](http://www.senchalabs.org/connect/)-style middleware, including\n[Express](http://expressjs.com/).\n\n',
          ctime: new Date('2011-11-04T00:28:17.973Z'),
          mtime: new Date('2017-08-30T14:29:54.769Z')
        });
      });
    }); // package without versions
    
  }); // #read
    
  
});

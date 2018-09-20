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
        name: 'passport-facebook',
        description: 'Facebook authentication strategy for Passport.',
        'dist-tags': { latest: '2.1.1' },
        time: {
          modified: '2018-08-03T00:35:46.879Z',
          created: '2011-10-23T22:27:46.568Z',
          '0.1.0': '2011-10-23T22:27:48.179Z',
          '0.1.1': '2011-12-02T07:29:25.064Z',
          '0.1.2': '2012-03-05T02:09:28.433Z',
          '0.1.3': '2012-04-01T00:58:04.129Z',
          '0.1.4': '2012-06-26T04:40:22.472Z',
          '0.1.5': '2013-02-10T07:43:08.016Z',
          '0.1.6': '2013-08-15T17:29:05.977Z',
          '1.0.0': '2013-08-15T21:53:46.344Z',
          '1.0.1': '2013-09-11T15:54:16.884Z',
          '1.0.2': '2013-11-08T19:00:56.090Z',
          '1.0.3': '2014-03-09T01:43:08.179Z',
          '2.0.0': '2015-03-03T17:43:41.174Z',
          '2.1.0': '2016-02-02T02:17:57.745Z',
          '2.1.1': '2016-05-17T19:13:37.644Z'
        },
        author: {
          name: 'Jared Hanson',
          email: 'jaredhanson@gmail.com',
          url: 'http://www.jaredhanson.net/'
        },
        repository: {
          type: 'git',
          url: 'git://github.com/jaredhanson/passport-facebook.git'
        },
        readme: '# passport-facebook\n\n',
        keywords: [
          'passport', 'facebook', 'identity'
        ],
        bugs: {
          url: 'http://github.com/jaredhanson/passport-openid/issues'
        },
        homepage: 'https://github.com/jaredhanson/passport-facebook#readme',
        license: 'MIT'
      });
      
      var NpmRegistry = $require('../../lib/npmregistry',
        { 'package-json': packageJsonStub });
      var registry = new NpmRegistry();
      
      
      var pkg;
      before(function(done) {
        registry.read('passport-facebook', function(err, p) {
          if (err) { return done(err); }
          pkg = p;
          done();
        })
      })
      
      it('should call package-json correctly', function() {
        expect(packageJsonStub.callCount).to.equal(1);
        var call = packageJsonStub.getCall(0)
        expect(call.args[0]).to.equal('passport-facebook');
        expect(call.args[1]).to.deep.equal({ fullMetadata: true, allVersions: true });
      });
      
      it('should read package', function() {
        expect(pkg).to.deep.equal({
          name: 'passport-facebook',
          description: 'Facebook authentication strategy for Passport.',
          keywords: [ 'passport', 'facebook', 'identity' ],
          versions: {},
          homepage: 'https://github.com/jaredhanson/passport-facebook#readme',
          author: {
            name: 'Jared Hanson',
            email: 'jaredhanson@gmail.com',
            url: 'http://www.jaredhanson.net/'
          },
          readme: '# passport-facebook\n\n',
          ctime: new Date('2011-10-23T22:27:46.568Z'),
          mtime: new Date('2018-08-03T00:35:46.879Z')
        });
      });
    }); // package
    
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
        keywords: [
          'passport', 'openid', 'identity'
        ],
        bugs: {
          url: 'http://github.com/jaredhanson/passport-openid/issues'
        },
        homepage: 'https://github.com/jaredhanson/passport-openid'
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

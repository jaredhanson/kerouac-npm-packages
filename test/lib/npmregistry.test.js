var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var NpmRegistry = require('../../lib/npmregistry');


describe('NpmRegistry', function() {
  
  it('should export constructor', function() {
    expect(NpmRegistry).to.be.a('function');
  });
  
  describe('#read', function() {
    
    it('should normalize package with latest version', function(done) {
      var packageJsonStub = sinon.stub().resolves({
        name: 'passport-facebook',
        description: 'Facebook authentication strategy for Passport.',
        'dist-tags': { latest: '2.1.1' },
        versions: {
          '0.1.0': {
            name: 'passport-facebook',
            version: '0.1.0',
            description: 'Facebook authentication strategy for Passport.',
            author: 
             { name: 'Jared Hanson',
               email: 'jaredhanson@gmail.com',
               url: 'http://www.jaredhanson.net/' },
            repository: 
             { type: 'git',
               url: 'git://github.com/jaredhanson/passport-facebook.git' },
            main: './lib/passport-facebook',
            dependencies: { 'passport-oauth': '>= 0.1.0' },
            engines: { node: '>= 0.4.0' },
            keywords: 
             [ 'passport',
               'facebook',
               'auth',
               'authn',
               'authentication',
               'identity' ],
            _npmJsonOpts: 
             { file: '/Users/jaredhanson/.npm/passport-facebook/0.1.0/package/package.json',
               wscript: false,
               contributors: false,
               serverjs: false },
            _id: 'passport-facebook@0.1.0',
            devDependencies: {},
            _engineSupported: true,
            _npmVersion: '1.0.20',
            _nodeVersion: 'v0.4.10',
            _defaultsLoaded: true,
            dist: 
             { shasum: '6e9fb3354505849dda60db4a093112359d675941',
               tarball: 'https://registry.npmjs.org/passport-facebook/-/passport-facebook-0.1.0.tgz' },
            scripts: {},
            maintainers: [ { name: 'jaredhanson', email: 'jaredhanson@gmail.com' } ],
            directories: {}
          },
          '2.1.1': {
            name: 'passport-facebook',
            version: '2.1.1',
            description: 'Facebook authentication strategy for Passport.',
            keywords: 
             [ 'passport',
               'facebook',
               'auth',
               'authn',
               'authentication',
               'identity' ],
            author: 
             { name: 'Jared Hanson',
               email: 'jaredhanson@gmail.com',
               url: 'http://www.jaredhanson.net/' },
            repository: 
             { type: 'git',
               url: 'git://github.com/jaredhanson/passport-facebook.git' },
            bugs: { url: 'http://github.com/jaredhanson/passport-facebook/issues' },
            license: 'MIT',
            licenses: [ { type: 'MIT', url: 'http://opensource.org/licenses/MIT' } ],
            main: './lib',
            dependencies: { 'passport-oauth2': '1.x.x' },
            devDependencies: 
             { 'make-node': '0.3.x',
               mocha: '1.x.x',
               chai: '2.x.x',
               'chai-passport-strategy': '1.x.x' },
            engines: { node: '>= 0.4.0' },
            scripts: { test: 'mocha --require test/bootstrap/node test/*.test.js' },
            gitHead: '2b74dd0eff976e85b029178e8012cb3703231112',
            homepage: 'https://github.com/jaredhanson/passport-facebook#readme',
            _id: 'passport-facebook@2.1.1',
            _shasum: 'c39d0b52ae4d59163245a4e21a7b9b6321303311',
            _from: '.',
            _npmVersion: '2.14.7',
            _nodeVersion: '4.2.1',
            _npmUser: { name: 'jaredhanson', email: 'jaredhanson@gmail.com' },
            maintainers: [ { name: 'jaredhanson', email: 'jaredhanson@gmail.com' } ],
            dist: 
             { shasum: 'c39d0b52ae4d59163245a4e21a7b9b6321303311',
               tarball: 'https://registry.npmjs.org/passport-facebook/-/passport-facebook-2.1.1.tgz' },
            _npmOperationalInternal: 
             { host: 'packages-16-east.internal.npmjs.com',
               tmp: 'tmp/passport-facebook-2.1.1.tgz_1463512414599_0.7715082890354097' },
            directories: {}
          }
        },
        maintainers: [{
          name: 'jaredhanson',
          email: 'jaredhanson@gmail.com'
        }],
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
          url: 'http://github.com/jaredhanson/passport-facebook/issues'
        },
        homepage: 'https://github.com/jaredhanson/passport-facebook#readme',
        license: 'MIT'
      });
      
      var pkgDownloadsStub = sinon.stub()
      pkgDownloadsStub.onFirstCall().resolves(7657);
      pkgDownloadsStub.onSecondCall().resolves(28650);
      pkgDownloadsStub.onThirdCall().resolves(183283);
      
      var NpmRegistry = $require('../../lib/npmregistry',
        { 'package-json': packageJsonStub,
          'pkg-downloads': pkgDownloadsStub });
      var registry = new NpmRegistry();
      
      registry.read('passport-facebook', function(err, pkg) {
        if (err) { return done(err); }
        
        expect(packageJsonStub.callCount).to.equal(1);
        var call = packageJsonStub.getCall(0)
        expect(call.args[0]).to.equal('passport-facebook');
        expect(call.args[1]).to.deep.equal({ fullMetadata: true, allVersions: true });
        
        expect(pkgDownloadsStub.callCount).to.equal(3);
        var call = pkgDownloadsStub.getCall(0)
        expect(call.args[0]).to.equal('passport-facebook');
        expect(call.args[1]).to.deep.equal({ period: 'day' });
        call = pkgDownloadsStub.getCall(1)
        expect(call.args[0]).to.equal('passport-facebook');
        expect(call.args[1]).to.deep.equal({ period: 'week' });
        call = pkgDownloadsStub.getCall(2)
        expect(call.args[0]).to.equal('passport-facebook');
        expect(call.args[1]).to.deep.equal({ period: 'month' });
        
        expect(pkg).to.deep.equal({
          name: 'passport-facebook',
          versions: {
            '0.1.0': {
              name: 'passport-facebook',
              version: '0.1.0',
              description: 'Facebook authentication strategy for Passport.',
              keywords: 
               [ 'passport',
                 'facebook',
                 'auth',
                 'authn',
                 'authentication',
                 'identity' ],
              repositories: [{
                type: 'git',
                url: 'git://github.com/jaredhanson/passport-facebook.git'
              }],
              contributors: [{
                name: 'Jared Hanson',
                email: 'jaredhanson@gmail.com',
                web: 'http://www.jaredhanson.net/'
              }],
              maintainers: [{
                name: 'jaredhanson',
                email: 'jaredhanson@gmail.com'
              }]
            },
            '2.1.1': {
              name: 'passport-facebook',
              version: '2.1.1',
              description: 'Facebook authentication strategy for Passport.',
              keywords: 
               [ 'passport',
                 'facebook',
                 'auth',
                 'authn',
                 'authentication',
                 'identity' ],
              homepage: 'https://github.com/jaredhanson/passport-facebook#readme',
              repositories: [{
                type: 'git',
                url: 'git://github.com/jaredhanson/passport-facebook.git'
              }],
              bugs: {
                url: 'http://github.com/jaredhanson/passport-facebook/issues'
              },
              contributors: [{
                name: 'Jared Hanson',
                email: 'jaredhanson@gmail.com',
                web: 'http://www.jaredhanson.net/'
              }],
              maintainers: [{
                name: 'jaredhanson',
                email: 'jaredhanson@gmail.com'
              }],
              licenses: [ { type: 'MIT' } ]
            }
          },
          'dist-tags': { latest: '2.1.1' },
          description: 'Facebook authentication strategy for Passport.',
          keywords: [ 'passport', 'facebook', 'identity' ],
          homepage: 'https://github.com/jaredhanson/passport-facebook#readme',
          repositories: [{
            type: 'git',
            url: 'git://github.com/jaredhanson/passport-facebook.git'
          }],
          bugs: {
            url: 'http://github.com/jaredhanson/passport-facebook/issues'
          },
          contributors: [{
            name: 'Jared Hanson',
            email: 'jaredhanson@gmail.com',
            web: 'http://www.jaredhanson.net/'
          }],
          maintainers: [{
            name: 'jaredhanson',
            email: 'jaredhanson@gmail.com'
          }],
          licenses: [{
            type: 'MIT'
          }],
          readme: '# passport-facebook\n\n',
          downloads: {
            'last-day': 7657,
            'last-week': 28650,
            'last-month': 183283
          },
          ctime: new Date('2011-10-23T22:27:46.568Z'),
          mtime: new Date('2018-08-03T00:35:46.879Z'),
          ptime: new Date('2016-05-17T19:13:37.644Z')
        });
        
        done();
      });
    }); // should normalize package with latest version
    
    it('should normalize package without versions or license', function(done) {
      var packageJsonStub = sinon.stub().resolves({
        name: 'passport-openid',
        description: 'OpenID authentication strategy for Passport.',
        maintainers: [{
          name: 'jaredhanson',
          email: 'jaredhanson@gmail.com'
        }],
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
        users: {
          'draschke': true,
          'ivan.marquez': true,
          'themadjoker': true
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
      
      var pkgDownloadsStub = sinon.stub()
      pkgDownloadsStub.onFirstCall().resolves(1029);
      pkgDownloadsStub.onSecondCall().resolves(4004);
      pkgDownloadsStub.onThirdCall().resolves(23844);
      
      var NpmRegistry = $require('../../lib/npmregistry',
        { 'package-json': packageJsonStub,
          'pkg-downloads': pkgDownloadsStub });
      var registry = new NpmRegistry();
      
      registry.read('passport-openid', function(err, pkg) {
        if (err) { return done(err); }
        
        expect(packageJsonStub.callCount).to.equal(1);
        var call = packageJsonStub.getCall(0)
        expect(call.args[0]).to.equal('passport-openid');
        expect(call.args[1]).to.deep.equal({ fullMetadata: true, allVersions: true });
        
        expect(pkgDownloadsStub.callCount).to.equal(3);
        var call = pkgDownloadsStub.getCall(0)
        expect(call.args[0]).to.equal('passport-openid');
        expect(call.args[1]).to.deep.equal({ period: 'day' });
        call = pkgDownloadsStub.getCall(1)
        expect(call.args[0]).to.equal('passport-openid');
        expect(call.args[1]).to.deep.equal({ period: 'week' });
        call = pkgDownloadsStub.getCall(2)
        expect(call.args[0]).to.equal('passport-openid');
        expect(call.args[1]).to.deep.equal({ period: 'month' });
        
        expect(pkg).to.deep.equal({
          name: 'passport-openid',
          versions: {},
          description: 'OpenID authentication strategy for Passport.',
          keywords: [ 'passport', 'openid', 'identity' ],
          homepage: 'https://github.com/jaredhanson/passport-openid',
          repositories: [{
            type: 'git',
            url: 'git://github.com/jaredhanson/passport-openid.git'
          }],
          bugs: {
            url: 'http://github.com/jaredhanson/passport-openid/issues'
          },
          contributors: [{
            name: 'Jared Hanson',
            email: 'jaredhanson@gmail.com',
            web: 'http://www.jaredhanson.net/'
          }],
          maintainers: [{
            name: 'jaredhanson',
            email: 'jaredhanson@gmail.com'
          }],
          readme: '# Passport-OpenID\n\n[Passport](https://github.com/jaredhanson/passport) strategy for authenticating\nwith [OpenID](http://openid.net/).\n\nThis module lets you authenticate using OpenID in your Node.js applications.  By\nplugging into Passport, OpenID authentication can be easily and unobtrusively\nintegrated into any application or framework that supports\n[Connect](http://www.senchalabs.org/connect/)-style middleware, including\n[Express](http://expressjs.com/).\n\n',
          downloads: {
            'last-day': 1029,
            'last-week': 4004,
            'last-month': 23844
          },
          ctime: new Date('2011-11-04T00:28:17.973Z'),
          mtime: new Date('2017-08-30T14:29:54.769Z')
        });
        
        done();
      });
    }); // should normalize package without versions or license
    
    it('should normalize package with contributors but no author', function(done) {
      var packageJsonStub = sinon.stub().resolves({
        name: 'passport-adobe-oauth2',
        time: {
          modified: '2018-03-30T22:05:57.398Z',
          created: '2018-02-23T21:47:14.303Z',
        },
        maintainers: [
          { email: 'audreyeso@gmail.com', name: 'audreyeso' },
          { email: 'caryn.tran@berkeley.edu', name: 'carynbear' },
          { email: 'ddragosd@gmail.com', name: 'ddragosd' },
          { email: 'purplecabbage@gmail.com', name: 'purplecabbage' }
        ],
        description: 'Adobe OAuth 2.0 authentication strategy for Passport.',
        homepage: 'https://github.com/adobe/passport-adobe-oauth2#readme',
        keywords: [
          'passport',
          'adobe',
          'oauth2',
          'auth',
          'authentication',
          'identity',
        ],
        repository: {
          type: 'git',
          url: 'git+https://github.com/adobe/passport-adobe-oauth2.git'
        },
        contributors: [
          { name: 'Dragos Dascalita Haut', url: 'https://github.com/ddragosd' },
          { name: 'Audrey So', url: 'https://github.com/audreyeso' },
          { name: 'Caryn Tran', url: 'https://github.com/carynbear' },
          { name: 'Jesse MacFadyen', url: 'https://github.com/purplecabbage' },
        ],
        bugs: { url: 'https://github.com/adobe/passport-adobe-oauth2/issues' },
        license: 'Apache-2.0',
        readme: '# Passport-Adobe-OAuth2\n\n',
      });
      
      var pkgDownloadsStub = sinon.stub()
      pkgDownloadsStub.onFirstCall().resolves(1);
      pkgDownloadsStub.onSecondCall().resolves(7);
      pkgDownloadsStub.onThirdCall().resolves(30);
      
      var NpmRegistry = $require('../../lib/npmregistry',
        { 'package-json': packageJsonStub,
          'pkg-downloads': pkgDownloadsStub });
      var registry = new NpmRegistry();
      
      registry.read('passport-adobe-oauth2', function(err, pkg) {
        if (err) { return done(err); }
        
        expect(packageJsonStub.callCount).to.equal(1);
        var call = packageJsonStub.getCall(0)
        expect(call.args[0]).to.equal('passport-adobe-oauth2');
        expect(call.args[1]).to.deep.equal({ fullMetadata: true, allVersions: true });
        
        expect(pkgDownloadsStub.callCount).to.equal(3);
        var call = pkgDownloadsStub.getCall(0)
        expect(call.args[0]).to.equal('passport-adobe-oauth2');
        expect(call.args[1]).to.deep.equal({ period: 'day' });
        call = pkgDownloadsStub.getCall(1)
        expect(call.args[0]).to.equal('passport-adobe-oauth2');
        expect(call.args[1]).to.deep.equal({ period: 'week' });
        call = pkgDownloadsStub.getCall(2)
        expect(call.args[0]).to.equal('passport-adobe-oauth2');
        expect(call.args[1]).to.deep.equal({ period: 'month' });
        
        expect(pkg).to.deep.equal({
          name: 'passport-adobe-oauth2',
          versions: {},
          description: 'Adobe OAuth 2.0 authentication strategy for Passport.',
          keywords: [
            'passport',
            'adobe',
            'oauth2',
            'auth',
            'authentication',
            'identity',
          ],
          homepage: 'https://github.com/adobe/passport-adobe-oauth2#readme',
          repositories: [{
            type: 'git',
            url: 'git+https://github.com/adobe/passport-adobe-oauth2.git'
          }],
          bugs: {
            url: 'https://github.com/adobe/passport-adobe-oauth2/issues'
          },
          contributors: [
            { name: 'Dragos Dascalita Haut', web: 'https://github.com/ddragosd' },
            { name: 'Audrey So', web: 'https://github.com/audreyeso' },
            { name: 'Caryn Tran', web: 'https://github.com/carynbear' },
            { name: 'Jesse MacFadyen', web: 'https://github.com/purplecabbage' },
          ],
          maintainers: [
            { email: 'audreyeso@gmail.com', name: 'audreyeso' },
            { email: 'caryn.tran@berkeley.edu', name: 'carynbear' },
            { email: 'ddragosd@gmail.com', name: 'ddragosd' },
            { email: 'purplecabbage@gmail.com', name: 'purplecabbage' }
          ],
          licenses: [
            { type: 'Apache-2.0' }
          ],
          readme: '# Passport-Adobe-OAuth2\n\n',
          downloads: {
            'last-day': 1,
            'last-week': 7,
            'last-month': 30
          },
          ctime: new Date('2018-02-23T21:47:14.303Z'),
          mtime: new Date('2018-03-30T22:05:57.398Z')
        });
        
        done();
      });
    }); //should normalize package with contributors but no author
    
  }); // #read
  
});

var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../app/handlers/show');


describe('handlers/show', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  
  describe('handler', function() {
    var packageRegistry = {
      read: function(){}
    };
    var project = {
      info: function(){}
    };
    
    
    describe('package', function() {
      var page, layout, err;
      
      before(function() {
        sinon.stub(packageRegistry, 'read').yields(null, {
          name: 'passport-facebook',
          description: 'Facebook authentication strategy for Passport.',
          keywords: [ 'passport', 'facebook', 'identity' ],
          'dist-tags': { latest: '2.1.1' },
          versions: {
            '0.1.0': {
              name: 'passport-facebook',
              description: 'Facebook authentication strategy for Passport.',
              keywords: 
               [ 'passport',
                 'facebook',
                 'auth',
                 'authn',
                 'authentication',
                 'identity' ],
              homepage: undefined,
              repository: {
                type: 'git',
                url: 'git://github.com/jaredhanson/passport-facebook.git'
              },
              author: 
               { name: 'Jared Hanson',
                 email: 'jaredhanson@gmail.com',
                 url: 'http://www.jaredhanson.net/' },
              readme: undefined
            },
            '2.1.1': {
              name: 'passport-facebook',
              description: 'Facebook authentication strategy for Passport.',
              keywords: 
               [ 'passport',
                 'facebook',
                 'auth',
                 'authn',
                 'authentication',
                 'identity' ],
              homepage: 'https://github.com/jaredhanson/passport-facebook#readme',
              repository: {
                type: 'git',
                url: 'git://github.com/jaredhanson/passport-facebook.git'
              },
              author: 
               { name: 'Jared Hanson',
                 email: 'jaredhanson@gmail.com',
                 url: 'http://www.jaredhanson.net/' },
              license: { type: 'MIT' },
              readme: undefined
            }
          },
          homepage: 'https://github.com/jaredhanson/passport-facebook#readme',
          repository: {
            type: 'git',
            url: 'git://github.com/jaredhanson/passport-facebook.git'
          },
          author: {
            name: 'Jared Hanson',
            email: 'jaredhanson@gmail.com',
            url: 'http://www.jaredhanson.net/'
          },
          license: {
            type: 'MIT'
          },
          //readme: '# passport-facebook\n\n',
          ctime: new Date('2011-10-23T22:27:46.568Z'),
          mtime: new Date('2018-08-03T00:35:46.879Z')
        });
        
        sinon.stub(project, 'info').yields(null, {
          name: 'passport-facebook',
          description: 'Facebook authentication strategy for Passport and Node.js.',
          homepage: 'https://github.com/jaredhanson/passport-facebook',
          favoriteCount: 1062,
          subscriberCount: 49,
          forkCount: 417,
          createdAt: new Date('2011-10-18T03:44:47.000Z'),
          modifiedAt: new Date('2018-09-20T10:59:45.000Z')
        });
      });
    
      after(function() {
        project.info.restore();
        packageRegistry.read.restore();
      });
      
      before(function(done) {
        chai.kerouac.handler(factory(packageRegistry, project))
          .page(function(page) {
            page.params = { name: 'passport-facebook' };
          })
          .render(function(p, l) {
            page = p;
            layout = l;
            done();
          })
          .dispatch();
      });
      
      it('should read from package repository', function() {
        expect(packageRegistry.read.callCount).to.equal(1);
        var call = packageRegistry.read.getCall(0)
        expect(call.args[0]).to.equal('passport-facebook');
      });
      
      it('should set locals', function() {
        expect(page.locals).to.deep.equal({
          title: 'passport-facebook',
          name: 'passport-facebook',
          description: 'Facebook authentication strategy for Passport.',
          version: '2.1.1',
          homepage: 'https://github.com/jaredhanson/passport-facebook#readme',
          repository: {
            type: 'git',
            url: 'git://github.com/jaredhanson/passport-facebook.git'
          },
          license: {
            type: 'MIT',
            name: 'MIT License',
            url: 'http://www.opensource.org/licenses/MIT'
          },
          readme: '<p>Sadly, this package has no README.</p>',
          createdAt: new Date('2011-10-23T22:27:46.568Z'),
          modifiedAt: new Date('2018-08-03T00:35:46.879Z'),
          modifiedTimeAgo: '2 months ago'
        });
      });
      
      it('should render layout', function() {
        expect(layout).to.equal('package');
      });
    }); // package
    
    describe('package without license and versions', function() {
      var page, layout, err;
      
      before(function() {
        sinon.stub(packageRegistry, 'read').yields(null, {
          name: 'passport-openid',
          description: 'OpenID authentication strategy for Passport.',
          versions: {},
          homepage: 'https://github.com/jaredhanson/passport-openid',
          repository: {
            type: 'git',
            url: 'git://github.com/jaredhanson/passport-openid.git'
          },
          //readme: '# Passport-OpenID\n\n[Passport](https://github.com/jaredhanson/passport) strategy for authenticating\nwith [OpenID](http://openid.net/).\n\nThis module lets you authenticate using OpenID in your Node.js applications.  By\nplugging into Passport, OpenID authentication can be easily and unobtrusively\nintegrated into any application or framework that supports\n[Connect](http://www.senchalabs.org/connect/)-style middleware, including\n[Express](http://expressjs.com/).\n\n',
          ctime: new Date('2011-11-04T00:28:17.973Z'),
          mtime: new Date('2017-08-30T14:29:54.769Z')
        });
        
        sinon.stub(project, 'info').yields(null, {
          name: 'passport-openid',
          description: 'OpenID authentication strategy for Passport and Node.js.',
          homepage: 'https://github.com/jaredhanson/passport-openid',
          favoriteCount: 63,
          subscriberCount: 6,
          forkCount: 72,
          createdAt: new Date('2011-11-03T05:26:46.000Z'),
          modifiedAt: new Date('2018-08-02T13:14:40.000Z')
        });
      });
    
      after(function() {
        project.info.restore();
        packageRegistry.read.restore();
      });
      
      before(function(done) {
        chai.kerouac.handler(factory(packageRegistry, project))
          .page(function(page) {
            page.params = { name: 'passport-openid' };
          })
          .render(function(p, l) {
            page = p;
            layout = l;
            done();
          })
          .dispatch();
      });
      
      it('should read from package repository', function() {
        expect(packageRegistry.read.callCount).to.equal(1);
        var call = packageRegistry.read.getCall(0)
        expect(call.args[0]).to.equal('passport-openid');
      });
      
      it('should set locals', function() {
        expect(page.locals).to.deep.equal({
          title: 'passport-openid',
          name: 'passport-openid',
          description: 'OpenID authentication strategy for Passport.',
          homepage: 'https://github.com/jaredhanson/passport-openid',
          repository: {
            type: 'git',
            url: 'git://github.com/jaredhanson/passport-openid.git'
          },
          readme: '<p>Sadly, this package has no README.</p>',
          createdAt: new Date('2011-11-04T00:28:17.973Z'),
          modifiedAt: new Date('2017-08-30T14:29:54.769Z'),
          modifiedTimeAgo: 'a year ago'
        });
      });
      
      it('should render layout', function() {
        expect(layout).to.equal('package');
      });
    }); // package without license and versions
    
  }); // handler
  
});





/*
describe('handlers/show', function() {
  var site = kerouac();
  
  describe('package with repository hosted at GitHub', function() {
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
    
    var handler = $require('../../app/handlers/show',
      { 'package-json': packageJsonStub, '../scm': scmStub });
    
    
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
    
    it('should load metadata from remote repositories', function() {
      expect(packageJsonStub.getCall(0).args[0]).to.equal('passport-openid');
      expect(scmStub.get.getCall(0).args[0]).to.equal('git://github.com/jaredhanson/passport-openid.git');
    });
  
    it('should set metadata', function() {
      expect(page.package).to.equal(true);
    });
    
    it('should render with locals', function() {
      expect(page.locals.name).to.equal('passport-openid');
      expect(page.locals.description).to.equal('OpenID authentication strategy for Passport.');
      expect(page.locals.keywords).to.deep.equal([ 'passport', 'openid', 'identity' ]);
      expect(page.locals.homepage).to.equal('https://github.com/jaredhanson/passport-openid');
      expect(page.locals.version).to.equal('0.4.0');
      expect(page.locals.repository).to.deep.equal({
        homepage: 'https://github.com/jaredhanson/passport-openid',
        url: 'git://github.com/jaredhanson/passport-openid.git',
        favoriteCount: 57,
        subscriberCount: 7,
        forkCount: 66,
        createdAt: new Date(Date.parse('2011-11-03T05:26:46.000Z')),
        modifiedAt: new Date(Date.parse('2017-09-16T23:34:19.000Z'))
      });
      expect(page.locals.licence).to.equal(undefined);
      expect(page.locals.createdAt).to.deep.equal(new Date(Date.parse('2011-11-04T00:28:17.973Z')));
      expect(page.locals.modifiedAt).to.deep.equal(new Date(Date.parse('2017-08-30T14:29:54.769Z')));
      
      var readme =
'<h1 id="passport-openid">Passport-OpenID</h1>\n' +
'<p><a href="https://github.com/jaredhanson/passport">Passport</a> strategy for authenticating\n' +
'with <a href="http://openid.net/">OpenID</a>.</p>\n' +
'<p>This module lets you authenticate using OpenID in your Node.js applications.  By\n' +
'plugging into Passport, OpenID authentication can be easily and unobtrusively\n' +
'integrated into any application or framework that supports\n' +
'<a href="http://www.senchalabs.org/connect/">Connect</a>-style middleware, including\n' +
'<a href="http://expressjs.com/">Express</a>.</p>\n'
      expect(page.locals.readme).to.equal(readme);
    });
    
    it('should render layout', function() {
      expect(layout).to.equal('package');
    });
  });
  
});
*/


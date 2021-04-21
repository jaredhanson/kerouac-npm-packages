var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/www/handlers/show');


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
    
    
    describe('package with latest version', function() {
      var page, layout, err;
      
      before(function() {
        sinon.stub(packageRegistry, 'read').yields(null, {
          name: 'passport-facebook',
          description: 'Facebook authentication strategy for Passport.',
          keywords: [ 'passport', 'facebook', 'identity' ],
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
          'dist-tags': { latest: '2.1.1' },
          homepage: 'https://github.com/jaredhanson/passport-facebook#readme',
          repository: {
            type: 'git',
            url: 'git://github.com/jaredhanson/passport-facebook.git'
          },
          bugs: {
            url: 'http://github.com/jaredhanson/passport-facebook/issues'
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
          downloads: {
            'last-day': 7657,
            'last-week': 28650,
            'last-month': 183283
          },
          ctime: new Date('2011-10-23T22:27:46.568Z'),
          mtime: new Date('2018-08-03T00:35:46.879Z'),
          ptime: new Date('2016-05-17T19:13:37.644Z')
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
      
      it('should read package from repository', function() {
        expect(packageRegistry.read.callCount).to.equal(1);
        var call = packageRegistry.read.getCall(0)
        expect(call.args[0]).to.equal('passport-facebook');
      });
      
      it('should fetch project info', function() {
        expect(project.info.callCount).to.equal(1);
        var call = project.info.getCall(0)
        expect(call.args[0]).to.equal('git://github.com/jaredhanson/passport-facebook.git');
        expect(call.args[1]).to.deep.equal({ protocol: 'git' });
      });
      
      it('should set meta', function() {
        expect(page.meta).to.deep.equal({
          package: true,
        });
      });
      
      it('should set locals', function() {
        expect(page.locals).to.deep.equal({
          title: 'passport-facebook',
          name: 'passport-facebook',
          description: 'Facebook authentication strategy for Passport.',
          keywords: [ 'passport', 'facebook', 'identity' ],
          version: '2.1.1',
          homepage: 'https://github.com/jaredhanson/passport-facebook#readme',
          repository: {
            type: 'git',
            url: 'git://github.com/jaredhanson/passport-facebook.git',
          },
          bugs: {
            url: 'http://github.com/jaredhanson/passport-facebook/issues'
          },
          license: {
            type: 'MIT',
            name: 'MIT License',
            url: 'http://www.opensource.org/licenses/MIT'
          },
          readme: '<p>Sadly, this package has no README.</p>',
          downloads: {
            'last-day': 7657,
            'last-week': 28650,
            'last-month': 183283
          },
          count: {
            favorites: 1062,
            subscribers: 49,
            forks: 417
          },
          createdAt: new Date('2011-10-23T22:27:46.568Z'),
          modifiedAt: new Date('2018-08-03T00:35:46.879Z'),
          publishedAt: new Date('2016-05-17T19:13:37.644Z'),
          modifiedTimeAgo: '3 years ago'
        });
      });
      
      it('should render layout', function() {
        expect(layout).to.equal('package');
      });
    }); // package with latest version
    
    describe('package without dist-tags and license', function() {
      var page, layout, err;
      
      before(function() {
        sinon.stub(packageRegistry, 'read').yields(null, {
          name: 'passport-openid',
          description: 'OpenID authentication strategy for Passport.',
          keywords: [ 'passport', 'openid', 'identity' ],
          versions: {},
          homepage: 'https://github.com/jaredhanson/passport-openid',
          repository: {
            type: 'git',
            url: 'git://github.com/jaredhanson/passport-openid.git'
          },
          bugs: {
            url: 'http://github.com/jaredhanson/passport-openid/issues'
          },
          author: {
            name: 'Jared Hanson',
            email: 'jaredhanson@gmail.com',
            url: 'http://www.jaredhanson.net/'
          },
          //readme: '# Passport-OpenID\n\n[Passport](https://github.com/jaredhanson/passport) strategy for authenticating\nwith [OpenID](http://openid.net/).\n\nThis module lets you authenticate using OpenID in your Node.js applications.  By\nplugging into Passport, OpenID authentication can be easily and unobtrusively\nintegrated into any application or framework that supports\n[Connect](http://www.senchalabs.org/connect/)-style middleware, including\n[Express](http://expressjs.com/).\n\n',
          downloads: {
            'last-day': 1029,
            'last-week': 4004,
            'last-month': 23844
          },
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
      
      it('should read package from repository', function() {
        expect(packageRegistry.read.callCount).to.equal(1);
        var call = packageRegistry.read.getCall(0)
        expect(call.args[0]).to.equal('passport-openid');
      });
      
      it('should fetch project info', function() {
        expect(project.info.callCount).to.equal(1);
        var call = project.info.getCall(0)
        expect(call.args[0]).to.equal('git://github.com/jaredhanson/passport-openid.git');
        expect(call.args[1]).to.deep.equal({ protocol: 'git' });
      });
      
      it('should set locals', function() {
        expect(page.locals).to.deep.equal({
          title: 'passport-openid',
          name: 'passport-openid',
          description: 'OpenID authentication strategy for Passport.',
          keywords: [ 'passport', 'openid', 'identity' ],
          homepage: 'https://github.com/jaredhanson/passport-openid',
          repository: {
            type: 'git',
            url: 'git://github.com/jaredhanson/passport-openid.git',
          },
          bugs: {
            url: 'http://github.com/jaredhanson/passport-openid/issues'
          },
          readme: '<p>Sadly, this package has no README.</p>',
          downloads: {
            'last-day': 1029,
            'last-week': 4004,
            'last-month': 23844
          },
          count: {
            favorites: 63,
            subscribers: 6,
            forks: 72
          },
          createdAt: new Date('2011-11-04T00:28:17.973Z'),
          modifiedAt: new Date('2017-08-30T14:29:54.769Z'),
          publishedAt: undefined,
          modifiedTimeAgo: '4 years ago'
        });
      });
      
      it('should render layout', function() {
        expect(layout).to.equal('package');
      });
    }); // package without dist-tags and license
    
  }); // handler
  
});

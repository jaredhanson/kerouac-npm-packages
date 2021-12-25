var expect = require('chai').expect;
var chai = require('chai');
var sinon = require('sinon');
var factory = require('../../../../../app/api/esc/www/handlers/all');


describe('api/esc/www/handlers/all', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    
    it('should render one package', function(done) {
      var registry = new Object();
      registry.list = sinon.stub().yieldsAsync(null, [
        { name: 'passport-facebook' }
      ]);
      registry.read = sinon.stub().withArgs('passport-facebook').yieldsAsync(null, {
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
            repositories: [ {
              type: 'git',
              url: 'git://github.com/jaredhanson/passport-facebook.git'
            } ],
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
            repositories: [ {
              type: 'git',
              url: 'git://github.com/jaredhanson/passport-facebook.git'
            } ],
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
        repositories: [ {
          type: 'git',
          url: 'git://github.com/jaredhanson/passport-facebook.git'
        } ],
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
        downloadCounts: {
          'last-day': 7657,
          'last-week': 28650,
          'last-month': 183283
        },
        ctime: new Date('2011-10-23T22:27:46.568Z'),
        mtime: new Date('2018-08-03T00:35:46.879Z'),
        ptime: new Date('2016-05-17T19:13:37.644Z')
      });
      
      var forge = new Object();
      forge.info = sinon.stub().withArgs('git://github.com/jaredhanson/passport-facebook.git').yields(null, {
        name: 'passport-facebook',
        description: 'Facebook authentication strategy for Passport and Node.js.',
        homepage: 'https://github.com/jaredhanson/passport-facebook',
        bookmarkCount: 1062,
        subscribeCount: 49,
        forkCount: 417,
        createdAt: new Date('2011-10-18T03:44:47.000Z'),
        modifiedAt: new Date('2018-09-20T10:59:45.000Z')
      });
  
      chai.kerouac.use(factory(registry, forge))
        .end(function(page) {
          var expected = [
            '{',
            '  "passport-facebook": {',
            '    "name": "passport-facebook",',
            '    "description": "Facebook authentication strategy for Passport.",',
            '    "keywords": [',
            '      "passport",',
            '      "facebook",',
            '      "identity"',
            '    ],',
            '    "dist-tags": {',
            '      "latest": "2.1.1"',
            '    },',
            '    "time": {',
            '      "modified": "2016-05-17T19:13:37.644Z"',
            '    },',
            '    "versions": {',
            '      "2.1.1": "latest"',
            '    },',
            //'    "_flags": {',
            //'      "featured": true',
            //'    },',
            '    "_downloads": {',
            '      "last-day": 7657,',
            '      "last-week": 28650,',
            '      "last-month": 183283',
            '    },',
            '    "_counts": {',
            '      "bookmarks": 1062,',
            '      "subscribers": 49,',
            '      "forks": 417',
            '    }',
            '  }',
            '}'
          ].join("\n");
  
          expect(page.body).to.equal(expected);
          done();
        })
        .dispatch();
    }); // should render one package
    
    it('should error when failing to list packages in registry', function(done) {
      var registry = new Object();
      registry.list = sinon.stub().yieldsAsync(new Error('something went wrong'));
      
      var forge = new Object();
  
      chai.kerouac.use(factory(registry, forge))
        .next(function(err) {
          expect(err).to.be.an.instanceof(Error);
          expect(err.message).to.equal('something went wrong');
          done();
        })
        .dispatch();
    }); // should error when failing to list packages in registry
    
    it('should error when failing to read package in registry', function(done) {
      var registry = new Object();
      registry.list = sinon.stub().yieldsAsync(null, [
        { name: 'passport-facebook' }
      ]);
      registry.read = sinon.stub().yieldsAsync(new Error('something went wrong'));
      
      var forge = new Object();
  
      chai.kerouac.use(factory(registry, forge))
        .next(function(err) {
          expect(err).to.be.an.instanceof(Error);
          expect(err.message).to.equal('something went wrong');
          done();
        })
        .dispatch();
    }); // should error when failing to read package in registry
    
  }); // handler
  
});

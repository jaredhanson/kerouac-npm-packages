var expect = require('chai').expect;
var chai = require('chai');
var sinon = require('sinon');
var factory = require('../../../../app/api/www/handlers/package');


describe('api/www/handlers/package', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    
    it('should render package', function(done) {
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
        downloads: {
          'last-day': 7657,
          'last-week': 28650,
          'last-month': 183283
        },
        ctime: new Date('2011-10-23T22:27:46.568Z'),
        mtime: new Date('2018-08-03T00:35:46.879Z'),
        ptime: new Date('2016-05-17T19:13:37.644Z')
      });
      
      var forge = new Object();
      forge.info = sinon.stub().withArgs('git://github.com/jaredhanson/passport-facebook.git').yieldsAsync(null, {
        name: 'passport-facebook',
        description: 'Facebook authentication strategy for Passport and Node.js.',
        homepage: 'https://github.com/jaredhanson/passport-facebook',
        favoriteCount: 1062,
        subscriberCount: 49,
        forkCount: 417,
        createdAt: new Date('2011-10-18T03:44:47.000Z'),
        modifiedAt: new Date('2018-09-20T10:59:45.000Z')
      });
    
      chai.kerouac.handler(factory(registry, forge))
        .page(function(page) {
          page.params = {};
        })
        .end(function(page) {
          var expected = [
            '{',
            '  "name": "passport-facebook",',
            '  "description": "Facebook authentication strategy for Passport.",',
            '  "keywords": [',
            '    "passport",',
            '    "facebook",',
            '    "identity"',
            '  ]',
            '}'
          ].join("\n");
    
          expect(page.body).to.equal(expected);
          done();
        })
        .dispatch();
    }); // should render package
    
  });
  
});

var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/www/handlers/api/all');


describe('handlers/api/all', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    var registry = {
      list: function(){},
      read: function(){}
    };
    var project = {
      info: function(){}
    };
    
    
    describe('with one featured package', function() {
      var page, err;
    
      before(function() {
        sinon.stub(registry, 'list').yields(null, [
          { name: 'passport-facebook' }
        ]);
        
        sinon.stub(registry, 'read').withArgs('passport-facebook').yields(null, {
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
        
        sinon.stub(project, 'info').withArgs('git://github.com/jaredhanson/passport-facebook.git').yields(null, {
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
        registry.list.restore();
        registry.read.restore();
      });
    
      before(function(done) {
        chai.kerouac.handler(factory(registry, project))
          .page(function(page) {
            page.params = {};
          })
          .end(function(p) {
            page = p;
            done();
          })
          .dispatch();
      });
    
      it('should write JSON', function() {
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
          '    "versions": {',
          '      "2.1.1": "latest"',
          '    },',
          '    "time": {',
          '      "modified": "2016-05-17T19:13:37.644Z"',
          '    },',
          //'    "_flags": {',
          //'      "featured": true',
          //'    },',
          //'    "_count": {',
          //'      "favorites": 1062,',
          //'      "subscribers": 49,',
          //'      "forks": 417',
          //'    },',
          '    "_downloads": {',
          '      "last-day": 7657,',
          '      "last-week": 28650,',
          '      "last-month": 183283',
          '    }',
          '  }',
          '}'
        ].join("\n");
    
        expect(page.body).to.equal(expected);
      });
    }); // with one featured package
    
  }); // handler
  
});

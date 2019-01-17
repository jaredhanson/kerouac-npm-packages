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
    
    describe('with one featured package', function() {
      var page, err;
    
      before(function(done) {
        chai.kerouac.handler(factory())
          .page(function(page) {
            page.site = {};
            page.site.pages = [
              { meta: { package: true },
                locals: {
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
                  flags: {
                    featured: true
                  },
                  createdAt: new Date('2011-10-23T22:27:46.568Z'),
                  modifiedAt: new Date('2018-08-03T00:35:46.879Z'),
                  publishedAt: new Date('2016-05-17T19:13:37.644Z')
                }
              }
            ];
          
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
          '    "_flags": {',
          '      "featured": true',
          '    },',
          '    "_count": {',
          '      "favorites": 1062,',
          '      "subscribers": 49,',
          '      "forks": 417',
          '    },',
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

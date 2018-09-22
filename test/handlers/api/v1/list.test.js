var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/handlers/api/v1/list');


describe('handlers/api/v1/list', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    
    describe('with one package', function() {
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
                    favoriteCount: 1062,
                    subscriberCount: 49,
                    forkCount: 417
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
                  createdAt: new Date('2011-10-23T22:27:46.568Z'),
                  modifiedAt: new Date('2018-08-03T00:35:46.879Z')
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
      
      it('should write sitemap.xml', function() {
        var expected = [
          '{',
          '  "objects": [',
          '    {',
          '      "name": "passport-facebook",',
          '      "description": "Facebook authentication strategy for Passport.",',
          '      "keywords": [',
          '        "passport",',
          '        "facebook",',
          '        "identity"',
          '      ],',
          '      "dist-tags": {',
          '        "latest": "2.1.1"',
          '      },',
          '      "homepage": "https://github.com/jaredhanson/passport-facebook#readme",',
          '      "repository": {',
          '        "type": "git",',
          '        "url": "git://github.com/jaredhanson/passport-facebook.git",',
          '        "favoriteCount": 1062,',
          '        "subscriberCount": 49,',
          '        "forkCount": 417',
          '      },',
          '      "license": "MIT",',
          '      "time": {',
          '        "created": "2011-10-23T22:27:46.568Z",',
          '        "modified": "2018-08-03T00:35:46.879Z"',
          '      },',
          '      "downloads": {',
          '        "last-day": 7657,',
          '        "last-week": 28650,',
          '        "last-month": 183283',
          '      }',
          '    }',
          '  ],',
          '  "total": 1,',
          '  "urls": {}',
          '}'
        ].join("\n");
      
        expect(page.body).to.equal(expected);
      });
      
    });
    
  });
  
});

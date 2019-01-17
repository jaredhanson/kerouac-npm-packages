/**
 * Package registry site.
 *
 * This component generates a site that serves as a JavaScript package registry.
 *
 * The site generated by this component serves two purposes.  First, it provides
 * a set of HTML pages, intended for humans to browse and search the registry.
 * Second, it provides an API that allows package.json-aware systems to locate
 * packages.
 *
 * The API provided by this site is intended to be compliant with the [CommonJS](http://www.commonjs.org/)
 * [package registry](http://wiki.commonjs.org/wiki/Packages/Registry)
 * specification.  This specification, unfortunately, is not particularly clear
 * or consistent.  As a result, it is not surprising that [npm](https://www.npmjs.com/)
 * (the most widely used registry), which claims to implement the specification,
 * exhibits notable behavioral differences.  This component acknowledges these
 * differences, and attempts to be as compatible as possible with clients
 * expecting either variation.
 *
 * npm's API has evolved in, what appears from the outside, to be a rather
 * ad-hoc manner from its origins as a CouchApp.  While the API isn't documented
 * in depth, the following references have been found to be useful:
 *   - [npm-registry](https://docs.npmjs.com/misc/registry)
 *   - [Public Registry API](https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md)
 *   - [Package Metadata](https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md)
 *   - [REST proposal](https://github.com/npm/registry/blob/master/docs/restful-api-conventions.md)
 *
 * The following sets of endpoints are exposed by this site:
 *
 *   * CommonJS-compliant package registry API
 *     /
 *     /{package}
 *     /{package}/{version}
 *
 *   * npm Meta API
 *     /-/all
 *
 *   * npm API v1
 *     /-/v1/search
 */
exports = module.exports = function(showHandler, api_allHandler, api_v1_allHandler, api_v1_promotedHandler, packageRegistry) {
  var kerouac = require('kerouac')
    , fs = require('fs')
    , path = require('path');


  var dir = 'data/packages';
  var options = {};
  
  var limit = options.limit || 25
    , featured = path.join(dir, '_feeds', 'featured.yaml');
  
  
  var site = kerouac();
  
  site.on('mount', function onmount(parent) {
    // inherit settings
    this.set('layout engine', parent.get('layout engine'));
    
    this.locals.pretty = parent.locals.pretty;
  });
  
  
  //site.page('/all.html', require('./handlers/list')());
  
  // HTML pages
  site.page('/:name.html', showHandler);
  
  // npm Meta API
  site.page('/-/all.json', api_allHandler);
  
  // npm API v1
  site.page('/-/v1/all.json', api_v1_allHandler);
  site.page('/-/v1/all/:page.json', api_v1_allHandler);
  site.page('/-/v1/promoted.json', api_v1_promotedHandler);
  
  site.page('/sitemap.xml', require('kerouac-sitemap')());
  
  site.bind(function(done) {
    var self = this;
    
    packageRegistry.list(function(err, pkgs) {
      if (err) { return done(err); }
      
      var npages
        , i, len;
      for (i = 0, len = pkgs.length; i < len; ++i) {
        self.add('/' + pkgs[i].name + '.html');
      }
      npages = Math.ceil(pkgs.length / limit)
      for (i = 1; i < npages; i++) {
        self.add('/-/v1/all/' + (i + 1) + '.json'); // add 1 for 1-based indexing
      }
      done();
    });
  });
  
  return site;
};

exports['@implements'] = 'http://i.kerouacjs.org/Site';
exports['@require'] = [
  './handlers/show',
  './handlers/api/all',
  './handlers/api/v1/all',
  './handlers/api/v1/promoted',
  'http://schemas.modulate.io/js/comp/lang/javascript/PackageRegistry'
];
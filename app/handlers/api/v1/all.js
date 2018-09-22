var uri = require('url');

/**
 * API v1: List all packages.
 *
 * This handler generates a list of all packages, and is one of the resources
 * that make up API v1.
 *
 * API v1 takes inspiration from npm's Registry API.  This API has evolved in,
 * what appears from the outside, to be a rather ad-hoc manner from npm's
 * origins as a CouchApp.  While the API isn't documented in depth, the
 * following references have been found to be useful:
 *   - [npm-registry](https://docs.npmjs.com/misc/registry)
 *   - [Public Registry API](https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md)
 *   - [Package Metadata](https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md)
 *   - [REST proposal](https://github.com/npm/registry/blob/master/docs/restful-api-conventions.md)
 *   - [Deprecating the /-/all registry endpoint](http://blog.npmjs.org/post/157615772423/deprecating-the-all-registry-endpoint)
 *
 * npm claims in documentation that the registry implements the CommonJS Package
 * Registry [specification](http://wiki.commonjs.org/wiki/Packages/Registry).
 * There are, however, notable differences between npm's implementation and the
 * specifcation, which is to be expected given the specification is not
 * particularly clear or consistent itself.
 */
exports = module.exports = function(limit) {
  var limit = 25;
  
  function filter(page, next) {
    var packages = page.site.pages.filter(function(p) {
      return (p.meta && p.meta.package == true);
    });
    
    var i = page.params.page ? parseInt(page.params.page - 1) : 0
      , offset = i * limit;
    
    var urls = {};
    if (offset + limit < packages.length) {
      urls.next = i > 0 ? uri.resolve(page.absoluteURL, (i + 2) + '.json')
                        : uri.resolve(page.absoluteURL, 'all/' + (i + 2) + '.json'); // add 2 for 1-based indexing
    }
    if (i > 0) {
      urls.prev = i > 1 ? uri.resolve(page.absoluteURL, i + '.json')
                        : uri.resolve(page.absoluteURL, '../all.json');
    }
    
    page.locals.total = packages.length;
    page.locals.urls = urls;
    
    packages = packages.slice(offset, offset + limit);
    
    var objects = packages.map(function(p) {
      var json = {};
      json.package = {};
      json.package.name = p.locals.name;
      json.package.version = p.locals.version;
      json.package.description = p.locals.description;
      json.package.keywords = p.locals.keywords;
      json.package.homepage = p.locals.homepage;
      if (p.locals.repository) {
        if (!json.package.homepage) { json.package.homepage = p.locals.repository.homepage; }
        json.package.repository = {};
        json.package.repository.type = p.locals.repository.type;
        json.package.repository.url = p.locals.repository.url;
        json.package.repository.favoriteCount = p.locals.repository.favoriteCount;
        json.package.repository.subscriberCount = p.locals.repository.subscriberCount;
        json.package.repository.forkCount = p.locals.repository.forkCount;
        if (p.locals.repository.createdAt) { json.package.repository.created = p.locals.repository.createdAt.toISOString(); }
        if (p.locals.repository.modifiedAt) { json.package.repository.modified = p.locals.repository.modifiedAt.toISOString(); }
      }
      if (p.locals.license) {
        json.package.license = p.locals.license.type;
      }
      json.package.time = {
        created: p.locals.createdAt.toISOString(),
        modified: p.locals.modifiedAt.toISOString()
      }
      if (p.locals.downloads) {
        json.package.downloads = {
          'last-day': p.locals.downloads['last-day'],
          'last-week': p.locals.downloads['last-week'],
          'last-month': p.locals.downloads['last-month']
        }
      }
      
      return json;
    });
    
    page.locals.objects = objects;
    next();
  }
  
  function render(page, next) {
    var json = {};
    json.objects = page.locals.objects;
    json.total = page.locals.total;
    json.urls = page.locals.urls;
    
    page.write(JSON.stringify(json, null, 2));
    page.end();
  }
  
  
  return [
    filter,
    render
  ];
};

exports['@require'] = [];

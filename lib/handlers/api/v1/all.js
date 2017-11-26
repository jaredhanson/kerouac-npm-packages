
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
 *   - [REST proposal](https://github.com/npm/registry/blob/master/docs/restful-api-conventions.md)
 *   - [Deprecating the /-/all registry endpoint](http://blog.npmjs.org/post/157615772423/deprecating-the-all-registry-endpoint)
 *
 * npm claims in documentation that the registry implements the CommonJS Package
 * Registry [specification](http://wiki.commonjs.org/wiki/Packages/Registry).
 * There are, however, notable differences between npm's implementation and the
 * specifcation, which is to be expected given the specification is not
 * particularly clear or consistent itself.
 */
exports = module.exports = function() {
  
  function initialize(page, next) {
    page._internals = {};
    next();
  }
  
  function getPackages(page, next) {
    var packages = page.site.pages.filter(function(p) {
      return p.package == true;
    });
    
    page._internals.packages = packages;
    next();
  }
  
  function formatPackages(page, next) {
    var packages = page._internals.packages;
    var objects = packages.map(function(p) {
      var json = {};
      json._id = p.locals._id;
      json.name = p.locals.name;
      json.description = p.locals.description;
      json.keywords = p.locals.keywords;
      json['dist-tags'] = { latest: p.locals.version };
      json.homepage = p.locals.homepage;
      if (p.locals.repository) {
        json.repository = {};
        json.repository.url = p.locals.repository.url;
        console.log(p.locals.repository)
        
        
        json.repository.favoriteCount = p.locals.repository.favoriteCount;
        json.repository.subscriberCount = p.locals.repository.subscriberCount;
        json.repository.forkCount = p.locals.repository.forkCount;
        json.repository.created = p.locals.repository.createdAt.toISOString();
        json.repository.modified = p.locals.repository.modifiedAt.toISOString();
      }
      json.license = p.locals.license;
      json.time = {
        created: p.locals.createdAt.toISOString(),
        modified: p.locals.modifiedAt.toISOString()
      }
      
      return json;
    });
    
    page.locals.objects = objects;
    next();
  }
  
  function render(page, next) {
    //console.log('RENDER ALL!');
    //console.log(page);
    
    var json = {};
    json.objects = page.locals.objects;
    
    // TODO: add `totals`, and `urls`, with `prev and next`
    
    page.write(JSON.stringify(json, null, 2));
    page.end();
  }
  
  
  return [
    initialize,
    getPackages,
    formatPackages,
    render
  ];
};

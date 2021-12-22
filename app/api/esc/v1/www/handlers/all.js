/**
 * List packages.
 *
 * This component provides a handler that generates a (optionally paged) list of
 * all packages in JSON format.  The format generated by this handler is
 * intended to be compatible with npm's [`/-/v1/search`](https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md#get-v1search)
 * endpoint.  Sample responses can be seen by fetching:
 *   - https://registry.npmjs.org/-/v1/search?text=passport
 *   - https://registry.npmjs.org/-/v1/search?text=kerouac%20cname
 *
 * This endpoint is not available in npm's API, as the functionality is intended
 * to be delivered via the search endpoint.  However, because this package
 * generates a static site and is not capable of dyanamic search, this endpoint
 * is provided as an alternative.
 */
exports = module.exports = function(registry, forge) {
  var uri = require('url');
  
  
  var limit = 25;
  
  function fetchPackages(page, next) {
    var pi = page.params.page ? parseInt(page.params.page - 1) : 0
      , offset = pi * limit;
    
    registry.list({ limit: limit, offset: offset }, function(err, ps, inf) {
      if (err) { return next(err); }
  
      //console.log('ABS URL: ' + page.absoluteURL);
      // /packages/-/v1/all.json
      // /packages/-/v1/all/2.json
  
      var urls = {};
      if (offset + limit < inf.count) {
        urls.next = pi > 0 ? uri.resolve(page.absoluteURL, (pi + 2) + '.json')
                           : uri.resolve(page.absoluteURL, 'all/' + (pi + 2) + '.json'); // add 2 for 1-based indexing
      }
      if (pi > 0) {
        urls.prev = pi > 1 ? uri.resolve(page.absoluteURL, pi + '.json')
                           : uri.resolve(page.absoluteURL, '../all.json');
      }
      page.locals.total = inf.count;
      page.locals.urls = urls;
      
      var pkgs = []
        , i = 0;
      function iter() {
        var p = ps[i++];
        if (!p) {
          page.locals.packages = pkgs;
          return next();
        }
        
        registry.read(p.name, function(err, pkg) {
          if (err) { return next(err); }
          pkgs.push(pkg);
          iter();
        });
      }
      iter();
    });
  }
  
  function augmentWithInfoFromForge(page, next) {
    var packages = page.locals.packages;
    
    var i = 0;
    function iter() {
      var pkg = packages[i++];
      if (!pkg) {
        return next();
      }
      
      if (!pkg.repositories) {
        return iter();
      }
      
      var repo = pkg.repositories[0];
      forge.info(repo.url, function(err, proj) {
        if (err && err.type == 'HostNotSupportedError') {
          return iter();
        } else if (err) { return next(err); }
        
        if (!proj) { return iter(); } // not found
        
        pkg.interactionCounts = {
          bookmarks: proj.bookmarkCount,
          subscribers: proj.subscribeCount,
          forks: proj.forkCount
        }
        iter();
      });
    }
    iter();
  }
  
  function mapFormat(page, next) {
    var packages = page.locals.packages;
    
    var objects = packages.map(function(p) {
      var obj = {};
      obj.package = {};
      obj.package.name = p.name;
      if (p['dist-tags']) {
        obj.package.version = p['dist-tags']['latest'];
      }
      obj.package.description = p.description;
      obj.package.keywords = p.keywords;
      if (p.ptime) {
        obj.package.date = p.ptime.toISOString();
      }
      obj.package.links = {};
      obj.package.links.npm = 'https://www.npmjs.com/package/' + encodeURIComponent(p.name);
      obj.package.links.homepage = p.homepage;
      if (p.repositories) {
        // TODO: Should this be normalized to web-based URL?
        obj.package.links.repository = p.repositories[0].url;
      }
      if (p.bugs) {
        obj.package.links.bugs = p.bugs.url;
      }
      // TODO: author
      // TODO: publisher
      // TODO: maintainers
      if (p.flags) {
        // The "flags" property is not documented.  However, it's existence has
        // been witnessed in npm's implementation, with resposes including:
        //
        // - trailpack-proxy-passport
        //   "flags": {
        //     "insecure": 6
        //   }
        //
        // - express-demo
        //   "flags": {
        //     "insecure": 1,
        //     "unstable": true
        //   }
        obj.flags = p.flags;
      }
      if (p.downloadCounts) {
        // The `downloadCounts` property is not present in npm's API.  This is
        // an extension.
        obj.downloadCounts = p.downloadCounts;
      }
      if (p.interactionCounts) {
        // The `interactionCounts` property is not present in npm's API.  This
        // is an extension, with the name chosen to bear similarity to the
        // Schema.org [`interactionCount`](https://schema.org/interactionCount)
        // property.
        //
        // The keys available on this object derive their names from the
        // relevant Schema.org actions:
        //   https://schema.org/BookmarkAction
        //   https://schema.org/SubscribeAction
        obj.interactionCounts = p.interactionCounts;
      }
      
      return obj;
    });
    
    page.locals.objects = objects;
    next();
  }
  
  function render(page, next) {
    var json = {};
    json.objects = page.locals.objects;
    json.total = page.locals.total;
    // The "urls" property is not available in npm's implementation.  It is,
    // however, used in accordance with their REST conventions for [list](https://github.com/npm/registry/blob/master/docs/restful-api-conventions.md#list)
    // endpoints.
    json.urls = page.locals.urls;
    
    page.write(JSON.stringify(json, null, 2));
    page.end();
  }
  
  
  return [
    fetchPackages,
    augmentWithInfoFromForge,
    mapFormat,
    render
  ];
};

exports['@require'] = [
  'http://schemas.modulate.io/js/comp/lang/javascript/PackageRegistry'
];

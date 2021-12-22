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
    var i = page.params.page ? parseInt(page.params.page - 1) : 0
      , offset = i * limit;
    
    registry.list({ limit: limit, offset: offset }, function(err, ps) {
      if (err) { return next(err); }
      
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
  
  function count(page, next) {
    // TODO: Pass counting info in response to `list` above, to avoid duplicate calls
    registry.list(function(err, pkgs) {
      if (err) { return next(err); }
      
      var i = page.params.page ? parseInt(page.params.page - 1) : 0
        , offset = i * limit;
    
      var urls = {};
      if (offset + limit < pkgs.length) {
        urls.next = i > 0 ? uri.resolve(page.absoluteURL, (i + 2) + '.json')
                          : uri.resolve(page.absoluteURL, 'all/' + (i + 2) + '.json'); // add 2 for 1-based indexing
      }
      if (i > 0) {
        urls.prev = i > 1 ? uri.resolve(page.absoluteURL, i + '.json')
                          : uri.resolve(page.absoluteURL, '../all.json');
      }
    
      page.locals.total = pkgs.length;
      page.locals.urls = urls;
      next();
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
        
        // The "counts" property is not available in npm's implementation.  The
        // keys available on this object are inspired by Schema.org's interaction
        // statistics.
        //   https://schema.org/interactionStatistic
        //   https://schema.org/InteractionCounter
        //   https://schema.org/SubscribeAction
        //   https://schema.org/BookmarkAction
        pkg._count = {
          favorites: proj.favoriteCount,
          subscribers: proj.subscriberCount,
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
        obj.package.links.repository = p.repositories[0].url;
      }
      if (p.bugs) {
        obj.package.links.bugs = p.bugs.url;
      }
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
      if (p.downloads) {
        // The "downloads" property is not available in npm's implementation.
        // The key name was chosen to mirror the path used by npm in their API
        // endpoint for obtaining download counts, `https://api.npmjs.org/downloads/point/{period}[/{package}]`.
        //
        // Information regarding how npm calculates download counts can be found at:
        //   - [package download counts](https://github.com/npm/registry/blob/master/docs/download-counts.md)
        //   - [Download counts are back!](https://blog.npmjs.org/post/78719826768/download-counts-are-back)
        //   - [numeric precision matters: how npm download counts work](https://blog.npmjs.org/post/92574016600/numeric-precision-matters-how-npm-download-counts)
        //   - [npm/download-counts](https://github.com/npm/download-counts)
        obj.downloads = {
          'last-day': p.downloads['last-day'],
          'last-week': p.downloads['last-week'],
          'last-month': p.downloads['last-month']
        }
      }
      if (p._count) {
        obj.count = p._count;
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
    count,
    augmentWithInfoFromForge,
    mapFormat,
    render
  ];
};

exports['@require'] = [
  'http://schemas.modulate.io/js/comp/lang/javascript/PackageRegistry'
];

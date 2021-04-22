/**
 * API v1: List packages.
 *
 * This component provides a handler that generates a (optionally paged) list of
 * all packages, and is one of the resources that make up API v1.
 *
 * Note that this endpoint is not available in npm's implementation, which
 * equivalent capabilities via a search endpoint at  `/-/v1/search`.  Because
 * this component generates a static set of resources, dynamic search
 * functionality is not possible.  As an alternative, a list of all packages is
 * provided so that clients can construct a local serach index.
 *
 * This handler is mounted at `/-/v1/all`, mirroring the convention of npm's
 * [deprecated](http://blog.npmjs.org/post/157615772423/deprecating-the-all-registry-endpoint)
 * endpoint which resided at `/-/all`.
 *
 * The file format generated by this handler is intended to be compatible with
 * npm's API v1 [search](https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md#get-v1search)
 * endpoint.  Sample responses can be inspected by fetching:
 *   - https://registry.npmjs.org/-/v1/search?text=passport
 *   - https://registry.npmjs.org/-/v1/search?text=kerouac%20cname
 */
exports = module.exports = function(registry, project) {
  var uri = require('url');
  
  
  var limit = 25;
  
  function fetchRecords(page, next) {
    page.internals = {};
    
    registry.list(function(err, items) {
      if (err) { return next(err); }
      
      var pkgs = []
        , i = 0;
      function iter() {
        var item = items[i++];
        if (!item) {
          page.internals.packages = pkgs;
          return next();
        }
        
        registry.read(item.name, function(err, pkg) {
          if (err) { return next(err); }
          pkgs.push(pkg);
          iter();
        });
      }
      iter();
    });
  }
  
  function select(page, next) {
    var packages = page.internals.packages;
    
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
    
    // TODO: Move this slicing into data layer
    packages = packages.slice(offset, offset + limit);
    
    var objects = packages.map(function(p) {
      var json = {};
      json.package = {};
      json.package.name = p.name;
      if (p['dist-tags']) {
        json.package.version = p['dist-tags']['latest'];
      }
      json.package.description = p.description;
      json.package.keywords = p.keywords;
      if (p.ptime) {
        json.package.date = p.ptime.toISOString();
      }
      json.package.links = {};
      json.package.links.npm = 'https://www.npmjs.com/package/' + encodeURIComponent(p.name);
      json.package.links.homepage = p.homepage;
      if (p.repository) {
        json.package.links.repository = p.repository.url;
      }
      if (p.bugs) {
        json.package.links.bugs = p.bugs.url;
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
        json.flags = p.flags;
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
        json.downloads = {
          'last-day': p.downloads['last-day'],
          'last-week': p.downloads['last-week'],
          'last-month': p.downloads['last-month']
        }
      }
      
      return json;
    });
    
    page.locals.objects = objects;
    next();
  }
  
  function loadCounts(page, next) {
    var packages = page.internals.packages;
    
    var i = 0;
    function iter() {
      var pkg = packages[i++];
      if (!pkg) {
        return next();
      }
      
      var repo = pkg.repository
      if (!repo) { return iter(); }
      
      project.info(repo.url, { protocol: repo.type }, function(err, proj) {
        if (err) { return next(err); }
        
        // The "counts" property is not available in npm's implementation.  The
        // keys available on this object are inspired by Schema.org's interaction
        // statistics.
        //   https://schema.org/interactionStatistic
        //   https://schema.org/InteractionCounter
        //   https://schema.org/SubscribeAction
        //   https://schema.org/BookmarkAction
        page.locals.objects[i - 1].count = {
          favorites: proj.favoriteCount,
          subscribers: proj.subscriberCount,
          forks: proj.forkCount
        }
        
        iter();
      });
    }
    iter();
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
    fetchRecords,
    select,
    loadCounts,
    render
  ];
};

exports['@require'] = [];

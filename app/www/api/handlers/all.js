/**
 * List packages.
 *
 * This component provides a handler that generates a list of all packages in
 * JSON format.  The format generated by this handler is intended to be
 * compatible with npm's [`/-/all`](https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md#get-all)
 * endpoint.  Note that npm has [deprecated](http://blog.npmjs.org/post/157615772423/deprecating-the-all-registry-endpoint)
 * this endpoint, but historical sample responses can be viewed at the Internet
 * Archive:
 *   - 2012/08/24 - https://web.archive.org/web/20120824150709/https://registry.npmjs.org/-/all
 *   - 2015/05/15 - https://web.archive.org/web/20150515053712/https://registry.npmjs.org/-/all
 *
 * After the deprecation, the Internet Archive recorded a response in the
 * following format:
 *
 *   ```
 *   {"message":"deprecated"}
 *   ```
 *   - 2018/02/18 - https://web.archive.org/web/20180218131402/https://registry.npmjs.org/-/all
 *
 * However, when fetching the endpoint directly at time of writing, a response
 * in the following format is returned.  It can be assumed that the change was
 * made in order to avoid breaking clients, which would have assumed that the
 * key `message` was a package, but its value wasn't a package object as
 * expected.
 *
 *   ```
 *   []
 *   ```
 *   - 2018/09/22 - https://registry.npmjs.org/-/all
 *
 * When generating a deprecated file, the ambiguity is resolved in favor of the
 * latest known format (a zero-length array).
 *
 * Note that this handler does not support paging, which can result in responses
 * of considerable size when there are a large number of packages in the
 * registry.  For this reason, it is recommended to use an endpoint which
 * supports paging, such as `/-/v1/all`.
 *
 * @returns {Function[]}
 */
exports = module.exports = function(registry, forge) {
  var uri = require('url');
  
  
  /*
  function deprecated(page) {
    page.write(JSON.stringify([]));
    page.end();
  }
  */
  
  function fetchPackages(page, next) {
    registry.list(function(err, ps) {
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
  
  function loadCounts(page, next) {
    var pkgs = page.locals.packages;
    
    var i = 0;
    function iter() {
      var pkg = pkgs[i++];
      if (!pkg) { return next(); }
      
      if (!pkg.repositories) {
        return iter();
      }
      
      var repo = pkg.repositories[0];
      forge.info(repo.url, function(err, proj) {
        if (err && err.type == 'HostNotSupportedError') {
          return iter();
        } else if (err) { return next(err); }
        
        if (!proj) { return iter(); } // not found
        
        // TODO: set this on locals, rather than package object
        pkg._count = {
          favorites: proj.favoriteCount,
          subscribers: proj.subscriberCount,
          forks: proj.forkCount
        };
        
        iter();
      });
    }
    iter();
  }
  
  function render(page, next) {
    var packages = page.locals.packages;
    
    var json = {};
    
    packages.forEach(function(p) {
      var obj = {};
      obj.name = p.name;
      obj.description = p.description;
      obj.keywords = p.keywords;
      if (p['dist-tags']) {
        obj['dist-tags'] = { latest: p['dist-tags']['latest'] };
      }
      obj.versions = {};
      if (p['dist-tags']) {
        obj.versions[p['dist-tags']['latest']] = 'latest';
      }
      if (p.ptime) {
        obj.time = { modified: p.ptime.toISOString() };
      }
      // TODO: Put this back in test case
      if (p.flags) {
        obj._flags = p.flags;
      }
      if (p._count) {
        obj._count = p._count;
      }
      if (p.downloads) {
        obj._downloads = p.downloads;
      }
      
      json[p.name] = obj;
    });
    
    page.write(JSON.stringify(json, null, 2));
    page.end();
  }
  
  
  return [
    //deprecated,
    fetchPackages,
    loadCounts,
    render
  ];
};

exports['@require'] = [
  'http://js.modulate.io/comp/lang/javascript/PackageRegistry'
];

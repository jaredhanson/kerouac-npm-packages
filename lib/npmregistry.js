var npmPackage = require('package-json')
  , npmDownloads = require('pkg-downloads')
  , LRUCache = require('lru-cache');


/**
 * npm Registry.
 */
function NpmRegistry() {
  this._cache = new LRUCache({ max: 600 });
}

NpmRegistry.prototype.read = function(name, cb) {
  var self = this
    , cached = this._cache.get(name);
  
  if (cached) {
    process.nextTick(function() {
      return cb(null, cached);
    });
    return;
  }
  
  npmPackage(name, { fullMetadata: true, allVersions: true })
    .then(function(pkg) {
      //console.log(pkg);
      //console.log(require('util').inspect(pkg, true, null));
      
      return normalize(pkg);
    })
    .then(function(pkg) {
      return Promise.all([
          npmDownloads(pkg.name, { period: 'day' }),
          npmDownloads(pkg.name, { period: 'week' }),
          npmDownloads(pkg.name, { period: 'month' })
        ])
        .then(function(counts) {
          pkg.downloads = {
            'last-day': counts[0],
            'last-week': counts[1],
            'last-month': counts[2]
          };
          return pkg;
        }, cb);
    })
    .then(function(pkg) {
      self._cache.set(name, pkg);
      return cb(null, pkg);
    }, cb);
}


/**
 * Normalize package.
 *
 * Normalizes a package object, as supplied by the [npm Registry](https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md),
 * into the format defined by CommonJS [Packages/1.0](http://wiki.commonjs.org/wiki/Packages/1.0)
 * and [Packages/1.1](http://wiki.commonjs.org/wiki/Packages/1.1), as well as extensions
 * defined by [Packages/Registry](http://wiki.commonjs.org/wiki/Packages/Registry).
 *
 * @api private
 */
function normalize(pkg, isVersion) {
  var npkg = {}
    , v, ts;
  npkg.name = pkg.name;
  if (isVersion) {
    npkg.version = pkg.version;
  } else {
    npkg.versions = {};
    for (v in pkg.versions) {
      npkg.versions[v] = normalize(pkg.versions[v], true);
    }
    if (pkg['dist-tags']) {
      npkg['dist-tags'] = pkg['dist-tags'];
    }
  }
  npkg.description = pkg.description;
  npkg.keywords = pkg.keywords;
  npkg.homepage = pkg.homepage;
  // TODO: Make this an array
  npkg.repository = pkg.repository;
  npkg.bugs = pkg.bugs;
  npkg.author = normalizeHuman(pkg.author);
  npkg.maintainers = normalizeHuman(pkg.maintainers);
  if (pkg.license) {
    npkg.license = { type: pkg.license };
  }
  if (pkg.time) {
    npkg.ctime = new Date(Date.parse(pkg.time.created));
    npkg.mtime = new Date(Date.parse(pkg.time.modified));
    if (pkg['dist-tags']) {
      ts = pkg.time[pkg['dist-tags']['latest']];
      npkg.ptime = new Date(ts);
    }
  }
  npkg.readme = pkg.readme;
  
  return npkg;
}

/**
 * Normalize human.
 *
 * Normalizes a human object, as supplied by the [npm Registry](https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md),
 * into the format defined by CommonJS [Packages/1.0](http://wiki.commonjs.org/wiki/Packages/1.0).
 *
 * The only difference between the formats is that CommonJS defines a `web`
 * property, whereas npm uses `url` for the same value.  Thus, `url` is mapped
 * to `web`.
 *
 * @api private
 */
function normalizeHuman(human) {
  if (Array.isArray(human)) {
    return human.map(function(h) { return normalizeHuman(h); });
  }
  
  var h = {};
  if (human.name) { h.name = human.name; }
  if (human.email) { h.email = human.email; }
  if (human.url) { h.web = human.url; }
  return h;
}


module.exports = NpmRegistry;

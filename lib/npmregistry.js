var npmPackage = require('package-json')
  , npmDownloads = require('pkg-downloads')
  , LRUCache = require('lru-cache');


/**
 * npm Registry.
 */
function NpmRegistry() {
  this._cache = new LRUCache({ max: 1000 });
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
          // TODO: Prefix this with an _ for private use
          
          pkg.downloads = {
            'last-day': counts[0],
            'last-week': counts[1],
            'last-month': counts[2]
          };
          return pkg;
        });
    })
    .then(function(pkg) {
      self._cache.set(name, pkg);
      return cb(null, pkg);
    })
    .catch(function(err) {
      return cb(err);
    });
}


/**
 * Normalize package.
 *
 * Normalizes a package object, as supplied by the [npm Registry](https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md),
 * into the format defined by CommonJS [Packages/1.0](http://wiki.commonjs.org/wiki/Packages/1.0)
 * and [Packages/1.1](http://wiki.commonjs.org/wiki/Packages/1.1), as well as extensions
 * defined by [Packages/Registry](http://wiki.commonjs.org/wiki/Packages/Registry).
 *
 * @access private
 * @param {Object} pkg - The package or version.
 * @param {Object} isv - Flag set to `true` if `pkg` parameter is a version.
 * @returns {Object} Normalized package.
 */
function normalize(pkg, isv) {
  var npkg = {}
    , v, ts;
  npkg.name = pkg.name;
  if (isv) {
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
  npkg.repositories = [ pkg.repository ];
  npkg.bugs = pkg.bugs;
  // NOTE: The CommonJS specification does not define an `author` property,
  //       instead having a convention where the author is the first element in
  //       the `contributors` property.  `author` is an extension used within
  //       npm and is preserved here for convienience.
  if (pkg.author) {
    npkg.author = normalizeHuman(pkg.author);
  }
  
  if (pkg.contributors) {
    // TODO:
  }
  
  // TODO: Contributors
  npkg.maintainers = normalizeHuman(pkg.maintainers);
  if (pkg.license) {
    npkg.licenses = [ { type: pkg.license } ];
  }
  // TODO: Add funding
  //       https://docs.npmjs.com/cli/v7/configuring-npm/package-json
  if (pkg.time) {
    npkg.ctime = new Date(Date.parse(pkg.time.created));
    npkg.mtime = new Date(Date.parse(pkg.time.modified));
    // TODO: Remove ptime
    if (pkg['dist-tags']) {
      ts = pkg.time[pkg['dist-tags']['latest']];
      npkg.ptime = new Date(ts);
    }
  }
  // NOTE: The CommonJS specification does not define a `readme` property.  This
  //       is an extension used within npm and is preserved here because it
  //       helps fulfill the primary purpose of this package - generating sites
  //       with helpful information.
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
 * @access private
 * @param {(Object|Object[])} human - The human.
 * @returns {Object} Normalized human.
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

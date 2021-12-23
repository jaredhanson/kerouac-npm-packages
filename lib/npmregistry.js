var npmPackage = require('package-json')
  , npmDownloads = require('pkg-downloads')
  , clone = require('clone')
  , LRUCache = require('lru-cache');


/**
 * npm Registry.
 *
 * This class is used to access package metadata from the [npm](https://www.npmjs.com)
 * public registry.
 *
 * The npm registry exposes an [API](https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md)
 * that provides package and version [metadata](https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md).
 * This metadata consists of metadata found in [package.json](https://docs.npmjs.com/cli/v7/configuring-npm/package-json),
 * as well as additional metadata added by the registry when packages are
 * published.
 *
 * Despite [claiming](https://docs.npmjs.com/cli/v7/using-npm/registry) to
 * implement the [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) [Package Registry](http://wiki.commonjs.org/wiki/Packages/Registry)
 * specification, npm's implementation differs in substantial ways.  These
 * differences are largely concentrated within the package descriptor defined by
 * [Packages/1.0](http://wiki.commonjs.org/wiki/Packages/1.0) and [Packages/1.1](http://wiki.commonjs.org/wiki/Packages/1.1).
 *
 * Where possible, this class normalizes any differences in favor of the
 * CommonJS specifications.  This allows other registry implementations to be
 * swapped in, assuming such implementations also normalize to the CommonJS
 * specification.
 *
 * @access public
 */
function NpmRegistry() {
  this._cache = new LRUCache({ max: 1000 });
}

/**
 * Read package metadata.
 *
 * @access public
 * @param {string} name - The package name.
 */
NpmRegistry.prototype.read = function(name, cb) {
  var self = this
    , cached = this._cache.get(name);
  
  if (cached) {
    process.nextTick(function() {
      return cb(null, clone(cached));
    });
    return;
  }
  
  npmPackage(name, { fullMetadata: true, allVersions: true })
    .then(function(pkg) {
      //console.log(require('util').inspect(pkg, true, null));
      return normalize(pkg);
    })
    .then(function(pkg) {
      // Information regarding how npm calculates download counts can be found
      // at:
      //   - [package download counts](https://github.com/npm/registry/blob/master/docs/download-counts.md)
      //   - [Download counts are back!](https://blog.npmjs.org/post/78719826768/download-counts-are-back)
      //   - [numeric precision matters: how npm download counts work](https://blog.npmjs.org/post/92574016600/numeric-precision-matters-how-npm-download-counts)
      //   - [npm/download-counts](https://github.com/npm/download-counts)
      
      return Promise.all([
          npmDownloads(pkg.name, { period: 'day' }),
          npmDownloads(pkg.name, { period: 'week' }),
          npmDownloads(pkg.name, { period: 'month' })
        ])
        .then(function(counts) {
          pkg.downloadCounts = {
            'last-day': counts[0],
            'last-week': counts[1],
            'last-month': counts[2]
          };
          return pkg;
        });
    })
    .then(function(pkg) {
      self._cache.set(name, pkg);
      return cb(null, clone(pkg));
    })
    .catch(function(err) {
      return cb(err);
    });
}


/**
 * Normalize package.
 *
 * Normalizes a package object into the format defined by CommonJS.
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
      // The CommonJS specification does not define a `dist-tags` property.  This
      // is an extension used within npm and is preserved here as it offers a more
      // effective way of determining the latest version than iterating through
      // the versions object and doing a semver comparison.
      npkg['dist-tags'] = pkg['dist-tags'];
    }
  }
  npkg.description = pkg.description;
  npkg.keywords = pkg.keywords;
  if (pkg.homepage) { npkg.homepage = pkg.homepage; }
  if (pkg.repository) {
    npkg.repositories = [ pkg.repository ];
  }
  if (pkg.bugs) { npkg.bugs = pkg.bugs; }
  if (pkg.author) {
    npkg.contributors = [ normalizeHuman(pkg.author) ];
  }
  if (pkg.contributors) {
    npkg.contributors = normalizeHuman(pkg.contributors);
  }
  if (pkg.maintainers) {
    npkg.maintainers = normalizeHuman(pkg.maintainers);
  }
  if (pkg.license) {
    npkg.licenses = [ { type: pkg.license } ];
  }
  // TODO: Add funding
  //       https://docs.npmjs.com/cli/v7/configuring-npm/package-json
  if (pkg.time) {
    npkg.ctime = new Date(Date.parse(pkg.time.created));
    npkg.mtime = new Date(Date.parse(pkg.time.modified));
    if (pkg['dist-tags']) {
      ts = pkg.time[pkg['dist-tags']['latest']];
      // The CommonJS specification does not define a `ptime` property.  It is
      // used here to indicate the publish time of the latest version of the
      // package.
      //
      // Note that this is different from the modified time of the package root
      // object.  This object, and the corresponding timestamp, can change
      // independently of publishing a new version.  The circumstances under
      // which it is modified are not entirely clear, but it is observable
      // behavior in the npm registry.
      npkg.ptime = new Date(Date.parse(ts));
    }
  }
  // The CommonJS specification does not define a `readme` property.  This is an
  // extension used within npm and is preserved here because it helps fulfill
  // the primary purpose of this package - generating sites with helpful
  // information.
  if (pkg.readme) { npkg.readme = pkg.readme; }
  
  return npkg;
}

/**
 * Normalize human.
 *
 * Normalizes a human object into the format defined by CommonJS.
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

var npmPackage = require('package-json')
  , npmDownloads = require('pkg-downloads')
  , LRUCache = require('lru-cache');


function NpmRegistry() {
  this._cache = new LRUCache({ max: 10 });
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


function normalize(pkg, pv) {
  var npkg = {}
    , v, ts;
  npkg.name = pkg.name;
  npkg.description = pkg.description;
  npkg.keywords = pkg.keywords;
  if (!pv) {
    npkg.versions = {};
    for (v in pkg.versions) {
      npkg.versions[v] = normalize(pkg.versions[v], true);
    }
    if (pkg['dist-tags']) {
      npkg['dist-tags'] = pkg['dist-tags'];
    }
  }
  npkg.homepage = pkg.homepage;
  npkg.repository = pkg.repository;
  npkg.bugs = pkg.bugs;
  npkg.author = pkg.author;
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


module.exports = NpmRegistry;

var npmPackage = require('package-json')
  , npmDownloads = require('pkg-downloads')


function NpmRegistry() {
}

NpmRegistry.prototype.read = function(name, cb) {
  npmPackage(name, { fullMetadata: true, allVersions: true })
    .then(function(pkg) {
      var npkg = normalize(pkg)
        , v;
      
      npkg.versions = {};
      for (v in pkg.versions) {
        npkg.versions[v] = normalize(pkg.versions[v]);
      }
      
      return npkg;
    })
    .then(function(pkg) {
      //return pkg;
      
      // https://github.com/npm/registry/blob/master/docs/download-counts.md
      // http://blog.npmjs.org/post/92574016600/numeric-precision-matters-how-npm-download-counts
  
      // http://blog.npmjs.org/post/78719826768/download-counts-are-back
      // https://github.com/npm/download-counts
      
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
      return cb(null, pkg);
    }, cb);
}


function normalize(pkg) {
  var npkg = {};
  npkg.name = pkg.name;
  npkg.description = pkg.description;
  npkg.keywords = pkg.keywords;
  if (pkg['dist-tags']) {
    npkg['dist-tags'] = pkg['dist-tags'];
  }
  npkg.homepage = pkg.homepage;
  npkg.repository = pkg.repository;
  npkg.author = pkg.author;
  if (pkg.license) {
    npkg.license = { type: pkg.license };
  }
  if (pkg.time) {
    npkg.ctime = new Date(Date.parse(pkg.time.created));
    npkg.mtime = new Date(Date.parse(pkg.time.modified));
  }
  npkg.readme = pkg.readme;
  
  return npkg;
}


module.exports = NpmRegistry;

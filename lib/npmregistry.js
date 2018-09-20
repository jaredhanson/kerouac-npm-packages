var PackageMeta = require('package-json');


function NpmRegistry() {
}

NpmRegistry.prototype.read = function(name, cb) {
  PackageMeta(name, { fullMetadata: true, allVersions: true })
    .then(function(pkg) {
      var npkg = normalize(pkg)
        , v;
      
      npkg.versions = {};
      for (v in pkg.versions){
        npkg.versions[v] = normalize(pkg.versions[v]);
      }
      
      return cb(null, npkg);
    }, cb);
}


function normalize(pkg) {
  var npkg = {};
  npkg.name = pkg.name;
  npkg.description = pkg.description;
  npkg.keywords = pkg.keywords;
  npkg.homepage = pkg.homepage;
  npkg.author = pkg.author;
  if (pkg.time) {
    npkg.ctime = new Date(Date.parse(pkg.time.created));
    npkg.mtime = new Date(Date.parse(pkg.time.modified));
  }
  npkg.readme = pkg.readme;
  
  return npkg;
}


module.exports = NpmRegistry;

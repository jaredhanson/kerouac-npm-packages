var PackageMeta = require('package-json');


function NpmRegistry(registry) {
  this._dir = 'data/packages';
  this._registry = registry;
}

NpmRegistry.prototype.read = function(name, cb) {
  PackageMeta(name, { fullMetadata: true, allVersions: true })
    .then(function(pkg) {
      var npkg = normalize(pkg);
      return cb(null, npkg);
    }, cb);
}


function normalize(pkg) {
  var npkg = {};
  npkg.name = pkg.name;
  npkg.description = pkg.description;
  
  return npkg;
}


module.exports = NpmRegistry;

exports = module.exports = function() {
  var LocalCuratedRegistry = require('../../../lib/localcuratedregistry');
  var NpmRegistry = require('../../../lib/npmregistry');
  
  var npm = new NpmRegistry();
  return new LocalCuratedRegistry(npm);
};

exports['@implements'] = 'http://schemas.modulate.io/js/comp/lang/javascript/PackageRegistry';
exports['@singleton'] = true;
exports['@require'] = [];

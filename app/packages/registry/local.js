exports = module.exports = function() {
  var LocalCuratedRegistry = require('../../../lib/localcuratedregistry');
  
  return new LocalCuratedRegistry();
};

exports['@implements'] = 'http://io.modulate.com/comp/lang/javascript/PackageRegistry';
exports['@singleton'] = true;
exports['@require'] = [];

exports = module.exports = function(allHandler, registry, project) {
  var kerouac = require('kerouac')


  var site = new kerouac.Router();
  
  site.page('/all.json', require('../../handlers/api/v1/all')(registry, project));
  site.page('/:page.json', require('../../handlers/api/v1/all')(registry, project));
  
  return site;
};

exports['@implements'] = 'http://i.kerouacjs.org/Site';
exports['@require'] = [
  './handlers/api/all',
  'http://schemas.modulate.io/js/comp/lang/javascript/PackageRegistry'
];

/**
 * npm Public Registry meta endpoints site.
 *
 * This component provides a site that consists of files conforming to the meta
 * endpoints that are part of the npm [Public Registry API](https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md).
 *
 * @param {Function|Function[]} allHandler - All handler.
 * @returns {Function}
 */
exports = module.exports = function(allHandler) {
  var kerouac = require('kerouac')


  var site = new kerouac.Router();
  
  site.page('/all.json', allHandler);
  
  return site;
};

exports['@implements'] = 'http://i.kerouacjs.org/Site';
exports['@path'] = '/-';
exports['@require'] = [
  './handlers/all'
];

/**
 * npm Public Registry API.
 *
 * This component provides a site that implements the npm [Public Registry API](https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md).
 * In particular, this implements the "escaped" portion of the API, which
 * includes endpoints (within a "-" directory) that are not part of the the
 * [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) [Package Registry](http://wiki.commonjs.org/wiki/Packages/Registry)
 * specification.
 *
 * This API has been superseded by the "v1" API.  Based on the naming of the
 * later, it can be assumed that this API was implemented before npm had a
 * versioning strategy and is effectively "v0".
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

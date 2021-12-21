/**
 * npm Public Registry API v1.
 *
 * This component provides a site that implements the npm [Public Registry API](https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md).
 * In particular, this implements the "escaped" portion of the API, which
 * includes endpoints (within a "-" directory) that are not part of the the
 * [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) [Package Registry](http://wiki.commonjs.org/wiki/Packages/Registry)
 * specification.
 *
 * @param {Function|Function[]} allHandler - All handler.
 * @returns {Function}
 */
exports = module.exports = function(allHandler) {
  var kerouac = require('kerouac');


  var site = new kerouac.Router();
  
  // This endpoint is not available npm's API.  The equivalent functionality is
  // delivered via the `/search` endpoint.  However, because this package
  // generates a static site and is not capable of dyanamic search, this
  // endpoint is provided as an alternative.  It is mounted at the path `/all`,
  // following the convention in the preceeding "v0" API.
  site.page('/all.json', allHandler);
  site.page('/all/:page.json', allHandler);
  
  return site;
};

exports['@implements'] = 'http://i.kerouacjs.org/Site';
exports['@path'] = '/-/v1';
exports['@require'] = [
  './handlers/all',
];

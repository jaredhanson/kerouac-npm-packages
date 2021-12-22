/**
 * npm Public Registry API.
 *
 * This component provides a site that implements the npm [Public Registry API](https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md).
 * In particular, this implements the "unescaped" portion of the API, which
 * [claims to](https://docs.npmjs.com/cli/v7/using-npm/registry) implement the
 * [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) [Package Registry](http://wiki.commonjs.org/wiki/Packages/Registry)
 * specification.
 *
 * Despite the claim to implement the CommonJS Package Registry specification,
 * npm's implementation differs in substantial ways.  This is not surprising as
 * the specification, unfortunately, is not particularly clear or consistent.
 * This component acknowledges these ambiguities, and attempts to be as
 * compatible as possible with clients expecting either variation.  This is a
 * pragmatic decision, acknowledging the fact that npm is the most widely used
 * registry, and clients are likely to be developed against and compatible with
 * its implementation, even where it deviates from the specification.
 *
 * @param {Function|Function[]} dbHandler - DB info handler.
 * @param {Function|Function[]} packageHandler - Package handler.
 * @returns {Function}
 */
exports = module.exports = function(dbHandler, packageHandler) {
  var kerouac = require('kerouac')


  var site = new kerouac.Router();
  
  site.page('/index.json', dbHandler);
  site.page('/:package.json', packageHandler);
  // TODO: /:package/:version.json
  
  return site;
};

exports['@implements'] = 'http://i.kerouacjs.org/Site';
exports['@path'] = '/';
exports['@require'] = [
  './handlers/db',
  './handlers/package'
];

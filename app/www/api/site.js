/**
 * npm Public Registry API site.
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
exports['@require'] = [
  './handlers/all'
];

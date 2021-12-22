exports = module.exports = function(packageHandler) {
  var kerouac = require('kerouac')


  var site = new kerouac.Router();
  
  site.page('/:name.json', packageHandler);
  
  return site;
};

exports['@implements'] = 'http://i.kerouacjs.org/Site';
exports['@path'] = '/';
exports['@require'] = [
  './handlers/package'
];

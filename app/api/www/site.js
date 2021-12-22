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

exports = module.exports = function(allHandler) {
  var kerouac = require('kerouac');


  var site = new kerouac.Router();
  
  site.page('/all.json', allHandler);
  site.page('/all/:page.json', allHandler);
  
  return site;
};

exports['@implements'] = 'http://i.kerouacjs.org/Site';
exports['@require'] = [
  './handlers/all',
];

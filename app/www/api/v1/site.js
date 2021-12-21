exports = module.exports = function(allHandler) {
  var kerouac = require('kerouac');


  var site = new kerouac.Router();
  
  // This handler is mounted at `/-/v1/all`, mirroring the convention of npm's
  // [deprecated](http://blog.npmjs.org/post/157615772423/deprecating-the-all-registry-endpoint)
  // endpoint which resided at `/-/all`.
  site.page('/all.json', allHandler);
  site.page('/all/:page.json', allHandler);
  
  return site;
};

exports['@implements'] = 'http://i.kerouacjs.org/Site';
exports['@require'] = [
  './handlers/all',
];

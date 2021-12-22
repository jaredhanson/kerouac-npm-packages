exports = module.exports = function() {
  var registry = require('./registry');
  var forge = require('./forge');
  
  return require('../app/www/site')(null, null, null, null, registry, forge);
};

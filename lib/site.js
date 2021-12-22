exports = module.exports = function() {
  var registry = require('./registry');
  var forge = require('./forge');
  
  return require('../app/www/site')(
    require('../app/www/handlers/show')(registry, forge),
    registry
  );
};

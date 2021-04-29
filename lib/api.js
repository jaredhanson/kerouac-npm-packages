exports = module.exports = function() {
  var registry = require('./registry');
  var vc = require('./vc');
  
  return require('../app/www/api/site')(
    require('../app/www/api/handlers/all')(registry, vc)
  );
};

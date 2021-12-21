exports = module.exports = function() {
  var registry = require('./registry');
  var vc = require('./vc');
  
  return require('../app/api/esc/www/site')(
    require('../app/api/esc/www/handlers/all')(registry, vc)
  );
};

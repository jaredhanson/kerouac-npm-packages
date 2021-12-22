exports = module.exports = function() {
  var registry = require('../../registry');
  var forge = require('../../forge');
  
  return require('../../../app/api/esc/v1/www/site')(
    require('../../../app/api/esc/v1/www/handlers/all')(registry, forge)
  );
};

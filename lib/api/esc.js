exports = module.exports = function() {
  var registry = require('../registry');
  var forge = require('../forge');
  
  return require('../../app/api/esc/www/site')(
    require('../../app/api/esc/www/handlers/all')(registry, forge)
  );
};

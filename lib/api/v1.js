exports = module.exports = function() {
  var registry = require('../registry');
  var vc = require('../vc');
  
  return require('../../app/www/api/v1/site')(
    require('../../app/www/api/v1/handlers/all')(registry, vc)
  );
};

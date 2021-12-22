exports = module.exports = function() {
  var registry = require('./registry');
  var forge = require('./forge');
  
  return require('../app/api/www/site')(
    require('../app/api/www/handlers/package')(registry, forge)
  );
};

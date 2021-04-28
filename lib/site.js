exports = module.exports = function() {
  
  var project = require('@modulate/developer/app/project/adapters/github')();
  var registry = require('../app/packages/registry/local')();
  
  return require('../app/www/site')(null, null, null, null, registry, project);
};

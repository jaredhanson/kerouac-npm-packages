exports = module.exports = function() {
  return require('../app/www/site')(null, null, null, null, require('./registry'), require('./vc'));
};

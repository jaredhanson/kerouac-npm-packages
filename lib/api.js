exports = module.exports = function() {
  return require('../app/www/api/site')(null, require('./registry'), require('./vc'));
};

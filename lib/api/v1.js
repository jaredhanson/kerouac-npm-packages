exports = module.exports = function() {
  return require('../../app/www/api/v1/site')(null, require('../registry'), require('../vc'));
};

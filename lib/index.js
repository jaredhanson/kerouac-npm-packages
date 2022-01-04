var Scanner = require('./driver');

exports = module.exports = require('./site');
exports.api = require('./api');
exports.api.esc = require('./api/esc');
exports.api.esc.v1 = require('./api/esc/v1');

exports.scanner = function() {
  var registry = require('./registry');
  return new Scanner(registry);
};

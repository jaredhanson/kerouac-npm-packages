var request = require('request');

// TODO:
exports.get = function(info, cb) {
  var url = 'https://api.bitbucket.org/2.0/repositories/' + info.user + '/' + info.project;
  
  request.get(url, { json: true }, function(err, res, json) {
  });
};

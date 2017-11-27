var HostedGitInfo = require('hosted-git-info')
  , github = require('./github');

// https://github.com/nice-registry/all-the-package-repos


exports.get = function(url, cb) {
  console.log('GET REPO: ' + url);
  
  var info = HostedGitInfo.fromUrl(url);
  console.log(info);
  
  switch (info.type) {
  case 'github':
    return github.get(info, cb);
  default:
    return cb(null);
  }
  
};

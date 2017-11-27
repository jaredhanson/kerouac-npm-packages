var HostedGitInfo = require('hosted-git-info')
  , github = require('./github')
  , bitbucket = require('./bitbucket');


/**
 * Get software change management information.
 *
 * This function obtains information from software change management systems,
 * including GitHub and Bitbucket.
 *
 * The vast majority of packages published to npm use GitHub as an SCM provider,
 * but there are other providers in use including Bitbucket and GitLab, as well
 * as others that tend to be common is specific regions such as China.  Tooling
 * that is useful to analyze such information is available at:
 *   - [all-the-package-repos](https://github.com/nice-registry/all-the-package-repos)
 */
exports.get = function(url, cb) {
  var info = HostedGitInfo.fromUrl(url);
  if (!info) { return cb(null); }
  
  switch (info.type) {
  case 'github':
    return github.get(info, cb);
  //case 'bitbucket':
  //  return bitbucket.get(info, cb);
  default:
    return cb(null);
  }
};

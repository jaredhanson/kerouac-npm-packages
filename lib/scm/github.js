var GitHubApi = require('github');

var github = new GitHubApi({});

exports.get = function(options, cb) {
  github.repos.get({ repo: options.name, owner: options.owner }, function(err, ghRepo) {
    if (err) { return next(err); }
    
    var repo = {};
    repo.favoriteCount = ghRepo.data.stargazers_count;
    repo.subscriberCount = ghRepo.data.subscribers_count;
    repo.forkCount = ghRepo.data.forks_count;
    return cb(null, repo);
  });
};

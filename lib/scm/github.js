var GitHubApi = require('github');

var github = new GitHubApi({});

exports.get = function(options, cb) {
  github.repos.get({ repo: options.name, owner: options.owner }, function(err, ghRepo) {
    if (err) { return next(err); }
    
    console.log(ghRepo)
    
    var repo = {};
    repo.homepage = ghRepo.data.html_url;
    repo.url = ghRepo.data.git_url;
    repo.favoriteCount = ghRepo.data.stargazers_count;
    repo.subscriberCount = ghRepo.data.subscribers_count;
    repo.forkCount = ghRepo.data.forks_count;
    repo.createdAt = new Date(Date.parse(ghRepo.data.created_at));
    repo.modifiedAt = new Date(Date.parse(ghRepo.data.pushed_at));
    
    return cb(null, repo);
  });
};

var GitHubApi = require('github');

var github = new GitHubApi({});

if (process.env.GITHUB_ACCESS_TOKEN) {
  github.authenticate({
    type: 'token',
    token: process.env.GITHUB_ACCESS_TOKEN
  });
}

exports.get = function(info, cb) {
  github.repos.get({ repo: info.project, owner: info.user }, function(err, ghRepo) {
    if (err) { return cb(err); }
    
    var repo = {};
    repo.type = 'git';
    repo.url = ghRepo.data.git_url;
    repo.homepage = ghRepo.data.html_url;
    repo.favoriteCount = ghRepo.data.stargazers_count;
    repo.subscriberCount = ghRepo.data.subscribers_count;
    repo.forkCount = ghRepo.data.forks_count;
    repo.createdAt = new Date(Date.parse(ghRepo.data.created_at));
    repo.modifiedAt = new Date(Date.parse(ghRepo.data.pushed_at));
    return cb(null, repo);
  });
};

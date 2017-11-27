var $require = require('proxyquire');
var chai = require('chai');
var sinon = require('sinon');
var github = require('../../lib/scm/github');


describe('scm/github', function() {
  
  describe('get repository', function() {
    var api;
    
    function GitHubApiStub(opts) {
      api = this;
      this._opts = opts;
      this.repos = { get: function(opts, cb) {
        api._getopts = opts;
        
        return cb(null, {
          data: 
           { id: 20238954,
             name: 'passport-slack',
             full_name: 'mjpearson/passport-slack',
             owner: 
              { login: 'mjpearson',
                id: 139480,
                avatar_url: 'https://avatars1.githubusercontent.com/u/139480?v=4',
                gravatar_id: '',
                url: 'https://api.github.com/users/mjpearson',
                html_url: 'https://github.com/mjpearson',
                followers_url: 'https://api.github.com/users/mjpearson/followers',
                following_url: 'https://api.github.com/users/mjpearson/following{/other_user}',
                gists_url: 'https://api.github.com/users/mjpearson/gists{/gist_id}',
                starred_url: 'https://api.github.com/users/mjpearson/starred{/owner}{/repo}',
                subscriptions_url: 'https://api.github.com/users/mjpearson/subscriptions',
                organizations_url: 'https://api.github.com/users/mjpearson/orgs',
                repos_url: 'https://api.github.com/users/mjpearson/repos',
                events_url: 'https://api.github.com/users/mjpearson/events{/privacy}',
                received_events_url: 'https://api.github.com/users/mjpearson/received_events',
                type: 'User',
                site_admin: false },
             private: false,
             html_url: 'https://github.com/mjpearson/passport-slack',
             description: 'Slack OAuth2 strategy for Passport',
             fork: false,
             url: 'https://api.github.com/repos/mjpearson/passport-slack',
             forks_url: 'https://api.github.com/repos/mjpearson/passport-slack/forks',
             keys_url: 'https://api.github.com/repos/mjpearson/passport-slack/keys{/key_id}',
             collaborators_url: 'https://api.github.com/repos/mjpearson/passport-slack/collaborators{/collaborator}',
             teams_url: 'https://api.github.com/repos/mjpearson/passport-slack/teams',
             hooks_url: 'https://api.github.com/repos/mjpearson/passport-slack/hooks',
             issue_events_url: 'https://api.github.com/repos/mjpearson/passport-slack/issues/events{/number}',
             events_url: 'https://api.github.com/repos/mjpearson/passport-slack/events',
             assignees_url: 'https://api.github.com/repos/mjpearson/passport-slack/assignees{/user}',
             branches_url: 'https://api.github.com/repos/mjpearson/passport-slack/branches{/branch}',
             tags_url: 'https://api.github.com/repos/mjpearson/passport-slack/tags',
             blobs_url: 'https://api.github.com/repos/mjpearson/passport-slack/git/blobs{/sha}',
             git_tags_url: 'https://api.github.com/repos/mjpearson/passport-slack/git/tags{/sha}',
             git_refs_url: 'https://api.github.com/repos/mjpearson/passport-slack/git/refs{/sha}',
             trees_url: 'https://api.github.com/repos/mjpearson/passport-slack/git/trees{/sha}',
             statuses_url: 'https://api.github.com/repos/mjpearson/passport-slack/statuses/{sha}',
             languages_url: 'https://api.github.com/repos/mjpearson/passport-slack/languages',
             stargazers_url: 'https://api.github.com/repos/mjpearson/passport-slack/stargazers',
             contributors_url: 'https://api.github.com/repos/mjpearson/passport-slack/contributors',
             subscribers_url: 'https://api.github.com/repos/mjpearson/passport-slack/subscribers',
             subscription_url: 'https://api.github.com/repos/mjpearson/passport-slack/subscription',
             commits_url: 'https://api.github.com/repos/mjpearson/passport-slack/commits{/sha}',
             git_commits_url: 'https://api.github.com/repos/mjpearson/passport-slack/git/commits{/sha}',
             comments_url: 'https://api.github.com/repos/mjpearson/passport-slack/comments{/number}',
             issue_comment_url: 'https://api.github.com/repos/mjpearson/passport-slack/issues/comments{/number}',
             contents_url: 'https://api.github.com/repos/mjpearson/passport-slack/contents/{+path}',
             compare_url: 'https://api.github.com/repos/mjpearson/passport-slack/compare/{base}...{head}',
             merges_url: 'https://api.github.com/repos/mjpearson/passport-slack/merges',
             archive_url: 'https://api.github.com/repos/mjpearson/passport-slack/{archive_format}{/ref}',
             downloads_url: 'https://api.github.com/repos/mjpearson/passport-slack/downloads',
             issues_url: 'https://api.github.com/repos/mjpearson/passport-slack/issues{/number}',
             pulls_url: 'https://api.github.com/repos/mjpearson/passport-slack/pulls{/number}',
             milestones_url: 'https://api.github.com/repos/mjpearson/passport-slack/milestones{/number}',
             notifications_url: 'https://api.github.com/repos/mjpearson/passport-slack/notifications{?since,all,participating}',
             labels_url: 'https://api.github.com/repos/mjpearson/passport-slack/labels{/name}',
             releases_url: 'https://api.github.com/repos/mjpearson/passport-slack/releases{/id}',
             deployments_url: 'https://api.github.com/repos/mjpearson/passport-slack/deployments',
             created_at: '2014-05-27T23:35:07Z',
             updated_at: '2017-11-10T03:37:09Z',
             pushed_at: '2017-07-20T20:27:19Z',
             git_url: 'git://github.com/mjpearson/passport-slack.git',
             ssh_url: 'git@github.com:mjpearson/passport-slack.git',
             clone_url: 'https://github.com/mjpearson/passport-slack.git',
             svn_url: 'https://github.com/mjpearson/passport-slack',
             homepage: null,
             size: 28,
             stargazers_count: 81,
             watchers_count: 81,
             language: 'JavaScript',
             has_issues: true,
             has_projects: true,
             has_downloads: true,
             has_wiki: true,
             has_pages: false,
             forks_count: 41,
             mirror_url: null,
             archived: false,
             open_issues_count: 12,
             forks: 41,
             open_issues: 12,
             watchers: 81,
             default_branch: 'master',
             permissions: { admin: false, push: false, pull: true },
             license: 
              { key: 'mit',
                name: 'MIT License',
                spdx_id: 'MIT',
                url: 'https://api.github.com/licenses/mit',
                featured: true },
             network_count: 41,
             subscribers_count: 6 },
          meta: 
           { 'x-ratelimit-limit': '5000',
             'x-ratelimit-remaining': '4981',
             'x-ratelimit-reset': '1511820082',
             'x-oauth-scopes': 'public_repo',
             'x-github-request-id': 'E190:29D17:FE5923:147FC80:5A1C8A9F',
             'x-github-media-type': 'github.drax-preview; format=json',
             'last-modified': 'Fri, 10 Nov 2017 03:37:09 GMT',
             etag: '"a503cef086ec081350db4ac33e7a6f99"',
             status: '200 OK' }
        })
      } };
    }
    
    
    var repo;
    before(function(done) {
      var github = $require('../../lib/scm/github', { 'github': GitHubApiStub });
      
      github.get({ project: 'passport-slack', user: 'mjpearson' }, function(err, r) {
        if (err) { return done(err); }
        repo = r;
        done();
      });
    });
    
    it('should initialize GitHub API', function() {
      expect(api._opts).to.deep.equal({});
    });
    
    it('should get repository', function() {
      expect(api._getopts).to.deep.equal({ repo: 'passport-slack', owner: 'mjpearson' });
      
      expect(repo.type).to.equal('git');
      expect(repo.url).to.equal('git://github.com/mjpearson/passport-slack.git');
      expect(repo.homepage).to.equal('https://github.com/mjpearson/passport-slack');
      expect(repo.favoriteCount).to.equal(81);
      expect(repo.subscriberCount).to.equal(6);
      expect(repo.forkCount).to.equal(41);
      expect(repo.createdAt).to.deep.equal(new Date(Date.parse('2014-05-27T23:35:07.000Z')));
      expect(repo.modifiedAt).to.deep.equal(new Date(Date.parse('2017-07-20T20:27:19.000Z')));
    });
  }); // get repository
  
  describe('get repository that is not found', function() {
    var api;
    
    function GitHubApiStub(opts) {
      api = this;
      this._opts = opts;
      this.repos = { get: function(opts, cb) {
        api._getopts = opts;
        
        return cb({
          message: '{"message":"Not Found","documentation_url":"https://developer.github.com/v3"}',
          code: 404,
          status: 'Not Found',
          headers: 
           { date: 'Mon, 27 Nov 2017 22:23:59 GMT',
             'content-type': 'application/json; charset=utf-8',
             'content-length': '77',
             connection: 'close',
             server: 'GitHub.com',
             status: '404 Not Found',
             'x-ratelimit-limit': '5000',
             'x-ratelimit-remaining': '4998',
             'x-ratelimit-reset': '1511824994',
             'x-oauth-scopes': 'public_repo',
             'x-accepted-oauth-scopes': 'repo',
             'x-github-media-type': 'github.drax-preview; format=json',
             'access-control-expose-headers': 'ETag, Link, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
             'access-control-allow-origin': '*',
             'content-security-policy': 'default-src \'none\'',
             'strict-transport-security': 'max-age=31536000; includeSubdomains; preload',
             'x-content-type-options': 'nosniff',
             'x-frame-options': 'deny',
             'x-xss-protection': '1; mode=block',
             'x-runtime-rack': '0.031205',
             'x-github-request-id': 'E227:13A17:3E4F:4FD3:5A1C907F' }
        })
      } };
    }
    
    
    var repo;
    before(function(done) {
      var github = $require('../../lib/scm/github', { 'github': GitHubApiStub });
      
      github.get({ project: 'passport-notfound', user: 'johndoe' }, function(err, r) {
        if (err) { return done(err); }
        repo = r;
        done();
      });
    });
    
    it('should initialize GitHub API', function() {
      expect(api._opts).to.deep.equal({});
    });
    
    it('should get repository', function() {
      expect(api._getopts).to.deep.equal({ repo: 'passport-notfound', owner: 'johndoe' });
      
      expect(repo).to.equal(undefined)
    });
  }); // get repository that is not found
  
});

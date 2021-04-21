exports = module.exports = function(packageRegistry, project) {
  var moment = require('moment')
    , npmUser = require('npm-user')
    , LICENSES = require('spdx-license-list');
  
  
  function initialize(page, next) {
    page._internals = {};
    
    page.meta = {
      package: true
    }
    next();
  }
  
  function fetchPackage(page, next) {
    packageRegistry.read(page.params.name, function(err, pkg) {
      //page.locals._id = page.params.name;
      if (pkg.unpublished || pkg.ignore) { return page.skip(); }

      page._internals.package = pkg;
      page.locals.name = pkg.name;
      page.locals.description = pkg.description;
      page.locals.keywords = pkg.keywords;
      if (pkg['dist-tags']) {
        page.locals.version = pkg['dist-tags']['latest'];
      }
      page.locals.homepage = pkg.homepage;
      page.locals.repository = pkg.repository;
      page.locals.bugs = pkg.bugs;
      if (pkg.license) {
        page.locals.license = pkg.license;
        var license = LICENSES[pkg.license.type];
        if (license) {
          page.locals.license.name = license.name;
          page.locals.license.url = license.url;
        }
      }
      if (pkg.downloads) {
        page.locals.downloads = pkg.downloads;
      }
      if (pkg.flags) {
        page.locals.flags = pkg.flags;
      }
      
      page.locals.createdAt = pkg.ctime;
      page.locals.modifiedAt = pkg.mtime;
      page.locals.publishedAt = pkg.ptime;
      // TODO: Move this to a locals, so it can be invoked in the view
      page.locals.modifiedTimeAgo = moment(page.locals.modifiedAt).fromNow();

      next();
    });
  }
  
  function loadUserMetadata(page, next) {
    var pkg = page._internals.package
      , user;
    
    user = pkg.versions[page.locals.version]._npmUser
    
    // passport-23andme
    if (!user) { return next(); }
    
    //console.log(require('util').inspect(user, false, null))
      
    //console.log(require('util').inspect(page.locals.license, false, null))
    
    npmUser(user.name)
      .then(function(profile) {
        //console.log(require('util').inspect(profile, false, null))
        
        page.locals.author = {
          username: user.name,
          displayName: profile.name,
          photo: profile.avatar,
          url: 'https://www.npmjs.com/~' + user.name,
          accounts: []
        };
        
        if (profile.twitter) {
          page.locals.author.accounts.push({ domain: 'twitter.com', username: profile.twitter });
        }
        if (profile.github) {
          page.locals.author.accounts.push({ domain: 'github.com', username: profile.github });
        }
        
        
        // FIXME:
        page.locals.author.photo += '&size=100'
        
      })
      .then(next, next);
    
    
    //console.log(require('util').inspect(pkg, false, null))
  }
  
  function loadRepositoryMetadata(page, next) {
    var repo = page.locals.repository
    if (!repo) { return next(); }
    
    project.info(repo.url, { protocol: repo.type }, function(err, proj) {
      //if (err) { return next(err); }
      if (err) {
        // TODO: Handle unsupported location error correctly
        //Unsupported to locate adapter for: git@git.sankuai.com/~wangshijun/passport-meituan.git
        return next();
      }
      if (!proj) { return next(); }
      
      // TODO: set favorite counts and the like as locals
      
      page.locals.count = {};
      page.locals.count.favorites = proj.favoriteCount;
      page.locals.count.subscribers = proj.subscriberCount;
      page.locals.count.forks = proj.forkCount;
      next();
    });
  }
  
  function renderReadMe(page, next) {
    var pkg = page._internals.package
      , readme = pkg.readme;
    if (!readme && page.locals.version) {
      // sometimes npm doesn't set the root level readme property
      readme = pkg.versions[page.locals.version].readme
    }
      
      
    if (!readme) {
      page.locals.readme = '<p>Sadly, this package has no README.</p>'
      return next();
    }
    
    var site = page.app
      , engines = [ 'md' ];
    
    (function iter(i, err) {
      if (err) { console.log(err); return cb(err); }
      
      var engine = engines[i];
      if (!engine) { return next(); } // done
      
      site.render(readme, { engine: engine }, function(err, html) {
        if (err) { return iter(i + 1, err); }
        
        page.locals.readme = html;
        next();
      }, false);
    })(0);
  }
  
  function render(page, next) {
    page.locals.title = page.locals.name;
    page.render('package');
  }
  
  function errorHandler(err, page, next) {
    console.log(err);
    return next(err);
  }
  
  
  return [
    //kerouac.manifest(),
    //kerouac.canonicalURL(),
    initialize,
    fetchPackage,
    //loadUserMetadata,
    loadRepositoryMetadata,
    renderReadMe,
    render,
    errorHandler
  ];
};

exports['@require'] = [
  'http://schemas.modulate.io/js/comp/lang/javascript/PackageRegistry',
  'http://schemas.modulate.io/js/developer/project'
];

/**
 * Package page handler.
 *
 * This component provides a handler that generates an HTML page with package
 * information.  This page is suitable for viewing by a person using a web
 * browser.
 *
 * @returns {Function[]}
 */
exports = module.exports = function(registry, forge) {
  var npmUser = require('npm-user')
    , LICENSES = require('spdx-license-list');
  
  
  function initialize(page, next) {
    page._internals = {};
    next();
  }
  
  function fetchPackage(page, next) {
    console.log(page.params.name)
    
    registry.read(page.params.name, function(err, pkg) {
      if (err) { return next(err); }
      
      //page.locals._id = page.params.name;
      if (pkg.unpublished || pkg.ignore) { return page.skip(); }

      page._internals.package = pkg;
      page.locals.name = pkg.name;
      if (pkg['dist-tags']) {
        page.locals.version = pkg['dist-tags']['latest'];
      }
      page.locals.description = pkg.description;
      page.locals.keywords = pkg.keywords;
      page.locals.homepage = pkg.homepage;
      if (pkg.repositories) {
        page.locals.repository = pkg.repositories[0];
      }
      page.locals.bugs = pkg.bugs;
      if (pkg.licenses) {
        page.locals.license = pkg.licenses[0];
        var license = LICENSES[page.locals.license.type];
        if (license) {
          page.locals.license.name = license.name;
          page.locals.license.url = license.url;
        }
      }
      if (pkg.downloadCounts) {
        page.locals.downloads = pkg.downloadCounts;
      }
      if (pkg.flags) {
        page.locals.flags = pkg.flags;
      }
      
      page.locals.createdAt = pkg.ctime;
      page.locals.modifiedAt = pkg.mtime;
      page.locals.publishedAt = pkg.ptime;

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
  
  function fetchForgeInfo(page, next) {
    var repo = page.locals.repository
    if (!repo) { return next(); }
    
    forge.info(repo.url, { protocol: repo.type }, function(err, proj) {
      if (err && err.type == 'HostNotSupportedError') {
        return next();
      } else if (err) { return next(err); }
      
      if (!proj) { return next(); }
      
      // TODO: set favorite counts and the like as locals
      
      if (proj.homepage) { page.locals.repository.url = proj.homepage; }
      
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
      if (err) { return cb(err); }
      
      var engine = engines[i];
      if (!engine) { return next(); } // done
      
      site.convert(readme, engine, function(err, html) {
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
    fetchForgeInfo,
    renderReadMe,
    render,
    errorHandler
  ];
};

exports['@require'] = [
  'http://schemas.modulate.io/js/comp/lang/javascript/PackageRegistry',
  'http://schemas.modulate.io/js/developer/project'
];

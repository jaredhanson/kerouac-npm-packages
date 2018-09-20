var kerouac = require('kerouac')
  , path = require('path')
  , fs = require('fs')
  , moment = require('moment')
  , YAML = require('js-yaml')
  , PackageMeta = require('package-json')
  , npmUser = require('npm-user')
  , npmDownloads = require('pkg-downloads')
  , SCM = require('../scm')
  , LICENSES = require('spdx-license-list');


exports = module.exports = function(packageRegistry) {
  var dir = 'data/packages';
  
  
  function initialize(page, next) {
    page._internals = {};
    next();
  }
  
  function fetchPackage(page, next) {
    packageRegistry.read(page.params.name, function(err, pkg) {
      //page.locals._id = page.params.name;
      if (pkg.unpublished || pkg.ignore) { return page.skip(); }

      page._internals.package = pkg;
      page.locals.name = pkg.name;
      page.locals.description = pkg.description;
      if (pkg['dist-tags']) {
        page.locals.version = pkg['dist-tags']['latest'];
      }
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
      
      page.locals.createdAt = pkg.ctime;
      page.locals.modifiedAt = pkg.mtime;
      page.locals.modifiedTimeAgo = moment(page.locals.modifiedAt).fromNow();

      next();
    });
  }
  
  function loadDataRecord(page, next) {
    var file = path.resolve(dir, page.params.name + '.yaml');
    
    fs.readFile(file, 'utf8', function(err, data) {
      if (err) { return next(err); }
      
      var record = YAML.safeLoad(data);
      page._internals.record = record;
      page.locals._id = page.params.name;
      
      if (record.unpublished || record.ignore) { return page.skip(); }
      next();
    });
  }
  
  function loadMetadataFromNPM(page, next) {
    var rec = page._internals.record;
    
    PackageMeta(rec.name, { fullMetadata: true, allVersions: true })
      .then(function(pkg) {
        page._internals.package = pkg;
        
        page.locals.name = pkg.name;
        page.locals.description = pkg.description;
        page.locals.keywords = pkg.keywords;
        page.locals.homepage = pkg.homepage;
        if (pkg['dist-tags']) {
          page.locals.version = pkg['dist-tags']['latest'];
        }
        page.locals.license = { type: pkg.license };
        var license = LICENSES[pkg.license];
        if (license) {
          page.locals.license.name = license.name;
          page.locals.license.url = license.url;
        }
        page.locals.createdAt = new Date(Date.parse(pkg.time.created));
        page.locals.modifiedAt = new Date(Date.parse(pkg.time.modified));
        page.locals.modifiedTimeAgo = moment(page.locals.modifiedAt).fromNow();
      })
      .then(next, next);
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
  
  // https://github.com/npm/registry/blob/master/docs/download-counts.md
  // http://blog.npmjs.org/post/92574016600/numeric-precision-matters-how-npm-download-counts
  
  // http://blog.npmjs.org/post/78719826768/download-counts-are-back
  // https://github.com/npm/download-counts
  function loadNPMDownloadCounts(page, next) {
    var pkg = page._internals.package
    
    Promise.all([
        npmDownloads(pkg.name, { period: 'day' }),
        npmDownloads(pkg.name, { period: 'week' }),
        npmDownloads(pkg.name, { period: 'month' })
      ])
      .then(function(counts) {
        page.locals.downloads = {
          'last-day': counts[0],
          'last-week': counts[1],
          'last-month': counts[2]
        };
      })
      .then(next, next);
  }
  
  function loadRepositoryMetadata(page, next) {
    var rec = page._internals.record
      , pkg = page._internals.package
      , repository = pkg.repository;
    if (!repository) {
      return next();
      //if (!rec.repository) {
      //  return next();
      //}
      //repository = { url: rec.repository };
    }
    
    SCM.get(repository.url, function(err, repo) {
      if (err) {
        console.log(err);
        return next(err);
      }
      
      if (!repo) {
        page.locals.repository = pkg.repository;
        return next();
      }
      page.locals.repository = repo;
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
    
    var site = page.site
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
    page.package = true;
    
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
    //loadDataRecord,
    //loadMetadataFromNPM,
    //loadUserMetadata,
    //loadNPMDownloadCounts,
    //loadRepositoryMetadata,
    renderReadMe,
    render,
    errorHandler
  ];
};

exports['@require'] = [
  'http://io.modulate.com/comp/lang/javascript/PackageRegistry'
];

var kerouac = require('kerouac')
  , path = require('path')
  , fs = require('fs')
  , YAML = require('js-yaml')
  , PackageMeta = require('package-json')
  , npmUser = require('npm-user')
  , SCM = require('../scm');


exports = module.exports = function(dir) {
  
  function initialize(page, next) {
    page._internals = {};
    next();
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
        page.locals.license = pkg.license;
        page.locals.createdAt = new Date(Date.parse(pkg.time.created));
        page.locals.modifiedAt = new Date(Date.parse(pkg.time.modified));
      })
      .then(next, next);
  }
  
  function loadUserMetadata(page, next) {
    var pkg = page._internals.package
      , user;
    
    user = pkg.versions[page.locals.version]._npmUser
    
    console.log(require('util').inspect(user, false, null))
    
    npmUser(user.name)
      .then(function(profile) {
        console.log(require('util').inspect(profile, false, null))
        
        page.locals.author = {
          username: user.name,
          displayName: profile.name,
          photo: profile.avatar,
          url: 'https://www.npmjs.com/~' + user.name
        };
        
        // FIXME:
        page.locals.author.photo += '&size=100'
        
      })
      .then(next, next);
    
    
    //console.log(require('util').inspect(pkg, false, null))
  }
  
  function loadRepositoryMetadata(page, next) {
    var rec = page._internals.record
      , pkg = page._internals.package
      , repository = pkg.repository;
    if (!repository) {
      if (!rec.repository) {
        return next();
      }
      repository = { url: rec.repository };
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
    if (!readme) { return next(); }
    
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
  
  function meta(page, next) {
    page.package = true;
    next();
  }
  
  function render(page, next) {
    page.render('package');
  }
  
  
  return [
    kerouac.manifest(),
    kerouac.canonicalURL(),
    initialize,
    loadDataRecord,
    loadMetadataFromNPM,
    loadUserMetadata,
    loadRepositoryMetadata,
    renderReadMe,
    meta,
    render
  ];
};

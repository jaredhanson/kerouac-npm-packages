var kerouac = require('kerouac')
  , path = require('path')
  , fs = require('fs')
  , YAML = require('js-yaml')
  , PackageMeta = require('package-json')
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
      
      if (record.ignore) { return next('route'); }
      next();
    });
  }
  
  function loadMetadataFromNPM(page, next) {
    var record = page._internals.record;
    
    PackageMeta(record.name, { fullMetadata: true, allVersions: true })
      .then(function(pkg) {
        //console.log(pkg);
        
        
        //console.log(require('util').inspect(pkg, false, null))
        //return;
        
        page._internals.package = pkg;
        
        //console.log(pkg);
        
        page.locals.name = pkg.name;
        page.locals.description = pkg.description;
        page.locals.keywords = pkg.keywords;
        page.locals.homepage = pkg.homepage;
        page.locals.version = pkg['dist-tags']['latest'];
        page.locals.license = pkg.license;
        page.locals.createdAt = new Date(Date.parse(pkg.time.created));
        page.locals.modifiedAt = new Date(Date.parse(pkg.time.modified));
      })
      .then(next, next);
  }
  
  function loadRepositoryMetadata(page, next) {
    var pkg = page._internals.package
      , repository = pkg.repository;
    
    SCM.get(repository.url, function(err, repo) {
      if (err) {
        console.log(err);
        return next(err);
      }
      
      console.log(repo);
      
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
    loadRepositoryMetadata,
    renderReadMe,
    meta,
    render
  ];
};

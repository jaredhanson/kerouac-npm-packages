var kerouac = require('kerouac')
  , path = require('path')
  , fs = require('fs')
  , YAML = require('js-yaml')
  , PackageMeta = require('package-json')
  , HostedGitInfo = require('hosted-git-info')
  , SCM = require('../scm/github');


// https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md

exports = module.exports = function(dir) {
  
  function initialize(page, next) {
    page._internals = {};
    next();
  }
  
  function loadLocalMetadata(page, next) {
    var file = path.resolve(dir, page.params.name + '.yaml');
    
    fs.readFile(file, 'utf8', function(err, text) {
      if (err) { return next(err); }
      
      var data = YAML.safeLoad(text);
      page._internals.data = data;
      
      page.locals._id = page.params.name;
      
      if (data.ignore) { return next('route'); }
      next();
    });
  }
  
  function loadNPMMetadata(page, next) {
    var data = page._internals.data;
    
    PackageMeta(data.name, { fullMetadata: true, allVersions: true })
      .then(function(pkg) {
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
    var pkg = page._internals.package;
    
    var repo = pkg.repository;
    var info = HostedGitInfo.fromUrl(repo.url);
    console.log(info);
    
    SCM.get({ name: info.project, owner: info.user }, function(err, repo) {
      if (err) {
        console.log(err);
        return next(err);
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
  
  
  function render(page, next) {
    page.package = true;
    
    page.render('package');
  
    //page.end('TODO: show package ' + page.params.name)
  }
  
  
  return [
    initialize,
    loadLocalMetadata,
    loadNPMMetadata,
    loadRepositoryMetadata,
    renderReadMe,
    kerouac.canonicalURL(),
    kerouac.manifest(),
    render
  ];
};

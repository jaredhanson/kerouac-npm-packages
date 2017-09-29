var PackageMeta = require('package-json');


// https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md

exports = module.exports = function() {
  
  function initialize(page, next) {
    page._internals = {};
    next();
  }
  
  function loadMetadata(page, next) {
    console.log('LOAD META! - ' + page.params.name);
    
    PackageMeta(page.params.name, { fullMetadata: true, allVersions: true })
      .then(function(pkg) {
        //console.log(pkg);
        page._internals.pkg = pkg;
        
        page.locals.name = pkg.name;
        page.locals.description = pkg.description;
      })
      .then(next, next);
  }
  
  function renderReadMe(page, next) {
    var pkg = page._internals.pkg
      , readme = pkg.readme;
    if (!readme) { return next(); }
    
    var site = page.site
      , engines = [ 'md' ];
    
    (function iter(i, err) {
      if (err) { return cb(err); }
      
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
    console.log('$$ PKG');
    page.render('package');
  
    //page.end('TODO: show package ' + page.params.name)
  }
  
  
  return [
    initialize,
    loadMetadata,
    renderReadMe,
    render
  ];
};

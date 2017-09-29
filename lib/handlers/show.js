var PackageMeta = require('package-json');


// https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md

exports = module.exports = function() {
  
  function loadMetadata(page, next) {
    console.log('LOAD META! - ' + page.params.name);
    
    PackageMeta(page.params.name, { fullMetadata: true })
      .then(function(pkg) {
        page.locals.name = pkg.name;
      })
      .then(next, next);
  }
  
  function render(page, next) {
    console.log('$$ PKG');
    page.render('package');
  
    //page.end('TODO: show package ' + page.params.name)
  }
  
  
  return [
    loadMetadata,
    render
  ];
};



exports = module.exports = function() {
  
  function initialize(page, next) {
    page._internals = {};
    next();
  }
  
  function getPackages(page, next) {
    var packages = page.site.pages.filter(function(p) {
      return p.package == true;
    });
    
    page._internals.packages = packages;
    next();
  }
  
  function formatPackages(page, next) {
    var packages = page._internals.packages;
    var data = packages.map(function(p) {
      var json = {};
      json.name = p.locals.name;
      json.description = p.locals.description;
      
      return json;
    });
    
    page.locals.data = data;
    next();
  }
  
  function render(page, next) {
    //console.log('RENDER ALL!');
    //console.log(page);
    
    var json = {};
    json.data = page.locals.data;
    
    page.write(JSON.stringify(json, null, 2));
    page.end();
  }
  
  
  return [
    initialize,
    getPackages,
    formatPackages,
    render
  ];
};

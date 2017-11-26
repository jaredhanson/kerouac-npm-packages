

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
      json._id = p.locals._id;
      json.name = p.locals.name;
      json.description = p.locals.description;
      json.keywords = p.locals.keywords;
      json.version = p.locals.version;
      if (p.locals.repository) {
        json.repository = {};
        json.repository.url = p.locals.repository.url;
        console.log(p.locals.repository)
        
        
        json.repository.favoriteCount = p.locals.repository.favoriteCount;
        json.repository.subscriberCount = p.locals.repository.subscriberCount;
        json.repository.forkCount = p.locals.repository.forkCount;
        json.repository.created = p.locals.repository.createdAt.toISOString();
        json.repository.modified = p.locals.repository.modifiedAt.toISOString();
      }
      json.license = p.locals.license;
      json.created = p.locals.createdAt.toISOString();
      json.modified = p.locals.modifiedAt.toISOString();
      
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

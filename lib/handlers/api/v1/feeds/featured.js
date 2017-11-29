var fs = require('fs')
  , uri = require('url')
  , YAML = require('js-yaml');


exports = module.exports = function(file) {
  
  function initialize(page, next) {
    page._internals = {};
    next();
  }
  
  function load(page, next) {
    fs.readFile(file, 'utf8', function(err, data) {
      if (err) { return next(err); }
      
      var entries = YAML.safeLoad(data);
      page._internals.entries = entries;
      next();
    });
  }
  
  function select(page, next) {
    var entries = page._internals.entries
      , pages = page.site.pages
      , packages = []
      , entry, pf, i, len;
    
    for (i = 0, len = entries.length; i < len; ++i) {
      entry = entries[i];
      pf = pages.find(function(p) {
        return p.locals.name == entry.name;
      });
      if (pf) { packages.push(pf); }
    }
    
    page._internals.packages = packages;
    next();
  }
  
  function filter(page, next) {
    var entries = page._internals.entries
      , packages = page._internals.packages;
    
    var objects = packages.map(function(p, i) {
      var json = {};
      json._id = p.locals._id;
      json.name = p.locals.name;
      json.description = p.locals.description;
      json.keywords = p.locals.keywords;
      if (p.locals.version) {
        json['dist-tags'] = { latest: p.locals.version };
      }
      json.homepage = p.locals.homepage;
      if (p.locals.repository) {
        if (!json.homepage) { json.homepage = p.locals.repository.homepage; }
        json.repository = {};
        json.repository.type = p.locals.repository.type;
        json.repository.url = p.locals.repository.url;
        json.repository.favoriteCount = p.locals.repository.favoriteCount;
        json.repository.subscriberCount = p.locals.repository.subscriberCount;
        json.repository.forkCount = p.locals.repository.forkCount;
        if (p.locals.repository.createdAt) { json.repository.created = p.locals.repository.createdAt.toISOString(); }
        if (p.locals.repository.modifiedAt) { json.repository.modified = p.locals.repository.modifiedAt.toISOString(); }
      }
      json.license = p.locals.license;
      json.time = {
        created: p.locals.createdAt.toISOString(),
        modified: p.locals.modifiedAt.toISOString()
      }
      
      if (entries[i].promoted) {
        json._promoted = true;
      }
      
      return json;
    });
    
    page.locals.objects = objects;
    page.locals.total = packages.length;
    next();
  }
  
  function render(page, next) {
    var json = {};
    json.objects = page.locals.objects;
    json.total = page.locals.total;
    json.urls = page.locals.urls;
    
    page.write(JSON.stringify(json, null, 2));
    page.end();
  }
  
  
  return [
    initialize,
    load,
    select,
    filter,
    render
  ];
}

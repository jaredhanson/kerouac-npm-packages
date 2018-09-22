exports = module.exports = function() {
  var uri = require('url');

  
  function select(page, next) {
    var packages = page.site.pages.filter(function(p) {
      return (p.meta && p.meta.package == true)
        && (p.locals.flags && (p.locals.flags.featured || p.locals.flags.sponsored));
    });
    
    
    var objects = packages.map(function(p) {
      var json = {};
      json.package = {};
      json.package.name = p.locals.name;
      json.package.version = p.locals.version;
      json.package.description = p.locals.description;
      json.package.keywords = p.locals.keywords;
      if (p.locals.publishedAt) {
        json.package.date = p.locals.publishedAt.toISOString();
      }
      json.package.links = {};
      json.package.links.npm = 'https://www.npmjs.com/package/' + encodeURIComponent(p.locals.name);
      json.package.links.homepage = p.locals.homepage;
      if (p.locals.repository) {
        json.package.links.repository = p.locals.repository.url;
      }
      if (p.locals.bugs) {
        json.package.links.bugs = p.locals.bugs.url;
      }
      if (p.locals.flags) {
        json.flags = p.locals.flags;
      }
      if (p.locals.count) {
        json.count = {
          favorites: p.locals.count.favorites,
          subscribers: p.locals.count.subscribers,
          forks: p.locals.count.forks
        }
      }
      if (p.locals.downloads) {
        json.downloads = {
          'last-day': p.locals.downloads['last-day'],
          'last-week': p.locals.downloads['last-week'],
          'last-month': p.locals.downloads['last-month']
        }
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
    select,
    render
  ];
}

exports['@require'] = [];

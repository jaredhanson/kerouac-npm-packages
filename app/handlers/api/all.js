/**
 * API: List all packages.
 *
 * [Deprecating the /-/all registry endpoint](http://blog.npmjs.org/post/157615772423/deprecating-the-all-registry-endpoint)
 *
 *  https://registry.npmjs.org/-/all
 *
 *  2012/08/24 - https://web.archive.org/web/20120824150709/https://registry.npmjs.org/-/all
 *  2015/05/15 - https://web.archive.org/web/20150515053712/https://registry.npmjs.org/-/all
 *
 *  2018/02/18 - https://web.archive.org/web/20180218131402/https://registry.npmjs.org/-/all
 */


exports = module.exports = function() {
  var uri = require('url');
  
  
  function render(page, next) {
    var packages = page.site.pages.filter(function(p) {
      return (p.meta && p.meta.package == true);
    });
    
    
    var json = {};
    
    packages.forEach(function(p) {
      var obj = {};
      obj.name = p.locals.name;
      obj.description = p.locals.description;
      obj.keywords = p.locals.keywords;
      obj['dist-tags'] = { latest: p.locals.version };
      obj.versions = {};
      obj.versions[p.locals.version] = 'latest';
      if (p.locals.publishedAt) {
        obj.time = { modified: p.locals.publishedAt.toISOString() };
      }
      
      if (p.locals.flags) {
        obj._flags = p.locals.flags;
      }
      if (p.locals.count) {
        obj._count = p.locals.count;
      }
      if (p.locals.downloads) {
        obj._downloads = p.locals.downloads;
      }
      
      json[p.locals.name] = obj;
    });
    
    page.write(JSON.stringify(json, null, 2));
    page.end();
  }
  
  
  return [
    render
  ];
};

exports['@require'] = [];

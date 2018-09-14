var kerouac = require('kerouac')
  , fs = require('fs')
  , path = require('path');


exports = module.exports = function(dir, options) {
  dir = dir || 'data/packages';
  options = options || {};
  
  var limit = options.limit || 25
    , featured = path.join(dir, '_feeds', 'featured.yaml');
  
  
  var site = kerouac();
  
  site.on('mount', function onmount(parent) {
    // inherit settings
    this.set('layout engine', parent.get('layout engine'));
    
    this.locals.pretty = parent.locals.pretty;
  });
  
  
  //site.page('/all.html', require('./handlers/list')());
  
  site.page('/:name.html', require('./handlers/show')(dir));
  
  site.page('/-/v1/all.json', require('./handlers/api/v1/all')(limit));
  site.page('/-/v1/all/:page.json', require('./handlers/api/v1/all')(limit));
  if (fs.existsSync(featured)) {
    site.page('/-/v1/feeds/featured.json', require('./handlers/api/v1/feeds/featured')(featured));
  }
  
  site.page('/sitemap.xml', require('kerouac-sitemap')());
  
  site.bind(function(done) {
    var self = this;
    
    fs.readdir(dir, function(err, files) {
      if (err && err.code == 'ENOENT') {
        return done();
      } else if (err) { return done(err); }
      
      
      //files = [ 'passport-facebook.yaml', 'passport-http-bearer.yaml' ];
      //console.log(files)
      
      
      var idx = 0, count = 0
        , file, name, ext;
      
      (function iter(err) {
        if (err) {
          return done(err);
        }
        
        file = files[idx++];
        if (!file) {
          var pages = Math.ceil(count / limit)
            , i;
          for (i = 1; i < pages; i++) {
            self.add('/-/v1/all/' + (i + 1) + '.json'); // add 1 for 1-based indexing
          }
          return done();
        }
        
        ext = path.extname(file);
        name = path.basename(file, ext);
        
        if (ext !== '.yaml') { return iter(); }
        
        self.add('/' + name + '.html');
        count++;
        iter();
      })();
    });
  })
  
  return site;
};

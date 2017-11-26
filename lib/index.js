var kerouac = require('kerouac')
  , fs = require('fs')
  , path = require('path');


exports = module.exports = function(dir) {
  dir = dir || 'data/packages';
  
  
  var site = kerouac();
  
  site.on('mount', function onmount(parent) {
    // inherit settings
    this.set('layout engine', parent.get('layout engine'));
    
    this.locals.pretty = parent.locals.pretty;
  });
  
  
  //site.page('/all.html', require('./handlers/list')());
  
  site.page('/:name.html', require('./handlers/show')(dir));
  site.page('/-/v1/all.json', require('./handlers/api/v1/all')());
  
  site.page('/sitemap.xml', require('kerouac-sitemap')());
  
  site.bind(function(done) {
    var self = this;
    
    fs.readdir(dir, function(err, files) {
      if (err && err.code == 'ENOENT') {
        return done();
      } else if (err) { return done(err); }
      
      //files = files.slice(0, 20);
      //files = files.slice(0, 2);
      files = [ 'passport-facebook.yaml' ]
      
      var idx = 0
        , file, name, ext
      
      (function iter(err) {
        if (err) { return done(err); }
        
        file = files[idx++];
        if (!file) {
          return done();
        }
        
        ext = path.extname(file);
        name = path.basename(file, ext);
        
        if (ext !== '.yaml') { return iter(); }
        
        self.add('/' + name + '.html');
        iter();
      })();
    });
  })
  
  return site;
};

var kerouac = require('kerouac')
  , fs = require('fs')
  , path = require('path');


exports = module.exports = function(showHandler, allHandler, featuredHandler, packageRegistry) {
  var dir = 'data/packages';
  var options = {};
  
  var limit = options.limit || 25
    , featured = path.join(dir, '_feeds', 'featured.yaml');
  
  
  var site = kerouac();
  
  site.on('mount', function onmount(parent) {
    // inherit settings
    this.set('layout engine', parent.get('layout engine'));
    
    this.locals.pretty = parent.locals.pretty;
  });
  
  
  //site.page('/all.html', require('./handlers/list')());
  
  site.page('/:name.html', showHandler);
  
  site.page('/-/v1/all.json', allHandler);
  site.page('/-/v1/all/:page.json', allHandler);
  if (fs.existsSync(featured)) {
    site.page('/-/v1/feeds/featured.json', featuredHandler);
  }
  
  site.page('/sitemap.xml', require('kerouac-sitemap')());
  
  site.bind(function(done) {
    var self = this;
    
    packageRegistry.list(function(err, pkgs) {
      if (err) { return done(err); }
      
      var npages
        , i, len;
      for (i = 0, len = pkgs.length; i < len; ++i) {
        self.add('/' + pkgs[i].name + '.html');
      }
    
      npages = Math.ceil(pkgs.length / limit)
      for (i = 1; i < npages; i++) {
        self.add('/-/v1/all/' + (i + 1) + '.json'); // add 1 for 1-based indexing
      }
    
      done();
    });
  });
  
  return site;
};

exports['@implements'] = [
  'http://i.kerouacjs.org/Site',
  'http://schemas.modulate.io/js/comp/lang/javascript/packages/registry/WWWSite'
];
exports['@require'] = [
  './handlers/show',
  './handlers/api/v1/list',
  './handlers/api/v1/feeds/featured',
  'http://schemas.modulate.io/js/comp/lang/javascript/PackageRegistry'
];

/**
 * Packages site.
 *
 * This component provides a site that allows people to browse and search
 * JavaScript packages.
 */
exports = module.exports = function(showHandler, registry) {
  var kerouac = require('kerouac')
    , fs = require('fs')
    , path = require('path');


  
  //var dir = 'data/packages';
  //var options = {};
  
  //var limit = options.limit || 25
  //  , featured = path.join(dir, '_feeds', 'featured.yaml');
  
  //var site = kerouac();
  var site = new kerouac.Router();
  
  site.page('/:name.html', showHandler);
  
  /*
  site.on('mount', function onmount(parent) {
    // inherit settings
    this.set('layout engine', parent.get('layout engine'));
    
    this.locals.pretty = parent.locals.pretty;
  });
  */
  
  
  //site.page('/all.html', require('./handlers/list')());
  
  // HTML pages
  //site.page('/:name.html', showHandler);
  //site.page('/:name.html', require('./handlers/show')(registry, project));
  
  //site.page('/-/all.json', require('./handlers/api/all')(registry, project));
  
  //site.page('/-/v1/all.json', require('./handlers/api/v1/all')(registry, project));
  //site.page('/-/v1/all/:page.json', require('./handlers/api/v1/all')(registry, project));
  
  /*
  // npm Meta API
  site.page('/-/all.json', api_allHandler);
  
  // npm API v1
  site.page('/-/v1/all.json', api_v1_allHandler);
  */
  //site.page('/-/v1/all/:page.json', api_v1_allHandler);
  //site.page('/-/v1/all/:page.json', require('./handlers/api/v1/all')());
  /*
  site.page('/-/v1/promoted.json', api_v1_promotedHandler);
  
  site.page('/sitemap.xml', require('kerouac-sitemap')());
  */
  
  /*
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
  */
  
  return site;
};

exports['@implements'] = 'http://i.kerouacjs.org/Site';
exports['@require'] = [
  './handlers/show',
  './handlers/api/all',
  './handlers/api/v1/all',
  './handlers/api/v1/promoted',
  'http://schemas.modulate.io/js/comp/lang/javascript/PackageRegistry'
];

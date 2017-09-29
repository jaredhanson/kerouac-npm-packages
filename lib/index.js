var kerouac = require('kerouac');


exports = module.exports = function() {
  
  var site = kerouac();
  site.use(kerouac.prettyURLs());
  
  site.page('/all.html', require('./handlers/list')());
  
  site.page('/:name.html', require('./handlers/show')());
  
  
  site.bind(function(site) {
    site.add('/kerouac-sitemap.html');
    site.add('/kerouac-htaccess.html');
    site.add('/kerouac-robotstxt.html');
  })
  
  return site;
};

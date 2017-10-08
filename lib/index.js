var kerouac = require('kerouac');


exports = module.exports = function() {
  
  var site = kerouac();
  
  site.page('/all.html', require('./handlers/list')());
  
  site.page('/:name.html', require('./handlers/show')());
  
  site.page('/sitemap.xml', require('kerouac-sitemap')());
  
  site.bind(function() {
    this.add('/kerouac-sitemap.html');
    this.add('/kerouac-robotstxt.html');
  })
  
  return site;
};

/**
 * API: List all packages.
 *
 * [Deprecating the /-/all registry endpoint](http://blog.npmjs.org/post/157615772423/deprecating-the-all-registry-endpoint)
 *
 *  https://registry.npmjs.org/-/all
 */


exports = module.exports = function() {
  var uri = require('url');
  
  function render(page, next) {
    var json = {};
    
    page.write(JSON.stringify(json, null, 2));
    page.end();
  }
  
  
  return [
    render
  ];
};

exports['@require'] = [];

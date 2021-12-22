exports = module.exports = function(registry, forge) {
  
  function fetchPackage(page, next) {
    registry.read(page.params.name, function(err, pkg) {
      if (err) { return next(err); }
      page.locals.package = pkg;
      next();
    });
  }
  
  function render(page, next) {
    var pkg = page.locals.package;
    var obj = {};
    
    obj.name = pkg.name;
    obj.description = pkg.description;
    obj.keywords = pkg.keywords;
    
    page.write(JSON.stringify(obj, null, 2));
    page.end();
  }
  
  
  return [
    fetchPackage,
    render
  ];
};

exports['@require'] = [
];

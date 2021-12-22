exports = module.exports = function(registry) {
  
  function fetchPackages(page, next) {
    console.log('DB INFO!');
    
    registry.list(function(err, pkgs) {
      if (err) { return next(err); }
      page.locals.packages = pkgs;
      next();
    });
  }
  
  function render(page, next) {
    //var pkg = page.locals.package;
    var obj = {};
    
    obj.doc_count = 2;
    
    //obj.name = pkg.name;
    //obj.description = pkg.description;
    //obj.keywords = pkg.keywords;
    
    page.write(JSON.stringify(obj, null, 2));
    page.end();
  }
  
  
  return [
    fetchPackages,
    render
  ];
};

exports['@require'] = [
];

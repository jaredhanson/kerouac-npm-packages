exports = module.exports = function(registry) {
  
  function fetchPackages(page, next) {
    registry.list(function(err, pkgs, info) {
      if (err) { return next(err); }
      page.locals.count = info.count;
      next();
    });
  }
  
  function render(page, next) {
    var obj = {};
    obj.db_name = 'registry';
    obj.doc_count = page.locals.count;
    
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

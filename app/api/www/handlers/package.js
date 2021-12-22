/**
 * Get package metadata.
 *
 * This component provides a handler that responds with package metadata in JSON
 * format.  The format of this metadata is intended to be compatible with npm's
 * [/{package}](https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md#getpackage)
 * endpoint and the [package metadata](https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md)
 * it responds with, specifically the full metadata, as content negotiation is
 * not possible with a statically generated site.
 *
 * Additionally, this metadata is broadly compatible with the CommonJS [Packages/Registry](http://wiki.commonjs.org/wiki/Packages/Registry)
 * specification.  Where differences exist, the format generated by this handler
 * attempts to be satisfy either variation.
 */
exports = module.exports = function(registry, forge) {
  
  function fetchPackage(page, next) {
    registry.read(page.params.package, function(err, pkg) {
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

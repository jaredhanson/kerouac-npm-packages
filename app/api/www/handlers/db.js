/**
 * Get database information.
 *
 * This component provides a handler that responds with database information in
 * JSON format.  The format of this metadata is intended to be compatible with
 * npm's [/](https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md#get)
 * endpoint.
 *
 * This endpoint reflects npm's origins as a CouchApp, as it responds with the
 * same [information](https://docs.couchdb.org/en/1.3.0/api/database.html#get-db)
 * expected from [CouchDB](https://couchdb.apache.org).  It also conflicts with
 * npm's claim to be compatible with the CommonJS [Packages/Registry](http://wiki.commonjs.org/wiki/Packages/Registry)
 * specification.  Compatibility would dictate a response conforming with the
 * registry root URL.  Presumably this situation gave rise to the need to
 * introduce the "escaped" `/-/all` endpoint, which serves the same purpose as
 * the registry root URL.
 *
 * Given the unavoidable conflict, this handler favors compatibility with npm's
 * implementation.
 */
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

var fs = require('fs')
  , path = require('path')
  , YAML = require('js-yaml')
  , merge = require('utils-merge')


function LocalCuratedRegistry(registry) {
  this._dir = 'data/packages';
  this._registry = registry;
}

LocalCuratedRegistry.prototype.list = function(cb) {
  var dir = this._dir;
  
  fs.readdir(dir, function(err, files) {
    if (err && err.code == 'ENOENT') {
      return cb();
    } else if (err) { return cb(err); }
    
    var recs = []
      , file, base, ext
      , i, len;
    
    for (i = 0, len = files.length; i < len; ++i) {
      file = files[i];
      ext = path.extname(file);
      base = path.basename(file, ext);
      
      if (ext !== '.yaml') { continue; }
      recs.push({ name: base });
    }
    
    
    //recs = recs.slice(0, 10);
    
    return cb(null, recs);
  });
}

LocalCuratedRegistry.prototype.read = function(name, cb) {
  var self = this
    , dir = this._dir
    , file = path.join(dir, name + '.yaml');
  
  fs.readFile(file, 'utf8', function(err, data) {
    if (err) { return cb(err); }
    
    // NORMALIZE:  if repository = string, turn to object with url property
    
    var rec = YAML.safeLoad(data);
    if (typeof rec.repository == 'string') {
      rec.repository = { url: rec.repository };
    }
    rec.flags = {};
    rec.flags.featured = rec.featured;
    rec.flags.sponsored = rec.sponsored;
    delete rec.featured;
    delete rec.sponsored;
    
    if (rec.ignore) { return cb(null, rec); }
    self._registry.read(rec.name, function(err, rrec) {
      if (err) { return cb(err); }
      merge(rrec, rec);
      return cb(null, rrec);
    });
  });
}


module.exports = LocalCuratedRegistry;

var fs = require('fs')
  , path = require('path')
  , YAML = require('js-yaml')
  , merge = require('utils-merge')


function LocalCuratedRegistry(registry) {
  this._dir = 'data/packages';
  this._registry = registry;
}

LocalCuratedRegistry.prototype.list = function(cb) {
  console.log('LIST PACKAGES!');
  
  var dir = this._dir;
  
  
  fs.readdir(dir, function(err, files) {
    if (err && err.code == 'ENOENT') {
      return cb();
    } else if (err) { return cb(err); }
    
    
    var recs = []
      , file, base, ext
      , i, len;
    
    for (i = 0, len = files.length; i < len; ++i) {
      console.log(files[i])
    
      file = files[i];
      ext = path.extname(file);
      base = path.basename(file, ext);
      
      if (ext !== '.yaml') { continue; }
      recs.push({ name: base });
    }
    
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
    
    rec.repository = {};
    //rec.license = {};
    
    self._registry.read(rec.name, function(err, rrec) {
      if (err) { return cb(err); }
      merge(rrec, rec);
      return cb(null, rrec);
    });
  });
}


module.exports = LocalCuratedRegistry;

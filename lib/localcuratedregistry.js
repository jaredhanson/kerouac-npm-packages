var fs = require('fs')
  , path = require('path');


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
      recs.push({ id: base });
    }
    
    return cb(null, recs);
  });
}


module.exports = LocalCuratedRegistry;

var fs = require('fs')
  , path = require('path')
  , YAML = require('js-yaml')
  , merge = require('utils-merge')
  , AsyncCache = require('async-cache');


function LocalCuratedRegistry(registry) {
  var self = this;
  
  this._dir = 'data/packages';
  this._registry = registry;
  
  this._list = new AsyncCache({
    load: function(key, cb) {
      /*
      var recs = [
        //- non-github repo
        //- git@git.sankuai.com/~wangshijun/passport-meituan.git
        //{ name: 'passport-anyexercise' }
        //- github 404
        //{ name: 'passport-allplayers' },
        //{ name: 'passport-anonymous' },
        { name: 'passport-facebook' }
        //{ name: 'passport-openid' }
        //{ name: 'passport-adobe-oauth2' }
      ];
      return cb(null, recs);
      */
      
      fs.readdir(self._dir, function(err, files) {
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
          
          // TODO: Test if file, and not directory?
      
          if (ext !== '.yaml') { continue; }
          recs.push({ name: base });
        }
    
        // TODO: Remove this
        //recs = recs.slice(0, 30);
    
        return cb(null, recs);
      });
      
      
    }
  });
}

LocalCuratedRegistry.prototype.list = function(options, cb) {
  if (typeof options == 'function') {
    cb = options;
    options = undefined;
  }
  options = options || {};
  
  this._list.get('__list__', function(err, recs) {
    if (err) { return cb(err); }
    
    var start = options.offset ? options.offset : 0
      , end = options.limit ? (start + options.limit) : recs.length;
    return cb(null, recs.slice(start, end), { count: recs.length });
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
    // TODO: Improve this if rec is an object
    if (typeof rec.repository == 'string') {
      rec.repositories = [ { url: rec.repository } ];
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

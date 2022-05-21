var events = require('events')
  , util = require('util');


function Driver(registry) {
  events.EventEmitter.call(this);
  this._registry = registry;
}

util.inherits(Driver, events.EventEmitter);

Driver.prototype.map = function() {
  console.log('NPM DRIVER GO!');
  
  //this.emit('request', '/passport-local.html');
  
  
  var self = this;
  
  this._registry.list(function(err, pkgs) {
    //console.log(err);
    //console.log(pkgs);
    
    //self.emit('request', '/index.json');
    
    var npages
      , limit
      , i, len;
    for (i = 0, len = pkgs.length; i < len; ++i) {
      //console.log(pkgs[i].name);
      
      //self.add('/' + pkgs[i].name + '.html');
      
      //self.emit('request', '/' + pkgs[i].name + '.html');
      self.request('/' + pkgs[i].name + '.html');
      //self.emit('request', '/' + pkgs[i].name + '.json');
    }
    
    limit = 25;
    npages = Math.ceil(pkgs.length / limit);
    
    console.log('NEED TO GENERATE N PAGES: ' + npages)
    
    //self.emit('request', '/-/all.json');
    self.request('/-/all.json');
    
    // WIP: make this work
    //self.emit('request', '/-/v1/all.json');
    self.request('/-/v1/all.json');
    for (i = 1; i < npages; i++) {
      //self.emit('request', '/-/v1/all/' + (i + 1) + '.json'); // add 1 for 1-based indexing
      self.request('/-/v1/all/' + (i + 1) + '.json'); // add 1 for 1-based indexing
    }
    
    self.emit('finish');
    
  });
};


module.exports = Driver;

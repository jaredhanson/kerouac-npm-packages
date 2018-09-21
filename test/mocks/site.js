var EventEmitter = require('events').EventEmitter
  , util = require('util');


function Site() {
  EventEmitter.call(this);
  this._routes = [];
}
util.inherits(Site, EventEmitter);

Site.prototype.page = function(path, handler) {
  this._routes.push({ path: path, handler: handler });
  return this;
}

Site.prototype.bind = function(fn) {
  this._bind = fn;
}


module.exports = Site;

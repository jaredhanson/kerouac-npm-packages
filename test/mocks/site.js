var EventEmitter = require('events').EventEmitter
  , util = require('util');


function Site() {
  EventEmitter.call(this);
  this._pages = [];
}
util.inherits(Site, EventEmitter);

Site.prototype.page = function(path, handler) {
  this._pages.push({ path: path, handler: handler });
  return this;
}

Site.prototype.bind = function(fn) {
  this._bind = fn;
}


module.exports = Site;

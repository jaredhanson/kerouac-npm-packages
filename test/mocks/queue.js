function Queue() {
  this._q = [];
}

Queue.prototype.add = function(path) {
  this._q.push(path);
  return this;
}


module.exports = Queue;

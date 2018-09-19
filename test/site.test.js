/* global describe, it */

var packages = require('../app/site');
var Queue = require('./stubs/queue');


/*
describe('kerouac-npm-packages', function() {
  
  describe('binding to directory containing packages implementing federation protocols', function() {
    var site = packages('test/fixtures/federation-protocols');
    var queue = new Queue();
    
    before(function(done) {
      site._blocks[0].call(queue, function(err) {
        if (err) { return done(err); }
        return done();
      });
    });
    
    it('should bind pages', function() {
      expect(site._spaths).to.have.length(2);
      expect(site._spaths[0]).to.equal('/-/v1/all.json');
      expect(site._spaths[1]).to.equal('/sitemap.xml');
    });
    
    it('should queue pages', function() {
      expect(queue._q).to.have.length(3);
      expect(queue._q[0]).to.equal('/passport-oauth.html');
      expect(queue._q[1]).to.equal('/passport-openid.html');
      expect(queue._q[2]).to.equal('/passport-saml.html');
    });
  });
  
});
*/

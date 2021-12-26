var expect = require('chai').expect;
var chai = require('chai');
var sinon = require('sinon');
var factory = require('../../../../app/api/www/handlers/db');


describe('api/www/handlers/db', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    
    it('should render info for db with one package', function(done) {
      var registry = new Object();
      registry.list = sinon.stub().yieldsAsync(null, [
        { name: 'passport-facebook' }
      ], { count: 1 });
    
      chai.kerouac.use(factory(registry))
        .finish(function() {
          var expected = [
            '{',
            '  "db_name": "registry",',
            '  "doc_count": 1',
            '}'
          ].join("\n");
    
          expect(this.body).to.equal(expected);
          done();
        })
        .dispatch();
    }); // should render info for db with one package
    
    it('should render info for db with two packages', function(done) {
      var registry = new Object();
      registry.list = sinon.stub().yieldsAsync(null, [
        { name: 'passport-facebook' },
        { name: 'passport-google' }
      ], { count: 2 });
    
      chai.kerouac.use(factory(registry))
        .finish(function() {
          var expected = [
            '{',
            '  "db_name": "registry",',
            '  "doc_count": 2',
            '}'
          ].join("\n");
    
          expect(this.body).to.equal(expected);
          done();
        })
        .dispatch();
    }); // should render info for db with two packages
    
    it('should error when failing to list packages in registry', function(done) {
      var registry = new Object();
      registry.list = sinon.stub().yieldsAsync(new Error('something went wrong'));
  
      chai.kerouac.use(factory(registry))
        .next(function(err) {
          expect(err).to.be.an.instanceof(Error);
          expect(err.message).to.equal('something went wrong');
          done();
        })
        .dispatch();
    }); // should error when failing to list packages in registry
    
  }); // handler
  
});

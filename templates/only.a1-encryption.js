
var test = new Test();

test.initialize('a1-encryption', function(){

  it('should do a test method', function (callback) {
    console.log('ran test');
    callback();
  });

  it('should do a test method 1', function (callback) {
    console.log('ran test 1');
    callback();
  });

  before('should initialize the services', function(callback) {
    console.log('ran before');
    callback();
  });

  after('should delete the temp data files', function(callback) {
    console.log('ran after');
    callback();
  });

}.bind(this));
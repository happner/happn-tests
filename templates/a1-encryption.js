
var test = new Test();

test.initialize('a1-encryption', function(){

  var _this = this;

  it('should do a test method', function (callback) {
    console.log('A1 METHOD:::', this.test.Context.name);
    callback();
  });

  it('should do a test method 1', function (callback) {
    console.log('A1 METHOD 1:::');
    callback();
  });

  before('should initialize the services', function(callback) {
    console.log('A1 BEFORE WE HAVE:::', this.test.Context.name);
    callback();
  });

  after('should delete the temp data files', function(callback) {
    console.log('A1 AFTER:::');
    callback();
  });

}.bind(this), function(e){
  console.log('TEST WAS INIT:::');
});
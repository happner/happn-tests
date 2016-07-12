
var test = new Test();

test.initialize('a2-encryption', function(){

  var _this = this;

  it('should do a test method', function (callback) {
    console.log('A2 METHOD:::', this.test.Context.name);
    callback();
  });

  it('should do a test method 1', function (callback) {
    console.log('A2 METHOD 1:::');
    callback();
  });

  before('should initialize the services', function(callback) {
    console.log('A2 BEFORE WE HAVE:::', this.test.Context.name);
    callback();
  });

  after('should delete the temp data files', function(callback) {
    console.log('A2 AFTER:::');
    callback();
  });

}.bind(this), function(e){
  console.log('TEST WAS INIT:::');
});
var test = new Test();

test.initialize('01-vanilla', function() {

	var expect = require('expect.js');
	var happnInstance = null;
	var test_id = null;

	/*
	 This test demonstrates starting up the happn service -
	 the authentication service will use authTokenSecret to encrypt web tokens identifying
	 the logon session. The utils setting will set the system to log non priority information
	 */

	before('should initialize the service', function (done) {

		test_id = this.test.Context.helper.testId();

		this.test.Context.helper.startHappnServices([this.test.Context.serviceConfig], function (e, services) {
			if (e) return done(e);
			happnInstance = services[0];
			done();
		});

	});

	after(function (done) {
		this.test.Context.helper.tearDown(done);
	});

	it('should fetch the browser client', function(callback) {

		try{

			require('request')({uri:'http://127.0.0.1:55000/browser_client',
					method:'GET'
				},
				function(e, r, b){

					if (!e){

						var path = require('path');
						var happnPath = path.dirname(path.resolve(require.resolve('happn'), '..' + path.sep));
						var happnVersion = require(happnPath + path.sep + 'package.json').version;

						expect(b.indexOf('\/\/happn client v' + happnVersion)).to.be(0);

						console.log(happnVersion);

						//console.log(b);
						callback();
					}else
						callback(e);


				});

		}catch(e){
			callback(e);
		}
	});
});


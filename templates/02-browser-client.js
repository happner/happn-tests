var fs = require('fs');
var testFilenames = fs.readdirSync(__dirname + '/context');

var expect = require('expect.js');
var async = require('async');
var testport = 8000;
var test_secret = 'test_secret';
var mode = "embedded";

var testFiles = [];
var happn_tests_config = require('../test/config');


for (var testFileIndex in testFilenames){

	var testFilename = testFilenames[testFileIndex];

	if (testFilename.indexOf('02-browser-client') != 0 && testFilename.indexOf('only.02-browser-client') != 0) continue;//we only use files that start with 'test-'

	testFiles.push(testFilename);

	describe(testFilename.replace('.js',''), function() {

		var request = require('request');

		this.timeout(happn_tests_config.timeout);

		before(function () {

			var testFile = testFiles.shift();

			testInstance = require(__dirname + '/context/' + testFile);
			happn = testInstance.happnDependancy;
			service = happn.service;
			happn_client = happn.client;
			happnInstance = null;

	    });

		/*
		This test demonstrates starting up the happn service -
		the authentication service will use authTokenSecret to encrypt web tokens identifying
		the logon session. The utils setting will set the system to log non priority information
		*/

		it('should initialize the service', function(callback) {



			try{
				service.create(testInstance.serviceConfig,
					function(e, happnInst){
						if (e)
							return callback(e);

						happnInstance = happnInst;
						callback();
					});
			}catch(e){
				callback(e);
			}
		});

	  	after(function(done) {
	    	happnInstance.stop(done);
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

}


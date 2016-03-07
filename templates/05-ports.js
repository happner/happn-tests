var fs = require('fs');
var testFilenames = fs.readdirSync(__dirname + '/context');

var expect = require('expect.js');
var async = require('async');
var testport = 8000;
var test_secret = 'test_secret';
var mode = "embedded";
var default_timeout = 10000;

var testFiles = [];

for (var testFileIndex in testFilenames){

	var testFilename = testFilenames[testFileIndex];

	if (testFilename.indexOf('05-ports') != 0 && testFilename.indexOf('only.05-ports') != 0) continue;//we only use files that start with 'test-'

	testFiles.push(testFilename);

	describe(testFilename.replace('.js',''), function() {

		var service1Port = 8000;
		var service2Port = 8001;

		var service1Client;
		var service2Client;
		var defaultClient;

		var instances = [];

		before(function () {

			var testFile = testFiles.shift();

			testInstance = require(__dirname + '/context/' + testFile);
			happn = testInstance.happnDependancy;
			service = happn.service;
			happn_client = happn.client;
			happnInstance = null;

	    });

	    after('stop all services', function(callback) {

			service1Client.disconnect()
		    .then(service2Client.disconnect()
		    .then(defaultClient.disconnect()
		    .then(function(){

		    	async.eachSeries(instances, function(instance, eachCallback){
			   		instance.stop(eachCallback);
				},
				   callback
				);

		    })))
		    .catch(callback);

		});

		var initializeService = function(config, callback){
			service.initialize(config,
				function(e, instance){
					if (e) return callback(e);

					instances.push(instance);
					callback();
				}
			);
		}

		it('should initialize the services', function(callback) {

			this.timeout(20000);

			try{

				initializeService(testInstance.server1Config, function(e){
					if (e) return callback(e);

					initializeService(testInstance.server2Config, function(e){
						if (e) return callback(e);

						initializeService(testInstance.serverDefaultConfig, callback);
					});
				});

			}catch(e){
				callback(e);
			}
		});

		it('should initialize the clients', function(callback) {
			this.timeout(default_timeout);

			try{
			  //plugin, config, context,

			  happn_client.create(testInstance.server1ClientConfig, function(e, instance) {

			  	if (e) return callback(e);

			  	service1Client = instance;
			    happn_client.create(testInstance.server2ClientConfig, function(e, instance) {

			    	if (e) return callback(e);

			  		service2Client = instance;
			      	happn_client.create(testInstance.serverDefaultClientConfig, function(e, instance) {

			      		if (e) return callback(e);

			      		defaultClient = instance;
			      		callback();

			      	});
			    });

			  });

			}catch(e){
			  callback(e);
			}
		});

	})

}
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

	if (testFilename.indexOf('03-stopping-starting') != 0 && testFilename.indexOf('only.03-stopping-starting') != 0) continue;//we only use files that start with 'test-'

	testFiles.push(testFilename);

	describe(testFilename.replace('.js',''), function() {

		this.timeout(happn_tests_config.timeout);

		before(function () {

			var testFile = testFiles.shift();

			testInstance = require(__dirname + '/context/' + testFile);
			happn = testInstance.happnDependancy;
			service = happn.service;
			happn_client = happn.client;
			happnInstance = null;

	    });

		context('stopping and starting meshes', function() {

		    var tmpFile = __dirname + '/tmp/testdata_' + require('shortid').generate() + '.db';
		    var persistKey = '/persistence_test/' + require('shortid').generate();

		    var currentService = null;

		    var stopService = function(callback){
		       if (currentService){
		        currentService.stop(function(e){
		          if (e && e.toString() != 'Error: Not running') return callback(e);
		          callback();
		        });
		       } else callback();
		    }

		    var initService = function(filename, name, callback){

		      var doInitService = function(){

		          var serviceConfig = JSON.parse(JSON.stringify(testInstance.serviceConfig));

		          serviceConfig.services.data.config.filename = filename;
		          serviceConfig.name = name;

		          happn.service.create(serviceConfig,
		          function(e, happnService){
		            if (e) return callback(e);
		            currentService = happnService;
		            callback();
		          }
		        );
		      }

		      stopService(function(e){
		        if (e) return callback(e);
		        doInitService();
		      });
		    }

		    var getClient = function(service, callback){
		      happn.client.create(testInstance.getClientConfig(service), function(e, instance) {

		          if (e) return callback(e);

		         callback(null, instance);

		      });
		    }

		    before('should initialize the service', function(callback) {

		      initService(tmpFile, '5_eventemitter_stoppingstarting', callback);

		    });

		    after('should delete the temp data file', function(callback) {

		      stopService(function(e){
		        fs.unlink(tmpFile, function(e){
		            callback();
		        });
		      });

		    });


		    it('should push some data into a permanent datastore', function(callback) {


		      getClient(currentService, function(e, testclient){

		        if (e) return callback(e);

		        testclient.set(persistKey,
		          {property1: "prop1", prop2: "prop2"},
		          null,
		          callback
		        );

		      });

		    });

		   it('should disconnect then reconnect and reverify the data', function(callback) {

		    initService(tmpFile, '5_eventemitter_stoppingstarting', function(e){

		      if (e) return callback(e);

		      getClient(currentService, function(e, testclient){

		        if (e) return callback(e);

		        testclient.get(persistKey, null, function(e, response){

		          if (e) return callback(e);

		          expect(response.property1).to.be("prop1");
		          callback();
		        });

		      });
		    });
		   });

		   it('should create a memory server - check for the data - shouldnt be any', function(callback) {

		    initService(null, '5_eventemitter_stoppingstarting', function(e){

		      if (e) return callback(e);

		      getClient(currentService, function(e, testclient){

		        if (e) return callback(e);

		        testclient.get(persistKey, null, function(e, response){

		          if (e) return callback(e);

		          expect(response).to.eql(null);
		          callback();
		        });

		      });
		    });

		   });

		   it('should stop then start and verify the server name', function(callback) {

		    initService(tmpFile, '5_eventemitter_stoppingstarting', function(e){

		      if (e) return callback(e);

		      var currentPersistedServiceName = currentService.services.system.name;
		      expect(currentPersistedServiceName).to.be('5_eventemitter_stoppingstarting');

		      initService(null, null, function(e){

		        var currentUnpersistedServiceName = currentService.services.system.name;
		        expect(currentUnpersistedServiceName).to.not.be('5_eventemitter_stoppingstarting');
		        expect(currentUnpersistedServiceName).to.not.be(null);
		        expect(currentUnpersistedServiceName).to.not.be(undefined);

		        initService(tmpFile, null, function(e){
		          if (e) return callback(e);

		          var currentPersistedRestartedServiceName = currentService.services.system.name;
		          expect(currentPersistedRestartedServiceName).to.be('5_eventemitter_stoppingstarting');
		          callback();

		        });

		      });

		    });


		   });

		  });

	});

}


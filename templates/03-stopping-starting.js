var test = new Test();

test.initialize('03-stopping-starting', function() {

	var expect = require('expect.js');

	var tmpFile;
	var persistKey;
	var currentService;
	var happn;

	var stopService = function(callback){
		if (currentService){
			currentService.stop(function(e){
				if (e && e.toString() != 'Error: Not running') return callback(e);
				callback();
			});
		} else callback();
	}

	var initService = function(filename, name, testContext, callback){

		var doInitService = function(){

			var serviceConfig = JSON.parse(JSON.stringify(testContext.serviceConfig));

			serviceConfig.services.data.config.filename = filename;
			serviceConfig.name = name;

			happn.service.create(serviceConfig,
				function(e, happnService){
					if (e) return callback(e);
					currentService = happnService;
					callback();
				}
			);
		};

		stopService(function(e){
			if (e) return callback(e);
			doInitService();
		});
	}

	var getClient = function(service, testContext, callback){
		happn.client.create(testContext.getClientConfig(service), function(e, instance) {
			if (e) return callback(e);
			callback(null, instance);
		});
	}

	before('should initialize the service', function(callback) {

		tmpFile = this.test.Context.helper.randomFile('nedb');
		persistKey = '/persistence_test/' +  this.test.Context.helper.shortid();
		currentService = null;
		happn = this.test.Context.happnDependancy;

		initService(tmpFile, '3_stopping_starting', this.test.Context, callback);

	});

	after('should delete the temp data file', function(callback) {

		stopService(function(){
			require('fs').unlink(tmpFile, function(){
				callback();
			});
		});
	});

	it('should push some data into a permanent datastore', function(callback) {

		getClient(currentService, this.test.Context, function(e, testclient){

			if (e) return callback(e);

			testclient.set(persistKey,
				{property1: "prop1", prop2: "prop2"},
				null,
				callback
			);

		});

	});

	it('should disconnect then reconnect and reverify the data', function(callback) {

		var _this = this;

		initService(tmpFile, '3_stopping_starting', _this.test.Context, function(e){

			if (e) return callback(e);

			getClient(currentService, _this.test.Context, function(e, testclient){

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

		var _this = this;

		initService(null, '3_stopping_starting', _this.test.Context, function(e){

			if (e) return callback(e);

			getClient(currentService, _this.test.Context, function(e, testclient){

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

		var _this = this;

		initService(tmpFile, '3_stopping_starting', _this.test.Context, function(e){

			if (e) return callback(e);

			var currentPersistedServiceName = currentService.services.system.name;
			expect(currentPersistedServiceName).to.be('3_stopping_starting');

			initService(null, null, _this.test.Context, function(e){

				var currentUnpersistedServiceName = currentService.services.system.name;
				expect(currentUnpersistedServiceName).to.not.be('3_stopping_starting');
				expect(currentUnpersistedServiceName).to.not.be(null);
				expect(currentUnpersistedServiceName).to.not.be(undefined);

				initService(tmpFile, null, _this.test.Context, function(e){
					if (e) return callback(e);

					var currentPersistedRestartedServiceName = currentService.services.system.name;
					expect(currentPersistedRestartedServiceName).to.be('3_stopping_starting');
					callback();

				});

			});
		});
	});

});

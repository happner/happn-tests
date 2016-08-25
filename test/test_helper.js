describe('test_helper', function () {

	var expect = require('expect.js');

	beforeEach('create helper', function(){
		var TestHelper = require('../test_helper');
		this.helper = new TestHelper('test');
	})

	afterEach('create helper', function(done){
		this.helper.tearDown(done);
	})

	it('can start a happn service', function (done) {

		this.helper.startHappnService({}, function(e){
			done(e);
		});

	});

	it('can start a happn service and connect an eventemitter client', function (done) {

		var _this = this;

		_this.helper.startHappnService({}, function(e, service){

			if (e) return done(e);

			_this.helper.connectHappnClient(service, {}, done);
		});
	});

	it('can start a happn service and connect an websockets client', function (done) {

		var _this = this;

		_this.helper.startHappnService({port:55004}, function(e, service){

			if (e) return done(e);

			_this.helper.connectHappnClient(service, {websocketsClient:true, port:55001}, function(e){
				expect(e.toString().substring(0, 27)).to.be('Error: connect ECONNREFUSED');
				//correct port override
				_this.helper.connectHappnClient(service, {websocketsClient:true, port:55004}, function(e){
					expect(e).to.be(null);
					//correct port from server
					_this.helper.connectHappnClient(service, {websocketsClient:true}, function(e){
						expect(e).to.be(null);
						//no server passed in
						_this.helper.connectHappnClient(null, {websocketsClient:true, port:55004}, done);

					});

				});
			});
		});

	});

	it('can start a happn service, with a default eventemitter client', function (done) {

		var _this = this;

		_this.helper.startHappnServices([{port:55004}], function(e, services, clients){

			if (e) return done(e);

			expect(services.length).to.be(1);
			expect(clients.length).to.be(1);
			expect(clients[0].clientType).to.be('eventemitter');


			done();

		});
	});

	it('can start a happn service, with a default websockets client', function (done) {

		var _this = this;

		_this.helper.startHappnServices([{port:55004}], {websocketsClient:true}, function(e, services, clients){

			if (e) return done(e);

			expect(services.length).to.be(1);
			expect(clients.length).to.be(1);
			expect(clients[0].clientType).to.be('socket');


			done();

		});
	});

	it('can start a secure happn service and a basic service, with a secure ws client and a basic ws client', function (done) {

		var _this = this;

		var secureConfig = {
			port:55004,
			secure:true,
			services:{
				security:{
					adminUser:{
						password:'happn'
					}
				},
				data: {
					path: './services/data_embedded/service.js'
				}
			}
		};

		var otherConfig = {
			port:55005
		};

		_this.helper.startHappnServices([secureConfig, otherConfig], {websocketsClient:true}, function(e, services, clients){

			if (e) return done(e);

			expect(services.length).to.be(2);
			expect(clients.length).to.be(2);
			expect(clients[0].clientType).to.be('socket');
			expect(clients[1].clientType).to.be('socket');

			clients[1].set('/test/data', {test:'data'}, done);

		});
	});

	it('can start a secure happn service with a specified admin password and a basic service, with a websockets client with the password specified and a basic client', function (done) {

		var _this = this;

		var secureConfig = {
			port:55004,
			secure:true,
			services:{
				security:{
					config:{
						adminUser:{
							password:'guessme'
						}
					}
				},
				data: {
					path: './services/data_embedded/service.js'
				}
			}
		};

		var otherConfig = {
			port:55005
		};

		_this.helper.startHappnServices([secureConfig, otherConfig], {websocketsClient:true, adminPassword:'guessme'}, function(e, services, clients){

			//_this.helper.startHappnServices([secureConfig, otherConfig], {websocketsClient:true, adminPassword:'guessme'}, function(e, services, clients){

			if (e) return done(e);

			expect(services.length).to.be(2);
			expect(clients.length).to.be(2);
			expect(clients[0].clientType).to.be('socket');
			expect(clients[1].clientType).to.be('socket');

			done();

		});
	});

	it('can start a secure happn service with a specified admin password and a basic service, with a websockets client with the password unspecified and a basic client', function (done) {

		var _this = this;

		var secureConfig = {
			port:55004,
			secure:true,
			services:{
				security:{
					config:{
						adminUser:{
							password:'guessme'
						}
					}
				},
				data: {
					path: './services/data_embedded/service.js'
				}
			}
		};

		var otherConfig = {
			port:55005
		};

		_this.helper.startHappnServices([secureConfig, otherConfig], {websocketsClient:true}, function(e, services, clients){

			//_this.helper.startHappnServices([secureConfig, otherConfig], {websocketsClient:true, adminPassword:'guessme'}, function(e, services, clients){

			if (e) return done(e);

			expect(services.length).to.be(2);
			expect(clients.length).to.be(2);
			expect(clients[0].clientType).to.be('socket');
			expect(clients[1].clientType).to.be('socket');

			done();

		});
	});

});

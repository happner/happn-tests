var test = new Test();

test.initialize('05-websockets-ports', function() {

  var happn;
  var service1;
  var service2;
  var serviceDefault;

  var happn_client;

  var service1Port;
  var service2Port;

  var service1Client;
  var service2Client;
  var defaultClient;

  var default_timeout;

  before('setup of globals', function(callback){

    var happn = this.test.Context.happnDependancy;
    service1 = happn.service;
    service2 = happn.service;
    serviceDefault = happn.service;

    happn_client = happn.client;

    service1Port = 8000;
    service2Port = 8001;

    callback();

  });

  after('stop all services', function (callback) {
    this.test.Context.helper.tearDown(callback);
  });

  var initializeService = function (instance, port, serviceConfig, testHelper, callback) {

    var config = JSON.parse(JSON.stringify(serviceConfig));
    config.port = port;

    instance.initialize(config,
      function (e, instance) {

        if (e) return callback(e);
        testHelper.addHappnService(instance);

        callback();
      }
    );
  }

  it('should initialize the services', function (callback) {

    var _this = this;
    this.timeout(20000);

    try {

      initializeService(service1, service1Port, _this.test.Context.serviceConfig, _this.test.Context.helper, function (e) {
        if (e) return callback(e);

        initializeService(service2, service2Port, _this.test.Context.serviceConfig, _this.test.Context.helper, function (e) {
          if (e) return callback(e);

          initializeService(serviceDefault, null, _this.test.Context.serviceConfig, _this.test.Context.helper, callback);
        });
      });

    } catch (e) {
      callback(e);
    }
  });

  it('should initialize the clients', function (callback) {
    var _this = this;
    this.timeout(default_timeout);

    try {
      //plugin, config, context,
      //{config: {port: service1Port}}
      happn_client.create(_this.test.Context.getClientConfig(service1Port), function (e, instance) {

        if (e) return callback(e);

        service1Client = instance;
        _this.test.Context.addHappnClient(service1Port);
        happn_client.create(_this.test.Context.getClientConfig(service2Port), function (e, instance) {

          if (e) return callback(e);

          service2Client = instance;
          _this.test.Context.addHappnClient(service2Port);
          happn_client.create(_this.test.Context.getClientConfig(55000), function (e, instance) {

            if (e) return callback(e);

            defaultClient = instance;
            _this.test.Context.addHappnClient(defaultClient);
            callback();

          });
        });

      });

    } catch (e) {
      callback(e);
    }
  });
});
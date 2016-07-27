var shortid = require('shortid')
  , path = require('path')
  , fs = require('fs-extra')
  , async = require('async')
  , happn = require('happn')
  , happn_client = happn.client
;

function TestHelper(testName){
  this.testName = testName;
  this.happnServices = [];
  this.happnClients = [];
}

var tempDirectory = false;
var testId = false;

TestHelper.prototype.shortid = function(){
  return shortid.generate();
};

TestHelper.prototype.testId = function(){
  if (!testId){
    testId = Date.now() + '_' + this.shortid();
  }
  return testId;
};

TestHelper.prototype.randomFile = function(ext){
  if (ext)
    return this.ensureTestDirectory() + path.sep + this.shortid() + '.' + ext;
  else this.ensureTestDirectory() + path.sep + this.shortid();
}

TestHelper.prototype.ensureTestDirectory = function(){
  if (!tempDirectory){
    fs.mkdirSync(__dirname + path.sep + 'temp' + path.sep + this.testId());
    tempDirectory = __dirname + path.sep + 'temp' + path.sep + this.testId();
  }
  return tempDirectory;
};

TestHelper.prototype.deleteTestDirectory = function(){
  if (tempDirectory){
    fs.emptyDirSync(tempDirectory);
    fs.rmdirSync(tempDirectory);
    console.log('deleted temp dir:::', tempDirectory);
  }
};

TestHelper.prototype.startHappnServices = function(configs, opts, callback){

  var _this = this;

  if (typeof opts == 'function'){
    callback = opts;
    opts = {};
  }

  var services = [];
  var clients = [];

  async.eachSeries(configs, function(config, configCB){

    happn.service.create(config,
      function(e, instance){

        if (e) return configCB(e);
        services.push(instance);

        var clientConfig =  {
          plugin: happn.client_plugins.intra_process,
          context: instance
        }

        if (opts && opts.websocketsClient){
          clientConfig = {
            config:{
              port:55000
            }
          };

          if (config.port)
            clientConfig.config.port = config.port;
        }

        if (config.secure){

          clientConfig.secure = true;
          clientConfig.config = {
            username:'_ADMIN',
            password:'happn'
          }

          if (config.services && config.services.security && config.services.security.adminPassword)
            clientConfig.config.password = config.services.security.adminPassword;
        }

        happn_client.create(clientConfig, function(e, clientInstance){

          if (e) return configCB(e);
          clients.push(clientInstance);

          configCB();
        });
      }
    );

  }, function(e){

    if (e) return callback(e);

    services.map(function(service){
      _this.addHappnService(service);
    });

    clients.map(function(client){
      _this.addHappnClient(client);
    });

    callback(null, services, clients);
  });

}

TestHelper.prototype.addHappnService = function(service){
  this.happnServices.push(service);
};

TestHelper.prototype.addHappnClient = function(client){
  this.happnClients.push(client);
};

TestHelper.prototype.stopHappnServices = function(callback){

  if (this.happnServices.length == 0) return callback();

  async.each(this.happnServices,
    function(currentService, eachServiceCB){
      currentService.stop({reconnect:false}, eachServiceCB);
    },
    function(e){

      if (!e)
        this.happnServices = [];//reset the services

      callback(e);
    });
}

TestHelper.prototype.disconnectHappnClients = function(callback){

  if (this.happnClients.length == 0) return callback();

  async.each(this.happnClients,
    function(currentClient, eachClientCB){
      currentClient.disconnect(eachClientCB);
    },
    callback);
}

TestHelper.prototype.tearDown = function(callback){

  var _this = this;

  _this.deleteTestDirectory();

  _this.disconnectHappnClients(function(e){
    if (e) console.error('unable to disconnect all clients: ' + e.toString(), e);
    _this.stopHappnServices(callback);
  });

}

module.exports = TestHelper;
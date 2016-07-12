var shortid = require('shortid');
var path = require('path');
var fs = require('fs');
var async = require('async');
var happn = require('happn');

function TestHelper(testName){
  this.testName = testName;
  this.happnServices = [];
}

var tempDirectory = false;
var testId = false;

TestHelper.prototype.shortid = function(){
  return shortid.generate();
};

TestHelper.prototype.testId = function(){
  if (!testId){
    testId = Date.now() + '_' + shortid.generate();
  }
  return testId;
};

TestHelper.randomFile = function(ext){
  if (ext)
    return this.ensureTestDirectory() + path.sep + this.shortid + '.' + ext;
  else this.ensureTestDirectory() + path.sep + this.shortid;
}

TestHelper.prototype.ensureTestDirectory = function(){
  if (!tempDirectory){
    fs.mkdirSync(__dirname + path.sep + 'temp' + path.sep + testId);
    tempDirectory = __dirname + path.sep + 'temp' + path.sep + testId;
  }
  return tempDirectory;
};

TestHelper.prototype.deleteTestDirectory = function(){
  if (tempDirectory)
    fs.rmdirSync(tempDirectory);
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
          //TODO - add websocket client config
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

    callback(services, clients);
  });

}

TestHelper.prototype.addHappnService = function(service){
  this.happnServices.push(service);
};

TestHelper.prototype.tearDown = function(callback){
  this.deleteTestDirectory();

  if (this.happnServices.length > 0){

    async.each(this.happnServices,
    function(currentService, eachServiceCB){
      currentService.stop(eachServiceCB);
    },
    callback);

  } else callback();
}

module.exports = TestHelper;
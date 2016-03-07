var happn = require('happn')
var happn_client = happn.client;

module.exports = {
  happnDependancy:require('happn'),
  description:"websockets embedded functional tests",
  serviceConfig:{},
  publisherClient:function(happnInstance, callback){

    var config =  undefined;
    happn_client.create(config, callback);

  },
  listenerClient:function(happnInstance, callback){

    var config =  undefined;
    happn_client.create(config, callback);

  }
}
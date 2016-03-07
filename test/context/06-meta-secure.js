var happn = require('happn')
var happn_client = happn.client;

module.exports = {
  happnDependancy:require('happn'),
  description:"eventemitter embedded functional tests, with security switched on",
  serviceConfig:{
    secure:true,
  },
  publisherClient:function(happnInstance, callback){

    var config =  {
    plugin: happn.client_plugins.intra_process,
    context: happnInstance,
    config:{
      username:'_ADMIN',
      password:'happn'
    },
    secure:true
  }

  happn_client.create(config, callback);

  },
  listenerClient:function(happnInstance, callback){

    var config =  {
    plugin: happn.client_plugins.intra_process,
    context: happnInstance,
    config:{
      username:'_ADMIN',
      password:'happn'
    },
    secure:true
  }

  happn_client.create(config, callback);

  }
}
var happn = require('happn')
var happn_client = happn.client;

module.exports = {
  happnDependancy:require('happn'),
  description:"eventemitter embedded functional tests, with security switched on",
  serviceConfig:{
    secure:true,
  },
  publisherClient:function(happnInstance, callback){

    var config =  JSON.parse(JSON.stringify({
      secure:true,
      config:{
        username:'_ADMIN',
        password:'happn'
      }
    }));

    config.plugin = happn.client_plugins.intra_process;
    config.context = happnInstance;

    happn_client.create(config, callback);

  },
  listenerClient:function(happnInstance, callback){

    var config =  JSON.parse(JSON.stringify({
      secure:true,
      config:{
        username:'_ADMIN',
        password:'happn'
      }
    }));

    config.plugin = happn.client_plugins.intra_process;
    config.context = happnInstance;

    happn_client.create(config, callback);

  }
}
var happn = require('happn')
var happn_client = happn.client;

module.exports = {
  happnDependancy:require('happn'),
  description:"websockets embedded functional tests",
  serviceConfig:{
    secure:true,
    encryptPayloads:true
  },
  publisherClient:function(happnInstance, callback){

    var config =  {
      config:{
        username:'_ADMIN',
        password:'happn'
      }
    }

    happn_client.create(config, callback);

  },
  listenerClient:function(happnInstance, callback){

    var config =  {
      config:{
        username:'_ADMIN',
        password:'happn'
      }
    }
    happn_client.create(config, callback);

  }
}
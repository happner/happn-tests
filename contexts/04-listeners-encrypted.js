var happn = require('happn')
var happn_client = happn.client;

module.exports = {
  happnDependancy:require('happn'),
  description:"eventemitter embedded functional tests with encrypted payloads",
  serviceConfig:{
    secure:true,
    encryptPayloads:true,
    services:{
        security:{
          config:{
            keyPair:{
              privateKey:'Kd9FQzddR7G6S9nJ/BK8vLF83AzOphW2lqDOQ/LjU4M=',
              publicKey:'AlHCtJlFthb359xOxR5kiBLJpfoC2ZLPLWYHN3+hdzf2'
            }
          }
        }
      }
    }
  ,
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
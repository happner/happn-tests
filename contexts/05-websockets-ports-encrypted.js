var happn = require('happn')
var happn_client = happn.client;
var happn_server = happn.server;

module.exports = {
  happnDependancy:require('happn'),
  happnClient:happn_client,
  happnServer:happn_server,
  description:"eventemitter embedded functional tests",
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
  },
  getClientConfig:function(port){
    return {
      config:{
        port:port,
        username:'_ADMIN',
        password:'happn'
      }
    }
  }
}
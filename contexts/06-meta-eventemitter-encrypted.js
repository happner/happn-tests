var happn = require('happn');
module.exports = {
  happnDependancy:require('happn'),
  description:"eventemitter embedded functional tests, with security switched on",
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
  getClientConfig:function(happnInstance){
    return {
      plugin: happn.client_plugins.intra_process,
      context: happnInstance,
      secure:true,
      config:{
        username:'_ADMIN',
        password:'happn'
      }
    }
  }
}
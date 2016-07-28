var happn = require('happn')

module.exports = {
  happnDependancy:require('happn'),
  description:"eventemitter embedded functional tests, with security switched on",
  serviceConfig:{
    secure:true
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
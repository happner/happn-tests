var happn = require('happn')

module.exports = {
  happnDependancy:require('happn'),
  description:"eventemitter embedded functional tests, with security switched on",
  serviceConfig:{
    secure:true
  },
  getClientConfig:function(happnInstance){
    return {
      secure:true,
      config:{
        username:'_ADMIN',
        password:'happn'
      }
    }
  }
}
var happn = require('happn')
var happn_client = happn.client;

module.exports = {
  happnDependancy:require('happn'),
  description:"default server configuration",
  serviceConfig:{
    secure:true,
    encryptPayloads:true,
    services: {
      data: {
        path: './services/data_embedded/service.js',
        config: {}
      }
    }
  },
  getClientConfig:function(service){
  	return {config:{username:'_ADMIN', password:'happn'}}
  }
}
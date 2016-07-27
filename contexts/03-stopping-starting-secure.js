var happn = require('happn')
var happn_client = happn.client;

module.exports = {
  happnDependancy:require('happn'),
  description:"default server configuration",
  serviceConfig:{
    services: {
      data: {
        path: './services/data_embedded/service.js'
      }
    },
    secure:true
  },
  getClientConfig:function(service){
  	return {
      plugin: happn.client_plugins.intra_process,
      context: service,
      secure:true,
      config:{
        username:'_ADMIN',
        password:'happn'
      }
    }
  }
}
var happn = require('happn')
var happn_client = happn.client;
var happn_server = happn.server;

module.exports = {
  happnDependancy:require('happn'),
  happnClient:happn_client,
  happnServer:happn_server,
  description:"eventemitter embedded functional tests",
  serviceConfig:{},
  getClientConfig:function(port){
    return {
      config:{
        port:port
      }
    }
  }
}
var happn = require('happn')
var happn_client = happn.client;

module.exports = {
  happnDependancy:require('happn'),
  description:"eventemitter embedded functional tests, with security switched on",
  serviceConfig:{
    secure:true,
  },
  startServiceOptions:{},
  listenerClientConfig:{
    plugin: happn.client_plugins.intra_process,
    context: happnInstance
  }
}
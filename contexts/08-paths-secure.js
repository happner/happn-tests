var happn = require('happn')
module.exports = {
  happnDependancy:happn,
  serviceConfig:{
    secure:true
  },
  startServiceOptions:{},
  listenerClientConfig:function(happnInstance){
    return {
      secure:true,
      plugin: happn.client_plugins.intra_process,
      context: happnInstance
    }
  }
}
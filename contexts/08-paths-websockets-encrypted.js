var happn = require('happn')
module.exports = {
  happnDependancy:happn,
  serviceConfig:{
    secure:true,
    encryptPayloads:true
  },
  startServiceOptions:{},
  listenerClientConfig:function(happnInstance){
    return {};
  }
}
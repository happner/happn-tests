var happn = require('happn')
module.exports = {
  happnDependancy:happn,
  serviceConfig:{
    secure:true
  },
  startServiceOptions:{},
  listenerClientConfig:function(happnInstance){
    return {};
  }
}
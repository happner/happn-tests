var happn = require('happn')
var happn_client = happn.client;

module.exports = {
	happnDependancy:require('happn'),
	serviceConfig:{
		secure:true,
		encryptPayloads:true
	},
	startServiceOptions:{},
	listenerClientConfig:function(happnInstance){
		return {
			plugin: happn.client_plugins.intra_process,
			context: happnInstance,
			secure:true
		}
	}
}
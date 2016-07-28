var happn = require('happn');

module.exports = {
  happnDependancy:require('happn'),
  serviceConfig:{},
	getClientConfig:function(happnInstance){

		return {
			plugin: happn.client_plugins.intra_process,
			context: happnInstance
		}
	}
}
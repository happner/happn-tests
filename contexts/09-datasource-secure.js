var happn = require('happn')
var happn_client = happn.client;

module.exports = {
  happnDependancy:require('happn'),
  serviceConfig1:function(tempFile){
    return  {
      secure:true,
      port:55001,
      services: {
        data: {
          path: './services/data_embedded/service.js',
          config:{
             filename:tempFile
          }
        }
      }
    }
  },
  serviceConfig2:function(tempFile, test_id){
      return {
        secure:true,
        services: {
          data: {
            path: './services/data_embedded/service.js',
            config: {
              datastores:[
                {
                  name:'memory',
                  isDefault:true,
                  patterns:[
                    '/a3_eventemitter_multiple_datasource/' + test_id + '/memorytest/*',
                    '/a3_eventemitter_multiple_datasource/' + test_id + '/memorynonwildcard'
                  ]
                },
                {
                  name:'persisted',
                  settings:{
                    filename:tempFile
                  },
                  patterns:[
                    '/a3_eventemitter_multiple_datasource/' + test_id + '/persistedtest/*',
                    '/a3_eventemitter_multiple_datasource/' + test_id + '/persistednonwildcard'
                  ]
                }
              ]
            }
          }
        }
      }
  },
  client:function(happnInstance, callback){

    var config =  {
  		plugin: happn.client_plugins.intra_process,
  		context: happnInstance,
      config:{username:'_ADMIN',password:'happn'},
      secure:true
  	}

  	happn_client.create(config, callback);

  }
}
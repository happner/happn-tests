var happn = require('happn')
var happn_client = happn.client;

module.exports = {
  happnDependancy:require('happn'),
  serviceConfig1:function(tempFile){
    return  {
      secure:true,
      encryptedPayloads:true,
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
        port:55002,
        secure:true,
        encryptedPayloads:true,
        services: {
          data: {
            path: './services/data_embedded/service.js',
            config: {
              datastores:[
                {
                  name:'memory',
                  isDefault:true,
                  patterns:[
                    '/09-multiple-datasource/' + test_id + '/memorytest/*',
                    '/09-multiple-datasource/' + test_id + '/memorynonwildcard'
                  ]
                },
                {
                  name:'persisted',
                  settings:{
                    filename:tempFile
                  },
                  patterns:[
                    '/09-multiple-datasource/' + test_id + '/persistedtest/*',
                    '/09-multiple-datasource/' + test_id + '/persistednonwildcard'
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
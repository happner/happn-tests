var happn = require('happn')
var happn_client = happn.client;
var happn_server = happn.server;

module.exports = {
  happnDependancy:require('happn'),
  happnClient:happn_client,
  happnServer:happn_server,
  description:"eventemitter embedded functional tests",
  server1Config:{port:8000, secure:true},
  server2Config:{port:8001, secure:true},
  serverDefaultConfig:{secure:true},
  server1ClientConfig:{port:8000, secure:true, config:{username:'_ADMIN',password:'happn'}},
  server2ClientConfig:{port:8001, secure:true, config:{username:'_ADMIN',password:'happn'}},
  serverDefaultClientConfig:{secure:true, config:{username:'_ADMIN',password:'happn'}}
}
var happn = require('happn')
var happn_client = happn.client;
var happn_server = happn.server;

module.exports = {
  happnDependancy:require('happn'),
  happnClient:happn_client,
  happnServer:happn_server,
  description:"eventemitter embedded functional tests",
  server1Config:{port:8000},
  server2Config:{port:8001},
  serverDefaultConfig:{},
  server1ClientConfig:{port:8000},
  server2ClientConfig:{port:8001},
  serverDefaultClientConfig:{}
}
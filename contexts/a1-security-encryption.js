module.exports = {
  happnDependancy:require('happn'),
  dataService:require('../../node_modules/happn/lib/services/data_embedded/service'),
  cryptoService:require('../../node_modules/happn/lib/services/crypto/service'),
  utils:require('../../node_modules/happn/lib/utils'),
  cryptoUtils:function(){
    var Crypto = require('happn-util-crypto');
    return new Crypto();
  },
  logger:require('happn-logger')
}
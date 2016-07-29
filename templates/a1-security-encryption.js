var test = new Test();

test.initialize('a1-security-encryption', function () {

  var happn;
  var service;

  var happnMock;

  var crypto;

  var testConfigs;
  var testServices;

  var bobKeyPair;

  var generatedPrivateKeyBob;
  var generatedPublicKeyBob;

  var generatedPrivateKeyAlice;
  var generatedPublicKeyAlice;

  var dataToEncrypt;
  var Logger;

  before('should initialize the globals services', function (callback) {

    console.log('initializing:::');

    happn = this.test.Context.happnDependancy;
    service = happn.service;

    happnMock = {services: {}};

    Logger = this.test.Context.logger;

    crypto =  this.test.Context.cryptoUtils();

    testConfigs = {};

    testConfigs.data = {};
    testConfigs.crypto = {};

    testServices = {};

    testServices.data = this.test.Context.dataService;
    testServices.crypto = this.test.Context.cryptoService;

    happnMock.utils = this.test.Context.utils;

    bobKeyPair = crypto.createKeyPair();

    generatedPrivateKeyBob = bobKeyPair.privateKey;
    generatedPublicKeyBob = bobKeyPair.publicKey;

    dataToEncrypt = 'this is a secret';

    console.log('initialized:::');

    async.eachSeries(['data', 'crypto'], function (serviceName, eachServiceCB) {

      testServices[serviceName] = new testServices[serviceName]({logger: Logger});
      testServices[serviceName].happn = happnMock;

      testServices[serviceName].initialize(testConfigs[serviceName], function (e) {
        if (e)  return eachServiceCB(e);

        happnMock.services[serviceName] = testServices[serviceName];

        eachServiceCB();

      });
    }, callback);

  });

  it('should generate a keypair', function (callback) {

    var keyPair = testServices.crypto.createKeyPair();

    generatedPrivateKeyAlice = keyPair.privateKey;
    generatedPublicKeyAlice = keyPair.publicKey;

    callback();

  });

  it('should serialize and deserialize a keypair', function (callback) {

    var keyPair = testServices.crypto.createKeyPair();
    var keyPairSerialized = testServices.crypto.serializeKeyPair(keyPair);
    var keyPairDeserialized = testServices.crypto.deserializeKeyPair(keyPairSerialized);

    expect(typeof keyPairSerialized).to.be('string');
    expect(keyPairDeserialized.publicKey.toString()).to.be(keyPair.publicKey.toString());
    expect(keyPairDeserialized.privateKey.toString()).to.be(keyPair.privateKey.toString());

    callback();

  });

  it('should encrypt and decrypt data using the security layer', function (callback) {
    var message = 'this is a secret';

    var encrypted = testServices.crypto.asymmetricEncrypt(generatedPublicKeyBob, generatedPrivateKeyAlice, message);
    var decrypted = testServices.crypto.asymmetricDecrypt(generatedPublicKeyAlice, generatedPrivateKeyBob, encrypted);

    if (message == encrypted)
      throw new Error('encrypted data matches secret message');

    if (message != decrypted)
      throw new Error('decrypted data does not match secret message');

    callback();

  });

  it('should encrypt and decrypt data using symmetric hashing in the security layer', function (callback) {

    var message = 'this is a secret';
    testServices.crypto.generateHash(message, function (e, hash) {
      if (e)  return callback(e);

      testServices.crypto.verifyHash(message, hash, function (e, verified) {

        if (e)  return callback(e);
        expect(verified).to.be(true);
        callback();

      });

    });

  });

});
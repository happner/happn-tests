[![npm](https://img.shields.io/npm/v/happn-tests.svg)](https://www.npmjs.com/package/happn-tests) [![Build Status](https://travis-ci.org/happner/happn-tests.svg?branch=master)](https://travis-ci.org/happner/happn-tests) [![Coverage Status](https://coveralls.io/repos/happner/happn-tests/badge.svg?branch=master&service=github)](https://coveralls.io/github/happner/happn-tests?branch=master) [![David](https://img.shields.io/david/happner/happn-tests.svg)]()

<img src="https://raw.githubusercontent.com/happner/happner-website/master/images/HAPPN%20Logo%20B.png" width="300"></img>

happn tests
-----------
*we have a standard test that we inject a bunch of different contexts through, so if you happn to build a plugin for happn - you would use this test suite to ensure your code is up to standard.*

getting started:
----------------

```bash
npm install happn-tests
```

the create a tests directory, in that directory create a "happn_test.js" file and a "context" folder - the happn_test.js file sets up the happn-tests suite and call's its run method, in the example below, a TEST_GLOBALS object is also created, so that contexts are able to use properties on the TEST_GLOBALS later:

happn_test.js:
--------------

```javascript

//this is specific to the project you are testing - this code is borrowed from the mongo plugin for happn
TEST_GLOBALS = {};

var service = require('../tests.js');
var serviceInstance = new service();

var config = {
	url:'mongodb://127.0.0.1:27017/happn'
}

serviceInstance.initialize(config, function(e){

	if (e) throw e;

	TEST_GLOBALS.mongoService = serviceInstance;

	//we have initialised some global objects, now time to run our test:

	var happn_tests = require('happn-tests').instantiate(__dirname + '/context');//the __dirname + context - is where our test context files will be found, this can be left blank if your context file is in [app root]/test/context

	//we run the tests - the contexts are iterated through and injected into our tests, the tests are designed to pick up contexts that have filenames that start with the filenames of the tests (without extensions), so the context 01-vanilla_test.js matches the 01-vanilla.js test

	happn_tests.run(function(e){
		if (e) {
			console.log('tests ran with failures', e);
			process.exit(1);
		}
		else{
			console.log('tests passed ok');
			process.exit(0);
		}
	});

});

```

contexts
--------

*the contexts are little modules that supply the tests with configurations that are being tested against, here is an example context file for the 01-vanilla test:*

```javascript

var happn = require('happn')
var happn_client = happn.client;

module.exports = {
  //the test needs a required happn module
  happnDependancy:require('happn'),
  //some additional information if you want - just used to console.log out
  description:"eventemitter embedded functional tests",
  //the happn service configuration - we are going for default vanilla here
  serviceConfig:{},
  //this specific test needs a happn client in a specific configuration - in this case in EventEmitter mode
  publisherClient:function(happnInstance, callback){

    var config =  {
		plugin: happn.client_plugins.intra_process,
		context: happnInstance
	}

	happn_client.create(config, callback);
  },
  //this specific test needs a happn client in a specific configuration - in this case in EventEmitter mode
  listenerClient:function(happnInstance, callback){

  	var config =  {
		plugin: happn.client_plugins.intra_process,
		context: happnInstance
	}

	happn_client.create(config, callback);
  }
}

```

you save your context file as 01-vanilla-[my context name].js in the context folder. you are now A for away and can test, using node like so:

```bash
node test/happn_test.js
```

*NB: if you are already running mocha tests, it is fine to locate your happn_test file elsewhere - so you dont get instances where the tests are automatically run causing issues, you can also update your package.json to run mocha tests and then the happn_test file, as follows: *

```json

{
  "name": "happn-tests",
  "description": "service plugin for running happn on a mongo database",
  "version": "0.0.3",
  "main": "./lib/index",
  "scripts": {
    "test": "mocha silence.js test/functional && node test/happn-test",
    "test-cover": "istanbul cover _mocha -- silence.js test"
  },

```

this was again borrowed from the [happn mongo service's](https://github.com/happner/happn-tests) package.json.




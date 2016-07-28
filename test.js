function Test(){

}

Test.prototype.initialize = function(testName, testFunction){
  var fs = require('fs');

  var contextNames = fs.readdirSync(__dirname + '/templates/context');
  var testTemplates = fs.readdirSync(__dirname + '/templates');

  var happn_tests_config = require('./config');

  var testFiles = [];
  var testContexts = [];

  testTemplates.map(function(templateName){
    if (templateName != 'tmp' && (templateName == testName + '.js' || templateName == 'only.' + testName + '.js'))
      testFiles.push(templateName);
  });

  testFiles.map(function(testFilename){

    testFilename = testFilename.replace('.js','').replace('only.','');

    contextNames.map(function(contextName){

      if (contextName.indexOf(testFilename) == 0){

        var testName = contextName.replace('.js','').replace('only.','');

        testContexts.push(contextName);

        var Context = require(__dirname + '/templates/context/' + contextName);

        Context.name = contextName;

        Context.config = happn_tests_config;

        Context.happn = Context.happnDependancy;
        Context.service = Context.happn.service;
        Context.happn_client = Context.happn.client;

        var TestHelper = require('./test_helper');

        Context.helper = new TestHelper(testName);

        Contexts[testName] = Context;
        describe(testName, testFunction);

      }
    });
  });
}


module.exports = Test;
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

  for (var fileNameIndex in testFiles) {

    var testFilename = testFiles[fileNameIndex].replace('.js','').replace('only.','');

    contextNames.map(function(contextName){

      console.log('checking context against test file:::', contextName, testFilename);

      if (contextName.indexOf(testFilename) == 0){

        console.log('describe in:::',describe);

        testContexts.push(contextName);

        testFunction.__config = happn_tests_config;
        testFunction.__context = require(__dirname + '/templates/context/' + contextName);

        testFunction.__happn = testFunction.__context.happnDependancy;
        testFunction.__service = testFunction.__happn.service;
        testFunction.__happn_client = testFunction.__happn.client;

        testFunction.__expect = require('expect.js');

        describe(testFilename.replace('.js', ''), testFunction);

      }
    });
  }
}

module.exports = Test;
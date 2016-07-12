var async = require('async');

function Test(){

}

Test.prototype.initialize = function(testName, testFunction, callback){
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

  async.eachSeries(testFiles, function(testFilename, testFilenameCB){
    testFilename = testFilename.replace('.js','').replace('only.','');

    async.eachSeries(contextNames, function(contextName, contextNameCB){

      if (contextName.indexOf(testFilename) == 0){

        var testName = contextName.replace('.js','').replace('only.','');

        testContexts.push(contextName);

        var Context = require(__dirname + '/templates/context/' + contextName);

        if (!Context.init)
          Context.init = function(cb){
            cb();
          };

        Context.name = contextName;
        Context.config = happn_tests_config;

        Context.happn = Context.happnDependancy;
        Context.service = Context.happn.service;
        Context.happn_client = Context.happn.client;

        var TestHelper = require('./test_helper');

        Context.helper = new TestHelper(testName);

        Context.init(function(e){

          if (e) return contextNameCB(e);
          //add to the contexts
          Contexts[testName] = Context;
          describe(testName, testFunction);
          contextNameCB();

        });
      }
    }, testFilenameCB);

  }, callback);
}

module.exports = Test;
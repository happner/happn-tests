var commander = require('commander');

commander

  .allowUnknownOption()//fixes the unknown option error
  .version(JSON.parse(require('fs').readFileSync(__dirname + require('path').sep + 'package.json')).version)
  .option('--conf [file]', 'Load mesh config from file/module (js)') // ie. module.exports = {/* the config */}
  .option('--silent', 'Run tests quietly')
  .option('--log_level', 'If not silent, the log level')
  .parse(process.argv);

if (commander.silent)
  process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'off';
else{
  if (commander.log_level)
    process.env.LOG_LEVEL = commander.log_level;
}

var configPath = __dirname + '/config.js';

if (commander.conf) configPath = commander.conf;

var runConfig;

try{
  runConfig = require(configPath);
}catch(e){
  if (e) throw new Error('bad config path or invalid config: ' + configPath);
}

if (!runConfig.contextPath) runConfig.contextPath = __dirname + '/contexts';
if (!runConfig.templatePath) runConfig.templatePath = __dirname + '/templates';

var happn_tests = require('./tests').instantiate(runConfig);

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
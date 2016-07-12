var happn_tests = require('./tests').instantiate({
  contextPath:__dirname + '/contexts',
  templatePath:__dirname + '/templates',
  configPath:__dirname + '/config.js'
});

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
var happn_tests = require('../index').instantiate(__dirname + '/context');
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
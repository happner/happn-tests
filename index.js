module.exports = HappnTests;
module.exports.instantiate = function(opts){
	return new HappnTests(opts);
}

function HappnTests(opts) {

	if (typeof opts == 'string') opts = {
		contextDirectory:opts
	}

	if (!opts) opts = {};

	if (!opts.contextDirectory)
		opts.contextDirectory = '../../test/context';

	if (!opts.templateDirectory)
		opts.templateDirectory = __dirname + '/templates';

	this.opts = opts;

}

HappnTests.prototype.run = function(){

	var Mocha = require('mocha');
	var mocha = new Mocha();
	var fs = require('fs-extra');
	var path = require('path');
	var _this = this;

	var testFiles = fs.readdirSync(_this.opts.templateDirectory);
	var testContextFiles = fs.readdirSync(_this.opts.contextDirectory);

	console.log('ensuring:::' + __dirname + path.sep + 'templates' + path.sep + 'context');

	fs.ensureDirSync(__dirname + path.sep + 'templates' + path.sep + 'context');

	console.log('emptying:::' + __dirname + path.sep + 'templates' + path.sep + 'context');

	fs.emptyDirSync(__dirname + path.sep + 'templates' + path.sep + 'context')

	//move context to where they should be
	for (var iFile in testContextFiles){

		var fileName = testContextFiles[iFile];
		if (fs.lstatSync(_this.opts.contextDirectory + path.sep + fileName).isFile()){
			console.log('copying ' + _this.opts.contextDirectory + path.sep + fileName);
			console.log('to ' + _this.opts.contextDirectory + path.sep + testContextFiles[iFile]);
			fs.copySync(_this.opts.contextDirectory + path.sep + fileName, _this.opts.contextDirectory + path.sep + testContextFiles[iFile]);
		}

	}

	//add the templates to the test
	for (var iFile in testFiles){

		var fileName = testFiles[iFile];
		if (fs.lstatSync(_this.opts.templateDirectory + path.sep + fileName).isFile()){
			mocha.addFile(_this.opts.templateDirectory + path.sep + testFiles[iFile]);
		}
	}

	mocha.run(function(e) {
		if (e)
			console.log(e);
		else
			console.log('happn tests ran ok');
	});
}


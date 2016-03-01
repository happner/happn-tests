module.exports = HappnTests;
module.exports.instantiate = function(opts){
	return new HappnTests(opts);
}

function HappnTests(opts) {

	if (typeof opts == 'string') opts = {
		contextDirectory:opts
	}

	if (!opts) opts = {};

	if (!opts.contextDirectory){
		var path = require('path');
		opts.contextDirectory = path.resolve(__dirname, '../../test/context')
	}

	if (!opts.templateDirectory)
		opts.templateDirectory = __dirname + '/templates';

	this.opts = opts;

}

HappnTests.prototype.run = function(callback){

	try{

		var Mocha = require('mocha');
		var mocha = new Mocha();
		var fs = require('fs-extra');
		var path = require('path');
		var _this = this;

		var testFiles = fs.readdirSync(_this.opts.templateDirectory);
		var testContextFiles = fs.readdirSync(_this.opts.contextDirectory);
		fs.ensureDirSync(__dirname + path.sep + 'templates' + path.sep + 'context');
		fs.emptyDirSync(__dirname + path.sep + 'templates' + path.sep + 'context')

		//move context to where they should be
		for (var iFile in testContextFiles){

			var fileName = testContextFiles[iFile];
			if (fs.lstatSync(_this.opts.contextDirectory + path.sep + fileName).isFile()){
				fs.copySync(_this.opts.contextDirectory + path.sep + fileName, _this.opts.templateDirectory + path.sep + 'context' + path.sep + fileName);
			}

		}

		//add the templates to the test
		for (var iFile in testFiles){
			var fileName = testFiles[iFile];
			if (fs.lstatSync(_this.opts.templateDirectory + path.sep + fileName).isFile()){
				mocha.addFile(_this.opts.templateDirectory + path.sep + fileName);
			}
		}

		mocha.run(function(failures){

			if (failures) return callback(new Error('tests ran with failures:' + failures));

			callback();
		});

	}catch(e){
		callback(e);
	}
}


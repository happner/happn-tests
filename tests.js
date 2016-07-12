Test = require('./test');

module.exports = HappnTests;
module.exports.instantiate = function(opts){
	return new HappnTests(opts);
}

function HappnTests(opts) {

	if (typeof opts == 'string') opts = {
		contextPath:opts
	}

	if (!opts) opts = {};

	if (!opts.contextPath){
		var path = require('path');
		opts.contextPath = __dirname + '/contexts';
	}

	if (!opts.templatePath)
		opts.templatePath = __dirname + '/templates';

	if (!opts.config)
		opts.config = __dirname + '/config.js';

	this.opts = opts;
}

HappnTests.prototype.run = function(callback){

	try{

		var Mocha = require('mocha');
		var mocha = new Mocha();
		var fs = require('fs-extra');
		var path = require('path');
		var _this = this;

		var testFiles = fs.readdirSync(_this.opts.templatePath);
		var testContextFiles = fs.readdirSync(_this.opts.contextPath);

		fs.ensureDirSync(__dirname + path.sep + 'templates' + path.sep + 'context');
		fs.emptyDirSync(__dirname + path.sep + 'templates' + path.sep + 'context')

		var onlyContext;
		var onlyTemplate;

		for (var iFile in testContextFiles){
			var fileName = testContextFiles[iFile];
			if (fs.lstatSync(_this.opts.contextPath + path.sep + fileName).isFile()){
				if (fileName.indexOf('only.') == 0){
					testContextFiles = [fileName];
					break;
				}
			}
		}

		for (var iFile in testFiles){
			var fileName = testFiles[iFile];
			if (fs.lstatSync(_this.opts.templatePath + path.sep + fileName).isFile()){
				if (fileName.indexOf('only.') == 0){
					testFiles = [fileName];
					break;
				}
			}
		}

		//move context to where they should be
		for (var iFile in testContextFiles){

			var fileName = testContextFiles[iFile];

			if (fileName.indexOf('skip.') == 0 || fileName.indexOf('.') == 0) continue;

			if (fs.lstatSync(_this.opts.contextPath + path.sep + fileName).isFile()){
				fs.copySync(_this.opts.contextPath + path.sep + fileName, _this.opts.templatePath + path.sep + 'context' + path.sep + fileName);
				console.log('copied over context:::', _this.opts.templatePath + path.sep + 'context' + path.sep + fileName);
			}

		}

		//add the templates to the test
		var testsToRun = [];
		for (var iFile in testFiles){
			var fileName = testFiles[iFile];

			if (fileName.indexOf('skip.') == 0 || fileName.indexOf('.') == 0) continue;

			if (fs.lstatSync(_this.opts.templatePath + path.sep + fileName).isFile()){
				mocha.addFile(_this.opts.templatePath + path.sep + fileName);
				console.log('added test file:::', _this.opts.templatePath + path.sep + fileName);
				testsToRun.push(_this.opts.templatePath + path.sep + fileName);
			}
		}

		console.log('running tests:::', testsToRun.join(','));
		mocha.run(function(failures){

			if (failures) return callback(new Error('tests ran with failures:' + failures));

			callback();
		});

	}catch(e){
		callback(e);
	}
}


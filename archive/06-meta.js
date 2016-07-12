var fs = require('fs');
var testFilenames = fs.readdirSync(__dirname + '/context');

var expect = require('expect.js');
var async = require('async');
var testport = 8000;
var test_secret = 'test_secret';
var mode = "embedded";

var happn_tests_config = require('../test/config');

var testFiles = [];

for (var testFileIndex in testFilenames){

	var testFilename = testFilenames[testFileIndex];

	if (testFilename.indexOf('06-meta') != 0 && testFilename.indexOf('only.06-meta') != 0) continue;//we only use files that start with 'test-'

	testFiles.push(testFilename);

	describe(testFilename.replace('.js',''), function() {

		this.timeout(happn_tests_config.timeout);

		before(function () {

			var testFile = testFiles.shift();

			testInstance = require(__dirname + '/context/' + testFile);
			happn = testInstance.happnDependancy;
			service = happn.service;
			happn_client = happn.client;
			happnInstance = null;

	    });

	    after(function(done) {
	      happnInstance.stop(done);
	  	});

	  	before('should initialize the service', function (callback) {

		    try {
		      service.create(testInstance.serviceConfig,
		        function (e, happnInst) {
		          if (e)
		            return callback(e);

		          happnInstance = happnInst;
		          callback();
		        });
		    } catch (e) {
		      callback(e);
		    }
		});


		var publisherclient;
		var listenerclient;

	    /*
	    We are initializing 2 clients to test saving data against the database, one client will push data into the
	    database whilst another listens for changes.
	    */
		before('should initialize the clients', function (callback) {


		    try {

				testInstance.publisherClient(happnInstance, function (e, instance) {

		        if (e) return callback(e);

		        publisherclient = instance;

		        testInstance.listenerClient(happnInstance, function (e, instance) {

		          if (e) return callback(e);
		          listenerclient = instance;
		          callback();

		        });

		      });

		    } catch (e) {
		      callback(e);
		    }

		});


	    var test_path = '/test/meta/' + require('shortid').generate();
	    var test_path_remove = '/test/meta/remove' + require('shortid').generate();
	    var test_path_all = '/test/meta/all' + require('shortid').generate();
	    var test_path_created_modified = '/test/meta/created_modified' + require('shortid').generate();
	    var test_path_created_modified_notmerge = '/test/meta/created_modified_notmerge' + require('shortid').generate();
	    var test_path_timestamp = '/test/meta/test_path_timestamp' + require('shortid').generate();


		it('tests the set meta data', function (callback) {



		    try {
		      //first listen for the change
		      listenerclient.on(test_path, {event_type: 'set', count: 1}, function (data, meta) {

		        expect(meta.path).to.be(test_path);
		        callback();

		      }, function (e) {

		        if (!e) {

		          expect(listenerclient.events['/SET@' + test_path].length).to.be(1);

		          //then make the change
		          publisherclient.set(test_path, {
		            property1: 'property1',
		            property2: 'property2',
		            property3: 'property3'
		          }, null, function (e, result) {

		            if (e) return callback(e);
		            expect(result._meta.path).to.be(test_path);
		          });
		        }
		        else
		          callback(e);
		      });

		    } catch (e) {
		      callback(e);
		    }
		});

			  it('tests the update meta data', function (callback) {

			    publisherclient.set(test_path, {
			      property1: 'property1',
			      property2: 'property2',
			      property3: 'property3'
			    }, {}, function (e, result) {

			      if (e) return callback(e);

			      expect(result._meta.path).to.be(test_path);

			      callback();

			    });

			  });

			  it('tests the delete meta data', function (callback) {

			    publisherclient.set(test_path_remove, {
			      property1: 'property1',
			      property2: 'property2',
			      property3: 'property3'
			    }, {}, function (e, result) {

			      if (e) return callback(e);


			      expect(result._meta.path).to.be(test_path_remove);

			      listenerclient.on(test_path_remove, {event_type: 'remove', count: 1}, function (data, meta) {
			        expect(meta.path).to.be(test_path_remove);
			        callback();
			      }, function(e){

			        if (e) return callback(e);

			        publisherclient.remove(test_path_remove,
			          {},
			          function (e, result) {

			          if (e) return callback(e);

			          expect(result._meta.path).to.be('/REMOVE@' + test_path_remove);

			        });
			      });
			    });
			  });

			  it('tests created and modified dates, merge', function (callback) {

			    publisherclient.set(test_path_created_modified, {
			      property1: 'property1',
			      property2: 'property2',
			      property3: 'property3'
			    }, {}, function (e, result) {

			      if (e) return callback(e);

			      expect(result._meta.created).to.not.be(null);
			      expect(result._meta.created).to.not.be(undefined);

			      expect(result._meta.modified).to.not.be(null);
			      expect(result._meta.modified).to.not.be(undefined);

			      expect(result._meta.modified.toString()).to.be(result._meta.created.toString());

			      setTimeout(function(){

			        publisherclient.set(test_path_created_modified, {
			          property4: 'property4'
			        }, {merge:true}, function (e, result) {

			          if (e) return callback(e);

			           publisherclient.get(test_path_created_modified, function(e, result){

			            expect(result._meta.modified > result._meta.created).to.be(true);
			            callback();

			           });

			        })

			      }, 1000);

			    });
			  });

			  it('tests created and modified dates, not merge', function (callback) {

			    publisherclient.set(test_path_created_modified_notmerge, {
			      property1: 'property1',
			      property2: 'property2',
			      property3: 'property3'
			    }, {}, function (e, result) {

			      if (e) return callback(e);

			      expect(result._meta.created).to.not.be(null);
			      expect(result._meta.created).to.not.be(undefined);

			      expect(result._meta.modified).to.not.be(null);
			      expect(result._meta.modified).to.not.be(undefined);

			      expect(result._meta.modified.toString()).to.be(result._meta.created.toString());

			      setTimeout(function(){

			        publisherclient.set(test_path_created_modified_notmerge, {
			          property4: 'property4'
			        }, {}, function (e, result) {

			          if (e) return callback(e);

			           publisherclient.get(test_path_created_modified_notmerge, function(e, result){

			            expect(result._meta.modified > result._meta.created).to.be(true);
			            callback();

			           });

			        })

			      }, 1000);

			    });
			  });

			  it('searches by timestamps', function (callback) {



			    var itemIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

			    var windowStart = Date.now();

			    //we save 10 items, with timestamp path, then do a search with modified, then a search created - ensure the counts are right
			    async.eachSeries(itemIndexes,
			    function(index, eachCallback){

			      publisherclient.set(test_path_timestamp + index, {
			          property4: 'property4',
			          ind:index
			      }, eachCallback);

			    },
			    function(e){

			      if (e) return callback(e);

			      //now set an 11th after a second

			      setTimeout(function(){

			        var windowEnd = Date.now();

			        publisherclient.set(test_path_timestamp + 10, {
			            property4: 'property4',
			            ind:10
			        }, function(e, eleventhItem){

			          var searchCriteria = {
			            '_meta.created':{
			              '$gte':windowStart,
			              '$lt':windowEnd
			            }
			          }

			          publisherclient.get('*', {criteria:searchCriteria}, function(e, items){

			            if (e) return callback(e);
			            expect(items.length == 10).to.be(true);

			            var searchCriteria = {
			              '_meta.created':{
			                '$gte':windowEnd
			              }
			            }

			            publisherclient.get('*', {criteria:searchCriteria}, function(e, items){

			              if (e) return callback(e);

			              expect(items.length == 1).to.be(true);
			              expect(items[0].ind).to.be(10);

			              setTimeout(function(){

			                var lastModified = Date.now();

			                publisherclient.set(test_path_timestamp + '0', {
			                  modifiedProperty:'modified'
			                }, {merge:true}, function(e, modifiedItem){

			                  if (e) return callback(e);

			                  var searchCriteria = {
			                    '_meta.modified':{
			                      '$gte':lastModified
			                    }
			                  }

			                  publisherclient.get('*', {criteria:searchCriteria}, function(e, items){

			                    if (e) return callback(e);

			                    expect(items.length == 1).to.be(true);
			                    expect(items[0].ind).to.be(0);

			                    callback();

			                  });

			                });

			              }, 1000);

			            });

			          });

			        });


			      }, 2000);

			    });

			  });

			it('tests the all meta data', function (callback) {



			    try {
			      //first listen for the change
			      listenerclient.onAll(function (data, meta) {

			        expect(meta.path).to.be(test_path_all);
			        expect(meta.channel).to.be('/ALL@*');

			        callback();

			      }, function (e) {

			        if (e) return callback(e);

			        //then make the change
			        publisherclient.set(test_path_all, {
			          property1: 'property1',
			          property2: 'property2',
			          property3: 'property3'
			        }, null, function (e, result) {

			          if (e) return callback(e);

			          expect(result._meta.path).to.be(test_path_all);

			        });

			      });

		    } catch (e) {
		      callback(e);
		    }

		});

	});

}
var fs = require('fs');
var testFilenames = fs.readdirSync(__dirname + '/context');

var expect = require('expect.js');
var async = require('async');
var testport = 8000;
var test_secret = 'test_secret';
var mode = "embedded";
var default_timeout = 10000;

var testFiles = [];

for (var testFileIndex in testFilenames){

	var testFilename = testFilenames[testFileIndex];

	if (testFilename.indexOf('04-listeners') != 0 && testFilename.indexOf('only.04-listeners') != 0) continue;//we only use files that start with 'test-'

	testFiles.push(testFilename);

	describe(testFilename.replace('.js',''), function() {

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

		it('should initialize the service', function (callback) {

		    this.timeout(20000);

		    try {
		      service.create(JSON.parse(JSON.stringify(testInstance.serviceConfig)),
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
		  it('should initialize the clients', function (callback) {
		    this.timeout(default_timeout);

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

		  it('the listener should pick up a single wildcard event', function (callback) {

		    this.timeout(default_timeout);

		    try {
		      //first listen for the change
		      listenerclient.on('/e2e_test1/testsubscribe/data/event/*', {event_type: 'set', count: 1}, function (message) {

		        expect(listenerclient.events['/SET@/e2e_test1/testsubscribe/data/event/*'].length).to.be(0);
		        callback();

		      }, function (e) {

		        if (!e) {

		          expect(listenerclient.events['/SET@/e2e_test1/testsubscribe/data/event/*'].length).to.be(1);
		          var stats = happnInstance.stats();

		          //then make the change
		          publisherclient.set('/e2e_test1/testsubscribe/data/event/blah', {
		            property1: 'property1',
		            property2: 'property2',
		            property3: 'property3'
		          }, null, function (e, result) {
		            //console.log('put happened - listening for result');
		          });
		        }
		        else
		          callback(e);
		      });

		    } catch (e) {
		      callback(e);
		    }
		  });

		//	We set the listener client to listen for a PUT event according to a path, then we set a value with the publisher client.

		  it('the listener should pick up a single published event', function (callback) {

		    this.timeout(default_timeout);

		    try {

		      //first listen for the change
		      listenerclient.on('/e2e_test1/testsubscribe/data/event', {event_type: 'set', count: 1}, function (message) {

		        expect(listenerclient.events['/SET@/e2e_test1/testsubscribe/data/event'].length).to.be(0);
		        callback();

		      }, function (e) {

		        //////////////////console.log('ON HAS HAPPENED: ' + e);

		        if (!e) {

		          expect(listenerclient.events['/SET@/e2e_test1/testsubscribe/data/event'].length).to.be(1);
		          //////////////////console.log('on subscribed, about to publish');

		          //then make the change
		          publisherclient.set('/e2e_test1/testsubscribe/data/event', {
		            property1: 'property1',
		            property2: 'property2',
		            property3: 'property3'
		          }, null, function (e, result) {
		            ////////////////////////////console.log('put happened - listening for result');
		          });
		        }
		        else
		          callback(e);
		      });

		    } catch (e) {
		      callback(e);
		    }
		  });

		//	We set the listener client to listen for a PUT event according to a path, then we set a value with the publisher client.

		  it('the listener should pick up a single published event', function (callback) {

		    this.timeout(default_timeout);

		    try {

		      //first listen for the change
		      listenerclient.on('/e2e_test1/testsubscribe/data/event', {event_type: 'set', count: 1}, function (message) {

		        expect(listenerclient.events['/SET@/e2e_test1/testsubscribe/data/event'].length).to.be(0);
		        callback();

		      }, function (e) {

		        if (!e) {

		          expect(listenerclient.events['/SET@/e2e_test1/testsubscribe/data/event'].length).to.be(1);

		          ////////////////////////////console.log('on subscribed, about to publish');

		          //then make the change
		          publisherclient.set('/e2e_test1/testsubscribe/data/event', {
		            property1: 'property1',
		            property2: 'property2',
		            property3: 'property3'
		          }, null, function (e, result) {
		            ////////////////////////////console.log('put happened - listening for result');
		          });
		        }
		        else
		          callback(e);
		      });

		    } catch (e) {
		      callback(e);
		    }
		  });

		  it('the listener should pick up a single delete event', function (callback) {

		    this.timeout(default_timeout);

		    try {

		      //We put the data we want to delete into the database
		      publisherclient.set('/e2e_test1/testsubscribe/data/delete_me', {
		        property1: 'property1',
		        property2: 'property2',
		        property3: 'property3'
		      }, null, function (e, result) {

		        //////////////////console.log('did delete set');
		        //path, event_type, count, handler, done
		        //We listen for the DELETE event
		        listenerclient.on('/e2e_test1/testsubscribe/data/delete_me', {
		          event_type: 'remove',
		          count: 1
		        }, function (eventData) {

		          //we are looking at the event internals on the listener to ensure our event management is working - because we are only listening for 1
		          //instance of this event - the event listener should have been removed
		          ////console.log('listenerclient.events');
		          ////console.log(listenerclient.events);
		          expect(listenerclient.events['/REMOVE@/e2e_test1/testsubscribe/data/delete_me'].length).to.be(0);

		          ////console.log(eventData);

		          //we needed to have removed a single item
		          expect(eventData.removed).to.be(1);

		          ////////////////////////////console.log(message);

		          callback();

		        }, function (e) {

		          ////////////console.log('ON HAS HAPPENED: ' + e);

		          if (!e) {
		            ////console.log('listenerclient.events, pre');
		            ////console.log(listenerclient.events);
		            expect(listenerclient.events['/REMOVE@/e2e_test1/testsubscribe/data/delete_me'].length).to.be(1);

		            //////////////////console.log('subscribed, about to delete');

		            //We perform the actual delete
		            publisherclient.remove('/e2e_test1/testsubscribe/data/delete_me', null, function (e, result) {


		              //////////////////console.log('REMOVE HAPPENED!!!');
		              //////////////////console.log(e);
		              //////////////////console.log(result);


		              ////////////////////////////console.log('put happened - listening for result');
		            });
		          }
		          else
		            callback(e);
		        });
		      });


		    } catch (e) {
		      callback(e);
		    }
		  });

		  it('should unsubscribe from an event', function (callback) {

		    var currentListenerId;

		    listenerclient.on('/e2e_test1/testsubscribe/data/on_off_test', {event_type: 'set', count: 0}, function (message) {

		      //we detach all listeners from the path here
		      ////console.log('ABOUT OFF PATH');
		      listenerclient.off('/e2e_test1/testsubscribe/data/on_off_test', function (e) {

		        if (e)
		          return callback(new Error(e));

		        listenerclient.on('/e2e_test1/testsubscribe/data/on_off_test', {event_type: 'set', count: 0},
		          function (message) {

		            ////console.log('ON RAN');
		            ////console.log(message);

		            listenerclient.off(currentListenerId, function (e) {

		              if (e)
		                return callback(new Error(e));
		              else
		                return callback();

		            });

		          },
		          function (e, listenerId) {
		            if (e) return callback(new Error(e));

		            currentListenerId = listenerId;

		            publisherclient.set('/e2e_test1/testsubscribe/data/on_off_test', {
		              property1: 'property1',
		              property2: 'property2',
		              property3: 'property3'
		            }, {}, function (e, setresult) {
		              if (e) return callback(new Error(e));

		              ////console.log('DID ON SET');
		              ////console.log(setresult);
		            });

		          });

		      });

		    }, function (e, listenerId) {
		      if (e) return callback(new Error(e));

		      currentListenerId = listenerId;

		      publisherclient.set('/e2e_test1/testsubscribe/data/on_off_test', {
		        property1: 'property1',
		        property2: 'property2',
		        property3: 'property3'
		      }, {}, function (e, setresult) {
		        if (e) return callback(new Error(e));
		      });
		    });
		  });

		  it('should subscribe to the catch all notification', function (callback) {

		    var caught = {};

		    this.timeout(10000);
		    var caughtCount = 0;

		    listenerclient.onAll(function (eventData, meta) {

		      if (meta.action == '/REMOVE@/e2e_test1/testsubscribe/data/catch_all' ||
		          meta.action == '/SET@/e2e_test1/testsubscribe/data/catch_all')
		        caughtCount++;

		      if (caughtCount == 2)
		        callback();

		    }, function (e) {

		      if (e) return callback(e);


		      publisherclient.set('/e2e_test1/testsubscribe/data/catch_all', {
		        property1: 'property1',
		        property2: 'property2',
		        property3: 'property3'
		      }, null, function (e, put_result) {



		        publisherclient.remove('/e2e_test1/testsubscribe/data/catch_all', null, function (e, del_result) {


		        });

		      });

		    });

		  });

		  it('should unsubscribe from all events', function (callback) {
		    this.timeout(10000);

		    var onHappened = false;

		    listenerclient.onAll(function (message) {

		      onHappened = true;
		      callback(new Error('this wasnt meant to happen'));

		    }, function (e) {

		      if (e) return callback(e);

		      listenerclient.on('/e2e_test1/testsubscribe/data/off_all_test', {event_type: 'set', count: 0},
		        function (message) {
		          onHappened = true;
		          callback(new Error('this wasnt meant to happen'));
		        },
		        function (e) {
		          if (e) return callback(e);

		          listenerclient.offAll(function (e) {
		            if (e) return callback(e);

		            publisherclient.set('/e2e_test1/testsubscribe/data/off_all_test', {
		              property1: 'property1',
		              property2: 'property2',
		              property3: 'property3'
		            }, null, function (e, put_result) {
		              if (e) return callback(e);

		              setTimeout(function () {

		                if (!onHappened)
		                  callback();

		              }, 3000);
		            });
		          });
		        }
		      );
		    });
		  });

	});
}
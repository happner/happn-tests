var test = new Test();

test.initialize('07-datatypes', function() {

  var default_timeout = 10000;
  var happnInstance = null;
  var test_id;

  /*
   This test demonstrates starting up the happn service -
   the authentication service will use authTokenSecret to encrypt web tokens identifying
   the logon session. The utils setting will set the system to log non priority information
   */

  var publisherclient;
  var listenerclient;
  var happn_client;

  before('should initialize the service and the publisher client', function (callback) {

    test_id = this.test.Context.helper.testId();
    happn_client = this.test.Context.happnDependancy.client;
    try {

      this.test.Context.helper.startHappnServices([this.test.Context.serviceConfig], this.test.Context.startServiceOptions, function(e, services, clients){
        happnInstance = services[0];
        publisherclient = clients[0];
        callback();
      });

    } catch (e) {
      callback(e);
    }
  });

  after(function (done) {
    this.test.Context.helper.tearDown(done);
  });

  /*
   We are initializing 2 clients to test saving data against the database, one client will push data into the
   database whilst another listens for changes.
   */
  before('should initialize the listener client', function (callback) {

    var _this = this;

    try {

      _this.test.Context.helper.connectHappnClient(happnInstance, function (e, instance) {

        if (e) return callback(e);

        _this.test.Context.helper.addHappnClient(instance);

        listenerclient = instance;
        callback();

      });

    } catch (e) {
      callback(e);
    }
  });

  it('the publisher should set string data', function (callback) {

    this.timeout(default_timeout);

    try {
      var test_string = require('shortid').generate();
      var test_base_url = '/a1_eventemitter_embedded_datatypes/' + test_id + '/set/string/' + test_string;

      publisherclient.set(test_base_url, test_string, {noPublish: true}, function (e, result) {

        if (!e) {

          expect(result.value).to.be(test_string);

          publisherclient.get(test_base_url, null, function (e, result) {

            if (e) return callback(e);

            expect(result.value).to.be(test_string);

            callback(e);
          });
        }
        else
          callback(e);
      });

    } catch (e) {
      callback(e);
    }
  });

  it('the publisher should set number data', function (callback) {

    this.timeout(default_timeout);

    try {

      var test_number = Math.random();
      var test_base_url = '/a1_eventemitter_embedded_datatypes/' + test_id + '/set/number/' + test_number.toString().replace('.', '');

      publisherclient.set(test_base_url, test_number, {noPublish: true}, function (e, result) {

        if (!e) {

          expect(result.value).to.be(test_number);

          publisherclient.get(test_base_url, null, function (e, result) {

            if (e) return callback(e);

            expect(result.value).to.be(test_number);

            callback(e);
          });
        }
        else
          callback(e);
      });

    } catch (e) {
      callback(e);
    }

  });

  it('the publisher should set boolean data', function (callback) {

    this.timeout(default_timeout);

    try {

      var test_bool = true;
      var test_base_url = '/a1_eventemitter_embedded_datatypes/' + test_id + '/set/boolean/' + test_bool.toString();

      publisherclient.set(test_base_url, test_bool, {noPublish: true}, function (e, result) {

        if (!e) {

          expect(result.value).to.be(test_bool);

          publisherclient.get(test_base_url, null, function (e, result) {

            if (e) return callback(e);

            expect(result.value).to.be(test_bool);

            callback(e);
          });
        }
        else
          callback(e);
      });

    } catch (e) {
      callback(e);
    }
  });

  it('the publisher should set date data', function (callback) {

    this.timeout(default_timeout);

    try {

      var test_date = new Date();
      var test_base_url = '/a1_eventemitter_embedded_datatypes/' + test_id + '/set/date';

      publisherclient.set(test_base_url, test_date, {noPublish: true}, function (e, result) {

        if (!e) {

          expect(result.value).to.be(test_date);

          publisherclient.get(test_base_url, null, function (e, result) {

            if (e) return callback(e);

            expect(result.value).to.be(test_date);

            callback(e);
          });
        }
        else
          callback(e);
      });

    } catch (e) {
      callback(e);
    }
  });

  it('the publisher should set null data', function (callback) {

    this.timeout(default_timeout);

    try {

      var test_null = null;
      var test_base_url = '/a1_eventemitter_embedded_datatypes/' + test_id + '/set/null';

      publisherclient.set(test_base_url, test_null, {noPublish: true}, function (e, result) {

        if (!e) {

          expect(result.value).to.be(test_null);

          publisherclient.get(test_base_url, null, function (e, result) {

            if (e) return callback(e);

            expect(result.value).to.be(test_null);//YES. IT IS NOW UNDEFINED

            callback(e);
          });
        }
        else
          callback(e);
      });

    } catch (e) {
      callback(e);
    }
  });

  it('the publisher should set undefined data', function (callback) {

    this.timeout(default_timeout);

    try {

      var test_undefined = undefined;
      var test_base_url = '/a1_eventemitter_embedded_datatypes/' + test_id + '/set/undefined';

      publisherclient.set(test_base_url, test_undefined, {noPublish: true}, function (e, result) {

        if (!e) {

          expect(result.value).to.be(test_undefined);

          publisherclient.get(test_base_url, null, function (e, result) {

            if (e) return callback(e);

            expect(result.value).to.be(test_undefined);

            callback(e);
          });
        }
        else
          callback(e);
      });

    } catch (e) {
      callback(e);
    }
  });

  it('the publisher should set array data', function (callback) {

    this.timeout(default_timeout);

    try {

      var test_array = [0, 1, 2, 3, 4, 5];
      var test_base_url = '/a1_eventemitter_embedded_datatypes/' + test_id + '/set/array';

      publisherclient.set(test_base_url, test_array, {noPublish: true}, function (e, result) {

        if (!e) {

          expect(result.value.length).to.be(6);

          publisherclient.get(test_base_url, null, function (e, result) {

            if (e) return callback(e);

            expect(result.value.length).to.be(6);
            expect(result.value[0]).to.be(0);
            expect(result.value[5]).to.be(5);

            callback(e);

          });
        }
        else
          callback(e);
      });

    } catch (e) {
      callback(e);
    }
  });

  it('wildcards, the listener should pick up a single wildcard event', function (callback) {

    this.timeout(default_timeout);

    var test_base_url = '/a1_eventemitter_embedded_datatypes/' + test_id + '/wildcard';
    var test_path_end = require('shortid').generate();

    try {

      //first listen for the change
      listenerclient.on(test_base_url + '/*', {event_type: 'set', count: 1}, function (message) {

        expect(listenerclient.events['/SET@' + test_base_url + '/*'].length).to.be(0);

        expect(message.value == "test string").to.be(true);

        callback();

      }, function (e) {

        if (!e) {

          expect(listenerclient.events['/SET@' + test_base_url + '/*'].length).to.be(1);
          //////////////////console.log('on subscribed, about to publish');

          //then make the change
          publisherclient.set(test_base_url + '/' + test_path_end, "test string", null, function (e, result) {


          });
        }
        else
          callback(e);
      });

    } catch (e) {
      callback(e);
    }
  });

});
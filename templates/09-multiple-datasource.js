var test = new Test();

test.initialize('09-multiple-datasource', function () {

  var fs;

  var tempFile;
  var tempFile1;

  var test_id;

  var services = [];

  var singleClient;
  var multipleClient;

  //console.log('persisted data file', tempFile1);

  var getService = function (config, callback) {
    var happn = require('happn');
    happn.service.create(config,
      callback
    );
  };

  before('should initialize the services', function (callback) {

    var _this = this;

    this.timeout(60000);//travis sometiems takes ages...

    fs = require('fs');

    tempFile = this.test.Context.helper.randomFile('db');
    tempFile1 = this.test.Context.helper.randomFile('db');

    test_id = this.test.Context.helper.testId();

    services = [];

    var serviceConfigs = [
      this.test.Context.serviceConfig1(tempFile),
      this.test.Context.serviceConfig2(tempFile1, test_id)
    ];

    async.eachSeries(serviceConfigs,
      function (serviceConfig, serviceConfigCallback) {
        getService(serviceConfig, function (e, happnService) {

          if (e) return serviceConfigCallback(e);

          _this.test.Context.helper.addHappnService(happnService);

          services.push(happnService);
          serviceConfigCallback();

        });
      },
      function (e) {

        if (e) return callback(e);

          _this.test.Context.client(services[0], function (e, client) {

            if (e) return callback(e);
            _this.test.Context.helper.addHappnClient(client);
            singleClient = client;

            _this.test.Context.client(services[1], function (e, client) {

              if (e) return callback(e);
              _this.test.Context.helper.addHappnClient(client);
              multipleClient = client;
              callback();

            });
        });
      });

  });

  after('should delete the temp data files', function (callback) {
   this.test.Context.helper.tearDown(callback);
  });

  it('should push some data into the single datastore service', function (callback) {

    this.timeout(4000);

    try {
      var test_path_end = require('shortid').generate();
      var test_path = '/09-multiple-datasource/' + test_id + '/set/' + test_path_end;

      singleClient.set(test_path, {
        property1: 'property1',
        property2: 'property2',
        property3: 'property3'
      }, {}, function (e, result) {

        if (!e) {
          singleClient.get(test_path, null, function (e, results) {
            expect(results.property1 == 'property1').to.be(true);
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

  it('should push some data into the multiple datastore', function (callback) {

    this.timeout(4000);

    try {
      var test_path_end = require('shortid').generate();
      var test_path = '/09-multiple-datasource/' + test_id + '/set/' + test_path_end;

      multipleClient.set(test_path, {
        property1: 'property1',
        property2: 'property2',
        property3: 'property3'
      }, {}, function (e, result) {

        if (!e) {
          multipleClient.get(test_path, null, function (e, results) {
            expect(results.property1 == 'property1').to.be(true);
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

  var findRecordInDataFile = function (path, filepath, callback) {

    try {

      setTimeout(function () {

        var fs = require('fs'), byline = require('byline');
        var stream = byline(fs.createReadStream(filepath, {encoding: 'utf8'}));
        var found = false;

        stream.on('data', function (line) {

          if (found)
            return;

          var record = JSON.parse(line);

          if (record._id == path) {
            found = true;
            stream.end();
            return callback(null, record);
          }

        });

        stream.on('end', function () {

          if (!found)
            callback(null, null);

        });

      }, 1000)

    } catch (e) {
      callback(e);
    }
  }

  it('should push some data into the multiple datastore, memory datastore, wildcard pattern', function (callback) {

    this.timeout(4000);

    try {
      var test_path_end = require('shortid').generate();
      var test_path = '/09-multiple-datasource/' + test_id + '/memorytest/' + test_path_end;

      multipleClient.set(test_path, {
        property1: 'property1',
        property2: 'property2',
        property3: 'property3'
      }, {}, function (e, result) {

        if (!e) {
          multipleClient.get(test_path, null, function (e, results) {

            expect(results.property1 == 'property1').to.be(true);

            findRecordInDataFile(test_path, tempFile1, function (e, record) {

              if (e) return callback(e);

              if (record)
                callback(new Error('record found in persisted file, meant to be in memory'));
              else
                callback();

            });

          });
        }
        else
          callback(e);
      });

    } catch (e) {
      callback(e);
    }

  });

  it('should push some data into the multiple datastore, persisted datastore, wildcard pattern', function (callback) {

    this.timeout(4000);

    try {
      var test_path_end = require('shortid').generate();
      var test_path = '/09-multiple-datasource/' + test_id + '/persistedtest/' + test_path_end;

      multipleClient.set(test_path, {
        property1: 'property1',
        property2: 'property2',
        property3: 'property3'
      }, {}, function (e, result) {

        if (!e) {
          multipleClient.get(test_path, null, function (e, results) {

            expect(results.property1 == 'property1').to.be(true);

            findRecordInDataFile(test_path, tempFile1, function (e, record) {

              if (e) return callback(e);

              //console.log('rec: ', record);

              if (record)
                callback();
              else
                callback(new Error('record not found in persisted file'));

            });

          });
        }
        else
          callback(e);
      });

    } catch (e) {
      callback(e);
    }

  });

  it('should push some data into the multiple datastore, memory datastore, exact pattern', function (callback) {

    this.timeout(4000);

    try {
      var test_path = '/09-multiple-datasource/' + test_id + '/memorynonwildcard';

      multipleClient.set(test_path, {
        property1: 'property1',
        property2: 'property2',
        property3: 'property3'
      }, {}, function (e, result) {

        if (!e) {
          multipleClient.get(test_path, null, function (e, results) {

            expect(results.property1 == 'property1').to.be(true);

            findRecordInDataFile(test_path, tempFile1, function (e, record) {

              if (e) return callback(e);

              if (record)
                callback(new Error('record found in persisted file, meant to be in memory'));
              else
                callback();

            });

          });
        }
        else
          callback(e);
      });

    } catch (e) {
      callback(e);
    }

  });

  it('should push some data into the multiple datastore, persisted datastore, exact pattern', function (callback) {

    this.timeout(4000);

    try {
      var test_path = '/09-multiple-datasource/' + test_id + '/persistednonwildcard';

      multipleClient.set(test_path, {
        property1: 'property1',
        property2: 'property2',
        property3: 'property3'
      }, {}, function (e, result) {

        if (!e) {
          multipleClient.get(test_path, null, function (e, results) {

            expect(results.property1 == 'property1').to.be(true);

            findRecordInDataFile(test_path, tempFile1, function (e, record) {

              if (e) return callback(e);

              //console.log('rec: ', record);

              if (record)
                callback();
              else
                callback(new Error('record not found in persisted file'));

            });

          });
        }
        else
          callback(e);
      });

    } catch (e) {
      callback(e);
    }

  });

  it('should push some data into the multiple datastore, default pattern', function (callback) {

    this.timeout(4000);

    try {
      var test_path = '/09-multiple-datasource/' + test_id + '/default';

      multipleClient.set(test_path, {
        property1: 'property1',
        property2: 'property2',
        property3: 'property3'
      }, {}, function (e, result) {

        if (!e) {
          multipleClient.get(test_path, null, function (e, results) {

            expect(results.property1 == 'property1').to.be(true);

            findRecordInDataFile(test_path, tempFile1, function (e, record) {

              if (e) return callback(e);

              if (record)
                callback(new Error('record found in persisted file, meant to be in memory'));
              else
                callback();

            });

          });
        }
        else
          callback(e);
      });

    } catch (e) {
      callback(e);
    }

  });

  it('should tag some persisted data for the multiple datastore', function (callback) {

    this.timeout(10000);

    var randomTag = require('shortid').generate();

    var test_path = '/09-multiple-datasource/' + test_id + '/persistedtest/tag'

    multipleClient.set(test_path, {
      property1: 'property1',
      property2: 'property2',
      property3: 'property3'
    }, {noPublish: true}, function (e, result) {

      ////////////////////console.log('did set');
      ////////////////////console.log([e, result]);

      if (e) return callback(e);

      multipleClient.set(test_path, null, {
        tag: randomTag,
        merge: true,
        noPublish: true
      }, function (e, result) {

        //console.log(e);

        if (e) return callback(e);

        expect(result.data.property1).to.be('property1');
        expect(result.data.property2).to.be('property2');
        expect(result.data.property3).to.be('property3');

        var tagged_path = result._meta.path;

        multipleClient.get(tagged_path, null, function (e, tagged) {

          expect(e).to.be(null);

          expect(tagged.data.property1).to.be('property1');
          expect(tagged.data.property2).to.be('property2');
          expect(tagged.data.property3).to.be('property3');

          findRecordInDataFile(tagged_path, tempFile1, function (e, record) {

            if (e) return callback(e);

            if (record)
              callback();
            else
              callback(new Error('record not found in persisted file'));

          });

        });

      });

    });

  });

  it('check the same event should be raised, regardless of what data source we are pushing to', function (callback) {

    var caught = {};

    this.timeout(10000);
    var caughtCount = 0;

    var memoryTestPath = '/09-multiple-datasource/' + test_id + '/memorytest/event';
    var persistedTestPath = '/09-multiple-datasource/' + test_id + '/persistedtest/event';

    multipleClient.onAll(function (eventData, meta) {

      if (meta.action == '/SET@' + memoryTestPath || meta.action == '/SET@' + persistedTestPath) {
        caughtCount++;
        if (caughtCount == 2) {

          findRecordInDataFile(persistedTestPath, tempFile1, function (e, record) {

            if (e) return callback(e);

            if (record)
              callback();
            else
              callback(new Error('record not found in persisted file'));

          });
        }
      }


    }, function (e) {

      if (e) return callback(e);

      multipleClient.set(memoryTestPath, {
        property1: 'property1',
        property2: 'property2',
        property3: 'property3'
      }, null, function (e, put_result) {

        if (e) return callback(e);

        multipleClient.set(persistedTestPath, {
          property1: 'property1',
          property2: 'property2',
          property3: 'property3'
        }, null, function (e, put_result) {

          if (e) return callback(e);


        });

      });

    });

  });

  it('should not find the pattern to be added in the persisted datastore', function (callback) {

    this.timeout(4000);

    try {
      var test_path = '/09-multiple-datasource/' + test_id + '/persistedaddedpattern';

      multipleClient.set(test_path, {
        property1: 'property1',
        property2: 'property2',
        property3: 'property3'
      }, {}, function (e, result) {

        if (!e) {
          multipleClient.get(test_path, null, function (e, results) {

            expect(results.property1 == 'property1').to.be(true);

            findRecordInDataFile(test_path, tempFile1, function (e, record) {

              if (e) return callback(e);

              if (record)
                callback(new Error('record found in persisted file, meant to be in memory'));
              else
                callback();

            });

          });
        }
        else
          callback(e);
      });

    } catch (e) {
      callback(e);
    }

  });

  it('should add a pattern to the persisted datastore, and check it works', function (callback) {

    this.timeout(4000);

    try {
      var test_path = '/09-multiple-datasource/' + test_id + '/persistedaddedpattern';

      services[1].services.data.addDataStoreFilter(test_path, 'persisted');

      multipleClient.set(test_path, {
        property1: 'property1',
        property2: 'property2',
        property3: 'property3'
      }, {}, function (e, result) {

        if (!e) {
          multipleClient.get(test_path, null, function (e, results) {

            expect(results.property1 == 'property1').to.be(true);

            findRecordInDataFile(test_path, tempFile1, function (e, record) {

              if (e) return callback(e);

              //console.log('rec: ', record);

              if (record)
                callback();
              else
                callback(new Error('record not found in persisted file'));

            });

          });
        }
        else
          callback(e);
      });

    } catch (e) {
      callback(e);
    }

  });

  it('should remove a pattern from the persisted datastore', function (callback) {

    this.timeout(4000);

    try {

      var test_path = '/09-multiple-datasource/' + test_id + '/persistedaddedpattern';
      var patternExists = false;

      for (var pattern in services[1].services.data.dataroutes) {
        if (pattern == test_path) {
          patternExists = true;
          break;
        }
      }

      expect(patternExists).to.be(true);

      patternExists = false;

      services[1].services.data.removeDataStoreFilter(test_path);

      for (var pattern in services[1].services.data.dataroutes) {
        if (pattern == test_path) {
          patternExists = true;
          break;
        }
      }

      expect(patternExists).to.be(false);

      callback();

    } catch (e) {
      callback(e);
    }

  });


});
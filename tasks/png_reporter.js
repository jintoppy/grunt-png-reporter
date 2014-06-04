/*
 * png-reporter
 * https://github.com/jintoppy/grunt-png-reporter
 *
 * Copyright (c) 2014 Jinto Jose
 * Licensed under the MIT license.
 */

'use strict';

var main = require('./lib/main');
//var seleniumUtil = require('./lib/seleniumUtil');
//var exec = require('child_process').exec;
var selenium = require('selenium-standalone');
var webdriverjs = require('webdriverjs');
//var protractor = require('protractor');
//var protractorInstance = protractor.wrapDriver(driver);
var fs = require('fs');
var driverOptions = { desiredCapabilities: { browserName: 'chrome' } };

module.exports = function (grunt) {

var spawnOptions = { stdio: 'pipe' };

// options to pass to `java -jar selenium-server-standalone-X.XX.X.jar`
var seleniumArgs = [
  '-debug'
];


grunt.registerMultiTask('png_reporter', 'Do the element dimension comparison test and generate a png report based on that', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    
    var options = this.options();

    if((!options.expectUrl && !options.expectationFile) || !options.assertUrl ){
      grunt.log.error(['expected parameters missing']);
      return;
    }

    var utilRegex = new RegExp('{{util}}');
    var reporterRegex = new RegExp('{{REPORTER}}');
    var visibilityRegex = new RegExp('{{VISIBILITY}}');
    var underscoreRegex = new RegExp('{{UNDERSCORE}}');
    var expectationObjectRegex = new RegExp('{{EXPECTATION_OBJECT}}');

    //Common 
    var underscoreContent = grunt.file.read('node_modules/underscore/underscore-min.js');
    var utilContent = grunt.file.read('tasks/lib/util.js');
    
    //Expectation
    var visibilityContent, mainContent, expect_combined;
    if(!options.expectationFile){
      visibilityContent = grunt.file.read('tasks/lib/visibility.js');
      mainContent = grunt.file.read('tasks/lib/main.js');
      mainContent = mainContent.replace(utilRegex,utilContent);
      mainContent = mainContent.replace(visibilityRegex,visibilityContent);
      mainContent = mainContent.replace(underscoreRegex,underscoreContent);
      grunt.file.write('tasks/lib/main_combined.js',mainContent);
      expect_combined = require('./lib/main_combined.js');  
    }
    

    //Reporter
    var reporterContent = grunt.file.read('tasks/lib/reporter.js');
    reporterContent = reporterContent.replace(utilRegex,utilContent);
    reporterContent = reporterContent.replace(underscoreRegex,underscoreContent);
    
    
    var done = this.async();
    var server = selenium(spawnOptions, seleniumArgs);
    var count = 0;


    var client =  webdriverjs.remote(driverOptions);

    function callGenerateReport(expectationObject, options, done){
      if(expectationObject.constructor === Array){
        expectationObject = JSON.stringify(expectationObject);  
      }
      
      if(!options.expectactionFile){
        grunt.file.write('tasks/expected.json',expectationObject);  
      }      
      reporterContent = reporterContent.replace(expectationObjectRegex,'expectation = ' + expectationObject + ';');
      grunt.file.write('tasks/lib/reporter_combined.js',reporterContent);
      var reporter_combined = require('./lib/reporter_combined.js');

      client
       .url('http://localhost:8000/app')
       .execute(reporter_combined.generateReport)
       .saveScreenshot('test.png',function(err, png){
            if(err){
                console.log('Screenshot coult not be saved.');
            }
            done();
        });
    }

    server.stdout.on('data', function(output) {
        var val, expectParameterContent;
        val = output.toString();
        if(val.indexOf('jetty.jetty.Server')>-1){
            count++;
            if(count>1){

               
               client.init();


               if(!options.expectationFile){
                  client
                 .url('http://localhost:8000/app')
                 .execute(expect_combined.generateExpectation, function(err, response){
                    callGenerateReport(response.value,options, done);
                 }); 
               }
               else{
                  expectParameterContent = grunt.file.read(options.expectationFile);
                  callGenerateReport(expectParameterContent,options,done);
               }
               
               console.log('came till done');
                 
            }
            
      }

  });

  
  });

};

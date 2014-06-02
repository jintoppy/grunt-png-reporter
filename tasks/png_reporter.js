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
    
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    var utilRegex = new RegExp('{{util}}');
    var reporterRegex = new RegExp('{{REPORTER}}');
    var visibilityRegex = new RegExp('{{VISIBILITY}}');
    var underscoreRegex = new RegExp('{{UNDERSCORE}}');

    var utilContent = grunt.file.read('tasks/lib/util.js');
    var reporterContent = grunt.file.read('tasks/lib/reporter.js');
    var visibilityContent = grunt.file.read('tasks/lib/visibility.js');
    var mainContent = grunt.file.read('tasks/lib/main.js');
    var underscoreContent = grunt.file.read('node_modules/underscore/underscore-min.js');

    mainContent = mainContent.replace(utilRegex,utilContent);
    mainContent = mainContent.replace(reporterRegex,reporterContent);
    mainContent = mainContent.replace(visibilityRegex,visibilityContent);
    mainContent = mainContent.replace(underscoreRegex,underscoreContent);

    grunt.file.write('tasks/lib/main_combined.js',mainContent);
    var combined = require('./lib/main_combined.js');
    console.log('task running');
    var done = this.async();
    var server = selenium(spawnOptions, seleniumArgs);
    var count = 0;
    server.stdout.on('data', function(output) {
      console.log('coming inside stdout');
        var val = output.toString();
        if(val.indexOf('jetty.jetty.Server')>-1){
            console.log(main.customScript);
            count++;
            if(count>1){
                webdriverjs
               .remote(driverOptions)
               .init()
               .url('http://localhost:8000/app')
               .title(function(err, res) {
                  console.log('Title was: ' + res.value);
               })
               .execute(combined.customScript)
               .saveScreenshot('test.png',function(err, png){
                    if(err){
                        console.log('Screenshot coult not be saved.');
                    }
                });
               //.end();
               console.log('came till done');
               done();  
            }
            
      }

  });

  
  });

};

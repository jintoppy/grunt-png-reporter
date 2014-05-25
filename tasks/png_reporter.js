/*
 * png-reporter
 * https://github.com/jintoppy/grunt-png-reporter
 *
 * Copyright (c) 2014 Jinto Jose
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore');
var REPORTER = require('./lib/reporter');
var util = require('./lib/util');
var VISIBILITY = require('./lib/visibility');
//var seleniumUtil = require('./lib/seleniumUtil');
//var exec = require('child_process').exec;
var selenium = require('selenium-standalone');
var webdriverjs = require('webdriverjs');
var fs = require('fs');
var driverOptions = { desiredCapabilities: { browserName: 'chrome' } };

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks


var formattedJson = [];

function traverseDOM(element) {
    var nodeData, parentNode, elementNodeData;
    
    
    if(util.isValidElement(element)){
    elementNodeData = util.getNodeData(element);
    if (element.tagName === "BODY") {
      formattedJson.push(elementNodeData);
    }
    var parentData = util.findDeep(formattedJson, elementNodeData);
    if(VISIBILITY.isVisible(element) && element.hasChildNodes() && parentData){
      for (var i = 0; i < element.childNodes.length; i++) {
        var node = element.childNodes[i];
        if (util.isValidElement(node)) {
          nodeData = util.getNodeData(node);
          if (!parentData.childNodes) {
            parentData.childNodes = [];
          }
          parentData.childNodes.push(nodeData);
          traverseDOM(node);
        }
      }
    }
  }
}

var f = function(){
    return document.getElementById('gbqfq').value = 'THIS IS CUSTOM';
};

var expectJsonObj=[];
function createExpectationObject(jsonObj){
  var obj, currentObj;
  if(jsonObj && jsonObj.childNodes && jsonObj.childNodes.length>0){
      obj={};
      obj["selector"] = jsonObj.selector;
      obj.top={};
      obj.left={};
      expectJsonObj.push(obj);
    for(var i=0;i<jsonObj.childNodes.length;i++){
      currentObj = jsonObj.childNodes[i];
      obj.top[currentObj.selector] = Math.abs(currentObj.y-jsonObj.y);
      obj.left[currentObj.selector] = Math.abs(currentObj.x-jsonObj.x);
      createExpectationObject(currentObj);
    }
    
  }

}

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
    console.log('task running');
    var done = this.async();
    var server = selenium(spawnOptions, seleniumArgs);
    var count = 0;
    server.stdout.on('data', function(output) {
      console.log('coming inside stdout');
        var val = output.toString();
        if(val.indexOf('jetty.jetty.Server')>-1){
            count++;
            if(count>1){
                webdriverjs
               .remote(driverOptions)
               .init()
               .url('http://www.google.com')
               .title(function(err, res) {
                  console.log('Title was: ' + res.value);
               })
               .execute(f)
               .saveScreenshot('test.png',function(err, png){
                    if(err){
                      console.log('Screenshot coult not be saved.')
                    }
                })
               .end();
               console.log('came till done');
               done();  
            }
            
      }

  });

  
  });

};

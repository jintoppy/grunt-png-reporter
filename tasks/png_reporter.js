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
var seleniumUtil = require('./lib/seleniumUtil');
var exec = require('child_process').exec;


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

  grunt.registerMultiTask('png_reporter', 'Do the element dimension comparison test and generate a png report based on that', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

  
    seleniumUtil.openPage('http://www.google.com');

    

    seleniumUtil.getTitle().then(function(title){
        console.log('title is ' + title);
    });
    // util.loadJQuery(null,function(){
    //   traverseDOM('body');
    //   formattedJson = formattedJson;
    //   createExpectationObject(formattedJson[0]);
    //   console.log(formattedJson);
    //   console.log(expectJsonObj);
      //REPORTER.generateReport(expectJsonObj);
  //});



    // // Iterate over all specified file groups.
    // this.files.forEach(function (file) {
    //   // Concat specified files.
    //   var src = file.src.filter(function (filepath) {
    //     // Warn on and remove invalid source files (if nonull was set).
    //     if (!grunt.file.exists(filepath)) {
    //       grunt.log.warn('Source file "' + filepath + '" not found.');
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   }).map(function (filepath) {
    //     // Read file source.
    //     return grunt.file.read(filepath);
    //   }).join(grunt.util.normalizelf(options.separator));

    //   // Handle options.
    //   src += options.punctuation;

    //   // Write the destination file.
    //   grunt.file.write(file.dest, src);

    //   // Print a success message.
    //   grunt.log.writeln('File "' + file.dest + '" created.');
    // });
  });

};

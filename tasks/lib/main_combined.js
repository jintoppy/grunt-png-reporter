var main = (function(){

	function customScript(){
	var formattedJson = [];
	//var REPORTER = require('./reporter');
	//var util = require('./util');
	//var VISIBILITY = require('./visibility');
	//files will be inserted here
	var util = (function(){

	var trial = function(callback){
		callback();
	};

	var loadJQuery = function(url, callback){
		console.log('came till here');
		callback();
		// if(window.jQuery){
		// 	callback(window.jQuery);
		// }
		// else{
		// 	if(!url){
		// 		url = "https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js";
		// 	}

		// 	var script = document.createElement("script");
		// 	script.type = "text/javascript";

		// 	if (script.readyState) { //IE
		// 	script.onreadystatechange = function () {
		// 		if (script.readyState == "loaded" || script.readyState == "complete") {
		// 			script.onreadystatechange = null;
		// 			callback(window.jQuery);
		// 		}
		// 	};
		// 	} else { //Others
		// 		script.onload = function () {
		// 			callback(window.jQuery);
		// 		};
		// 	}

		// 	script.src = url;
		// 	document.getElementsByTagName("head")[0].appendChild(script);
		// }
		

	};

	var findDeep = function(items, attrs) {

    function match(value) {
        for (var key in attrs) {
            if (attrs[key] !== value[key]) {
                return false;
            }
        }

        return true;
    }

    function traverse(value) {
        var result;

        _.forEach(value, function (val) {
            if (val && match(val)) {
                result = val;
                return false;
            }

            if (_.isObject(val) || _.isArray(val)) {
                result = traverse(val);
            }

            if (result) {
                return false;
            }
        });

        return result;
    }

    return traverse(items);

};

var getStyle = function(el, property) {
      if ( window.getComputedStyle ) {
        return document.defaultView.getComputedStyle(el,null)[property];
      }
      if ( el.currentStyle ) {
        return el.currentStyle[property];
      }
    };


var getPosition = function(element) {
    var xPosition = 0;
    var yPosition = 0;

    while (element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return {
        x: xPosition,
        y: yPosition
    };
};

var isValidElement = function(element){
	return (!_.contains(["SCRIPT", "STYLE", "NOSCRIPT"], element.tagName)) && element.nodeType === 1;
};

var getSelector = function(element){
	if(element.tagName === 'BODY'){
		return 'body';
	}
	if(element.id){
		return '#' + element.id;
	}
	else if(element.className){
		return '.' + element.className.join('.');
	}

	var elIndex = 1;
	var siblingElements = element.parentNode.getElementsByTagName(element.tagName.toLowerCase());
		
	for(var k=0;k<siblingElements.length;k++){
		if(siblingElements[k] === element){
			break;
		}
		elIndex++;
	}

	var selectorStr = siblingElements.length ==1? element.tagName.toLowerCase():
						element.tagName.toLowerCase() + ':nth-child(' +elIndex + ')';
	
	var currEl = element.parentNode;
	while(!currEl.id && !currEl.className && currEl.tagName !== 'BODY'){
		selectorStr = currEl.tagName.toLowerCase() + ' ' + selectorStr;
		currEl = currEl.parentNode;
	}
	if(currEl.tagName === 'BODY'){
		return 'body '+selectorStr;
	}
	selectorStr = currEl.id? '#'+currEl.id + ' ' + selectorStr:
					'.' + currEl.className.join('.') + ' ' +selectorStr;
	return selectorStr;

};

var getNodeData = function(element){
	var pos = this.getPosition(element);
	var selector = this.getSelector(element);
	return {
		selector: selector,
		tagName: element.tagName,
		content: element.innerHTML,
		x: pos.x,
		y: pos.y
	};
};


	return {
		loadJQuery: loadJQuery,
		findDeep: findDeep,
		getPosition: getPosition,
		isValidElement: isValidElement,
		getSelector: getSelector,
		getNodeData: getNodeData,
		trial: trial
	};

})();
	var reporter = (function(){
	var jQuery;
	var _ = require('underscore');
	var util = require('./util');
	var setJQuery = function(jQuery){
		jQuery = jQuery;
	};

	var createTopFailureLine = function(fromPos, toPos){
		var div =  jQuery('<div/>');
		var height = Math.abs(fromPos.y - toPos.y);

		div.css({
			"top": toPos.y,
			"left": toPos.x+2,
			"width": "3px",
			"background-color": "red",
			"position": "absolute",
			"height": height
		});
		jQuery('body').append(div);

	};

	var createLeftFailureLine = function(fromPos, toPos){

		var div =  jQuery('<div/>');
		var width = Math.abs(fromPos.x - toPos.x);

		div.css({
			"top": toPos.y+2,
			"left": fromPos.x,
			"width": width,
			"height": "3px",
			"position": "absolute",
			"background-color": "red"
		});
		jQuery('body').append(div);
	};

	var createSuccessMsg = function(){
		var div = jQuery('<div/>');
		div.html('Success!');
		div.css({
			"top": window.innerHeight/2,
			"left": window.innerWidth/2,
			"position": "absolute",
			"color": "green",
			"font-weight": "bold",
			"font-size": "20px"
		});
		jQuery('body').append(div);

	};
		

	var generateReport = function(expectation){
		var totalFailures = 0;
		for(var i=0;i<expectation.length;i++){
			var currObj = expectation[i];
			var currNode = jQuery(currObj.selector);
			if(currNode.length>0){
				var currObjPos = util.getPosition(currNode[0]);
				_.each(currObj.top, function(value,key){
					var nodeToBeComparedForTop = jQuery(key);
					if(nodeToBeComparedForTop.length>0){
						var posToBeCompared = util.getPosition(nodeToBeComparedForTop[0]);
						if(Math.abs(currObjPos.y-posToBeCompared.y) !== value){
							totalFailures++;
							createTopFailureLine(currObjPos, posToBeCompared);
						}
					}
				});

				_.each(currObj.left, function(value,key){
					var nodeToBeComparedForLeft = jQuery(key);
					if(nodeToBeComparedForLeft.length>0){
						var posToBeCompared = util.getPosition(nodeToBeComparedForLeft[0]);
						if(Math.abs(currObjPos.x-posToBeCompared.x) !== value){
							totalFailures++;
							createLeftFailureLine(currObjPos, posToBeCompared);
						}
					}
				});

				if(totalFailures === 0){
					createSuccessMsg();
				}
			}

		}
	};

	return {
		generateReport: generateReport,
		setJQuery: setJQuery
	};

})();

	var visibility = (function(){
    /**
     * Checks if a DOM element is visible. Takes into
     * consideration its parents and overflow.
     *
     * @param (el)      the DOM element to check if is visible
     *
     * These params are optional that are sent in recursively,
     * you typically won't use these:
     *
     * @param (t)       Top corner position number
     * @param (r)       Right corner position number
     * @param (b)       Bottom corner position number
     * @param (l)       Left corner position number
     * @param (w)       Element width number
     * @param (h)       Element height number
     */
    function _isVisible(el, t, r, b, l, w, h) {
      var p = el.parentNode,
          VISIBLE_PADDING = 2;

      //-- Return true for document node
      if ( 9 === p.nodeType ) {
        return true;
      }

      //-- Return false if our element is invisible
      if (
         '0' === _getStyle(el, 'opacity') ||
         'none' === _getStyle(el, 'display') ||
         'hidden' === _getStyle(el, 'visibility')
      ) {
        return false;
      }
      
      if (
        'undefined' === typeof(t) ||
        'undefined' === typeof(r) ||
        'undefined' === typeof(b) ||
        'undefined' === typeof(l) ||
        'undefined' === typeof(w) ||
        'undefined' === typeof(h)
      ) {
        t = el.offsetTop;
        l = el.offsetLeft;
        b = t + el.offsetHeight;
        r = l + el.offsetWidth;
        w = el.offsetWidth;
        h = el.offsetHeight;
      }
      //-- If we have a parent, let's continue:
      if ( p ) {
        //-- Check if the parent can hide its children.
        if ( ('hidden' === _getStyle(p, 'overflow') || 'scroll' === _getStyle(p, 'overflow')) ) {
          //-- Only check if the offset is different for the parent
          if (
            //-- If the target element is to the right of the parent elm
            l + VISIBLE_PADDING > p.offsetWidth + p.scrollLeft ||
            //-- If the target element is to the left of the parent elm
            l + w - VISIBLE_PADDING < p.scrollLeft ||
            //-- If the target element is under the parent elm
            t + VISIBLE_PADDING > p.offsetHeight + p.scrollTop ||
            //-- If the target element is above the parent elm
            t + h - VISIBLE_PADDING < p.scrollTop
          ) {
            //-- Our target element is out of bounds:
            return false;
          }
        }
        //-- Add the offset parent's left/top coords to our element's offset:
        if ( el.offsetParent === p ) {
          l += p.offsetLeft;
          t += p.offsetTop;
        }
        //-- Let's recursively check upwards:
        return _isVisible(p, t, r, b, l, w, h);
      }
      return true;
    }

    //-- Cross browser method to get style properties:
    function _getStyle(el, property) {
      if ( window.getComputedStyle ) {
        return document.defaultView.getComputedStyle(el,null)[property];
      }
      if ( el.currentStyle ) {
        return el.currentStyle[property];
      }
    }


    return {
      'getStyle' : _getStyle,
      'isVisible' : _isVisible
    };

  })();
	function traverseDOM(element) {
		var nodeData, parentNode, elementNodeData;
		
		console.log('came inside traverseDOM');
		// if(util.isValidElement(element)){
		// 	elementNodeData = window.util.getNodeData(element);
		// 	if (element.tagName === "BODY") {
		// 		formattedJson.push(elementNodeData);
		// 	}
		// 	var parentData = window.util.findDeep(formattedJson, elementNodeData);
		// 	if(VISIBILITY.isVisible(element) && element.hasChildNodes() && parentData){
		// 		for (var i = 0; i < element.childNodes.length; i++) {
		// 			var node = element.childNodes[i];
		// 			if (util.isValidElement(node)) {
		// 				nodeData = window.util.getNodeData(node);
		// 				if (!parentData.childNodes) {
		// 					parentData.childNodes = [];
		// 				}
		// 				parentData.childNodes.push(nodeData);
		// 				traverseDOM(node);
		// 			}
		// 		}
		// 	}
		// }
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

	  

	  	 
		return util.loadJQuery(null,function(jQuery){
			// 	console.log('came inside this');
			document.getElementById('gbqfq').value = "CUSTOM SCRIPT";
			traverseDOM(window.document.body);
			window.formattedJson = formattedJson;
			createExpectationObject(formattedJson[0]);
			console.log(formattedJson);
			console.log(expectJsonObj);
				REPORTER.setJQuery(jQuery);
				REPORTER.generateReport(expectJsonObj);
			});
	  	}

	  return {
		customScript: customScript
	  };

})();
module.exports = main;
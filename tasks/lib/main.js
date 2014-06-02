var main = (function(){

	function generateExpectation(expectationObjectParam){
	var formattedJson = [];

	//files will be inserted here
	{{UNDERSCORE}}

	{{util}}

	{{VISIBILITY}}


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

	  
		var executingCompleted = false;
	  	 
		util.loadJQuery(null,function(jQuery){
				traverseDOM(window.document.body);
				window.formattedJson = formattedJson;
				createExpectationObject(formattedJson[0]);
				executingCompleted = true;
				//console.log(expectationObjectParam);
				//return expectationObjectParam;
		});

		do{
			console.log('waiting');
		}while(!executingCompleted);
		
		return expectJsonObj;
	  }

	  return {
		generateExpectation: generateExpectation
	  };




})();
module.exports = main;
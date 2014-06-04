var REPORTER = (function(){

	function generateReport(){

	var expectation;

	{{UNDERSCORE}}

	{{util}}

		
	{{EXPECTATION_OBJECT}} // jshint ignore:line


	var createTopFailureLine = function(fromPos, toPos){
		var div = document.createElement('div');
		var height = Math.abs(fromPos.y - toPos.y);

		div.style.top =toPos.y + 'px';
		div.style.left =(toPos.x + 2) + 'px';
		div.style.width = '3px';
		div.style.backgroundColor = "red";
		div.style.position = "absolute";
		div.style.height = height + 'px';

		document.body.appendChild(div);

	};

	var createLeftFailureLine = function(fromPos, toPos){

		var div = document.createElement('div');
		var width = Math.abs(fromPos.x - toPos.x);

		div.style.top = (toPos.y +2) + 'px';
		div.style.left =fromPos.x + 'px';
		div.style.width = width + 'px';
		div.style.backgroundColor = "red";
		div.style.position = "absolute";
		div.style.height = '3px';

		document.body.appendChild(div);
	};

	var createSuccessMsg = function(){
		var div = document.createElement('div');
		div.innerHTML = 'Success!';

		div.style.top = (window.innerHeight/2) + 'px';
		div.style.left = (window.innerWidth/2) + 'px';
		div.style.color = "green";
		div.style.fontWeight = "bold";
		div.style.position = "absolute";
		div.style.fontSize = '20px';

		document.body.appendChild(div);

	};


			var totalFailures = 0;
			for(var i=0;i<expectation.length;i++){
				var currObj = expectation[i];
				var currNode = document.querySelectorAll(currObj.selector);
				if(currNode.length>0){
					var currObjPos = util.getPosition(currNode[0]);
					_.each(currObj.top, function(value,key){
						var nodeToBeComparedForTop = document.querySelectorAll(key);
						if(nodeToBeComparedForTop.length>0){
							var posToBeCompared = util.getPosition(nodeToBeComparedForTop[0]);
							if(Math.abs(currObjPos.y-posToBeCompared.y) !== value){
								totalFailures++;
								createTopFailureLine(currObjPos, posToBeCompared);
							}
						}
					});

					_.each(currObj.left, function(value,key){
						var nodeToBeComparedForLeft = document.querySelectorAll(key);
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

	}

	return {
		generateReport: generateReport
	};

})();
module.exports = REPORTER;
var seleniumUtil = (function(){
	var webdriver = require('selenium-webdriver');
	var driver = new webdriver.Builder().
		withCapabilities(webdriver.Capabilities.chrome()).
		build();

	var getWindowObject = function(){
		driver.executeScript("return window").then(function(window)	{
			return window;
		});
	};

	return {
		getWindowObject: getWindowObject
	};

})();

exports.module = seleniumUtil;
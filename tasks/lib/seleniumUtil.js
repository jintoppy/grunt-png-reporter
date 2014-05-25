var seleniumUtil = (function(){
	var webdriver = require('selenium-webdriver');

	function createDriver() {
		var driver = new webdriver.Builder()
			.usingServer('http://localhost:4444/wd/hub')
			.withCapabilities(webdriver.Capabilities.chrome())
			.build();
		driver.manage().timeouts().setScriptTimeout(10000);
		return driver;
	}

	var driver = createDriver();
	//driver.get("http://www.google.com");

	var getWindowObject = function(){
		driver.executeScript("return window").then(function(window)	{
			return window;
		});
	};

	var getElement = function(selector){
		//driver.
	};

	var getTitle = function(){
		return driver.getTitle();
	};

	var openPage = function(url){
		console.log('came inside openPage');
		console.log(driver.get);
		//driver.get(url);
		driver.get("http://www.google.com");
	};

	return {
		getWindowObject: getWindowObject,
		getElement: getElement,
		getTitle: getTitle,
		openPage: openPage
	};

})();

module.exports = seleniumUtil;
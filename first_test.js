var webdriver = require('selenium-webdriver');
 

function createDriver() {
    var driver = new webdriver.Builder()
      .usingServer('http://localhost:4444/wd/hub')
      .withCapabilities(webdriver.Capabilities.chrome())
      .build();
    driver.manage().timeouts().setScriptTimeout(10000);
    console.log('came inside createDriver');
    return driver;
  }

var driver = createDriver();
 
driver.get('http://www.google.com');
driver.findElement(webdriver.By.name('q')).sendKeys('simple programmer');
driver.findElement(webdriver.By.name('btnG')).click();
driver.quit();
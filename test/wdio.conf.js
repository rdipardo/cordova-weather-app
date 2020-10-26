exports.config = {
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    capabilities: [{
        name: 'weather_wizard_appium_tests',
        project: 'cordova_weatherwizard',
        build: 'weatherwizard-automated-appium-tests',
        app: process.env.BROWSERSTACK_APP_ID || 'io.github.rdipardo.weatherwizard',
        device: 'Google Pixel 3',
        os_version: '9.0',
        browserName: 'android',
        autoGrantPermissions: true,
        disableAnimations: true,
        'browserstack.idleTimeout': 120, 
        'browserstack.debug': true,
        'browserstack.appium_version': '1.18.0'
    }],
    logLevel: 'error',
    coloredLogs: false,
    screenshotPath: './captures/',
    baseUrl: '',
    waitforTimeout: 50000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    specs: [
        './test/specs/**/*.js'
    ],
    framework: 'jasmine',
    jasmineNodeOpts: {
        defaultTimeoutInterval: 90000,
        expectationResultHandler: (pass, spec) => {
            if (pass) return
            driver.saveScreenshot(`./captures/assertion_failed_'${spec.error.message}'.png`)
        }
    }
}
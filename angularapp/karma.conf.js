const puppeteer = require('puppeteer');
// Uncomment the below line if you need to set the CHROME_BIN environment variable to Puppeteer's executable path
// process.env.CHROME_BIN = puppeteer.executablePath();
module.exports = function (config) {
  config.set({
    basePath: '',
    colors: false, // Disable colored output
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-spec-reporter'),
    ],
    client: {
      clearContext: false // Leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // Removes the duplicated traces
    },
    specReporter: {
      maxLogLines: 5, // Limit number of lines logged per test
      suppressErrorSummary: true, // Do not print error summary
      suppressFailed: false, // Do not print information about failed tests
      suppressPassed: false, // Do not print information about passed tests
      suppressSkipped: true, // Do not print information about skipped tests
      showSpecTiming: false, // Print the time elapsed for each spec
      failFast: false, // Test would finish with error when a first fail occurs
      suppressColor: true, // Ensure color is suppressed in specReporter
      prefixes: {
        success: 'SUCCESS-', // Override prefix for passed tests, default is '✓ '
        failure: 'FAILED-', // Override prefix for failed tests, default is '✗ '
        skipped: 'SKIPPED-' // Override prefix for skipped tests, default is '- '
      }
    },
    reporters: ['spec'],
    progressReporter: {
      showFailed: true,
      showPassed: true // Corrected the typo here
    },
    port: 9876,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['CustomChromeHeadless'],
    customLaunchers: {
      CustomChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          '--remote-debugging-port=9222',
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ],
        executablePath: '/usr/bin/chromium-browser'
      },
    },
    singleRun: true,
    restartOnFileChange: false
  });
};

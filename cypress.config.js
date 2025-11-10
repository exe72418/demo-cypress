const { defineConfig } = require("cypress");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { createEsbuildPlugin } = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const { verifyDownloadTasks } = require('cy-verify-downloads');
const { polyfillNode } = require('esbuild-plugin-polyfill-node');

const path = require('path');
const fs = require('fs');

module.exports = defineConfig({
  e2e: {
    baseUrl: `http://${process.env.CYPRESS_HOST}:${process.env.CYPRESS_PORT}`,
    includeShadowDom: true,
    pageLoadTimeout: 10000,
    video: true,
    specPattern: "cypress/e2e/**/*.feature",
    defaultCommandTimeout: 10000,

    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      const bundler = createBundler({
        plugins: [
          polyfillNode(), 
          createEsbuildPlugin(config)
        ],
      });

      on("file:preprocessor", bundler);

      on('task', verifyDownloadTasks);

      on('before:browser:launch', (browser = {}, launchOptions) => {
        const downloadDirectory = path.join(__dirname, 'cypress/downloads');

        if (!fs.existsSync(downloadDirectory)) {
          fs.mkdirSync(downloadDirectory, { recursive: true });
        }

        if (browser.name === 'chrome' || browser.name === 'edge') {
          launchOptions.preferences.default['download'] = {
            'default_directory': downloadDirectory,
            'prompt_for_download': false, // No preguntar
            'directory_upgrade': true
          };
          launchOptions.args.push('--disable-popup-blocking');
        }
        
        return launchOptions;
      });
      
      return config;
    },
  },
});
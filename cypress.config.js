const { defineConfig } = require("cypress");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { createEsbuildPlugin } = require("@badeball/cypress-cucumber-preprocessor/esbuild");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080/jcnt/v',
    includeShadowDom: true,
    pageLoadTimeout: 90000,
    video: true,
    specPattern: "cypress/e2e/**/*.feature",
    defaultCommandTimeout: 50000,

    async setupNodeEvents(on, config) {
      // 1. Instala el plugin de Cucumber
      await addCucumberPreprocessorPlugin(on, config);

      // 2. Vincula el preprocesador Esbuild al plugin de Cucumber
      on("file:preprocessor", createBundler({
        plugins: [createEsbuildPlugin(config)],
      }));
      
      return config;
    },
  },
});
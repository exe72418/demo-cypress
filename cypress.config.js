const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Aquí puedes poner tu configuración global
    baseUrl: 'http://localhost:8080',
    includeShadowDom: true,
    pageLoadTimeout: 90000,
    video: true, 

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
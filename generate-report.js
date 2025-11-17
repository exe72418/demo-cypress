const reporter = require('cucumber-html-reporter');
const fs = require('fs');
const path = require('path');

const reportName = process.env.CYPRESS_TARGET_NAME || 'Reporte de Pruebas E2E Por Defecto';

const outputDir = 'cypress/reports/html';
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

// Opciones del reportero simple
const options = {
    theme: 'bootstrap', // Un tema limpio, profesional y compatible
    jsonDir: 'cypress/cucumber-json', // Sigue leyendo los mismos JSONs
    output: path.join(outputDir, 'index.html'),
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: false, // No intentes abrirlo en el servidor
    name: reportName,
    metadata: {
        "Plataforma": "Jenkins",
        "Proyecto": reportName,
        "Build": process.env.BUILD_NUMBER || "Local"
    }
};

try {
    reporter.generate(options);
    console.log('Reporte HTML simple generado exitosamente.');
} catch (error) {
    console.error('Error generando el reporte HTML:', error);
    process.exit(1);
}
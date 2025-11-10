// ----------------------------- CON ID---------------------------------------------
// import { When, Then, Given, And } from "@badeball/cypress-cucumber-preprocessor";

// // Step definition for a common login scenario
// Given('el usuario está autenticado en el sistema', () => {
//   cy.visit('http://localhost:8080/jcnt/v/login?servers=vmg');
//   cy.get('input[name="username"]').type('sandra');
//   cy.get('input[name="password"]').should('be.enabled').type('mosaFor267$');
//   cy.get('vaadin-button[part="vaadin-login-submit"]').click();
//   cy.url().should('not.include', 'login');
// });

// When('el usuario hace clic en el combo {string}', (nombreDelCombo) => {
//   // Tu idea es perfecta: construimos el selector dinámicamente
//   cy.get(`[data-testid="combo-${nombreDelCombo}"]`).click();
// });

// When('el usuario selecciona {string} en el combo {string}', (opcion, nombreDelCombo) => {
//   // Paso 1: Abrir el combo correcto
//   cy.get(`[data-testid="combo-${nombreDelCombo}"]`).click();

//   // Paso 2: Buscar y seleccionar la opción dentro del desplegable
//   cy.get('vaadin-combo-box-overlay')
//     .contains('vaadin-combo-box-item', opcion)
//     .click();
// });

// When('el usuario ingresa {string} en el campo {string}', (texto, nombreDelCampo) => {
//   // Usamos el data-testid que definimos en Java, ej: nombre.getElement().setAttribute("data-testid", "nombre");
//   cy.get(`[data-testid="${nombreDelCampo}"]`).clear().type(texto);
// });

// When('el usuario hace clic en el botón {string}', (testId) => {
//   // En tu código Java, le habrías puesto:
//   // botonGuardar.getElement().setAttribute("data-testid", "btn-guardar");
//   cy.get(`[data-testid="${testId}"]`).click();
// });

// When('el usuario espera {int} segundos', (segundos) => {
//   // cy.wait() espera en milisegundos, por eso multiplicamos por 1000
//   cy.wait(segundos * 1000);
// });

// // los botones: boton***.getElement().setAttribute("data-testid", "btn-***");
// When('el usuario hace clic en el boton de {string}', (propositoDelBoton) => {
//   // La variable 'propositoDelBoton' será "crear", "cancelar", etc.
//   cy.get(`[data-testid="btn-${propositoDelBoton}"]`).click();
// });

// // Step definition for a common loading indicator
// Then('el elemento {string} ya no es visible', (selector) => {
//   cy.get(selector, { timeout: 10000 }).should('not.be.visible');
// });

// Given('el usuario navega a la vista {string}', (vista) => {
//   cy.visit(`http://localhost:8080/jcnt/v/${vista}View?menu=21062`);
// });

// Then('el usuario ve el mensaje {string}', (mensaje) => {
//   // Buscamos un elemento que contenga el texto del mensaje y verificamos que sea visible
//   cy.contains(mensaje, { timeout: 10000 }).should('be.visible');
// });

// // Step definition for the loading indicator specific to the feature
// Then('el elemento ".v-loading-indicator" ya no es visible', () => {
//   cy.get('.v-loading-indicator', { timeout: 10000 }).should('not.be.visible');
// });

// When('el guardado es exitoso y el usuario es redirigido a una url que contiene {string}', (urlPart) => {
//   cy.url({ timeout: 10000 }).should('include', urlPart);
// });
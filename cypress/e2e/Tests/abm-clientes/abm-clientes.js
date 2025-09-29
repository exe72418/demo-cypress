import { When, Then, Given, And } from "@badeball/cypress-cucumber-preprocessor";

// Este step no cambia, el login siempre es por los atributos del formulario
Given('el usuario está autenticado en el sistema', () => {
  cy.visit('http://localhost:8080/jcnt/v/login?servers=vmg');
  cy.get('input[name="username"]').type('sandra');
  cy.get('input[name="password"]').should('be.enabled').type('mosaFor267$');
  cy.get('vaadin-button[part="vaadin-login-submit"]').click();
  cy.url().should('not.include', 'login');
});

// --- CAMBIOS PRINCIPALES AQUÍ ---

When('el usuario hace clic en el combo con la etiqueta {string}', (placeholderText) => {
  // Busca un componente <vaadin-combo-box> que contenga el texto de la etiqueta y le hace clic.
  // cy.contains('vaadin-combo-box', labelDelCombo).click();
  cy.get(`vaadin-multi-select-combo-box[placeholder="${placeholderText}"]`).click();
});

When('el usuario selecciona {string} en el combo con la etiqueta {string}', (opcion, placeholderText) => {
  // Paso 1: Abrir el combo usando su etiqueta visible
  cy.get(`vaadin-multi-select-combo-box[placeholder="${placeholderText}"]`).click();

  // Paso 2: Buscar y seleccionar la opción (esto no cambia)
  cy.get('vaadin-combo-box-overlay')
    .contains('vaadin-combo-box-item', opcion)
    .click();
});

When('el usuario ingresa {string} en el campo con la etiqueta {string}', (texto, labelDelCampo) => {
  cy.document().then((doc) => {
    const findFieldByLabel = (root) => {
      const fields = root.querySelectorAll('vaadin-text-field');
      for (const field of fields) {
        const label = field.querySelector('label');
        if (label && label.textContent.trim().includes(labelDelCampo)) {
          return field;
        }
      }
      const hosts = root.querySelectorAll('*');
      for (const host of hosts) {
        if (host.shadowRoot) {
          const found = findFieldByLabel(host.shadowRoot);
          if (found) return found;
        }
      }
      return null;
    };

    const match = findFieldByLabel(doc);
    // expect(match, `No se encontró vaadin-text-field con label "${labelDelCampo}"`).to.exist;

    const inputId = match
      .querySelector('input')
      .getAttribute('id');

    cy.get(`#${inputId}`, { includeShadowDom: true }).type(texto);
  });
});

When('el usuario ingresa {string} en el campo con la etiqueta custom {string}', (texto, labelDelCampo) => {
  cy.get('vaadin-custom-field').each(($field) => {
    const field = $field[0];

    if (field) {
      const labels = field.querySelectorAll('label');

      for (const label of labels) {
        if (label && label.textContent.trim() === labelDelCampo) {
        const input = field.querySelector('input');

        if (input) {
          cy.wrap(input).type(texto);
        }
        }
      }
    }
  });
});

When('el usuario selecciona {string} en el combo custom {string}', (opcion, labelDelCampo) => {
  cy.get('vaadin-custom-field', { timeout: 10000 }).each(($field) => {
    const field = $field[0];

    if (field) {
      const labels = field.querySelectorAll('label');

      for (const label of labels) {
        if (label && label.textContent.trim() === labelDelCampo) {
          const combo = field.querySelector('vaadin-combo-box');
          if (combo)
          {
            cy.wrap(combo).click();
            cy.wait(1000); 
            cy.get('vaadin-combo-box-overlay', { timeout: 30000 })
              .contains('vaadin-combo-box-item', opcion, { timeout: 20000 })
              .click();
          }
        }
      }
    }
  });
});

When('el usuario elige {string} en el combo custom del dialog {string}', (opcion, labelDelCampo) => {
  cy.get('vaadin-dialog-overlay[opened]', { timeout: 10000 }) // solo dentro del dialog abierto
    .find('vaadin-custom-field')
    .each(($field) => {
      const field = $field[0];

      if (field) {
        const labels = field.querySelectorAll('label');

        for (const label of labels) {
          if (label && label.textContent.trim() === labelDelCampo) {
            const combo = field.querySelector('vaadin-combo-box');
            combo.setAttribute('opened', '');

            if (combo) {
              cy.wait(500);
              let opcionEncontrada = false;
              cy.get('vaadin-combo-box-overlay', { timeout: 30000 }).each($overlay => {
                if (opcionEncontrada) return;
                    console.log('Item del combo:', $overlay); 

                cy.wrap($overlay).shadow().find('vaadin-combo-box-scroller').shadow()
                  .find('vaadin-combo-box-item').each($item => {
                    console.log('Item del combo:', $item); 
                    if ($item.textContent.trim() === opcion) {
                      cy.wrap($item).click({ force: true });
                      opcionEncontrada = true; // marcar como encontrada
                      return false; // rompe el each de items
                    }
                  });
              });
            }
          }
        }
      }
    });
});


When('el usuario hace click en el tab {string}', (nombreDelTab) => {
  cy.contains('vaadin-tab', nombreDelTab, { timeout: 30000}).click();
});

When('el usuario apreta {string} de la fila del grid {string}', (nombreDelMenuItem, cellContent) => {
  // 1. Buscar la celda que contiene el texto de referencia
  cy.contains('vaadin-grid-cell-content', cellContent, { matchCase: false, timeout: 30000 })
    .invoke('attr', 'slot') // obtenemos el valor del slot, ej: vaadin-grid-cell-content-21
    .then(slotId => {
      const numeroBase = parseInt(slotId.split('-').pop()); // 21
      const numeroTarget = numeroBase + 6; // 27
      const slotTarget = `vaadin-grid-cell-content-${numeroTarget}`;

      // 2. Ir a la celda destino (acciones)
      cy.get(`vaadin-grid-cell-content[slot="${slotTarget}"]`, { timeout: 10000 })
        .within(() => {
          // 3. Buscar el botón dentro del menú contextual por title
          cy.get('vaadin-menu-bar')
            .find(`vaadin-context-menu-item[title="${nombreDelMenuItem}"]`, { timeout: 10000 })
            .click();
        });
    });
});

When('el usuario hace clic en el botón con el texto {string}', (textoDelBoton) => {
  // Simplificamos los dos steps de botones en uno solo que busca por el texto visible.
  cy.contains('vaadin-button', textoDelBoton).click();
});

// --- STEPS QUE NO NECESITAN CAMBIOS ---

When('el usuario espera {int} segundos hasta que aparezca {string}', (segundos, titulo) => {
  cy.contains('h4', `${titulo}`, { timeout: segundos * 1000 }).should('be.visible');
});

When('el usuario espera {int} segundos', (segundos) => {
  cy.wait(segundos * 1000);
});

Then('el elemento {string} ya no es visible', (selector) => {
  cy.get(selector, { timeout: 10000 }).should('not.be.visible');
});

Given('el usuario navega a la vista {string}', (vista) => {
  cy.visit(`http://localhost:8080/jcnt/v/${vista}View?menu=21062`);
});

Then('el usuario ve el mensaje {string}', (mensaje) => {
  cy.contains(mensaje, { timeout: 10000 }).should('be.visible');
});

Then('el elemento ".v-loading-indicator" ya no es visible', () => {
  cy.get('.v-loading-indicator', { timeout: 10000 }).should('not.be.visible');
});

When('el guardado es exitoso y el usuario es redirigido a una url que contiene {string}', (urlPart) => {
  cy.url({ timeout: 10000 }).should('include', urlPart);
});


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
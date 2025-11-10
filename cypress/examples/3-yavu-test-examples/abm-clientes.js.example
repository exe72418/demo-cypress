import { When, Then, Given, And } from "@badeball/cypress-cucumber-preprocessor";

// Este step no cambia, el login siempre es por los atributos del formulario
Given('el usuario está autenticado en el sistema', () => {
  cy.visit('http://localhost:8080/jcnt/v/login?servers=vmg');
  cy.get('input[name="username"]').type('sandra');
  cy.get('input[name="password"]').should('be.enabled').type('mosaFor267$');
  cy.get('vaadin-button[part="vaadin-login-submit"]').click();
  cy.url().should('not.include', 'login');
  Cypress.on('uncaught:exception', (err, runnable) => {
    // Vaadin a veces lanza este error internamente al destruir componentes.
    // Devolver 'false' aquí previene que Cypress falle el test por este motivo.
    if (err.message.includes('Cannot read properties of null (reading \'removeEventListener\')')) {
      return false;
    }
    // Permite que otros errores no relacionados sí fallen el test.
    return true;
  });
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
          if (combo) {
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
        const labelHermano = field.querySelector(':scope > label'); // Elijo el hijo label directo y no algun sub-label

        if (labelHermano && labelHermano.textContent.trim() === labelDelCampo) {
          console.log('Label encontrado:', labelHermano ? labelHermano.textContent.trim() : 'No encontrado');

          const combo = field.querySelector('vaadin-combo-box');
          if (combo) {
            cy.wrap(combo).click();
            cy.wait(1000);
            cy.get('vaadin-combo-box-overlay', { timeout: 30000 })
              .contains('vaadin-combo-box-item', opcion, { timeout: 20000 })
              .click();
          }
        }
      }
    });
});


When('el usuario hace click en el tab {string}', (nombreDelTab) => {
  cy.contains('vaadin-tab', nombreDelTab, { timeout: 30000 }).click();
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

// ------------------------------------------------------------------------------------

/**
 * Encuentra una cabecera de la grilla por su texto y la devuelve como un objeto de Cypress.
 * Esta es una función de ayuda para no repetir código.
 * @param {string} nombreColumna El texto visible en la cabecera.
 */
const getGridHeader = (nombreColumna) => {
  return cy.get('vaadin-grid-cell-content')
           .contains(nombreColumna)
           .closest('th'); // Busca el ancestro 'th' que es la celda de la cabecera
};

Then('el título de la columna {string} debe ser {string}', (nombreColumna, textoEsperado) => {
  // Usamos la función de ayuda para encontrar la cabecera
  getGridHeader(nombreColumna)
    .should('be.visible')
    .and('contain.text', textoEsperado);
});

Then('el tooltip de la columna {string} debe ser {string}', (nombreColumna, textoEsperado) => {
  // Vaadin a menudo pone el tooltip en un elemento hijo, como un <span>
  getGridHeader(nombreColumna)
    .find('span') // Busca el span dentro de la cabecera
    .should('have.attr', 'title', textoEsperado);
});

When('el usuario hace clic en la cabecera de la columna {string} para ordenar', (nombreColumna) => {
  // La grilla de Vaadin tiene un componente específico para ordenar
  getGridHeader(nombreColumna)
    .find('vaadin-grid-sorter')
    .click();
});

Then('la primera fila de la grilla debe contener el texto {string}', (texto) => {
  // Seleccionamos la primera fila de datos y verificamos que una de sus celdas contenga el texto
  cy.get('vaadin-grid')
    .find('tr[part~="first-row"]') // Selector para la primera fila de datos
    .contains('td', texto)
    .should('be.visible');
});

When('el usuario ingresa {string} en el filtro de la columna {string}', (texto, nombreColumna) => {
  getGridHeader(nombreColumna)
    .find('vaadin-text-field') // Los filtros suelen ser text-fields
    .type(texto);
});

Then('la grilla debe mostrar solo {string} registro', (cantidad) => {
  // Verificamos la cantidad de filas de datos en el body de la tabla
  cy.get('vaadin-grid')
    .find('tbody tr')
    .should('have.length', parseInt(cantidad));
});

Then('la fila {string} de la grilla debe contener {string}', (numeroFila, texto) => {
  // `eq(0)` es para la primera fila, `eq(1)` para la segunda, etc.
  cy.get('vaadin-grid')
    .find('tbody tr')
    .eq(parseInt(numeroFila) - 1)
    .contains('td', texto)
    .should('be.visible');
});

When('el usuario fija la columna {string}', (nombreColumna) => {
  // Esta implementación asume que hay un menú contextual en la cabecera
  getGridHeader(nombreColumna)
    .find('vaadin-context-menu-item[aria-label="Opciones de Columna"]') // Asumo un botón de menú
    .click();
  
  cy.get('vaadin-context-menu-overlay') // El menú se abre en un overlay
    .contains('vaadin-item', 'Fijar')
    .click();
});

Then('las columnas {string}, {string} y {string} deben estar fijas a la izquierda', (col1, col2, col3) => {
  // Verificamos que las columnas tengan el atributo 'frozen' que usa Vaadin
  getGridHeader(col1).should('have.attr', 'frozen');
  getGridHeader(col2).should('have.attr', 'frozen');
  getGridHeader(col3).should('have.attr', 'frozen');
});

When('el usuario abre el selector de columnas', () => {
  // Asumo que hay un botón específico para esto, a menudo con un icono
  cy.get('vaadin-grid-column-toggle-button').click();
});

When('el usuario desmarca la columna {string}', (nombreColumna) => {
  cy.get('vaadin-context-menu-list-box')
    .contains('vaadin-context-menu-item', nombreColumna)
    .click(); // Hacer clic para desmarcarla
});

When('el usuario marca la columna {string}', (nombreColumna) => {
  cy.get('vaadin-context-menu-list-box')
    .contains('vaadin-context-menu-item', nombreColumna)
    .click(); // Hacer clic para marcarla
});

Then('la columna {string} no debe ser visible en la grilla', (nombreColumna) => {
  getGridHeader(nombreColumna).should('not.be.visible');
});

Then('la columna {string} debe ser visible en la grilla', (nombreColumna) => {
  getGridHeader(nombreColumna).should('be.visible');
});

When('el usuario hace clic en el botón de exportar a {string}', (formato) => {
  // Usamos el step que ya tenías pero de forma más específica
  cy.contains('vaadin-button', `Exportar a ${formato}`).click();
});

Then('un archivo llamado {string} debe descargarse', (nombreArchivo) => {
  // La verificación de descargas es compleja y a menudo requiere plugins como 'cypress-downloadfile'.
  // Este es un ejemplo conceptual de cómo se haría con ese plugin.
  cy.readFile(`cypress/downloads/${nombreArchivo}`).should('exist');
});
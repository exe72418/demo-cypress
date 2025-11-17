import { When, Then, Given, And } from "@badeball/cypress-cucumber-preprocessor";

// Este step no cambia, el login siempre es por los atributos del formulario
Given('el usuario está autenticado en el sistema', () => {
  // --- CAMBIO 1: Usar cy.session para guardar y reusar el login ---
  // Esto hace que el login real solo ocurra una vez. Las siguientes veces,
  // Cypress restaura la sesión guardada en menos de un segundo.
  cy.session('userSession', () => {
    // Función de ayuda para no repetir el código del login
    const attemptLogin = () => {
      // Usamos baseUrl en lugar de la URL completa para más flexibilidad
      cy.visit('http://localhost:8080/jcnt/v/login?servers=vmg');
      cy.get('input[name="username"]').type('sandra', { log: false }); // log: false para no mostrar la pass en los logs
      cy.get('input[name="password"]').should('be.enabled').type('mosaFor267$', { log: false });
      cy.get('vaadin-button[part="vaadin-login-submit"]').click();
    };

    // 1. Intenta el login por primera vez
    attemptLogin();

    // --- CAMBIO 2: Lógica para reintentar si el primer login falla ---
    cy.url().then((url) => {
      if (url.includes('authfailed')) {
        cy.log('El primer login falló. Reintentando...');
        attemptLogin();
      }
    });

    // 3. Verificación final: El test solo continuará si el login fue exitoso.
    cy.url().should('not.include', 'login');
  });

  // El manejador de excepciones se mantiene, es una buena práctica.
  Cypress.on('uncaught:exception', (err, runnable) => {
    if (err.message.includes("Cannot read properties of null (reading 'removeEventListener')")) {
      return false;
    }
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
  // 1. Busca un <label> con la clase correcta que contenga el texto de la columna.
  return cy.contains('label.label-header-filtro-columna', nombreColumna)
           // 2. Sube hasta encontrar el contenedor principal de la celda.
           .closest('vaadin-grid-cell-content');
};

Then('el titulo de la columna {string} se achica un {int}%', (nombreColumna, porcentaje) => {
    
    let anchoInicial; 
    let nuevoAncho;   

    getGridHeader(nombreColumna).then($header => {
        const slotId = $header.attr('slot');
      
        cy.get(`slot[name="${slotId}"]`).then($slotElement => {
          const $thPadre = $slotElement.closest('th');

            cy.wrap($thPadre)
                .invoke('attr', 'style')
                .then(styleValue => {
                    
                    // ARREGLO CLAVE: Capturar punto o coma. Reemplaza [.?] por [.,]?
                    // Captura: (dígitos)(punto O coma)(dígitos opcionales)
                    const widthMatch = styleValue.match(/width:\s*(\d+[,.]?\d*)px/); 
                    
                    if (!widthMatch) {
                        throw new Error(`❌ No se encontró 'width' en formato válido (decimales o enteros). Estilo: ${styleValue}`);
                    }

                    // Pre-procesamiento: reemplaza coma por punto para que parseFloat funcione correctamente en JS
                    const anchoStr = widthMatch[1].replace(',', '.');
                    anchoInicial = parseFloat(anchoStr);

                    const factorAchique = 1 - (porcentaje / 100);
                    nuevoAncho = Math.round(anchoInicial * factorAchique); 
                    
                    const distanciaDeslizamiento = anchoInicial - nuevoAncho; 
                    
                    const resizerSelector = '[part="resize-handle"]'; 

                    cy.wrap($thPadre).find(resizerSelector).first().then($resizerElement => {
                        
                        const startX = $resizerElement.offset().left;
                        const endX = startX - distanciaDeslizamiento; 

                        // SIMULACIÓN
                        cy.wrap($resizerElement).trigger('mousedown', { which: 1, force: true }); 
                        cy.document().trigger('mousemove', { clientX: endX, force: true });
                        cy.document().trigger('mouseup', { force: true });
                    });
                })
          });
    });
});

Then('el titulo de la columna {string} se agranda un {int}%', (nombreColumna, porcentaje) => {
    
    let anchoInicial; 
    let nuevoAncho;   

    getGridHeader(nombreColumna).then($header => {
        const slotId = $header.attr('slot');
      
        cy.get(`slot[name="${slotId}"]`).then($slotElement => {
          const $thPadre = $slotElement.closest('th');

            cy.wrap($thPadre)
                .invoke('attr', 'style')
                .then(styleValue => {
                    
                    // ARREGLO CLAVE: Capturar punto o coma.
                    const widthMatch = styleValue.match(/width:\s*(\d+[,.]?\d*)px/); 
                    
                    if (!widthMatch) {
                        throw new Error(`❌ No se encontró 'width' en formato válido (decimales o enteros). Estilo: ${styleValue}`);
                    }

                    // Pre-procesamiento: reemplaza coma por punto para que parseFloat funcione correctamente en JS
                    const anchoStr = widthMatch[1].replace(',', '.');
                    anchoInicial = parseFloat(anchoStr);
                    
                    const factorAgrandar = 1 + (porcentaje / 100); 
                    nuevoAncho = Math.round(anchoInicial * factorAgrandar); 
                    
                    const distanciaDeslizamiento = nuevoAncho - anchoInicial; 
                    
                    const resizerSelector = '[part="resize-handle"]'; 

                    cy.wrap($thPadre).find(resizerSelector).first().then($resizerElement => {
                        
                        const startX = $resizerElement.offset().left;
                        
                        // Mover a la derecha (sumar)
                        const endX = startX + distanciaDeslizamiento; 

                        // SIMULACIÓN
                        cy.wrap($resizerElement).trigger('mousedown', { which: 1, force: true }); 
                        cy.document().trigger('mousemove', { clientX: endX, force: true });
                        cy.document().trigger('mouseup', { force: true });
                    });
                })
            });
    });
});

Then('el título de la columna {string} debe ser {string}', (nombreColumna, textoEsperado) => {
  // Usamos la función de ayuda para encontrar la cabecera
  getGridHeader(nombreColumna)
    .should('be.visible')
    .and('contain.text', textoEsperado);
});

Then('el tooltip de la columna {string} debe ser {string}', (nombreColumna, textoEsperado) => {
  // Vaadin a menudo pone el tooltip en un elemento hijo, como un <span>
  getGridHeader(nombreColumna)
  .within(() => {
      // DENTRO de esa cabecera, buscamos la etiqueta y verificamos su atributo 'title'.
      cy.get('label.label-header-filtro-columna')
        .should('have.attr', 'title', textoEsperado);
    });
});

Then('la columna {string} esta ordenada de forma {string}', (nombreColumna, direccionDeseada) => {
const sorter = getGridHeader(nombreColumna).find('vaadin-grid-sorter');
  const maxAttempts = 3; // Límite para evitar bucles infinitos

  // Mapeamos el texto del feature a los valores del atributo HTML
  const targetAttr = {
    'ascendente': 'asc',
    'descendente': 'desc',
    'sin ordenar': undefined
  }[direccionDeseada];

  /**
   * Función recursiva que hace clic hasta que la columna tiene la dirección correcta.
   * @param {number} attempts - El número de intentos restantes.
   */
  function clickUntilSorted(attempts) {
      if (attempts <= 0) {
        throw new Error(`La columna "${nombreColumna}" no alcanzó el estado "${direccionDeseada}" después de ${maxAttempts} intentos.`);
      }

      // 🔁 VOLVEMOS A BUSCAR EL ELEMENTO AQUÍ, EN CADA INTENTO
      getGridHeader(nombreColumna).find('vaadin-grid-sorter').then($sorter => {
        const currentDirection = $sorter.attr('direction');

        if (currentDirection !== targetAttr) {
        cy.wrap($sorter).find('div[part="indicators"]').click();
          cy.wait(500); // Espera para la animación/re-renderizado
          clickUntilSorted(attempts - 1); // Llama recursivamente
        }
      });
  }

  clickUntilSorted(maxAttempts);
});

Then('en la fila con el código {string}, la columna siguiente debe contener {string}', (codigo, textoEsperado) => {
  // 1. Busca la celda que contiene el código de referencia.
  cy.contains('vaadin-grid-cell-content', codigo)
    // 2. Obtenemos el valor de su atributo 'slot'.
    .invoke('attr', 'slot')
    .then(slotId => {
      // slotId es, por ejemplo, "vaadin-grid-cell-content-24"

      // 3. Extraemos el número del final, lo convertimos a entero y le sumamos 1.
      const numeroBase = parseInt(slotId.split('-').pop());
      const numeroTarget = numeroBase + 1;

      // 4. Construimos el selector 'slot' para la celda de al lado.
      const slotTarget = `vaadin-grid-cell-content-${numeroTarget}`;

      // 5. Buscamos la celda objetivo por su 'slot' y verificamos que contenga el texto esperado.
      cy.get(`vaadin-grid-cell-content[slot="${slotTarget}"]`)
        .should('contain.text', textoEsperado);
    });
});

When('el usuario ingresa {string} en el filtro de la columna {string}', (texto, nombreColumna) => {
  getGridHeader(nombreColumna)
    .find('vaadin-text-field') // Los filtros suelen ser text-fields
    .type(texto);
});

Then('la grilla debe mostrar solo {string} registro', (cantidad) => {
  cy.get('span.grid-result-counter')
    .should('have.text', cantidad);
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
    .find('vaadin-button[class="botonFijar"]') // Asumo un botón de menú
    .click();
});

Then('las columnas {string}, {string} y {string} deben estar fijas a la izquierda', (col1, col2, col3) => {
const verificarColumnaFijada = (nombreColumna) => {
    // 1. Obtenemos el contenedor de la cabecera
    getGridHeader(nombreColumna)
      // 2. DENTRO de ese contenedor, buscamos el botón de fijar
      .find('vaadin-button[class="botonFijar"]')
      // 3. Verificamos que ESE botón tenga el atributo 'pinned'
      .should('have.attr', 'pinned');
  };

  // Verificamos cada una de las columnas pasadas en el test
  verificarColumnaFijada(col1);
  verificarColumnaFijada(col2);
  verificarColumnaFijada(col3);
});

When('el usuario abre el selector de columnas', () => {
  // Asumo que hay un botón específico para esto, a menudo con un icono
cy.get('vaadin-icon[icon="vaadin:ellipsis-dots-v"]').then($buttons => {
    // 2. Hacemos clic en el PRIMER botón encontrado.
    cy.wrap($buttons.eq(0)).click();

    // 3. Esperamos un momento para que el diálogo pueda aparecer.
    cy.wait(500);

    // 4. Usamos .then() para revisar el DOM SIN que el test falle si no encuentra el título.
    cy.get('body').then($body => {
      // 5. Verificamos si el título "Seleccionar columnas" AHORA existe en la página.
      if ($body.find('h2[slot="title"]:contains("Seleccionar columnas")').length) {
        // Si existe, ¡perfecto! No hacemos nada más.
        cy.log('El primer botón abrió el selector de columnas.');
      } else {
        // Si NO existe, significa que apretamos el botón incorrecto.
        cy.log('El primer botón no era el correcto, se apretará el segundo.');
        // Hacemos clic en el SEGUNDO botón.
        cy.wrap($buttons.eq(1)).click();
      }
    });
  });
});

Then('el usuario pasa todas las columnas a la izquierda', () => {
    cy.get('vaadin-button:has(vaadin-icon[icon="vaadin:angle-left"])').click();
});

Then('el usuario pasa todas las columnas a la derecha', () => {
    cy.get('vaadin-button:has(vaadin-icon[icon="vaadin:angle-right"])').click();
});

When('el usuario marca la columna {string}', (nombreColumna) => {
cy.get('vaadin-dialog-overlay[opened]').within(() => {
    cy.get('vaadin-grid').find('vaadin-grid-cell-content').each(($cell) => {
      const span = $cell.find('span');
      const render = $cell.find('flow-component-renderer');

      if (span.length > 0 && span.text().trim() === nombreColumna) {
        console.log('Columna encontrada para marcar:', span);
        console.log('Celda:', $cell);
        console.log('Render:', render);
        $cell.find('flow-component-renderer').click();
        return false;
      }
    });
  });
});

Then('la columna {string} no debe ser visible en la grilla', (nombreColumna) => {
  getGridHeader(nombreColumna).should('not.be.visible');
});

Then('la columna {string} debe ser visible en la grilla', (nombreColumna) => {
  getGridHeader(nombreColumna).should('be.visible');
});

When('el usuario hace clic en el botón de exportar a {string}', (formato) => {
  const titleDelBoton = `Exportar a ${formato}`;

  cy.get(`vaadin-button[title="${titleDelBoton}"]`).click();
});

When('el usuario hace clic en el botón de exportar a PDF', () => {
  cy.get('a:has(img[title="Exportar"])').click();
});

Then('un archivo llamado {string} debe descargarse', (nombreArchivo) => {
  // 2. Usar la "tarea" del plugin para verificar que el archivo existe
  //    Este comando SÍ espera a que el archivo aparezca en cypress/downloads
  cy.verifyDownload(nombreArchivo, { timeout: 30000 });

  // 3. AHORA SÍ, tu código tiene sentido para verificar el contenido
  //    (Esto es opcional si solo querés saber si se descargó)
  cy.readFile(`cypress/downloads/${nombreArchivo}`).should('exist');

  // O incluso podés verificar el contenido si es un archivo de texto o JSON
  // cy.readFile(`cypress/downloads/${nombreArchivo}`).should('contain', 'algun texto esperado');
});

// --- NUEVOS PASOS FALTANTES ---

Given('la base de datos no tiene ninguna entidad registrada', () => {
  // Este paso es avanzado. Requiere una tarea que limpie la base de datos.
  // Esto se configura en cypress.config.js y se llama así:
  cy.task('db:reset', null, { timeout: 60000 });
  cy.log('La base de datos fue reseteada para el test.');
});

Given('el usuario está en la grilla de entidades', () => {
  // Este paso a menudo no necesita hacer nada, porque el 'Background'
  // ya nos asegura que estamos en la vista correcta.
  // Se puede usar para verificar un elemento clave de la grilla.
  cy.get('vaadin-grid').should('be.visible');
  cy.log('Verificado que el usuario está en la grilla de entidades.');
});

Then('el título de la vista debe ser {string}', (textoDelTitulo) => {
  // Busca el span por su ID y verifica que contenga el texto
  cy.get('span#title').should('contain.text', textoDelTitulo);
});

When('el usuario cierra el mensaje "Dismiss" si existe', () => {
cy.get('body').then(($body) => {
    const devTools = $body.find('vaadin-dev-tools');

    if (devTools.length > 0) {
      cy.get('vaadin-dev-tools').invoke('remove');
    }
  });
});
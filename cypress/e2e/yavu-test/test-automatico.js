import { When, Then, Given, And } from "@badeball/cypress-cucumber-preprocessor";

/* Si se quiere testear en local estos archivos ejecute:
**      export CYPRESS_HOST='localhost' && 
**       export CYPRESS_PORT='8080' && 
**       export CYPRESS_SERVER='***' && 
**       export CYPRESS_USERNAME='******' && 
**       export CYPRESS_PASSWORD='******' && 
**       export CYPRESS_TARGET_NAME='Bancos' && 
**       export CYPRESS_TARGET_URL='ABMBancoView' && 
**           pnpm cypress open --port 8082
**       */

Given('el usuario está autenticado en el sistema', () => {
    const serverName = Cypress.env('SERVER') || '';
    const user = Cypress.env('USERNAME') || '';
    const pass = Cypress.env('PASSWORD') || '';

    const serverParam = `?servers=${serverName}`;
    const loginUrl = `/jcnt/v/login${serverParam}`;

    cy.session('userSession', () => {
        cy.log(`Autenticando en: ${loginUrl} con usuario: ${user} en el server: ${serverName} con la contraseña ${pass}`);

        const attemptLogin = () => {
            cy.visit(loginUrl);
            cy.get('input[name="username"]').type(user, { log: false });
            cy.get('input[name="password"]').should('be.enabled').type(pass, { log: false });
            cy.get('vaadin-button[part="vaadin-login-submit"]').click();
        };

        attemptLogin();

        cy.url().then((url) => {
            if (url.includes('authfailed')) {
                cy.log('El primer login falló. Reintentando...');
                attemptLogin();
            }
        });

        cy.url().should('not.include', 'login');
    });
});

When('el usuario espera {int} segundos hasta que aparezca el titulo configurado', (segundos) => {
    const tituloEsperado = Cypress.env('TARGET_NAME');

    if (!tituloEsperado) {
        throw new Error("🛑 Error: No se recibió la variable TARGET_NAME desde Jenkins. Revisa la configuración del Job.");
    }

    cy.log(`⏳ Esperando ${segundos}s hasta que aparezca el título: "${tituloEsperado}"`);

    cy.contains('h4', tituloEsperado, { timeout: segundos * 1000 }).should('be.visible');
});

Then('el elemento {string} ya no es visible', (selector) => {
    cy.get(selector, { timeout: 10000 }).should('not.be.visible');
});

When('el usuario espera {int} segundos', (segundos) => {
    cy.wait(segundos * 1000);
});

When('el usuario cierra el mensaje "Dismiss" si existe', () => {
    cy.get('body').then(($body) => {
        const devTools = $body.find('vaadin-dev-tools');

        if (devTools.length > 0) {
            cy.get('vaadin-dev-tools').invoke('remove');
        }
    });
});

Given('el usuario navega a la vista configurada', () => {
    const vistaConfigurada = Cypress.env('TARGET_URL'); 

    if (!vistaConfigurada) {
        throw new Error("🛑 Error: No se recibió la variable TARGET_URL desde Jenkins/Ambiente");
    }

    cy.log(`📍 Navegando dinámicamente a: /jcnt/v/${vistaConfigurada}`);

    cy.visit(`/jcnt/v/${vistaConfigurada}`);
});

When('el usuario completa todos los combos', () => {
    const textoLargo = Cypress._.repeat('x', 40);
    // const textoEsperado = Cypress._.repeat('x', 30);

    cy.get('vaadin-form-layout').first().then($form => {

        // -----------------INICIO Rellenar campos de texto -----------------
        cy.wrap($form).find('vaadin-text-field:visible').each(($textField) => {

            cy.wrap($textField).find('input')
                .clear()
                .type(textoLargo);
            // .should('have.value', textoEsperado);
        });
        // -----------------FIN Rellenar campos de texto -----------------

        // -----------------INICIO Seleccionar ítem en combo box -----------------
        cy.wrap($form).then(($f) => {
            const comboBoxes = $f.find('vaadin-combo-box:visible');

            if (comboBoxes.length) {
                cy.wrap(comboBoxes).each(($comboBox) => {
                    cy.wrap($comboBox).click();
                    cy.wrap($comboBox)
                        .find('input')
                        .invoke('attr', 'aria-controls')
                        .then((referenciaAItems) => {
                            cy.get(`vaadin-combo-box-scroller[id="${referenciaAItems}"]`)
                                .should('be.visible')
                                .find('vaadin-combo-box-item')
                                .first()
                                .click();
                        });
                });
            } else {
                const comboBoxes = $f.find('vaadin-multi-select-combo-box:visible:not([has-value])');

                if (comboBoxes.length) {
                    cy.wrap(comboBoxes).each(($comboBox) => {
                        cy.wrap($comboBox).click();
                        cy.wrap($comboBox)
                            .find('input')
                            .invoke('attr', 'aria-controls')
                            .then((referenciaAItems) => {
                                cy.get(`vaadin-multi-select-combo-box-scroller[id="${referenciaAItems}"]`)
                                    .should('be.visible')
                                    .find('vaadin-multi-select-combo-box-item')
                                    .first()
                                    .click();
                            });
                    });
                }
            }
        });
        // -----------------FIN Seleccionar ítem en combo box -----------------
    });
});

When('el usuario apreta guardar y valida que el código exista en la grilla', () => {
    // obtengo el texto del custom combo de vaadin
    cy.get('vaadin-form-layout').first().find('vaadin-custom-field:visible').first().find('input').invoke('val').then((codigoCreado) => {

        cy.contains('vaadin-button', "Guardar").click();
        // espero que el guardado se complete (backdrop desaparezca)
        cy.get('#backdrop', { timeout: 10000 }).should('not.be.visible');
        getGridHeader("Código")
            .find('text-field-decimal')
            .type(codigoCreado);

        cy.wait(10000);

        cy.contains('vaadin-grid-cell-content', codigoCreado)
            .should('be.visible');
    });
});

When('el usuario abre el selector de columnas', () => {
    cy.get('vaadin-icon[icon="fas:grip-vertical"]')
        .filter(':visible')
        .first()
        .parent()
        .click();

    cy.get('vaadin-icon[icon="fas:table-columns"]')
        .filter(':visible')
        .first()
        .parent()
        .click();
});

Then('el usuario pasa todas las columnas a la derecha', () => {
    cy.get('vaadin-button:has(vaadin-icon[icon="vaadin:angle-double-right"])').click();
});

When('el usuario hace clic en el botón con el texto {string}', (textoDelBoton) => {
    cy.contains('vaadin-button', textoDelBoton).click();
});

When('el usuario hace clic en el botón con el texto Volver', () => {
    cy.get('vaadin-icon[icon="fas:arrow-left"]')
        .filter(':visible')
        .parent()
        .click();
});

Then('valido que el campo Creación tiene contenido', () => {
    const regexPattern = /Creación:\s*\S+/;

    cy.get('.text-info').then(($el) => {
        const textoCompleto = $el.text().trim();

        if (textoCompleto.match(regexPattern)) {
            cy.log('✅ Validación Exitosa: El campo Creación tiene contenido.');
        } else {
            const mensajeError = `❌ ALERTA DE PRUEBA: El campo Creación está vacío. Texto actual: "${textoCompleto}"`;
            cy.log(mensajeError);
            assert.fail(mensajeError);
        }
    });
});

When('hago clic en el ícono de ver de la fila {int}', (fila) => {
    const index = fila - 1;

    cy.get('vaadin-icon[icon="fas:eye"]')
        .eq(index)
        .parent()
        .click({ force: true });
});

When('hago clic en el ícono de editar de la fila {int}', (fila) => {
    const index = fila - 1;

    cy.get('vaadin-icon[icon="fas:pen-to-square"]')
        .eq(index)
        .parent()
        .click({ force: true });
});

When('hago clic en el ícono de borrar de la fila {int}', (fila, url) => {
    const index = fila - 1;

    cy.get('vaadin-icon[icon="fas:trash"]')
        .eq(index)
        .parent()
        .click({ force: true });

    cy.get('vaadin-button[slot="confirm-button"]')
        .click();

    cy.wait(8000);
    cy.reload();
    cy.wait(2000);
});

When('el usuario hace clic en el botón de exportar a {string}', (formato) => {
    const titleDelBoton = `Exportar a ${formato}`;

    cy.get(`vaadin-button[title="${titleDelBoton}"]`).click();
});

When('el usuario hace clic en el botón de exportar a PDF', () => {
    cy.get('a:has(img[title="Exportar"])').click();
});

Then('un archivo llamado {string} debe descargarse', (nombreBase) => {

    const fechaActual = dayjs().format('DD-MM-YYYY');

    const nombreEsperado = `${nombreBase}_${fechaActual}.xlsx`;

    cy.log(`Buscando archivo descargado con el nombre: ${nombreEsperado}`);

    // 3. Usar la "tarea" del plugin para verificar que el archivo existe
    //    cy.verifyDownload esperará automáticamente hasta que el archivo aparezca.
    cy.verifyDownload(nombreEsperado, { timeout: 30000 });

    // 4. (Opcional) Verificar la existencia física después de la descarga
    cy.readFile(`cypress/downloads/${nombreEsperado}`).should('exist');
});

Then('el título de la vista debe ser {string}', (textoDelTitulo) => {
    // Busca el span por su ID y verifica que contenga el texto
    cy.get('span#title').should('contain.text', textoDelTitulo);
});

// Te sugiero un nuevo nombre para el step para no confundirlo
When('El usuario completa los datos obligatorios en el formulario', () => {
    const textoLargo = "Obligatorio";

    cy.get('body').then($body => {
        const $textFields = $body.find('vaadin-text-field:visible');

        if ($textFields.length > 0 && typeof $textFields.attr('required') !== 'undefined') {
            cy.wrap($textFields).each(($textField) => {
                cy.wrap($textField)
                    .then(($spans) => {
                        if ($spans.length > 0) {
                            cy.wrap($textField).find('input')
                                .clear()
                                .type(textoLargo);
                        }
                    });
                // .should('have.value', textoEsperado);
            });
        }

        const $comboBoxes = $body.find('vaadin-combo-box:visible[required]');

        if ($comboBoxes.length > 0) {
            cy.wrap($comboBoxes).each(($comboBox) => {
                cy.wrap($comboBox).click();
                cy.wrap($comboBox)
                    .find('input')
                    .invoke('attr', 'aria-controls')
                    .then((referenciaAItems) => {
                        if (referenciaAItems) {
                            cy.get(`vaadin-combo-box-scroller[id="${referenciaAItems}"]`)
                                .find('vaadin-combo-box-item')
                                .first()
                                .click();
                        }
                    });
            });
        }

        const $customFields = $body.find('vaadin-custom-field:visible[required]');

        if ($customFields.length > 0) {
            cy.wrap($customFields).each(($customField) => {
                const $comboBoxes = $customField.find('vaadin-multi-select-combo-box');

                if ($comboBoxes.length == 0) {
                    const $input = $customField.find('input');

                    if ($input.val() === '') {
                        cy.wrap($input).click();
                        cy.wrap($input)
                            .invoke('attr', 'aria-controls')
                            .then((referenciaAItems) => {
                                if (referenciaAItems) {
                                    cy.get(`vaadin-combo-box-scroller[id="${referenciaAItems}"]`)
                                        .find('vaadin-combo-box-item')
                                        .first()
                                        .click();
                                }
                            });
                    }
                    else {
                        cy.log('Este combo ya tiene valor. Saltando.');
                    }
                }
                else {
                    cy.wrap($comboBoxes)
                        .each(($comboBox) => {
                            if (typeof $comboBox.attr('has-value') === 'undefined') {
                                cy.get('body').should('not.have.css', 'pointer-events', 'none');
                                cy.wrap($comboBox).click();
                                cy.wrap($comboBox)
                                    .find('input')
                                    .invoke('attr', 'aria-controls')
                                    .then((referenciaAItems) => {
                                        if (referenciaAItems) {
                                            cy.get(`vaadin-multi-select-combo-box-scroller[id="${referenciaAItems}"]`)
                                                .find('vaadin-multi-select-combo-box-item')
                                                .first()
                                                .click();

                                            cy.get('body').type('{esc}');
                                        }
                                    });
                            } else {
                                cy.log('Este combo ya tiene valor. Saltando.');
                            }
                        });
                }
            });
        }
    });
    // --- Fin del cambio ---
    // -----------------FIN Seleccionar ítem en custom-field REQUERIDO -----------------
});

When('el usuario completa todos los campos', () => {
    const textoLargo = Cypress._.repeat('x', 40);
    // const textoEsperado = Cypress._.repeat('x', 30);


    // -----------------INICIO Rellenar campos de texto -----------------
    cy.get('vaadin-text-field:visible').each(($textField) => {
        cy.wrap($textField)
            .find('span[part="required-indicator"][aria-hidden="true"]', { includeShadowDom: true })
            .then(($spans) => {
                if ($spans.length > 0) {
                    cy.wrap($textField).find('input')
                        .clear()
                        .type(textoLargo);
                }
            });
        // .should('have.value', textoEsperado);
    });
    // -----------------FIN Rellenar campos de texto -----------------

    // -----------------INICIO Seleccionar ítem en combo box -----------------
    cy.get('vaadin-combo-box:visible:not([has-value])').each(($comboBox) => {
        cy.wrap($comboBox)
            .then(($spans) => {
                if ($spans.length > 0) {
                    cy.wrap($comboBox).click();
                    cy.wrap($comboBox)
                        .find('input')
                        .invoke('attr', 'aria-controls')
                        .then((referenciaAItems) => {
                            cy.get(`vaadin-combo-box-scroller[id="${referenciaAItems}"]`)
                                .should('be.visible')
                                .find('vaadin-combo-box-item')
                                .first()
                                .click();
                        });
                }
            });
    });

    cy.get('vaadin-multi-select-combo-box:visible:not([has-value])').each(($comboCustom) => {
        cy.wrap($comboCustom)
            .then(($spans) => {
                if ($spans.length > 0) {
                    cy.get('body').should('not.have.css', 'pointer-events', 'none');
                    cy.wrap($comboCustom).click();
                    cy.wrap($comboCustom)
                        .find('input')
                        .invoke('attr', 'aria-controls')
                        .then((referenciaAItems) => {
                            if (referenciaAItems) {
                                cy.get(`vaadin-multi-select-combo-box-scroller[id="${referenciaAItems}"]`)
                                    .should('be.visible')
                                    .find('vaadin-multi-select-combo-box-item')
                                    .first()
                                    .click();

                                cy.get('body').type('{esc}');
                            }
                        });
                }
            });
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

When('el usuario ingresa {string} en el filtro de la columna {string}', (texto, nombreColumna) => {
  getGridHeader(nombreColumna)
    .find('vaadin-text-field') // Los filtros suelen ser text-fields
    .type(texto);
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

When('el usuario fija la columna {string}', (nombreColumna) => {
  // Esta implementación asume que hay un menú contextual en la cabecera
  getGridHeader(nombreColumna)
    .find('vaadin-button[class="botonFijar"]') // Asumo un botón de menú
    .click();
});

Then('la grilla debe mostrar solo {string} registro', (cantidad) => {
  cy.get('span.grid-result-counter')
    .should('have.text', cantidad);
});

When('scrolleo hasta el final de la grilla', () => {
    // Comando para scrollear hacia abajo en el Vaadin Grid Scroller
    cy.get('vaadin-grid')
      .shadow()
      .find('#scroller')
      .scrollTo('bottom', { ensureScrollable: false, duration: 500 }); // 500ms de duración
});

// PASO PARA VOLVER AL INICIO
When('scrolleo de vuelta al inicio de la grilla', () => {
    // Comando para scrollear hacia arriba (al inicio)
    cy.get('vaadin-grid')
      .shadow()
      .find('#scroller')
      .scrollTo('top', { duration: 200 });
});

const getGridHeader = (nombreColumna) => {
    // 1. Busca un <label> con la clase correcta que contenga el texto de la columna.
    return cy.contains('label.label-header-filtro-columna', nombreColumna)
        // 2. Sube hasta encontrar el contenedor principal de la celda.
        .closest('vaadin-grid-cell-content');
};
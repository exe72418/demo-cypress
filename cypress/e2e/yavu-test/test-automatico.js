import { When, Then, Given, And } from "@badeball/cypress-cucumber-preprocessor";

Given('el usuario está autenticado en el sistema', () => {
    const host = Cypress.env('HOST') || '';
    const port = Cypress.env('PORT') || '';
    const serverName = Cypress.env('SERVER') || '';
    const user = Cypress.env('USERNAME') || '';
    const pass = Cypress.env('PASSWORD') || '';

    const appBaseUrl = `http://${host}:${port}`;
    const serverParam = `?servers=${serverName}`;
    const loginUrl = `${appBaseUrl}/jcnt/v/login${serverParam}`;

    cy.session('userSession', () => {
        cy.log(`Autenticando en: ${loginUrl} con usuario: ${user}`);

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

When('el usuario espera {int} segundos hasta que aparezca {string}', (segundos, titulo) => {
    cy.contains('h4', `${titulo}`, { timeout: segundos * 1000 }).should('be.visible');
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

Given('el usuario navega a la vista {string}', (vista) => {
    cy.visit(`http://localhost:8080/jcnt/v/${vista}`);
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
    cy.get('vaadin-icon[icon="vaadin:ellipsis-dots-v"]')
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
        .click();
});

When('hago clic en el ícono de borrar de la fila {int}', (fila, url) => {
    const index = fila - 1;

    cy.get('vaadin-icon[icon="fas:trash"]')
        .eq(index)
        .click();

    cy.get('vaadin-button[slot="confirm-button"]')
        .click();

    cy.wait(5000);
    cy.reload();
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


const getGridHeader = (nombreColumna) => {
    // 1. Busca un <label> con la clase correcta que contenga el texto de la columna.
    return cy.contains('label.label-header-filtro-columna', nombreColumna)
        // 2. Sube hasta encontrar el contenedor principal de la celda.
        .closest('vaadin-grid-cell-content');
};
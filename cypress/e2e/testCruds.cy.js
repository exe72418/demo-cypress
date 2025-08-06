describe('Flujo de Creación: Entidad y Cuenta Corriente', () => {

  beforeEach(() => {
    // Tu bloque beforeEach con cy.session se mantiene exactamente igual.
    // Se encarga de que estés logueado para cada test.
    cy.session('sesion_activa_sandra', () => {
      cy.visit('http://localhost:8080/jcnt/v/login?servers=produccion');
      cy.get('input[name="username"]').type('sandra');
      cy.get('input[name="password"]').should('be.enabled').type('mosaFor267$');
      cy.get('vaadin-button[part="vaadin-login-submit"]').click();
      cy.url().should('not.include', 'login'); 
    });
  });

  // --- Test 1: Crear la Entidad ---
  it('Crear entidad con próximo número sugerido', () => {
    // Visita la página de Entidades
    cy.visit('http://localhost:8080/jcnt/v/ABMEntidadView?menu=21062');
    
    cy.contains('vaadin-button', 'Crear', { timeout: 10000 }).click();

    // Aquí iría la lógica para rellenar el formulario de la entidad y guardarla
    // cy.get('#campo-nombre-entidad').type('Nueva Empresa S.A.');
    // cy.get('#boton-guardar-entidad').click();
    // cy.contains('Entidad guardada con éxito').should('be.visible');
  });


  // --- Test 2: Crear la Cuenta Corriente (NUEVO BLOQUE) ---
  it('Crear Cuenta Corriente con próximo número sugerido', () => {
    // 1. Visita la página del ABM de Cuentas Corrientes
        cy.visit('http://localhost:8080/jcnt/v/ABMCuentaCorrienteView?menu=600000027'); // Reemplaza XXXXX con el ID de menú correcto

    // 2. Haz clic en el botón "Crear"
        cy.contains('vaadin-button', 'Crear', { timeout: 10000 }).click();

    // 3. Rellena el formulario de la nueva cuenta corriente.
    //    Aquí podrías seleccionar la entidad que creaste en el test anterior.
    // cy.get('#combo-entidad').type('Nueva Empresa S.A.');
    // cy.get('#campo-limite-credito').type('500000');

    // 4. Guarda la nueva cuenta corriente
    // cy.get('#boton-guardar-ctacte').click();

    // 5. Verifica que se haya creado correctamente
    // cy.contains('Cuenta Corriente guardada con éxito').should('be.visible');
  });

    // --- Test 3: Escribir en Reporte para buscar (NUEVO BLOQUE) ---
  it('Crear Cuenta Corriente con próximo número sugerido', () => {
        cy.visit('http://localhost:8080/jcnt/v/ReporteSubdiarioIIBBView?menu=15101'); // Reemplaza XXXXX con el ID de menú correcto

        cy.get('input[placeholder="Cuentas"]').type('Intentando escribir...');
  });

});
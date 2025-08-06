/*
* DESCRIBE -> Si es algo diferente como otro test
*
* beforeEach -> Antes de cada test para no repetir, optimiza el login por ejemplo
*
* 
*
* ELEMENTOS QUE USE:
*
* El cy.visit(...) a la página específica de ese test.
*
* Los clics en botones (.click()).
*
* La escritura en campos (.type()).
*
* Las verificaciones y aserciones (.should(...)).
* Aveces funciona como en el login para una vez que cargo la pagina, empieza a buscar
* (No funciono en el crear de los ABM al parecer porque tarda mucho en cargar los registros)
*
* cy.contains('vaadin-button', 'Crear', { timeout: 10000 }).click();
* * Verifico si esta el componente boton en el abm y espero a que cargue para apretarlo
*
*
* En el Reporte me vi obligado a buscar por placeholder porque no tenia name ni compoennt.
* cy.get('input[placeholder="Cuentas"]').type('Intentando escribir...');
*
* Observación: Todo se solucionaria con ids o etiquetas especificas.
*
* Esto es cypress con jenkins ejecuto miles de test simultaneos y verifico pruebas con videos.
* 
*/
describe('Flujo de Creación: Entidad y Cuenta Corriente', () => {

  beforeEach(() => {
    cy.session('sesion_activa_sandra', () => {
      cy.visit('http://localhost:8080/jcnt/v/login?servers=produccion');
      cy.get('input[name="username"]').type('sandra');
      cy.get('input[name="password"]').should('be.enabled').type('mosaFor267$');
      cy.get('vaadin-button[part="vaadin-login-submit"]').click();
      cy.url().should('not.include', 'login'); 
    });
  });

  it('Crear entidad con próximo número sugerido', () => {
    cy.visit('http://localhost:8080/jcnt/v/ABMEntidadView?menu=21062');
    
    cy.contains('vaadin-button', 'Crear', { timeout: 10000 }).click();

  });


  it('Crear Cuenta Corriente con próximo número sugerido', () => {
        cy.visit('http://localhost:8080/jcnt/v/ABMCuentaCorrienteView?menu=600000027');

    // 2. Haz clic en el botón "Crear"
        cy.contains('vaadin-button', 'Crear', { timeout: 10000 }).click();

  });

  it('Consultando reporte con datos esperados', () => {
        cy.visit('http://localhost:8080/jcnt/v/ReporteSubdiarioIIBBView?menu=15101');

        cy.get('input[placeholder="Cuentas"]', { timeout: 10000 }).type('Intentando escribir...');
  });

});
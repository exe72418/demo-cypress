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
      cy.visit('http://localhost:8080/jcnt/v/login?servers=vmg');
      cy.get('input[name="username"]').type('sandra');
      cy.get('input[name="password"]').should('be.enabled').type('mosaFor267$');
      cy.get('vaadin-button[part="vaadin-login-submit"]').click();
      cy.url().should('not.include', 'login'); 
    });
  });

  it('Ingresar a reporte evaluacion proveedor', () => {
  // it('Crear entidad con próximo número sugerido', () => {
       cy.visit('http://localhost:8080/jcnt/v/EntidadView?menu=21062');
       cy.wait(5000); 
       cy.get('[aria-labelledby="label-vaadin-text-field-20"]').click();
       cy.wait(5000); 
       cy.get('[aria-labelledby="label-vaadin-custom-field-32"]').click();
cy.wait(5000); 
       // CADA VEZ QUE DESAPARECE PREFERENCIAS (PANTALLA NEGRA DE VAADIN)
       cy.get('#backdrop', { timeout: 10000 }).should('not.be.visible');

       // cy.contains('vaadin-button', 'Crear').click();

       //cy.get('[data-testid="dni"]').click();
       //cy.get('[data-testid="nombre"]').click();
       cy.get('[data-testid="combo-localidad"]').click();
       cy.contains('vaadin-combo-box-item', 'ROSARIO').click();
       cy.get('[data-testid="combo-localidad"]').click();
       cy.contains('vaadin-combo-box-item', 'SANTIAGO').click();


    // cy.visit('http://192.168.10.9:9090/jcnt/v/ReporteEvaluacionProveedoresView?menu=600000001');
    //   cy.visit('http://localhost:8080/jcnt/v/ReporteSubdiarioIIBBView?menu=15101&empresas=2');

    //   cy.get('[test=boton-consultar]', { timeout: 50000 }).should('be.visible');

    //   cy.get('[test=combo-division]').first().click();
    //   cy.get('vaadin-multi-select-combo-box-overlay')
    //   .find('vaadin-button[title="Seleccionar todos"]')
    //   .click();

    //   cy.get('[test=combo-cuenta-contable]', { timeout: 2000 }).first().click();
    //   // cy.get('vaadin-multi-select-combo-box-overlay', { timeout: 2000 })
    //   // .get('#vaadin-multi-select-combo-box-item-0')
    //   // .click();
    //   cy.wait(10000);

    //   // Después de la pausa, busca el botón que contiene el texto "Consultar" y le hace clic.

    // // cy.visit('http://localhost:8080/jcnt/v/ABMEntidadView?menu=21062');
    
    // // cy.contains('vaadin-button', 'Crear', { timeout: 10000 }).click();

  });


//       it('Crear Cuenta Corriente con próximo número sugerido', () => {
//           cy.visit('http://localhost:8080/jcnt/v/ABMCuentaCorrienteView?menu=600000027');

//       // 2. Haz clic en el botón "Crear"
//           cy.contains('vaadin-button', 'Crear', { timeout: 10000 }).click();
//       });

//       it('Consultando reporte con datos esperados', () => {
          
//         cy.visit('http://localhost:8080/jcnt/v/ReporteSubdiarioIIBBView?menu=15101');
//           // 1. Busca el ComboBox por su atributo "test" y le hace clic.
//           // cy.get('[test=combo-empresa]').click();
// cy.get('[test=combo-division]').first().click();
//           // 2. Busca los ítems, selecciona el primero y le hace clic.
//           // cy.get('vaadin-combo-box-item').first().click();
//       });

});
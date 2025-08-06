// describe('Testear CRUDs de Entidades', () => { // Un nombre más descriptivo
describe('CRUD de Entidades', () => {

  // Este bloque se ejecuta ANTES de cada 'it()'
  beforeEach(() => {
    
    // cy.session() se encarga de la magia:
    // 1. La primera vez, ejecuta el código de adentro para iniciar sesión.
    // 2. Guarda las cookies y el estado de la sesión.
    // 3. En las siguientes pruebas, en lugar de volver a loguearse, simplemente restaura la sesión guardada.
    cy.session('sesion_activa_sandra', () => {
      cy.visit('http://localhost:8080/jcnt/v/login?servers=produccion');
      cy.get('input[name="username"]').type('sandra');
      cy.get('input[name="password"]').should('be.enabled').type('mosaFor267$');
      cy.get('vaadin-button[part="vaadin-login-submit"]').click();
      
      // Es una buena práctica verificar que el login fue exitoso aquí mismo
      cy.url().should('not.include', 'login'); 
    });

    // Una vez que la sesión está activa (ya sea nueva o restaurada),
    // visitamos la página específica que queremos probar.
    cy.visit('http://localhost:8080/jcnt/v/ABMEntidadView?menu=21062');
  });


  // --- AHORA TUS PRUEBAS SON LIMPIAS Y ENFOCADAS ---

  // Tu prueba original, ahora mucho más corta
  it('Debería poder hacer clic en el botón "Crear"', () => {
    // No necesitas iniciar sesión ni visitar la página, beforeEach ya lo hizo.
    cy.contains('vaadin-button', 'Crear', { timeout: 10000 }).click();

    // Aquí agregarías una aserción para verificar que se abrió el formulario
    // cy.get('div.formulario-crear-entidad').should('be.visible'); // Ejemplo
  });

  // ¡Mira qué fácil es agregar una segunda prueba!
  // it('Debería mostrar la grilla de entidades al cargar la página', () => {
  //   // De nuevo, ya estás logueado y en la página correcta.
  //   cy.get('vaadin-grid').should('be.visible');
  // });

  // // Y una tercera...
  // it('El botón "Crear" debería estar habilitado', () => {
  //   cy.contains('vaadin-button', 'Crear').should('be.enabled');
  // });

});

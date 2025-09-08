import { test, expect } from '@playwright/test';
/* POR DEFECTO VINO ESTO...
  // test('has title', async ({ page }) => {
  //   await page.goto('https://playwright.dev/');

  //   // Expect a title "to contain" a substring.
  //   await expect(page).toHaveTitle(/Playwright/);
  // });

  // test('get started link', async ({ page }) => {
  //   await page.goto('https://playwright.dev/');

  //   // Click the get started link.
  //   await page.getByRole('link', { name: 'Get started' }).click();

  //   // Expects page to have a heading with the name of Installation.
  //   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  // });

  // // Importa las funciones 'test' y 'expect' de Playwright
  // import { test, expect } from '@playwright/test';
*/

/* Mi test
 * test.describe() -> Es el equivalente a 'describe'. Agrupa un conjunto de tests
 * relacionados a una misma funcionalidad.
 *
 * test.beforeEach() -> Es el equivalente a 'beforeEach'. Es un "hook" que se ejecuta
 * automáticamente ANTES de cada test ('test()') dentro de este
 * describe. Es perfecto para la lógica de login.
 *
 * ASYNC/AWAIT -> A diferencia de Cypress que encadena comandos, Playwright usa
 * async/await. Cada comando que interactúa con la página debe
 * tener un 'await' para que la prueba espere a que termine
 * esa acción antes de continuar.
 *
 * ELEMENTOS QUE USAREMOS:
 *
 * - page.goto(...) -> Equivalente a cy.visit(). Navega a una URL.
 *
 * - page.locator(...) -> Es el selector principal, similar a cy.get().
 *
 * - .click() -> Funciona igual que en Cypress.
 *
 * - .fill() -> Es el equivalente a .type() para rellenar campos.
 *
 * - expect(...) -> Es el sistema de aserciones de Playwright, similar a .should().
 *
 * - Espera automática: Al igual que Cypress, Playwright espera automáticamente
 * a que los elementos estén listos antes de interactuar con ellos.
 *
 * - page.getByRole('button', { name: 'Crear' }) -> Una forma más robusta que
 * cy.contains(). Busca un elemento por su rol (un botón) y su texto visible.
 *
 * - playright.config.js -> Aquí se puede configurar un timeout global, similar
 * al cypress.config.js. También se puede añadir en cada acción:
 * await page.locator('...', { timeout: 10000 });
 *
 * Observación: Todo se solucionaría con ids o 'data-testid'. Esta práctica es
 * idéntica y recomendada para ambos frameworks.
 *
 * Esto es Playwright, que con Jenkins puede ejecutar miles de tests simultáneos
 * y verificar pruebas con videos y un "Trace" interactivo muy potente.
 */
test.describe('Flujo de Creación: Entidad y Cuenta Corriente', () => {

  test.beforeEach(async ({ page }) => {
    // Playwright no usa cy.session(), pero el login se hace de forma similar
    // en la preparación. Para optimizar, se pueden guardar y reutilizar las
    // cookies o el estado de autenticación, pero hacerlo así es más claro.
    await page.goto('http://localhost:8080/jcnt/v/login?servers=produccion');
    await page.locator('input[name="username"]').fill('sandra');
    await expect(page.locator('input[name="password"]')).toBeEnabled();
    await page.locator('input[name="password"]').fill('mosaFor267$');
    await page.locator('vaadin-button[part="vaadin-login-submit"]').click();

    // Verificamos que el login fue exitoso esperando que la URL cambie.
    await expect(page).not.toHaveURL(/.*login/);
  });

  test('Crear entidad con próximo número sugerido', async ({ page }) => {
    await page.goto('http://localhost:8080/jcnt/v/ReporteSubdiarioIIBBView?menu=15101&empresas=2');

    // Espera hasta 50 segundos a que el botón esté visible.
    await expect(page.locator('[test=boton-consultar]')).toBeVisible({ timeout: 50000 });

    await page.locator('[test=combo-division]').first().click();
    await page.locator('vaadin-multi-select-combo-box-overlay')
      .locator('vaadin-button[title="Seleccionar todos"]')
      .click();

    await page.locator('[test=combo-cuenta-contable]').first().click();
    
    // Playwright maneja Shadow DOM automáticamente, pero a veces hay que ser explícito.
    // Si la línea de abajo falla, es porque el ID es dinámico. Es mejor buscar por texto.
    await page.locator('vaadin-multi-select-combo-box-overlay #vaadin-multi-select-combo-box-item-0').click();
    
    // El equivalente al cy.wait(). Es una MALA PRÁCTICA, solo para depuración.
    await page.waitForTimeout(10000);
  });

  test('Crear Cuenta Corriente con próximo número sugerido', async ({ page }) => {
    await page.goto('http://localhost:8080/jcnt/v/ABMCuentaCorrienteView?menu=600000027');

    // Busca un botón con el texto "Crear" y le hace clic. Espera hasta 10 segundos.
    await page.getByRole('button', { name: 'Crear' }).click({ timeout: 10000 });
  });

  test('Consultando reporte con datos esperados', async ({ page }) => {
    await page.goto('http://localhost:8080/jcnt/v/ReporteSubdiarioIIBBView?menu=15101');
    
    // 1. Busca el ComboBox por su atributo "test" y le hace clic.
    await page.locator('[test=combo-empresa]').click();

    // 2. Busca los ítems y selecciona el primero.
    await page.locator('vaadin-combo-box-item').first().click();
  });

});
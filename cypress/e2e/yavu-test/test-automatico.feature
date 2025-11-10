Feature: Prueba de CRUD automático

Scenario Outline: Verificar el CRUD de <Nombre CRUD>
    Given el usuario está autenticado en el sistema
    When el usuario espera 2 segundos
    And el usuario navega a la vista "<URL CRUD>"
    When el usuario espera 50 segundos hasta que aparezca "<Nombre CRUD>"
    Then el elemento "#backdrop" ya no es visible
    And el usuario cierra el mensaje "Dismiss" si existe
    When el usuario espera 1 segundos
    When El usuario completa los datos obligatorios en el formulario
    When el usuario hace clic en el botón con el texto "Guardar"

  Examples:
    | Nombre CRUD     | URL CRUD                  |
    | Banco           | BancoView?menu=2512       |
    | Sectores        | SectorView?menu=2515      |
    | Roles           | RolView?menu=600000088    |
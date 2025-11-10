
  Scenario: Crear una nueva entidad Responsable inscripto exitosamente
    Given el usuario está autenticado en el sistema
    And el usuario navega a la vista "Entidad"
    When el usuario espera 50 segundos hasta que aparezca "Entidades"
    When el usuario ingresa "Nueva Entidad de Prueba S.A." en el campo con la etiqueta "Nombre"
    And el usuario ingresa "Calle Falsa 123" en el campo con la etiqueta "Dirección"
    And el usuario ingresa "******" en el campo con la etiqueta custom "CUIT"
    And el usuario ingresa "Zarate" en el campo con la etiqueta "Apellido"
    And el usuario selecciona "ROSARIO" en el combo custom "Localidad"
    And el usuario selecciona "RESPONSABLE INCRIPTO" en el combo custom "Situación ante IVA"
    And el usuario hace clic en el botón con el texto "Si"
    And el usuario hace clic en el botón con el texto "Si"
    When el usuario espera 1 segundos
    When el usuario hace click en el tab "Datos Impositivos"
    When el usuario espera 1 segundos
    When el usuario hace click en el tab "Impuestos Provinciales"
    When el usuario apreta "Editar" de la fila del grid "[000] CAPITAL FEDERAL"
    When el usuario espera 2 segundos
    And el usuario elige "[00] NO CONTRIBUYE EXENTO" en el combo custom del dialog "Situación ante IIBB"
    And el usuario hace clic en el botón con el texto "Aceptar"
    When el usuario apreta "Editar" de la fila del grid "BUENOS AIRES"
    When el usuario espera 2 segundos
    And el usuario elige "[00] NO CONTRIBUYE EXENTO" en el combo custom del dialog "Situación ante IIBB"
    And el usuario hace clic en el botón con el texto "Aceptar"
    When el usuario apreta "Editar" de la fila del grid "SANTA FE"
    When el usuario espera 2 segundos
    And el usuario elige "[00] NO CONTRIBUYE EXENTO" en el combo custom del dialog "Situación ante IIBB"
    And el usuario hace clic en el botón con el texto "Aceptar"
    When el usuario apreta "Editar" de la fila del grid "TUCUMAN"
    When el usuario espera 2 segundos
    And el usuario elige "[00] NO CONTRIBUYE EXENTO" en el combo custom del dialog "Situación ante IIBB"
    And el usuario hace clic en el botón con el texto "Aceptar"
    When el usuario apreta "Editar" de la fila del grid "MISIONES"
    When el usuario espera 2 segundos
    And el usuario elige "[00] NO CONTRIBUYE EXENTO" en el combo custom del dialog "Situación ante IIBB"
    And el usuario hace clic en el botón con el texto "Aceptar"
    And el usuario hace clic en el botón con el texto "Guardar"
    When el usuario espera 3 segundos
    When el guardado es exitoso y el usuario es redirigido a una url que contiene "ABMEntidadView"
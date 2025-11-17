Feature: ABM de Entidades

  Scenario: Crear una nueva entidad Consumidor Final exitosamente
    Given el usuario está autenticado en el sistema
    And el usuario navega a la vista "Entidad"
    When el usuario espera 50 segundos hasta que aparezca "Entidades"
    When el usuario ingresa "Nueva Entidad de Prueba S.A." en el campo con la etiqueta "Nombre"
    And el usuario ingresa "Calle Falsa 123" en el campo con la etiqueta "Dirección"
    And el usuario ingresa "27000000006" en el campo con la etiqueta custom "CUIT"
    And el usuario ingresa "Zarate" en el campo con la etiqueta "Apellido"
    And el usuario selecciona "ROSARIO" en el combo custom "Localidad"
    And el usuario selecciona "CONSUMIDOR FINAL" en el combo custom "Situación ante IVA"
    And el usuario hace clic en el botón con el texto "Si"
    And el usuario hace clic en el botón con el texto "Si"
    When el usuario espera 1 segundos
    And el usuario hace clic en el botón con el texto "Guardar"
    When el usuario espera 3 segundos
    When el guardado es exitoso y el usuario es redirigido a una url que contiene "ABMEntidadView"
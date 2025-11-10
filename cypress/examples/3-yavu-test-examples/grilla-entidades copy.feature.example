
  @grilla @cabeceras
  Scenario Outline: Verificar títulos y tooltips de las cabeceras
    Given el usuario está en la grilla de entidades
    Then el título de la columna "<Nombre Columna>" debe ser "<Texto Esperado>"
    And el tooltip de la columna "<Nombre Columna>" debe ser "<Texto Esperado>"

    Examples:
      | Nombre Columna      | Texto Esperado        |
      | Código              | Código                |
      | Nombre Completo     | Nombre Completo       |
      | Nombre de Fantasía  | Nombre de Fantasía    |
      | CUIT                | CUIT                  |
      | Calle y Número      | Calle y Número        |
      | Localidad           | Localidad             |

  @grilla @ordenamiento
  Scenario: Ordenar la grilla por una columna de texto
    Then la columna "Nombre Completo" esta ordenada de forma "ascendente"
    When el usuario espera 5 segundos
    Then en la fila con el código "0", la columna siguiente debe contener "LOPEZ CARLOS"

    Then la columna "Nombre Completo" esta ordenada de forma "descendente"
    When el usuario espera 5 segundos
    Then en la fila con el código "19975", la columna siguiente debe contener ""

  @grilla @filtros
  Scenario: Filtrar la grilla por una columna
    When el usuario ingresa "LOPEZ CARLOS" en el filtro de la columna "Nombre Completo"
    Then la grilla debe mostrar solo "1" registro
    Then en la fila con el código "0", la columna siguiente debe contener "LOPEZ CARLOS"

  @grilla @columnas
  Scenario: Fijar una columna en la grilla
    When el usuario fija la columna "CUIT"
    Then las columnas "Código", "Nombre Completo" y "CUIT" deben estar fijas a la izquierda

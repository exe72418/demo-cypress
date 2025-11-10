Feature: Grilla Entidades

  Background:
    Given el usuario está autenticado en el sistema
    And el usuario navega a la vista "ABMEntidad"
    When el usuario espera 50 segundos hasta que aparezca "Entidades"
    Then el elemento "#backdrop" ya no es visible
    When el usuario espera 3 segundos
    And el usuario cierra el mensaje "Dismiss" si existe

  @grilla @cabeceras
  Scenario: Verificar títulos y tooltips de las cabeceras
    Given el usuario está en la grilla de entidades
    Then el título de la columna "<Nombre Columna>" debe ser "<Texto Esperado>"
    And el tooltip de la columna "<Nombre Columna>" debe ser "<Texto Esperado>"
    Then el titulo de la columna "<Nombre Columna>" se achica un 50%
    When el usuario espera 3 segundos
    Then el titulo de la columna "<Nombre Columna>" se agranda un 200%
    When el usuario espera 3 segundos

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


  @grilla @columnas
  Scenario: Agregar y quitar columnas de la vista
    When el usuario espera 2 segundos
    When el usuario abre el selector de columnas
    When el usuario espera 2 segundos
    And el usuario marca la columna "Celular"
    Then el usuario pasa todas las columnas a la derecha
    When el usuario espera 1 segundos
    And el usuario marca la columna "CUIT"
    Then el usuario pasa todas las columnas a la izquierda
    When el usuario espera 1 segundos
    And el usuario hace clic en el botón con el texto "Aplicar"
    When el usuario espera 2 segundos

  @grilla @exportacion
  Scenario: Exportar los datos visibles a Excel
    When el usuario ingresa "LOPEZ CARLOS" en el filtro de la columna "Nombre Completo"
    And el usuario hace clic en el botón de exportar a "Excel"
    And el usuario hace clic en el botón de exportar a "Excel"
    When el usuario espera 7 segundos
    Then un archivo llamado "Entidades_27-10-2025.xlsx" debe descargarse

  @grilla @exportacion
  Scenario: Exportar los datos visibles a PDF
    When el usuario ingresa "LOPEZ CARLOS" en el filtro de la columna "Nombre Completo"
    When el usuario hace clic en el botón de exportar a "PDF"
    When el usuario hace clic en el botón de exportar a PDF
    Then el título de la vista debe ser "ExportPDFAction.do"
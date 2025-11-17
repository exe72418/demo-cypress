    # language: es
    Característica: Prueba de CRUD automático

    Antecedentes: Configuración inicial de la prueba
        Dado el usuario está autenticado en el sistema
        Cuando el usuario espera 10 segundos
        Dado el usuario navega a la vista configurada
        Cuando el usuario espera 50 segundos hasta que aparezca el titulo configurado
        Entonces el elemento "#backdrop" ya no es visible
        Y el usuario cierra el mensaje "Dismiss" si existe
        Cuando el usuario espera 1 segundos

    @alta @datosobligatorios
    Escenario: Verificar el ALTA con los datos obligatorios
        Cuando el usuario hace clic en el botón con el texto "Crear"
        Cuando El usuario completa los datos obligatorios en el formulario
        Cuando el usuario hace clic en el botón con el texto "Guardar"
        Dado el usuario navega a la vista configurada
        Cuando el usuario espera 1 segundos

    @alta @datoscompletos @textosmaximo
    Escenario: Verificar el ALTA con los todos los datos y textos al máximo
        Cuando el usuario hace clic en el botón con el texto "Crear"
        Cuando el usuario completa todos los combos
        Cuando el usuario hace clic en el botón con el texto "Guardar"
        Dado el usuario navega a la vista configurada
        Cuando el usuario espera 1 segundos

    @editar @textomaximo
    Escenario: Verificar el Editar con los todos los datos y textos al máximo
        Cuando hago clic en el ícono de editar de la fila 1
        Cuando el usuario completa todos los combos
        Cuando el usuario hace clic en el botón con el texto "Guardar"
        Dado el usuario navega a la vista configurada
        Cuando el usuario espera 1 segundos

    @visualizacion @timestamp
    Escenario: Verificar el VISUALIZACIÓN y timestamp de creación
        Cuando hago clic en el ícono de ver de la fila 1
        Entonces valido que el campo Creación tiene contenido
        Cuando el usuario hace clic en el botón con el texto Volver
        Cuando el usuario abre el selector de columnas
        Entonces el usuario pasa todas las columnas a la derecha
        Cuando el usuario espera 1 segundos
        Cuando el usuario hace clic en el botón con el texto "Aplicar"
        Cuando el usuario espera 5 segundos

    @borrar
    Escenario: Verificar el BORRAR
        Cuando hago clic en el ícono de borrar de la fila 1
        Cuando el usuario espera 1 segundos

    @grilla @ordenamiento @ascendente @descendente
    Escenario: Ordenar la grilla por una columna de texto
        Entonces la columna "Descripción" esta ordenada de forma "ascendente"
        Cuando el usuario espera 5 segundos

        Entonces la columna "Descripción" esta ordenada de forma "descendente"
        Cuando el usuario espera 5 segundos

    @grilla @filtros
    Escenario: Filtrar la grilla por una columna
        Cuando el usuario ingresa "CITIBANK" en el filtro de la columna "Descripción"
        Entonces la grilla debe mostrar solo "1" registro

    @grilla @columnas
    Escenario: Fijar una columna en la grilla
        Cuando el usuario fija la columna "Descripción"
        Cuando el usuario espera 2 segundos

    @agregarcolumnas @todaslascolumnas
    Escenario: Verificar todas las columnas en la grilla
        Cuando el usuario abre el selector de columnas
        Entonces el usuario pasa todas las columnas a la derecha
        Cuando el usuario espera 1 segundos
        Cuando el usuario hace clic en el botón con el texto "Aplicar"
        Cuando el usuario espera 5 segundos
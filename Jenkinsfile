// Jenkinsfile para el repositorio demo-cypress
pipeline {
    // 1. Agente y Herramientas
    // Se ejecutará en cualquier agente de Jenkins disponible.
    agent any

    tools {
        // Usa la instalación de NodeJS que configuraste en 'Administrar Jenkins' > 'Tools'.
        // IMPORTANTE: El nombre 'NodeJS-18' debe coincidir EXACTAMENTE con el que le pusiste.
        nodejs 'NodeJS-LTS'
    }

    // 2. Etapas del Pipeline
    // Estas son las fases que se ejecutarán en orden.
    stages {
        stage('Checkout: Bajar el código') {
            steps {
                // Clona tu repositorio desde la rama 'main'.
                // Ya no necesitas la URL aquí si configuras el job para que la use,
                // pero por claridad, la acción es esta:
                checkout scm
            }
        }

        stage('Install: Instalar dependencias') {
            steps {
                // Muestra las versiones para depuración.
                sh 'node -v'
                sh 'npm -v'
                
                // 'npm ci' es la forma recomendada para instalar dependencias en CI.
                // Es más rápida y segura que 'npm install' porque usa el package-lock.json.
                sh 'npm ci'
            }
        }

        stage('Test: Ejecutar Pruebas Cypress') {
            steps {
                // Envuelve el comando en 'ansiColor' para tener logs de colores y legibles.
                ansiColor('xterm') {
                    // Ejecuta el script 'cy:run' que definiste en tu package.json.
                    sh 'npm run cy:run'
                }
            }
        }
    }

    // 3. Acciones Post-Ejecución
    // Estas acciones se realizan después de que todas las etapas terminen.
    post {
        // 'always' significa que se ejecutará sin importar si las pruebas pasaron o fallaron.
        always {
            echo 'Archivando artefactos de prueba...'
            
            // Guarda los videos y screenshots de Cypress como "artefactos" en Jenkins.
            // Podrás verlos en la página del build específico.
            archiveArtifacts artifacts: 'cypress/videos/**, cypress/screenshots/**', followSymlinks: false
            
            // (Avanzado) Si configuras un reportero JUnit, esta línea publicará los resultados.
            // junit 'cypress/results/junit/*.xml'
        }
    }
}

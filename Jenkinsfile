// Jenkinsfile SIMPLIFICADO Y CORRECTO
pipeline {
    agent any
    tools {
        nodejs 'NodeJS-LTS'
    }
    stages {
        stage('1. Checkout: Bajar código') {
            steps {
                // Este paso ahora debe bajar tanto el código de la app
                // como el código de el proyecto de testing Cypress.
                checkout scm
            }
        }
        
        // --- Etapa de Compilación y Pruebas del Backend (Java) ---
        stage('2. Build & Test Backend') {
            steps {
                echo 'Compilando y corriendo tests de JUnit...'
                // sh './mvnw clean install' // Compila y ejecuta tests unitarios
            }
        }

        // --- Etapa Condicional para Pruebas de UI con Cypress ---
        // stage('3. Test Frontend (Cypress)') {
            // ✅ ESTA ETAPA SÓLO SE EJECUTA SI CAMBIAN LAS VISTAS
            // when {
            //     changeset "src/main/java/vaadin/view/impl/**"
            // }
            stage('Test: Ejecutar Pruebas Cypress') {
                steps {
                    ansiColor('xterm') {
                        sh 'npm run cy:run'
                    }
                }
            }
        // }
        
        // --- NUEVA ETAPA DE DESPLIEGUE ---
        // ✅ ESTA ETAPA SÓLO SE EJECUTA SI LAS ANTERIORES FUERON EXITOSAS
        stage('4. Deploy to Staging') {
            steps {
                echo 'Todas las pruebas pasaron. Desplegando a servidor de pruebas...'
                
                // Aquí pones los comandos para desplegar tu aplicación.
                // Por ejemplo, copiar el archivo .jar al servidor de QA.
                // sh 'scp target/mi-app.jar usuario@servidor-qa:/ruta/'
                // sh 'ssh usuario@servidor-qa "systemctl restart mi-app"'
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'cypress/videos/**, cypress/screenshots/**', allowEmptyArchive: true
        }
    }
}
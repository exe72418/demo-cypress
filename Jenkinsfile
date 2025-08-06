// Jenkinsfile CORREGIDO
pipeline {
    agent any

    tools {
        nodejs 'NodeJS-LTS' // Asegúrate que este sea el nombre correcto
    }

    stages {
        stage('Checkout: Bajar el código') {
            steps {
                checkout scm
            }
        }

        stage('Install: Instalar dependencias') {
            steps {
                sh 'npm ci'
            }
        }

        // --- NUEVA ETAPA ---
        stage('Start Application: Iniciar la aplicación') {
            steps {
                echo 'Iniciando la aplicación en segundo plano...'
                // El '&' al final es CRUCIAL. Ejecuta el comando en segundo plano.
                sh 'npm run start &'
                
                // Esperamos 15 segundos para que el servidor se levante completamente.
                // Puedes ajustar este tiempo si tu app tarda más o menos.
                echo 'Esperando 15 segundos a que la aplicación inicie...'
                sh 'sleep 15'
            }
        }
        // --- FIN DE LA NUEVA ETAPA ---

        stage('Test: Ejecutar Pruebas Cypress') {
            steps {
                ansiColor('xterm') {
                    sh 'npm run cy:run'
                }
            }
        }
    }

    post {
        always {
            echo 'Archivando artefactos y limpiando...'
            archiveArtifacts artifacts: 'cypress/videos/**, cypress/screenshots/**', followSymlinks: false
            
            // (Buena práctica) Detener el proceso de la aplicación al final.
            // '|| true' evita que el build falle si el proceso ya no existe.
            sh 'pkill node || true'
        }
    }
}
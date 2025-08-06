// Jenkinsfile SIMPLIFICADO Y CORRECTO
pipeline {
    agent any
    tools {
        nodejs 'NodeJS-LTS'
    }
    stages {
        stage('Checkout: Bajar código de Cypress') {
            steps {
                checkout scm
            }
        }
        stage('Install: Instalar dependencias de Cypress') {
            steps {
                sh 'npm ci'
            }
        }
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
            archiveArtifacts artifacts: 'cypress/videos/**, cypress/screenshots/**', allowEmptyArchive: true
        }
    }
}
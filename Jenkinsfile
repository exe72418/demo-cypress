pipeline {
    agent any

    tools {
        nodejs 'NodeJS-LTS'
    }

    stages {
        stage('1. Checkout: Bajar Códigos') {
            steps {
                cleanWs()
                // Descarga el código de los tests E2E en la carpeta 'e2e-tests'
                dir('e2e-tests') {
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/main']],
                        userRemoteConfigs: [[url: 'https://github.com/exe72418/demo-cypress.git']]
                    ])
                }
            }
        }
        
        stage('2. Instalar Dependencias E2E') {
            steps {
                dir('e2e-tests') {
                    echo 'Instalando dependencias de Node.js...'
                    sh 'npm ci'
                }
            }
        }

        stage('3. Ejecutar Pruebas End-to-End (Cypress)') {
            steps {
                dir('e2e-tests') {
                    echo 'Ejecutando tests E2E con Cypress...'
                    sh 'npx cypress run'
                }
            }
        }
    }

    post {
        always {
            echo 'Guardando resultados de las pruebas...'
            archiveArtifacts artifacts: 'e2e-tests/cypress/videos/**, e2e-tests/cypress/screenshots/**', allowEmptyArchive: true
        }
    }
}
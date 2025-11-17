pipeline {
    agent any

    tools {
        nodejs 'NodeJS-LTS'
    }

    parameters {
        string(name: 'HOST_PARAM', defaultValue: 'localhost', description: 'Host/URL de la aplicación a testear')
        string(name: 'PORT_PARAM', defaultValue: '8080', description: 'Puerto del host')
        string(name: 'SERVER_PARAM', defaultValue: 'vmg', description: 'Servidor o entorno (ej: vmg, test, prod)')
        string(name: 'USERNAME_PARAM', defaultValue: 'sandra', description: 'Usuario de prueba')
        string(name: 'PASSWORD_PARAM', defaultValue: 'mosaFor267$', description: 'Password del usuario de prueba')
        
        string(name: 'TARGET_URL', defaultValue: '', description: 'La URL (sin /jcnt/v/) a testear.')
        string(name: 'TARGET_NAME', defaultValue: '', description: 'El título a esperar de la vista.')
    }

    environment {
        CYPRESS_HOST            = "${params.HOST_PARAM}"
        CYPRESS_PORT            = "${params.PORT_PARAM}"
        CYPRESS_SERVER          = "${params.SERVER_PARAM}"
        CYPRESS_USERNAME        = "${params.USERNAME_PARAM}"
        CYPRESS_PASSWORD        = "${params.PASSWORD_PARAM}"
        CYPRESS_TARGET_URL      = "${params.TARGET_URL}"
        CYPRESS_TARGET_NAME     = "${params.TARGET_NAME}"
    }

    stages {
        stage('Preparar Build') {
            steps {
                script {
                    currentBuild.description = "${env.CYPRESS_TARGET_NAME}" 
                }
            }
        }

        stage('1. Checkout: Bajar Códigos') {
            steps {
                cleanWs()
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
                    sh 'npm install -g pnpm --silent'
                    sh 'pnpm install --no-frozen-lockfile'
                }
            }
        }

        stage('3. Ejecutar Pruebas End-to-End (Cypress)') {
            steps {
                dir('e2e-tests') {
                    echo "Ejecutando tests en: ${env.CYPRESS_HOST}:${env.CYPRESS_PORT} (User: ${env.CYPRESS_USERNAME})"
                    echo "Target Test: ${env.CYPRESS_TARGET_NAME} en /jcnt/v/${env.CYPRESS_TARGET_URL}"
                    
                    // Ejecutamos Cypress. '|| true' evita que el pipeline se detenga si un test falla
                    sh 'TERM=xterm npx cypress run --port 8082 --quiet || true'

                    echo "Generando reporte HTML..."
                    sh 'node generate-report.js'
                }
            }
        }
    }

    post {
        always {
            script {
                dir('e2e-tests') {
                    // Aseguramos permisos de lectura antes de publicar para evitar errores de copia
                    sh 'chmod -R 777 cypress/reports || true'
                }
            }

            echo 'Guardando resultados y videos...'
            archiveArtifacts artifacts: 'e2e-tests/cypress/videos/**, e2e-tests/cypress/screenshots/**, e2e-tests/cypress/reports/html/**', allowEmptyArchive: true

            echo 'Publicando reporte HTML...'
            publishHTML (target: [
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'e2e-tests/cypress/reports/html', 
                reportFiles: 'index.html',
                reportName: 'Reporte Cypress'
            ])
        }
    }
}
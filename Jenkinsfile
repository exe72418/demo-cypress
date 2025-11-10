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
        text(
            name: 'EXAMPLES_PARAM', 
            defaultValue: '', 
            description: 'Pega aquí filas extras para el "Scenario Outline". Ej: | MiTest | MiView?menu=123 |'
        )
    }

    environment {
        CYPRESS_HOST     = "${params.HOST_PARAM}"
        CYPRESS_PORT     = "${params.PORT_PARAM}"
        CYPRESS_SERVER   = "${params.SERVER_PARAM}"
        CYPRESS_USERNAME = "${params.USERNAME_PARAM}"
        CYPRESS_PASSWORD = "${params.PASSWORD_PARAM}"
    }
    
    stages {
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
        
        stage('1b. Inyectar Examples') {
            steps {
                dir('e2e-tests') {
                    script {
                        if (params.EXAMPLES_PARAM.trim()) {
                            echo "Inyectando nuevos examples en el feature..."
                            
                            def featureFile = "cypress/e2e/yavu-test/test-automatico.feature"
                            def content = readFile(file: featureFile, encoding: 'UTF-8')
                            def originalContent = content

                            def newContent = content.replaceFirst("(?m)^(\\s*)#JENKINS_EXAMPLES_PLACEHOLDER#") { all, indent ->
                                return """${indent ?: ''}${params.EXAMPLES_PARAM}
${indent ?: ''}#JENKINS_EXAMPLES_PLACEHOLDER#"""
                            }

                            if (newContent != originalContent) {
                                writeFile(file: featureFile, text: newContent, encoding: 'UTF-8')
                                echo "Feature actualizado."
                            } else {
                                echo "ADVERTENCIA: No se encontró el placeholder '#JENKINS_EXAMPLES_PLACEHOLDER#'"
                            }
                        } else {
                            echo "No se proveyeron examples extras."
                        }
                    }
                }
            }
        }
        
        stage('2. Instalar Dependencias E2E') {
            steps {
                dir('e2e-tests') {
                    echo 'Instalando dependencias de Node.js...'
                    sh 'npm install -g pnpm --silent'
                    sh 'pnpm install'
                }
            }
        }

        stage('3. Ejecutar Pruebas End-to-End (Cypress)') {
            steps {
                dir('e2e-tests') {
                    echo "Ejecutando tests en: ${env.CYPRESS_HOST}:${env.CYPRESS_PORT} (User: ${env.CYPRESS_USERNAME})"
                    sh 'TERM=xterm npx cypress run --port 8082 --quiet'
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
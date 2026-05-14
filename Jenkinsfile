pipeline {
    agent any

    environment {
        // Mapping Jenkins Credentials to Env Vars
        DB_CONFIG = credentials('qa-db-credentials') // Expects username/password
        DB_HOST = 'localhost'
        DB_PORT = '5432'
        DB_USER = "${env.DB_CONFIG_USR}"
        DB_PASS = "${env.DB_CONFIG_PSW}"
        DB_NAME = 'test_db'
        
        // Browser testing env
        BASE_URL = 'https://playwright.dev'
        API_URL = 'https://jsonplaceholder.typicode.com'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Lint & Static Analysis') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Database Health Check') {
            steps {
                script {
                    echo "Checking DB Health at ${DB_HOST}:${DB_PORT}..."
                    // Example health check using pg_isready or a custom script
                    // For demo, we'll just echo
                }
            }
        }

        stage('Run E2E Tests') {
            steps {
                // Pass environment variables to Playwright
                sh "DB_HOST=${DB_HOST} DB_PORT=${DB_PORT} DB_USER=${DB_USER} DB_PASS=${DB_PASS} DB_NAME=${DB_NAME} npm run test"
            }
            post {
                always {
                    allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Build Successful!'
        }
        failure {
            echo 'Build Failed. Please check the reports.'
        }
    }
}

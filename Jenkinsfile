pipeline {
    agent {
        node {
            label ''
            customWorkspace 'E:\\Automation'
        }
    }

    tools {
        nodejs 'NodeJS'
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                bat 'npm ci || npm install'
                bat 'npx playwright install --with-deps chromium'
            }
        }

        stage('Run E2E Tests') {
            steps {
                // Clean old reports before running new tests
                bat 'if exist allure-results rmdir /s /q allure-results'
                bat 'if exist allure-report rmdir /s /q allure-report'
                bat 'if exist playwright-report rmdir /s /q playwright-report'
                bat 'npx playwright test src/tests/web/suite --project=chromium'
            }
        }

        stage('Generate Allure Report') {
            steps {
                bat 'npx allure generate allure-results -o allure-report || echo Allure generation skipped'
            }
        }
    }

    post {
        always {
            // Archive Playwright HTML Report
            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])

            // Archive Allure Report
            allure includeProperties: false,
                   jdk: '',
                   results: [[path: 'allure-results']]

            // Archive test artifacts
            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
        }
        success {
            echo 'All tests passed successfully!'
        }
        failure {
            echo 'Some tests failed. Please check the reports.'
        }
    }
}

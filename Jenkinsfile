pipeline {
    agent {
        node {
            label ''
            customWorkspace 'E:\\Testing\\2-automation-testing\\playwright-automation'
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
                bat 'npx playwright test --project=chromium'
            }
        }

        stage('Generate Allure Report') {
            steps {
                bat 'npx allure generate allure-results --clean -o allure-report || echo Allure generation skipped'
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

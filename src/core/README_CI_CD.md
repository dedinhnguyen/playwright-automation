# Jenkins CI/CD Configuration Guide

This guide explains how to set up the Jenkins pipeline for this automation framework, focusing on database integration and environment security.

## 1. Jenkins Credentials Setup
To securely handle database passwords and API keys, use the Jenkins Credentials Provider:

1. Go to **Manage Jenkins** -> **Credentials**.
2. Select a domain (e.g., global).
3. Click **Add Credentials**.
4. **For DB Credentials**:
   - **Kind**: Username with Password
   - **ID**: `qa-db-credentials` (matches the Jenkinsfile)
   - **Username**: Your DB user
   - **Password**: Your DB password
5. **For Secret Keys**:
   - **Kind**: Secret text
   - **ID**: `api-secret-key`

## 2. Environment Mapping
The `Jenkinsfile` automatically maps these credentials to environment variables:
```groovy
environment {
    DB_CONFIG = credentials('qa-db-credentials')
    DB_USER = "${env.DB_CONFIG_USR}"
    DB_PASS = "${env.DB_CONFIG_PSW}"
}
```
During the build, these variables are injected into the shell environment where Playwright runs.

## 3. Jenkins Agent & DB Network
Ensure that the Jenkins agent (node) where the tests are running has network access to the database:
- If using **Docker-compose**: The agent needs Docker installed. The pipeline can run `sh 'docker-compose up -d'` before tests.
- If using **Staging DB**: Ensure the DB's security groups allow inbound traffic from the Jenkins agent IP on the DB port (e.g., 5432 or 3306).

## 4. Allure Report Configuration
1. Install the **Allure Jenkins Plugin**.
2. Configure **Global Tool Configuration** -> **Allure Commandline**.
3. In the pipeline, the `allure` step will automatically find results in the `allure-results` folder.

## 5. Dockerized DB for Testing
If you want to spin up a temporary database for each build, add this to your `Jenkinsfile` stage:
```groovy
stage('Spin up DB') {
    steps {
        sh 'docker-compose -f docker-compose.test.yml up -d'
    }
}
```
Don't forget to tear it down in the `post` block.

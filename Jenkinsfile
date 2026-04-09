pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'python3 -m venv venv'
                sh '. venv/bin/activate && pip install -r backend/requirements.txt'
            }
        }

        stage('Lint Check') {
            steps {
                sh '. venv/bin/activate && pip install flake8'
                sh '. venv/bin/activate && flake8 backend || true'
            }
        }

        stage('Test') {
            steps {
                sh 'echo "No tests yet — pipeline ready for Sprint 2"'
            }
        }
    }

    post {
        success {
            mail to: 'sayalir2108@gmail.com',
            subject: "Build SUCCESS: ${env.JOB_NAME}",
            body: "Build ${env.BUILD_NUMBER} completed successfully.\n${env.BUILD_URL}"
        }

        failure {
            mail to: 'sayalir2108@gmail.com',
            subject: "Build FAILED: ${env.JOB_NAME}",
            body: "Build ${env.BUILD_NUMBER} failed.\nCheck: ${env.BUILD_URL}"
        }
    }
}
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
}
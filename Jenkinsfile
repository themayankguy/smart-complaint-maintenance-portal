pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Python') {
            steps {
                sh 'python3 --version'
                sh 'python3 -m venv venv'
                sh '. venv/bin/activate && pip install -r backend/requirements.txt'
            }
        }

        stage('Build Success') {
            steps {
                sh 'echo "SCMP CI Pipeline Running Successfully 🚀"'
            }
        }
    }
}
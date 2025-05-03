pipeline {
    agent any

    stages {
        stage('Clone repo') {
            steps {
                git 'https://github.com/Arpita2711/Smart-Water-Predictor'
            }
        }

        stage('Build Docker containers') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Deploy containers') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
}

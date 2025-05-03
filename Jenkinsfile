pipeline {
    agent any

    stages {
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


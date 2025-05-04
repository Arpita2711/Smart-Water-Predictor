pipeline {
    agent any

    stages {
        stage('Build Docker containers') {
            steps {
                dir('DockerFolder') {
                sh 'docker-compose build'
                }
            }
        }

stage('Deploy containers') {
    steps {
        dir('DockerFolder') {
            sh 'docker-compose down -v --remove-orphans || true'
            sh 'docker-compose rm -f || true'
            sh 'docker system prune -f || true'
            sh 'docker-compose up -d'
                }
            }
        }
    }
}


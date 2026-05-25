pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'koteswaraprasad'
        FRONTEND_IMAGE     = "${DOCKERHUB_USERNAME}/job-tracker-frontend:latest"
        BACKEND_IMAGE      = "${DOCKERHUB_USERNAME}/job-tracker-backend:latest"
        PROJECT_DIR        = 'C:\\Users\\Koteswara_prasad\\OneDrive\\Desktop\\JAT'
    }

    stages {

        stage('Pull Latest Code') {
            steps {
                echo '📥 Pulling latest code from GitHub...'
                git branch: 'main',
                    url: 'https://github.com/KoteswaraPrasad/job-application-tracker.git'
            }
        }

        stage('Pull Docker Images') {
            steps {
                echo '🐳 Pulling latest Docker images from DockerHub...'
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat 'docker login -u %DOCKER_USER% -p %DOCKER_PASS%'
                    bat "docker pull %FRONTEND_IMAGE%"
                    bat "docker pull %BACKEND_IMAGE%"
                }
            }
        }

        stage('Stop Old Containers') {
            steps {
                echo '🛑 Stopping old containers...'
                bat "cd %PROJECT_DIR% && docker-compose down --remove-orphans || exit 0"
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying new containers...'
                bat "cd %PROJECT_DIR% && docker-compose up -d"
            }
        }

        stage('Health Check') {
            steps {
                echo '✅ Running health check...'
                bat 'ping -n 15 127.0.0.1 > nul'
                bat 'curl -f http://localhost:3000 || exit 1'
                echo "✅ App is running successfully!"
            }
        }
    }

    post {
        success {
            echo '🎉 Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed! Check logs above.'
        }
        always {
            bat 'docker logout || exit 0'
        }
    }
}
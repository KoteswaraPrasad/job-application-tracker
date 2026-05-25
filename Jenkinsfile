pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'koteswaraprasad'
        FRONTEND_IMAGE     = "${DOCKERHUB_USERNAME}/job-tracker-frontend:latest"
        BACKEND_IMAGE      = "${DOCKERHUB_USERNAME}/job-tracker-backend:latest"
        COMPOSE_FILE       = 'docker-compose.yml'
    }

    stages {

        // ─────────────────────────────────────────
        // STAGE 1: Pull Latest Code
        // ─────────────────────────────────────────
        stage('Pull Latest Code') {
            steps {
                echo '📥 Pulling latest code from GitHub...'
                git branch: 'main',
                    credentialsId: 'github-credentials',
                    url: 'https://github.com/koteswaraprasad/job-application-tracker.git'
            }
        }

        // ─────────────────────────────────────────
        // STAGE 2: Pull Latest Docker Images
        // ─────────────────────────────────────────
        stage('Pull Docker Images') {
            steps {
                echo '🐳 Pulling latest Docker images from DockerHub...'
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh "docker pull ${FRONTEND_IMAGE}"
                    sh "docker pull ${BACKEND_IMAGE}"
                }
            }
        }

        // ─────────────────────────────────────────
        // STAGE 3: Stop Old Containers
        // ─────────────────────────────────────────
        stage('Stop Old Containers') {
            steps {
                echo '🛑 Stopping old containers...'
                sh 'docker-compose down --remove-orphans || true'
            }
        }

        // ─────────────────────────────────────────
        // STAGE 4: Deploy New Containers
        // ─────────────────────────────────────────
        stage('Deploy') {
            steps {
                echo '🚀 Deploying new containers...'
                sh 'docker-compose up -d'
            }
        }

        // ─────────────────────────────────────────
        // STAGE 5: Health Check
        // ─────────────────────────────────────────
        stage('Health Check') {
            steps {
                echo '✅ Running health check...'
                sh '''
                    sleep 10
                    curl -f http://localhost:3000 || exit 1
                    curl -f http://localhost:5000/api/health || exit 1
                    echo "✅ App is running successfully!"
                '''
            }
        }

    }

    // ─────────────────────────────────────────
    // POST: Notifications
    // ─────────────────────────────────────────
    post {
        success {
            echo '🎉 Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed! Check logs above.'
        }
        always {
            sh 'docker logout || true'
        }
    }
}

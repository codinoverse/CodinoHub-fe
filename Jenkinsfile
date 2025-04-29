pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "nived9951463302/codinohub-fe"
        HELM_RELEASE = "codinohub-fe"
        HELM_CHART_PATH = "./codinohub-fe"
    }

    stages {
        stage('Checkout') {
            steps {
                git credentialsId: 'github-creds', url: 'https://github.com/mnivedcodinoverse/codinohub-fe1.git'
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${env.BUILD_NUMBER}")
                    withCredentials([usernamePassword(credentialsId: 'docker-creds', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        sh """
                            echo "$PASSWORD" | docker login -u "$USERNAME" --password-stdin
                            docker push ${DOCKER_IMAGE}:${env.BUILD_NUMBER}
                            docker tag ${DOCKER_IMAGE}:${env.BUILD_NUMBER} ${DOCKER_IMAGE}:latest
                            docker push ${DOCKER_IMAGE}:latest
                        """
                    }
                }
            }
        }

        stage('Deploy via Helm') {
            steps {
                script {
                    sh """
                        helm upgrade --install ${HELM_RELEASE} ${HELM_CHART_PATH} \
                          --set image.repository=${DOCKER_IMAGE} \
                          --set image.tag=latest
                    """
                }
            }
        }
    }
}

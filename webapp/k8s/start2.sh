kubectl apply -f my-app-namespace.yaml

kubectl apply -f my-app-config.yaml

kubectl apply -f mypostgres/pv-local.yaml

kubectl create -f myredis/myredis-service-clusterip.yaml

kubectl create -f myredis/myredis-deployment.yaml

kubectl apply -f mypostgres/postgres-pvc.yaml

kubectl apply -f mypostgres/postgres-clusterip.yaml

kubectl apply -f mypostgres/postgres-secret.yaml

kubectl apply -f mypostgres/postgres-config.yaml

kubectl apply -f mypostgres/postgres-deployment.yaml

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.47.0/deploy/static/provider/cloud/deploy.yaml

kubectl create -f myapp-ingress.yaml

kubectl apply -f my-backend-node-port.yaml

kubectl apply -f my-backend-clusterip.yaml

kubectl apply -f my-backend-deployment.yaml

kubectl create -f my-frontend-clusterip.yaml

kubectl create -f my-frontend-deployment.yaml

kubectl get deploy
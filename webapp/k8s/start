#!/bin/sh

minikube addons enable ingress

kubectl apply -f my-app-namespace.yaml
kubectl apply -f my-app-config.yaml

kubectl apply -f mypostgres/postgres-secret.yaml
kubectl apply -f mypostgres/pv-local.yaml
kubectl apply -f mypostgres/postgres-pvc.yaml

kubectl apply -f myredis/myredis-service-clusterip.yaml
kubectl apply -f mypostgres/postgres-clusterip.yaml
kubectl apply -f my-backend-clusterip.yaml

kubectl apply -f myredis/myredis-deployment.yaml
kubectl apply -f mypostgres/postgres-deployment.yaml
kubectl apply -f my-backend-deployment.yaml

kubectl apply -f my-frontend-clusterip.yaml
kubectl apply -f my-frontend-deployment.yaml

kubectl apply -f myapp-ingress.yaml
#!/bin/sh

# docker stop mybackend
docker stop myredis mypostgres
docker network rm my_app
docker rmi ml3szczynska/mywebapp

docker network create my_app
docker build . -t ml3szczynska/mywebapp
docker run -d --rm --network my_app --name myredis redis:alpine
docker run -d --rm --network my_app --name mypostgres -e POSTGRES_PASSWORD=1qaz2wsx -v /Users/reckony/Desktop/devops/projekt/postresdata:/var/lib/postgresql/data postgres:alpine
# docker run --rm --network my_app --name mywebapp -p 9090:9090 ml3szczynska/mywebapp

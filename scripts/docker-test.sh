#!/usr/bin/env bash

docker-compose build
docker-compose up -d mysql
docker-compose run app
docker-compose down -v

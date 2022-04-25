# Project 2: Drill and practice!

## Description
This is an application where you can add quizzes and also try to answer some quizzes of various topics. Only reqistered users using the application can view the available topics and the related questions, answer them, and add new questions for topics. Only admin user can add new topics and delete them.

## Running the application
Navigate to the root folder (where docker-compose file is) and run `docker-compose up`. Navigate to http://localhost:7777 with your bowser.

## Running the automatic tests
Navigate to the root folder (where docker-compose file is) and first start the application with docker `docker-compose up` and then run the tests within the container, use the command `docker-compose run --rm drill-and-practice deno test --allow-all`. Terminal is showing the passed tests.

## Deployment (Heroku)
https://drill-and-practice-wsd.herokuapp.com

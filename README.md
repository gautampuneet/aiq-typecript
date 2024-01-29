<h1 align="center">
    AIQ TypeScript App
</h1>

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)

[//]: # (4. [API]&#40;#api&#41;)

[//]: # (5. [Testing]&#40;#testing&#41;)

[//]: # (6. [Contributing]&#40;#contributing&#41;)

[//]: # (7. [License]&#40;#license&#41;)

## Introduction
AIQ App is a docker container that uses Typescript(express) to provide a RESTful API. We are using mongodb database for this so please provide mongodb connection url in src/models/aiq.ts before executing.
## Installation
#### 1. Install Requirements
```bash
npm install
```

#### Run the server locally
```bash
tsc src/router.ts
```
## Usage
#### Run the server locally with Docker
```bash
docker build -t aiq-typescript .
docker run --name aiq-typescript -it --expose 8080 -p 8080:80 aiq-typescript:latest
```
Note: Remove `-it` if you want to run the container in the background

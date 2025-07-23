# Strava Titan

Strava Titan is a Full Stack Application using Angular, Flask, and PostgreSQL built exclusively on Docker Containers. It connects to your Strava account and provides a beautiful and aesthetic dashboard for your running statistics.

## Features

- **Strava OAuth Integration** - Securely connect to your Strava account
- **Beautiful Dashboard** - Clean, modern interface for viewing your data
- **Running Statistics** - Detailed analysis of your running activities
- **Fully Containerized** - Easy setup and deployment with Docker
- **Real-time Data** - Pull your latest activities from Strava

## Requirements

To clone this project all you will need is Docker installed and your Strava App setup.

## Clone

git clone https://github.com/foolishcactus/stravatitan.git

## Setup

1. Set up your Strava App at https://www.strava.com/settings/api on the Strava Website
  - Set Authorization Callback Domain to: localhost:4200
2. Install the Docker Engine/Docker Desktop Client at https://docs.docker.com/desktop/
3. Create a file named .env. Look at sample.env for the variables required for you to run this. Fill in the appropriate fields.
4. Navigate to frontend/stravatitan/src/environments/ You will see environment.example.ts Follow the instructions to create environment.ts and environment.prod.ts within that same directory.

## Starting/Running

1. Run docker-compose build
2. Run docker-compose up

This will initialize all of your containers.

## Starting/Running Individual Containers

1. Run docker-compose build <frontend/backend>
2. Run docker-compose up <frontend/backend>

## Usage

Once running, navigate to:
- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:5000

## Troubleshooting

- If containers fail to start, try: docker-compose down && docker-compose up --build
- Make sure ports 4200, 5000, and 5432 are available
- Verify your Strava OAuth callback domain is set to localhost:4200

## Tech Stack

- **Frontend:** Angular 17
- **Backend:** Flask
- **Database:** PostgreSQL
- **Containerization:** Docker

## Contributing

This is a personal project, but feel free to fork and modify.
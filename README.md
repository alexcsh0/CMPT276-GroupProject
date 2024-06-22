# How to run the app
1. Install npm and node locally
    - https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
2. Setup proper environment file
    - Rename `template.env` in `/frontend` into `.env` and fill in env variables where applicable
3. Install frontend dependencies
    ```
    cd frontend
    npm install
    ```
4. Startup backend (from root dir)
    ```
    cd backend
    mvn spring-boot:run
    ```
5. Startup frontend (from root dir)
    ```
    cd frontend
    npm start
    ```
6. Access app (http://localhost:3000)
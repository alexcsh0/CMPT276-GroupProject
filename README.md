# How to run the app
1. Install npm and node locally
    - https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
2. Install frontend dependencies
    ```
    cd frontend
    npm install
    ```
3. Startup backend (from root dir)
    ```
    cd backend
    mvn spring-boot:run
    ```
4. Startup frontend (from root dir)
    ```
    cd frontend
    npm start
    ```
5. Access app (http://localhost:3000)
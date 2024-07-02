# How to run the app

## 1. Database setup
 - Download the postgres locally and set it up.
 - In cmd initialize psql command line `psql -U <your_username> -W` and enter the password
 - Run the script below (change values to fit the applications.properties file)
    ```
    CREATE USER route_alert;
    CREATE DATABASE route_alert;
    ALTER USER route_alert WITH ENCRYPTED PASSWORD 'testpassword';
    GRANT ALL PRIVILEGES ON DATABASE route_alert to route_alert;
    ALTER DATABASE route_alert OWNER TO route_alert;
    ```
 - All done, now you should have a database running that app can connect to

## 2. Application start

1. Install nodejs (npm comes with it)
    - https://nodejs.org/en
2. Setup proper environment file in frontend
    - Duplicate `template.env` in `/frontend` and rename new file into `.env`, fill in env variables where applicable
3. Install frontend dependencies (from root dir)
    ```
    cd frontend
    npm install
    ```

4. npm install axios

5. Start the app (from root dir)
    ```
    npm start
    ```
6. Access app (http://localhost:3000)
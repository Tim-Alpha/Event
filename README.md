# Event Eclipse Backend

## Description
This is the backend server for the Event Eclipse project.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Tim-Alpha/event.git
   ```
   
2. Install dependencies:
   ```bash
   npm install
   ```
3. To run server on development environment:
   - Copy the contents of the `.env.development` file and paste them into a new file named `.env`.
     ```bash
     cp .env.develompent .env
     ```     
   - In the development server configuration, the database is automatically synchronized (`sequelize.sync()`), ensuring that any changes to the Sequelize models are reflected in the database schema.

4. If face error in step 3 run following command in your terminal. (Recommended for first time setup)
   ```bash
   CREATE USER 'admin'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL PRIVILEGES ON event.* TO 'admin'@'localhost';
   FLUSH PRIVILEGES;
   ```

5. Run Create Database:
   ```bash
   npx sequelize-cli db:create
   ```

6. Run Server:
   ```bash
   npm run dev
   ```

## Error:
   - Ensure that the database username is set to `admin` and the password is set to `password`. If these credentials do not match your `MySQL username and password`, replace them accordingly.
     
   - Step 4 is crucial to avoid `authentication errors` such as "username=admin does not have the required permission".

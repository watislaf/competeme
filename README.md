# Welcome to Compete me app
---

### Run the Spring Server

1. **Navigate to the Project Directory**  
   Open a terminal and navigate to the root directory of the project

2. **Set Up the Database**
    - Ensure you have PostgreSQL installed and running.
    - Create a new database named `competeme`:
      ```bash
      psql -U your_username
      CREATE DATABASE competeme;

3. **Build the Project**  
   Run the following command to build the project using Gradle:
   ```bash
   ./gradlew build
   ```

4. **Run the Server**  
   Start the server using the following  command:
   ```bash
   ./gradlew bootRun
   ```

5. **Verify Database Table**
    - Open a PostgreSQL client (e.g., `psql`) and connect to the `competeme` database:
      ```bash
      psql -U your_username -d competeme
      ```
    - Check if the `_user` table has been created:
      ```sql
      \dt
      ```

If the `_user` table appears in the list of tables, the server has been successfully set up and is running.

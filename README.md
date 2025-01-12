# Welcome to Remix + Vite + shadcn/ui!

📖 See the [Remix docs](https://remix.run/docs) and the [Remix Vite docs](https://remix.run/docs/en/main/future/vite) for
details on supported features.

## Getting Started

Node Server:

```sh
npx create-remix@latest --template jacob-ebey/remix-shadcn
```

Cloudflare Pages:

```shellscript
npx create-remix@latest --template https://github.com/jacob-ebey/remix-shadcn/tree/cloudflare
```

Or for a more flushed out template with a login flow and a SQLite database backed by Drizzle ORM:

Node Server:

```shellscript
npx create-remix@latest --template https://github.com/jacob-ebey/remix-shadcn/tree/drizzle
```

Cloudflare Pages:

```shellscript
npx create-remix@latest --template https://github.com/jacob-ebey/remix-shadcn/tree/drizzle-cloudflare
```

## Built in theme switcher

![image](https://github.com/jacob-ebey/remix-shadcn/assets/12063586/c6ed812c-764f-46b7-af30-26284f55535c)

![image](https://github.com/jacob-ebey/remix-shadcn/assets/12063586/4e378230-3b4b-4b78-8af4-096b30aacf79)

## Development

Run the Vite dev server:

```sh
npm run dev
```

Here’s how to include instructions for running the Spring server through the command line:

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
   Start the server using the following command:
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

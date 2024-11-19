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

### Run the Spring Server


1. **Open the Project**  
   Open the project in IntelliJ

2. **Load Gradle Configurations**  
   Navigate to `server/security/build.gradle.kts`, click **Load Script Configurations**, and select `/security`.

3. **Set Up the Database**
    - Click the **Database** button on the right panel.
    - Click **+** → **Data Source** → **PostgreSQL**.
    - Name the database **jwt_security** and copy its URL.

4. **Configure Application Properties**  
   Open `server/security/src/main/resources/application.properties` and paste the database URL after `spring.datasource.url=`.

5. **Run the Project**
    - Go to `server/security/src/main/java/com/colorpicker/security/SecurityApplication.java`.
    - Click the **Run** button in the top right corner.

6. **Verify Database Table**
    - While the server is running, check if the `_user` table has been created:
        - Open the **Database** menu.
        - Click the **Refresh** button.
        - Look under `jwt_security/public/tables` for the `_user` table.
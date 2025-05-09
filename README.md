# Welcome to Compete me app

---

## Running the application with Docker

1. **Navigate to the Project Directory**  
   Open a terminal and navigate to the root directory of the project.

2. **Start the app with Docker**  
   Run the following command to start the Spring server and all required services:

   ```bash
   docker-compose up

## Access the application

Once the containers are running, you can access the application services:

- **Web Interface**: `http://localhost:3000`
- **API Documentation**: `http://localhost:8080/swagger-ui.html`
- **Kibana**: `http://localhost:5601`

## Monitoring with Kibana

### Initial Setup

1. **Open Kibana:**  
   `http://localhost:5601`

2. **Create data view:**
   - Go to: ☰ Menu → **Stack Management** → **Data Views**
   - Click **Create data view**
   - Configure:
      - **Name**: `app-logs`
      - **Index pattern**: `competeme-logs-*`
      - **Timestamp field**: `@timestamp`
   - Click **Save**

### Viewing Logs

1. **Navigate to:** 
   ☰ Menu → **Discover**

2. **Select** the `app-logs` data view

3. **Use features:**
   - **Search**: Filter logs (e.g., `level:ERROR`)
   - **Time range**: Adjust in top-right corner
   - **Fields**: Filter by available log fields
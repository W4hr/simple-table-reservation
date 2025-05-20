# Simple Table Reservation

A minimalistic table reservation system built with Svelte and SvelteKit. This app allows users to reserve seats at tables in a simple, trust-based environment—ideal for small groups or events where authentication isn't needed.

![Site](./static/screenshots/site.png)

> **Note**: Cross-origin request checks are currently disabled for easier development and usage across environments.

## Features

* Maintainer-defined table and seat setup
* Users can reserve seats by name
* Reserved seats are locked and cannot be taken again
* Names will be displayed publicly

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/W4hr/simple-table-reservation.git
cd simple-table-reservation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Initialize the Database

The maintainer must define the table/seat structure manually.

* In `seat.js`, edit the list to reflect your table and seat layout.

  * The length of the list = number of tables
  * Each number in the list = number of seats at that table
  * Example: `[4, 6, 2]` creates 3 tables with 4, 6, and 2 seats respectively

Then run:

```bash
node seat.js
```

### 4. Set Environment Variable

Create a `.env` file in the project root and add the following line:

```bash
NODE_ENV=development
```

This ensures the app runs in development mode when using `node`.

### 5. Run the App Locally

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Docker Deployment

You can also deploy the app using Docker:

1. **Build the Docker image:**

   ```bash
   docker build -t simple-table-reservation .
   ```

2. **Run the container with your desired table configuration:**

   ```bash
   docker run -p 3000:3000 \
      -e TABLE_LIST='[6,8,4,10]' \
      -v /path/to/your/database.db:/app/data/database.db \
      simple-table-reservation
   ```

   This example sets up four tables with 6, 8, 4, and 10 seats respectively. <br>
   **To start with a fresh database**, simply omit the volume flag:

   ```bash
   docker run -p 3000:3000 -e TABLE_LIST='[6,8,4,10]' simple-table-reservation
   ```

3. **Access the app** at [http://localhost:3000](http://localhost:3000).

> Note: The `TABLE_LIST` environment variable should be a JSON array representing your table layout.

## Admin Tasks

The `adminTasks.js` script provides command-line tools for managing the reservation system's database directly. These tasks are useful for administrative actions like clearing reservations or adjusting table setups without interacting with the UI or re-initializing the entire database.

**Base Command:**

```bash
node ./src/lib/adminTasks.js <functionName> [arguments...]
```

If no function name is provided or if the function name is not recognized, the script will display a list of available functions.

**Available Functions:**

* **`unreserveSeat <seat_id>`**: Clears the reservation for a specific seat.
    * Example: `node ./src/lib/adminTasks.js unreserveSeat 15`
* **`unreserveSeats`**: Clears all reservations from all seats.
    * Example: `node ./src/lib/adminTasks.js unreserveSeats`
* **`unreserveName <name>`**: Clears all reservations made under a specific name.
    * Example: `node ./src/lib/adminTasks.js unreserveName "John Doe"`
* **`addTable <seat_count>`**: Adds a new table with the specified number of seats. Seats will have a default color of "gray".
    * Example: `node ./src/lib/adminTasks.js addTable 8`
* **`deleteTable <table_id>`**: Deletes a table and all its associated seats.
    * Example: `node ./src/lib/adminTasks.js deleteTable 3`
* **`deleteSeat <seat_id>`**: Deletes a specific seat.
    * Example: `node ./src/lib/adminTasks.js deleteSeat 216`
* **`clearTables`**: Deletes all seats and all tables from the database. Use with caution as this will empty your entire seating arrangement.
    * Example: `node ./src/lib/adminTasks.js clearTables`

**Example Usage:**

To delete seat with ID 216:
```bash
node ./src/lib/adminTasks.js deleteSeat 216
```

To unreserve all seats currently reserved by "Jane Doe":
```bash
node ./src/lib/adminTasks.js unreserveName "Jane Doe"
```

---
💡 **Running admin tasks inside Docker:**  
You can execute adminTasks.js inside the running container using Docker exec:  
```bash
docker exec -it <container_name_or_id> node adminTasks.js <functionName> [arguments...]
```  
For example, to unreserve seat with ID `216`:  
```bash
docker exec -it <container_name_or_id> node adminTasks.js unreserveSeat 216
```

## Future Plans

* Docker support ✅
* Deployment configuration (✅)
* administration interface
* add logging (✅)

## License

This project is licensed under the [MIT License](LICENSE).
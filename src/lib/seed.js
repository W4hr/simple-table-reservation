import db from "./db.js";

const tableList = JSON.parse(process.env.TABLE_LIST || "[]")
// each items represents a table so > tableList.length = table count
// each number represents the tables amount of seats i at the table at index i > tableList[i] = amount of seats at the i'th table

if (tableList.length === 0) {
    console.warn("No tables to seed (empty list).")
    process.exit(0)
}

const seedTables = db.prepare(`INSERT INTO tables DEFAULT VALUES`)
const seedSeats = db.prepare(`INSERT OR IGNORE INTO seats (color, table_id) VALUES (?, ?)`)

function seedDatabase() {
    const existingTablesCount = db.prepare("SELECT COUNT(*) AS count FROM tables").get().count;
    if (existingTablesCount !== 0) {
        console.log("There are tables already in the database")
        return
    }

    tableList.forEach(seatCount => {
        const table_id = seedTables.run().lastInsertRowid

        for (let i = 0; i < seatCount; i++) {
            seedSeats.run("gray", table_id)
        }
    })
    console.log('Database seeded with tables and seats')
}

try {
    seedDatabase()
} catch (e) {
    console.log("Seeding failed: ", e)
}
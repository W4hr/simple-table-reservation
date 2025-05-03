import Database from 'better-sqlite3'

const db = new Database('/app/data/database.db')
db.pragma('foreign_keys = ON');

try {
    db.exec(`
        CREATE TABLE IF NOT EXISTS tables (
            id INTEGER PRIMARY KEY
        );
      
        CREATE TABLE IF NOT EXISTS seats (
            id INTEGER PRIMARY KEY,
            reserved INTEGER DEFAULT "0",
            reservation_name TEXT DEFAULT "",
            color TEXT,
            table_id INTEGER,
            FOREIGN KEY(table_id) REFERENCES tables(id)
        );
    `)    
} catch (e) {
    console.error("Database setup failed: ", e)
}

console.log('Database initialized.')

export default db
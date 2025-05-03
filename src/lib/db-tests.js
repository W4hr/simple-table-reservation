import db from "./db.js";

function showSeats() {
    console.log(db.prepare("SELECT * FROM seats").all())
}

function clearTables() {
    db.prepare(`DELETE FROM seats`).run()
    db.prepare(`DELETE FROM tables`).run()
}

try {
    clearTables()
} catch (e) {
    console.error(e)
}
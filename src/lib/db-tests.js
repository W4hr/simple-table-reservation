import db from "./db.js";

function showSeats() {
    console.log(db.prepare("SELECT * FROM seats").all())
}



try {
    clearTables()
} catch (e) {
    console.error(e)
}
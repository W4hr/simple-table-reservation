import db from "./db";

function unreserveSeat(seatId) {
    db.prepare(`UPDATE seats SET reserved = 0, reservation_name = "" WHERE id = ?`).run(seatId)
}

function unreserveSeats() {
    db.prepare(`UPDATE seats SET reserved = 0, reservation_name = ""`).run()
}

function unreserveName(name) {
    db.prepare(`UPDATE seats SET reserved = 0, reservation_name = "" WHERE reservation_name = ?`).run(name)
}

function addTable(seat_count) {
    const insertTable = db.prepare(`INSERT INTO tables DEFAULT VALUES`)
    const table_id = insertTable.run().lastInsertRowid
    const insertSeat = db.prepare(`INSERT INTO seats (
            reserved,
            reservation_name,
            color,
            table_id
        ) VALUES (0, "", ?, ?)`)
    for (let i = 0; i < seat_count; i++) {
        insertSeat.run("gray", table_id)
    }
}

function deleteTable(table_id) {
    db.prepare(`DELETE FROM seats WHERE table_id = ?`).run(table_id)
    db.prepare(`DELETE FROM tables WHERE id = ?`).run(table_id)
}

function deleteSeat(seat_id) {
    db.prepare(`DELETE FROM seats WHERE id = ?`).run(seat_id)
}

function clearTables() {
    db.prepare(`DELETE FROM seats`).run()
    db.prepare(`DELETE FROM tables`).run()
}
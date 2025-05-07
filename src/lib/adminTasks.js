import db from "./db.js";

const functions = {
    unreserveSeat: (seat_id) => {
        if (!seat_id) throw new Error("seat_id is required for unreserveSeat")
        db.prepare(`UPDATE seats SET reserved = 0, reservation_name = '' WHERE id = ?`).run(seat_id)
        console.log(`Seat ${seat_id} unreserved`)
    },
    unreserveSeats: () => {
        db.prepare(`UPDATE seats SET reserved = 0, reservation_name = ''`).run()
        console.log("All seats unreserved")
    },
    unreserveName: (name) => {
        if (!name) throw new Error("name is required for unreserveName")
        db.prepare(`UPDATE seats SET reserved = 0, reservation_name = '' WHERE reservation_name = ?`).run(name)
        console.log(`Reservations under ${name} unreserved`)
    },

    addTable: (seat_count) => {
        const insertTable = db.prepare(`INSERT INTO tables DEFAULT VALUES`)
        const table_id = insertTable.run().lastInsertRowid
        const insertSeat = db.prepare(`INSERT INTO seats (
                reserved,
                reservation_name,
                color,
                table_id
            ) VALUES (0, '', ?, ?)`)
        for (let i = 0; i < seat_count; i++) {
            insertSeat.run("gray", table_id)
        }
    },

    deleteTable: (table_id) => {
        db.prepare(`DELETE FROM seats WHERE table_id = ?`).run(table_id)
        db.prepare(`DELETE FROM tables WHERE id = ?`).run(table_id)
    },
    deleteSeat: (seat_id) => {
        db.prepare(`DELETE FROM seats WHERE id = ?`).run(seat_id)
    },
    clearTables: () => {
        db.prepare(`DELETE FROM seats`).run()
        db.prepare(`DELETE FROM tables`).run()
    }
}

const main = () => {
    const args = process.argv.slice(2)
    const function_name = args[0]
    const function_args = args.slice(1)

    if (!function_name) {
        console.error("Usage: node adminTasks.js <functionName> [args...]")
        console.log("Available functions:", Object.keys(functions).join(", "))
        process.exit(1)
    }

    const func = functions[function_name]
    
    if (!func) {
        console.error(`Error: Function ${function_name} not found`)
        console.log(`Available functions: `, Object.keys(functions).join(", "))
        process.exit(1)
    }

    try {
        console.log(`Executing ${function_name} with args: ${function_args.join(", ")}`)
        func(...function_args)
        console.log(`${function_name} executed successfully`)
    } catch (e) {
        console.error(`Error executing ${function_name}`, e.message)
        process.exit(1)
    }
}

// if (require.main === module) {
//     main()
// }

main()
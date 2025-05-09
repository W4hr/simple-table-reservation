import db from "$lib/db.js"
import { error } from "@sveltejs/kit"
import { createLogger, format, transports } from "winston"

const logger = createLogger({
    level: 'info',
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.timestamp(),
                format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] ${level}: ${message}`;
                })
            ),
        }),
        new transports.File({ 
            format: format.combine(
                format.timestamp(),
                format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] ${level}: ${message}`;
                })
            ),
            filename: 'app.log' })
    ]
})

logger.info("Server started")

function groupByTableID(seatArray) {
    const groupedMap = new Map()

    for (const seat of seatArray) {
        const table_id = seat.table_id
        if (!groupedMap.has(table_id)) {
            groupedMap.set(table_id, {
                "table_id": table_id,
                "seats": []
            })
        }
        seat["selected"] = false
        groupedMap.get(table_id).seats.push(seat)
    }

    const result = Array.from(groupedMap.values())
    result.sort((a, b) => a.table_id - b.table_id);
    return result
}

export function load() {
    let tables_unformatted = db.prepare(`
        SELECT 
            seats.id AS seat_id,
            seats.reserved,
            seats.reservation_name,
            seats.color,
            seats.table_id,
            tables.id AS table_id
        FROM seats
        JOIN tables ON seats.table_id = tables.id
    `).all()
    let tables = groupByTableID(tables_unformatted)

    return { tables }
}

export const actions = {
    default: async ({ request }) => {
        try {
            const data = await request.formData()
            const data_object = Object.fromEntries(data)
            const reserved_seats_id = Object.keys(data_object)
                .filter(seat => data_object[seat] === "on")
                .map(seat => seat.split("-").slice(-1)[0])
            if (reserved_seats_id.length === 0) return
            let reserve_seat = db.prepare(`
                    UPDATE seats SET reservation_name = ?, reserved = 1 WHERE id = ? AND reserved = 0`
            )
            const reserve_seats = db.transaction((name, ids) => {
                for (const id of ids) {
                    reserve_seat.run(name, id)
                }
            })
            const name = data.get("reservation_name")
            if (!name) {
                logger.warn("Reservation attempt without a name.")
                error(400, "There was no name provided for the reservation. Please provide a name in the input field.")
            }
            reserve_seats(name, reserved_seats_id)
            logger.info(`Seats ${reserved_seats_id.join(", ")} reserved under the name "${name}"`)
        } catch (e) {
            logger.error(`Reservation failed: ${e.message}`)
            throw error(500, "Internal server error.")
        }
    }
}
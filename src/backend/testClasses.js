import { BookingManager } from "./BookingManager.js";

const manager = new BookingManager()
await manager.ready;

console.log(manager.fetchBookings())
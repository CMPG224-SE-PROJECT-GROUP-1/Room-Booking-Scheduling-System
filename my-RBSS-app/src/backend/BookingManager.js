import { Booking } from './Booking.js';
import {supabase} from './src/supabaseClient.js'

export class BookingManager{
    #activeBookings     // List<Booking>

    constructor(){
        // gathers all bookings from superbase database into activeBookings list
        this.#activeBookings = [];
    }

    async searchRooms({building, minCapacity} = {}){
        // interfaces with supabase to use search feature;
        let query = supabase.from('rooms').select('*').eq('availability', true);

        if (building) query = query.eq('building', building);
        if (minCapacity) query = query.gte('capacity',minCapacity);

        const {data, error} = await query;
        if (error) throw new Error(error.message);

        return data.map(row => new Room(row.room_id, row.room_number, row.building,
        row.capacity, row.availability, row.amenities));

    }

    async createBooking(userID, roomID, slot, roomUse){
        const checkInCode = Math.floor(1000 + Math.random() * 9000).toString();

        const {data, error} = await supabase
        .from('bookings')
        .insert({
            user_id: userID,
            room_id: roomID,
            start_time: slot.start, // EDIT THIS SO THAT SLOT IS GENERATED PROPERLY
            end_time: slot.end,
            room_use: roomUse,
            check_in_code: checkInCode
        })
        .select()
        .single()

        if (error){
            throw new Error(`Could not create booking: ${error.message}`)
        }

        const booking = new Booking(userID, roomID, slot.start, slot.end, roomUse, checkInCode);
        booking.setBookingID(data.booking_id);
        this.#activeBookings.push(booking);
        return booking;
    }

    processCheckIn(bookingID, code){
        const booking = this.#activeBookings.find(b => b.getBookingID === bookingID);
        if (!booking) return false;
        return booking.checkIn(code);
    }

    async cancelBooking(bookingID, reason){
        const booking = this.#activeBookings.find(b => b.getBookingID === bookingID);

        booking.cancel(reason);
        const {error} = await supabase.from('bookings')
        .update({status: false, cancel_reason: reason})
        .eq('booking_id, bookingID');

        return !error;
    }

    autoCancelUnclaimed(){
        // let cancelledCount = 0;

        for (const booking of this.#activeBookings){
            if (booking.isExpired()){
                booking.cancel("No check-in within 30 minutes")
                // cancelledCount++;
            }
        }
    }

}
import {supabase} from './src/supabaseClient.js'

export class BookingManager{
    #activeBookings     // List<Booking>

    constructor(){
        // gathers all bookings from superbase database into activeBookings list
        this.#activeBookings = [];
    }

    searchRooms(){
        // interfaces with supabase to use search feature;
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
        // checks if code is the same as the checkInCode in the Booking made
    }

    cancelBooking(bookingID, reason){
        // calls Booking's cancelBooking with reason
    }

    autoCancelUnclaimed(){
        // checks if current time is 30 minutes after slot time and if no checkIn so far the booking is cancelled, checkInCode rendered invalid
    }

}
export class BookingManager{
    #activeBookings     // List<Booking>

    constructor(){
        // gathers all bookings from superbase database into activeBookings list
        this.#activeBookings = [];
    }

    searchRooms(){
        // interfaces with supabase to use search feature;
    }

    createBooking(userID, roomNumber, slot){
        // slot is DateTime starting from selected time and ending 2/3 hours later
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
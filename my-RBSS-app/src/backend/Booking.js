import { CHECK_IN_GRACE_MINUTES } from './slots.js';

export class Booking{
    #userID         // uuid
    #bookingID      // uuid
    #roomID         // uuid
    #startTime      // Date
    #endTime        // Date
    #roomUse        // String, reason for using room
    #attendees      // int, number of people
    #checkInCode    // String
    #status         // boolean, true = active, false = cancelled
    #checkedIn      // boolean, true once the student has been checked in
    #cancelReason   // String

    constructor(bookingID, userID, roomID, startTime, endTime, roomUse, checkInCode, status = false, checkedIn = false, attendees = null){
        this.#bookingID = bookingID;
        this.#userID = userID;
        this.#roomID = roomID;
        this.#startTime = new Date(startTime);   // works for strings and Dates
        this.#endTime = new Date(endTime);
        this.#roomUse = roomUse;
        this.#checkInCode = checkInCode;
        this.#status = status;
        this.#checkedIn = checkedIn;
        this.#attendees = attendees;
        this.#cancelReason = null;
    }

    // GETTERS
    get getBookingID() {return this.#bookingID;}
    get getRoomID() {return this.#roomID;}
    get getUserID() {return this.#userID;}
    get getStartTime() {return this.#startTime;}
    get getEndTime() {return this.#endTime;}
    get getRoomUse() {return this.#roomUse;}
    get getAttendees() {return this.#attendees;}
    get getCheckInCode() {return this.#checkInCode;}
    get getStatus() {return this.#status;}
    get getCheckedIn() {return this.#checkedIn;}
    get getCancelReason() {return this.#cancelReason;}

    setBookingID(id){
        this.#bookingID = id;
    }

    confirmBooking(){
        this.#status = true;
        return this.#status;
    }

    cancel(reason){
        this.#status = false;
        this.#cancelReason = reason || null;
        return true;
    }

    checkIn(code){
        if (String(code ?? '').trim() !== String(this.#checkInCode)) return false;
        this.#checkedIn = true;
        return true;
    }

    isExpired(){
        const graceMs = CHECK_IN_GRACE_MINUTES * 60 * 1000;
        return this.#status && !this.#checkedIn && Date.now() > this.#startTime.getTime() + graceMs;
    }

    updateDetails(roomUse, attendees){
        if (roomUse !== undefined) this.#roomUse = roomUse;
        if (attendees !== undefined) this.#attendees = attendees;
        return true;
    }

    toObject(){
        return {
            booking_id: this.#bookingID,
            user_id: this.#userID,
            room_id: this.#roomID,
            start_time: this.#startTime.toISOString(),
            end_time: this.#endTime.toISOString(),
            room_use: this.#roomUse,
            attendees: this.#attendees,
            check_in_code: this.#checkInCode,
            status: this.#status,
            checked_in: this.#checkedIn,
            cancel_reason: this.#cancelReason
        };
    }

}
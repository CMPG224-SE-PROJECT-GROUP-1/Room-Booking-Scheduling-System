export class Booking{
    #userID         // int
    #bookingID      // String
    #roomID         // int
    #startTime      // DateTime
    #endTime        // DateTime
    #roomUse        // String, reason for using room
    #checkInCode    // String
    #status         // boolean

    constructor(bookingID, userID, roomID, startTime, endTime, roomUse, checkInCode){
        this.#bookingID = bookingID;
        this.#userID = userID;    // String
        this.#roomID = roomID;
        this.#startTime = startTime;
        this.#endTime = endTime;
        this.#roomUse = roomUse; 
        this.#checkInCode = checkInCode;
        this.#status = false; 
    }

    setBookingID(id){
        this.#bookingID = id;
    }

    confirmBooking(){
        
    }

    cancel(){
        
    }

    checkIn(){

    }

    isExpired(){
        const graceMs = 30 * 60 * 1000; // 30 minutes, from your SRS
        return !this.#status && Date.now() > this.#startTime.getTime() + graceMs;
    }

}
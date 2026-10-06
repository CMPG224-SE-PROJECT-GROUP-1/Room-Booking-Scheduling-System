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

    // GETTERS
    get getBookingID() {return this.#bookingID;}
    get getRoomID() {return this.#roomID;}
    get getUserID() {return this.#userID;}
    get getStartTime() {return this.#startTime;}
    get getEndTime() {return this.#endTime;}
    get getStatus() {return this.#status;}

    setBookingID(id){
        this.#bookingID = id;
    }

    confirmBooking(){
        this.#status = true;
        return this.#status;
    }

    cancel(reason){
        this.#status = false;
        return true;
    }

    checkIn(code){
        return code === this.#checkInCode;
    }

    isExpired(){
        const graceMs = 30 * 60 * 1000; // 30 minutes grace time
        return !this.#status && Date.now() > this.#startTime.getTime() + graceMs;
    }

}
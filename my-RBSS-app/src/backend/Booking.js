export class Booking{
    #userID         // int
    #bookingID      // String
    #roomID         // int
    #startTime      // DateTime
    #endTime        // DateTime
    #roomUse        // String, reason for using room
    #checkInCode    // String
    #status         // boolean

    constructor(userID, roomID, startTime, endTime, roomUse, checkInCode){
        this.#userID = userID;    // String
        this.#roomID = roomID;
        this.#startTime = startTime;
        this.#endTime = endTime;
        this.#roomUse = roomUse; 
        this.#checkInCode = checkInCode;
        this.#status = false; 
    }

    confirmBooking(){
        
    }

    cancel(){
        
    }

    checkInCode(){

    }

}
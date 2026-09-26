export class Room{
    #roomID;        // int
    #roomNumber;    // String
    #building;      // String
    #capacity;      // int
    #availability;  // boolean
    #amentities;    // List


    constructor(roomNumber, building, capacity, availabilty, amenities){
        this.#roomNumber = roomNumber;    // String
        this.#building = building;
        this.#capacity = capacity;
        this.#availability = availabilty;
        this.#amentities = amenities; 
    }

    checkAvailable(){
        return this.#availability;
    }

    getDetails(){
        return "";
    }
}
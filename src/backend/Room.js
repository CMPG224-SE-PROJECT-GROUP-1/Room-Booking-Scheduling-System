export class Room{
    #roomID;        // int
    #roomNumber;    // String
    #building;      // String
    #capacity;      // int
    #availability;  // boolean
    #amenities;    // List


    constructor(roomID, roomNumber, building, capacity, availability, amenities){
        this.#roomID = roomID;
        this.#roomNumber = roomNumber;    // String
        this.#building = building;
        this.#capacity = capacity;
        this.#availability = availability;
        this.#amenities = amenities; 
    }

    // GETTERS

    get getRoomID() {return this.#roomID}
    get getRoomNumber() {return this.#roomNumber}
    get getBuilding() {return this.#building}
    get getCapacity() {return this.#capacity}
    get getAmenities() {return this.#amenities}

    checkAvailable(){
        return this.#availability;
    }

    getDetails(){
        return  `Room ${this.#roomNumber} (${this.#building}) — capacity ${this.#capacity}`;
    }
}
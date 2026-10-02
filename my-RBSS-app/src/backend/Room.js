export class Room{
    #roomID;        // int
    #roomNumber;    // String
    #building;      // String
    #capacity;      // int
    #availability;  // boolean
    #amenities;     // List
    #image;         // String (url) or null


    constructor(roomID, roomNumber, building, capacity, availability, amenities, image = null){
        this.#roomID = roomID;
        this.#roomNumber = roomNumber;    // String
        this.#building = building;
        this.#capacity = capacity;
        this.#availability = availability;
        this.#amenities = Array.isArray(amenities) ? amenities : [];  // never null, so .includes() is safe
        this.#image = image;
    }

    // GETTERS

    get getRoomID() {return this.#roomID}
    get getRoomNumber() {return this.#roomNumber}
    get getBuilding() {return this.#building}
    get getCapacity() {return this.#capacity}
    get getAmenities() {return this.#amenities}
    get getImage() {return this.#image}

    checkAvailable(){
        return this.#availability;
    }

    getDetails(){
        return  `Room ${this.#roomNumber} (${this.#building}) — capacity ${this.#capacity}`;
    }

    toObject(){
        return {
            room_id: this.#roomID,
            room_number: this.#roomNumber,
            building: this.#building,
            capacity: this.#capacity,
            availability: this.#availability,
            amenities: this.#amenities,
            image: this.#image
        };
    }
}
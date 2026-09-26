import {User} from './User.js';

export class AdminUser extends User{
    #permissions // List
    
    constructor(fullName, studentNumber, email, password){
        super(fullName, studentNumber, email, password)
        this.#permissions = [ "MANAGE_USERS", "BLOCK_ROOM"]
    }

    manageUser(userID){

    }

    blockRoom(roomID){

    }
}
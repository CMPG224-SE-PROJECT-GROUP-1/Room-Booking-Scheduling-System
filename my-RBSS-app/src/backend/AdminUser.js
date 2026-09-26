import {User} from './User.js';

export class AdminUser extends User{
    #permissions // List
    
    constructor(fullName, studentNumber, email, password){
        super(fullName, studentNumber, email, password)
        this.#permissions = {
            // all admin permissions
        }
    }

    manageUser(userID){

    }

    blockRoom(roomID){
        
    }
}
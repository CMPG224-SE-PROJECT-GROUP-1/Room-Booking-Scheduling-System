import { supabase } from '../supabaseClient.js';
import {User} from './User.js';

export class AdminUser extends User{
    #permissions // List
    
    constructor(fullName, studentNumber, email, password){
        super(fullName, studentNumber, email, password)
        this.#permissions = [ "MANAGE_USERS", "BLOCK_ROOM"]
    }

    hasPermission(action){
        return this.#permissions.includes(action);
    }

    async manageUser(userID){ 
        if (!this.hasPermission("MANAGE_USERS")){
            throw new Error("Not Authorized");
        }

        const {data, error} = await supabase
        .from('users').select('*').eq('user_id', userID).single()

        if (error) throw new Error(error.message);
        return data;
    }

    async blockRoom(roomID){
        if (!this.hasPermission("BLOCK_ROOM")){
            throw new Error("Not authorized")
        }
    }
}
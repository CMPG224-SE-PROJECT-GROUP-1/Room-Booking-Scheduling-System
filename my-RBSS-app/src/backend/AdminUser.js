import { supabase } from '../supabaseClient.js';
import {User} from './User.js';
import { bookingManager } from './BookingManager.js';

export class AdminUser extends User{
    #permissions // List
    
    constructor(fullName, studentNumber, email, password){
        super(fullName, studentNumber, email, password)
        this.#permissions = [ "MANAGE_USERS", "BLOCK_ROOM", "CHECK_IN"]
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

    async listUsers(){
        if (!this.hasPermission("MANAGE_USERS")){
            throw new Error("Not authorized.")
        }

        const {data, error} = await supabase
            .from('profiles')
            .select('*')
            .order('full_name');

        if (error) throw new Error(error.message || "Error listing users.")
        
        return data || [];
    }

    async listRooms(){
        const {data, error} = await supabase
            .from('rooms').select('*').order('room_number')

        if (error) throw new Error(error.message);
        return data || [];
    }

    async blockRoom(roomID){
        if (!this.hasPermission("BLOCK_ROOM")){
            throw new Error("Not authorized")
        }

        const { error } = await supabase
            .from('rooms')
            .update({availability: false})
            .eq('room_id', roomID);
        
        if (error) throw new Error(error.message);

        const {error: cancelError} = await supabase
            .from('bookings')
            .update({status: false, cancel_reason: 'Room blocked by admin'})
            .eq('room_id', roomID)
            .eq('status', true)
            .gte('end_time', new Date().toISOString());

        if (cancelError) throw new Error(cancelError.message);
        return true;
    }

    async unblockRoom(roomID){
        if (!this.hasPermission('BLOCK_ROOM')){
            throw new Error("Not authorized");
        }

        const {error} = await supabase
            .from('rooms')
            .update({availability: true})
            .eq('room_id', roomID)

        if (error) throw new Error(error.message);
        return true;
    }

    async listUpcomingBookings(){
        if (!this.hasPermission("CHECK_IN")){
            throw new Error("Not authorized")
        }

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const {data, error} = await supabase
            .from('bookings')
            .select('*, rooms(room_number, building_name), profiles(full_name, student_number)')
            .eq('status', true)
            .gte('end_time', startOfToday.toISOString())
            .order('start_time')

        if (error) throw new Error(error.message);
        return data || [];
    }

    async checkInBooking(bookingID, code){
        if (!this.hasPermission("CHECK_IN")){
            throw new Error("Not authorized")
        }
        return bookingManager.processCheckIn(bookingID, code);
    }
}
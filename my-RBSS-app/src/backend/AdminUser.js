import { supabase } from '../supabaseClient.js';
import { User } from './User.js';
import { bookingManager } from './BookingManager.js';

export class AdminUser extends User{
    #permissions // List

    constructor(fullName, studentNumber, email){
        super(fullName, studentNumber, email)
        this.#permissions = ["MANAGE_USERS", "BLOCK_ROOM", "CHECK_IN", "MAINTENANCE"]
    }

    hasPermission(action){
        return this.#permissions.includes(action);
    }

    #require(action){
        if (!this.hasPermission(action)){
            throw new Error("Not authorized");
        }
    }

    #mustChange(rows, message){
        if (!rows || rows.length === 0) throw new Error(message);
    }

    async listUsers(){
        this.#require("MANAGE_USERS");

        const {data, error} = await supabase
            .from('profiles').select('*').order('student_number')

        if (error) throw new Error(error.message);
        return data || [];
    }

    async manageUser(userID){
        this.#require("MANAGE_USERS");

        const {data, error} = await supabase
            .from('profiles').select('*').eq('user_id', userID).single()

        if (error) throw new Error(error.message);
        return data;
    }

    async setUserActive(userID, isActive){
        this.#require("MANAGE_USERS");

        const {data, error} = await supabase
            .from('profiles').update({ is_active: isActive }).eq('user_id', userID).select()

        if (error) throw new Error(error.message);
        this.#mustChange(data, "Could not update that user (are you an admin?).");
        return true;
    }

    async updateUser(userID, changes = {}){
        this.#require("MANAGE_USERS");

        const allowedRoles = ['student', 'teacher', 'postgrad', 'manager', 'admin'];
        const update = {};
        if (changes.full_name !== undefined) update.full_name = changes.full_name.trim();
        if (changes.role !== undefined) {
            if (!allowedRoles.includes(changes.role)) throw new Error("Invalid role.");
            update.role = changes.role;
        }
        if (Object.keys(update).length === 0) throw new Error("Nothing to update.");

        const {data, error} = await supabase
            .from('profiles').update(update).eq('user_id', userID).select()

        if (error) throw new Error(error.message);
        this.#mustChange(data, "Could not update that user (are you an admin?).");
        return true;
    }

    async listRooms(){
        const {data, error} = await supabase
            .from('rooms').select('*').order('building').order('room_number')

        if (error) throw new Error(error.message);
        return data || [];
    }

    async blockRoom(roomID){
        this.#require("BLOCK_ROOM");

        const {data, error} = await supabase
            .from('rooms').update({ availability: false }).eq('room_id', roomID).select()

        if (error) throw new Error(error.message);
        this.#mustChange(data, "Could not block that room (are you an admin?).");

        const {error: cancelError} = await supabase
            .from('bookings')
            .update({ status: false, cancel_reason: 'Room blocked by admin' })
            .eq('room_id', roomID)
            .eq('status', true)
            .gte('end_time', new Date().toISOString())

        if (cancelError) throw new Error(cancelError.message);
        return true;
    }

    async unblockRoom(roomID){
        this.#require("BLOCK_ROOM");

        const {data, error} = await supabase
            .from('rooms').update({ availability: true }).eq('room_id', roomID).select()

        if (error) throw new Error(error.message);
        this.#mustChange(data, "Could not unblock that room (are you an admin?).");
        return true;
    }

    async listMaintenance(){
        this.#require("MAINTENANCE");

        const {data, error} = await supabase
            .from('room_maintenance')
            .select('*, rooms(room_number, building)')
            .gte('end_time', new Date().toISOString())
            .order('start_time')

        if (error) throw new Error(error.message);
        return data || [];
    }

    async scheduleMaintenance(roomID, start, end, reason){
        this.#require("MAINTENANCE");

        if (!roomID) throw new Error("Please choose a room.");
        if (!start || !end) throw new Error("Please choose a start and end time.");
        if (new Date(end) <= new Date(start)) throw new Error("The end time must be after the start time.");

        const user = await this.getCurrentUser();

        const {error} = await supabase.from('room_maintenance').insert({
            room_id: roomID,
            start_time: start,
            end_time: end,
            reason: reason?.trim() || null,
            created_by: user?.id ?? null
        })
        if (error) throw new Error(error.message);

        const {error: cancelError} = await supabase
            .from('bookings')
            .update({ status: false, cancel_reason: 'Room under maintenance' })
            .eq('room_id', roomID)
            .eq('status', true)
            .lt('start_time', end)
            .gt('end_time', start)

        if (cancelError) throw new Error(cancelError.message);
        return true;
    }

    async cancelMaintenance(maintenanceID){
        this.#require("MAINTENANCE");

        const {error} = await supabase
            .from('room_maintenance').delete().eq('maintenance_id', maintenanceID)

        if (error) throw new Error(error.message);
        return true;
    }

    async listUpcomingBookings(){
        this.#require("CHECK_IN");

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const {data, error} = await supabase
            .from('bookings')
            .select('*, rooms(room_number, building), profiles(full_name, student_number)')
            .eq('status', true)
            .gte('end_time', startOfToday.toISOString())
            .order('start_time')

        if (error) throw new Error(error.message);
        return data || [];
    }

    async checkInBooking(bookingID, code){
        this.#require("CHECK_IN");
        return bookingManager.processCheckIn(bookingID, code);
    }

    async cancelAnyBooking(bookingID, reason){
        this.#require("CHECK_IN");
        if (!reason || !reason.trim()) throw new Error("Please enter a reason for cancellation.");
        return bookingManager.cancelBooking(bookingID, `Cancelled by admin: ${reason.trim()}`);
    }

    async listAuditLog(limit = 50){
        this.#require("MANAGE_USERS");

        const {data, error} = await supabase
            .from('audit_log')
            .select('*, profiles(full_name, student_number)')
            .order('timestamp', { ascending: false })
            .limit(limit)

        if (error) throw new Error(error.message);
        return data || [];
    }
}
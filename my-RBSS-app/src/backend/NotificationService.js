import { supabase } from '../supabaseClient.js';

export class NotificationService{
    #channel

    constructor(channel = 'in-app'){
        this.#channel = channel;
    }

    get getChannel() {return this.#channel;}

    async fetchMine(limit = 10){
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('sent_at', { ascending: false })
            .limit(limit);

        if (error) throw new Error(error.message);
        return data || [];
    }

    async markRead(notificationID){
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('notification_id', notificationID);

        if (error) throw new Error(error.message);
        return true;
    }
}

export const notificationService = new NotificationService();
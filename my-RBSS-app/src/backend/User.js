import { supabase } from '../supabaseClient';

export class User {
    #userID;
    #fullName;
    #studentNumber;
    #email;

    constructor(fullName = '', studentNumber = '', email = '') {
        this.#fullName = fullName;
        this.#studentNumber = studentNumber;
        this.#email = email;
    }

    async authenticate(email, password) {
        const targetEmail = email || this.#email;

        if (!targetEmail) {
            throw new Error("Email address is required.");
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: targetEmail,
            password: password,
        });

        if (error) {
            throw error;
        }

        if (data?.user) {
            this.#userID = data.user.id;
            this.#email = data.user.email;
        }

        return data;
    }

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Sign-out error:', error.message);
            throw error;
        }
    }

    async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) return null;
        return user;
    }

    async getCurrentSession() {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
            console.error(error.message);
            return null;
        }
        return session; 
    }

    onAuthStateChange(callback) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                callback(session);
            }
        );
        return () => subscription?.unsubscribe();
    }
}

export const authService = new User();
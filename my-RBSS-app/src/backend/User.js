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

    async newSignUp(name, uniNumber, email, password) {
        try {
            const cleanUniNumber = uniNumber?.trim() || '';
            const prefix = cleanUniNumber.charAt(0);

            let role = '';
            if (prefix === 'S') {
                role = 'student';
            } else if (prefix === 'T') {
                role = 'teacher';
            } else if (prefix === 'P') {
                role = 'postgrad';
            } else {
                throw new Error("Invalid university number. Must start with S, T, or P.");
            }

            const targetEmail = (email || `${cleanUniNumber}@university.ac.za`).trim();
            if (!targetEmail) {
                throw new Error("Email is required.");
            }

            const { data, error } = await supabase.auth.signUp({
                email: targetEmail,
                password: password,
                options: {
                    data: {
                        full_name: name,
                        student_number: cleanUniNumber,
                        role: role
                    }
                }
            });

            if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
                throw new Error("An account with this email or university number already exists.");
            }

            if (error) {
                throw error;
            }

            if (data?.user) {
                this.#userID = data.user.id;
                this.#email = data.user.email;
            }

            return data;
        } catch (error) {
            alert(error.message);
            throw error;
        }
    }

    async verifySignUpOtp(email, token) {
        try {
            const { data, error } = await supabase.auth.verifyOtp({
                email: email.trim(),
                token: token.trim(),
                type: 'signup'
            });

            if (error) {
                throw error;
            }

            if (data?.user) {
                this.#userID = data.user.id;
                this.#email = data.user.email;
            }

            return data;
        } catch (error) {
            alert(error.message);
            throw error;
        }
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
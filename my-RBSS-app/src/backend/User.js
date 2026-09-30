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

    // Central persistent email resolver
    formatStudentEmail(uniNumber) {
        const clean = String(uniNumber ?? '').trim();
        if (!clean) return '';
        
        
        // (To change when in production this single string when we switch to ${clean}@university.ac.za)
        return `neomasebe9@gmail.com`.toLowerCase();
    }

    async authenticate(uniNumber, password) {
        const cleanUni = String(uniNumber ?? '').trim();

        if (!cleanUni) {
            throw new Error("University number is required.");
        }

        const targetEmail = this.formatStudentEmail(cleanUni);

        // Sign in with Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email: targetEmail,
            password: password,
        });

        if (error) throw error;

        // Verify student number against the profiles table
        if (data?.user) {
            const { data: profile, error: profileErr } = await supabase
                .from('profiles')
                .select('student_number')
                .eq('user_id', data.user.id)
                .single();
                
                console.log("Logged-in Auth User ID:", data.user.id);
                console.log("Profile Query Error:", profileErr);
                console.log("Profile Data Found:", profile);

            

            if (profileErr || !profile) {
                await supabase.auth.signOut();
                throw new Error("User profile not found.");
            }

            
            const dbStudentNum = String(profile.student_number ?? '').trim().toLowerCase();
            const inputStudentNum = cleanUni.toLowerCase();

            if (dbStudentNum !== inputStudentNum) {
                await supabase.auth.signOut();
                throw new Error(`University number (${cleanUni}) does not match this account.`);
            }

            this.#userID = data.user.id;
            this.#email = data.user.email;
            this.#studentNumber = profile.student_number;
        }

        return data;
    }

    async newSignUp(name, uniNumber, password) {
        const cleanUniNumber = uniNumber?.trim() || '';
        const prefix = cleanUniNumber.charAt(0).toUpperCase();

        let role = '';
        if (prefix === 'S') role = 'student';
        else if (prefix === 'T') role = 'teacher';
        else if (prefix === 'P') role = 'postgrad';
        else throw new Error("Invalid university number. Must start with S, T, or P.");

        const targetEmail = this.formatStudentEmail(cleanUniNumber);
        if (!targetEmail) {
            throw new Error("Valid university number is required to generate email.");
        }

        const { data, error } = await supabase.auth.signUp({ 
            email: targetEmail,
            password: password, 
            options: { 
                data: { 
                    full_name: name.trim(),
                    student_number: cleanUniNumber,
                    role: role 
                }
            }
        });

        if (error) throw error; 

        if (data.user && (!data.user.identities || data.user.identities.length === 0)) { 
            throw new Error("An account with this email or university number already exists."); 
        }

        if (data?.user) { 
            this.#userID = data.user.id; 
            this.#email = data.user.email; 
        }

        return { ...data, email: targetEmail };
    }

    async verifySignUpOtp(email, token) {
        const cleanEmail = email?.trim().toLowerCase();
        const cleanToken = String(token ?? '').trim();

        if (!cleanEmail) {
            throw new Error("Email address is missing.");
        }

        const { data, error } = await supabase.auth.verifyOtp({ 
            email: cleanEmail,
            token: cleanToken,
            type: 'signup' 
        });

        if (error) throw error; 

        if (data?.user) { 
            this.#userID = data.user.id; 
            this.#email = data.user.email; 
        }

        return data; 
    }

    async signOut() { 
        const { error } = await supabase.auth.signOut(); 
        if (error) throw error;
    }

    async getCurrentUser() { 
        const { data: { user }, error } = await supabase.auth.getUser(); 
        if (error) return null; 
        return user; 
    }

    async getCurrentSession() { 
        const { data: { session }, error } = await supabase.auth.getSession(); 
        if (error) return null;
        return session; 
    }

    onAuthStateChange(callback) { 
        const { data: { subscription } } = supabase.auth.onAuthStateChange( 
            (_event, session) => callback(session) 
        );
        return () => subscription?.unsubscribe(); 
    }
}

export const authService = new User(); 
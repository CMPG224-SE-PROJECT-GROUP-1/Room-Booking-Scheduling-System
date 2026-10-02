import { supabase } from '../supabaseClient';


const USE_TEST_EMAIL = true;
const TEST_EMAIL_NAME = 'neomasebe9';
const TEST_EMAIL_DOMAIN = 'gmail.com';
const SCHOOL_EMAIL_DOMAIN = 'university.ac.za';

export class User {
    #userID;
    #fullName;
    #studentNumber;
    #email;
    #role;

    constructor(fullName = '', studentNumber = '', email = '') {
        this.#fullName = fullName;
        this.#studentNumber = studentNumber;
        this.#email = email;
        this.#role = '';
    }

    // GETTERS
    get getUserID() { return this.#userID; }
    get getFullName() { return this.#fullName; }
    get getStudentNumber() { return this.#studentNumber; }
    get getEmail() { return this.#email; }
    get getRole() { return this.#role; }

    formatStudentEmail(uniNumber) {
        const clean = String(uniNumber ?? '').trim().toLowerCase();
        if (!clean) return '';

        if (USE_TEST_EMAIL) {
            // neomasebe9+s123456@gmail.com  (every student = different account, same inbox)
            return `${TEST_EMAIL_NAME}@${TEST_EMAIL_DOMAIN}`;
        }
        return `${clean}@${SCHOOL_EMAIL_DOMAIN}`;
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

        if (data?.user) {
            const { data: profile, error: profileErr } = await supabase
                .from('profiles')
                .select('student_number, full_name, role, is_active')
                .eq('user_id', data.user.id)
                .single();

            if (profileErr || !profile) {
                await supabase.auth.signOut();
                throw new Error("User profile not found.");
            }

            if (profile.is_active === false) {
                await supabase.auth.signOut();
                throw new Error("This account has been deactivated. Please contact the admin.");
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
            this.#fullName = profile.full_name;
            this.#role = profile.role;
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
// import the supabase client
import { supabase } from '../supabaseClient.js';

// default email domain used when creating student emails
const DEFAULT_EMAIL_DOMAIN = 'university.ac.za';

//get the domain from environment variables else use default
const EMAIL_DOMAIN =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_UNIVERSITY_EMAIL_DOMAIN) || globalThis.process?.env?.UNIVERSITY_EMAIL_DOMAIN || DEFAULT_EMAIL_DOMAIN;

  const USER_TABLE = 'users';

function cleanString(value) {
  return String(value ?? '').trim();
}

//makes uni num uppercase ("s123" → "S123")
function normalizeUniversityNumber(value) {
  return cleanString(value).toUpperCase();
}

//uni num validity (e.g. must start with S, T, or P )
function isValidUniversityNumber(value) {
  return /^[STP]\d+$/i.test(cleanString(value));
}

//email format check
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// User class(Auth and profile management) 
export class User 
{
  // Instance variables 
  #userID = null;        //supabase user ID
  #fullName = '';         
  #studentNumber = '';    
  #email = '';            

  //Default Constructor
  constructor() 
  {
    this.#fullName = " ";
    this.#studentNumber = " ";
    this.#email = " ";
  }

  // Constructor 
  constructor(fullName = '', studentNumber = '', email = '') 
  {
    this.#fullName = cleanString(fullName);
    this.#studentNumber = normalizeUniversityNumber(studentNumber);
    this.#email = cleanString(email).toLowerCase();
  }

  // Getters

  get userID() {
    return this.#userID;
  }

  // Alias for older code that used getUserID(Double check this!!)
  get getUserID() {
    return this.#userID;
  }

  get fullName() {
    return this.#fullName;
  }

  get studentNumber() {
    return this.#studentNumber;
  }

  get email() {
    return this.#email;
  }

  // Methods
  // Converts a university number into an email address
  // Example: "S123456" → "s123456@university.ac.za"
  formatStudentEmail(uniNumber, domain = EMAIL_DOMAIN) {
    const clean = cleanString(uniNumber).toLowerCase();
    if (!clean) return '';
    return `${clean}@${String(domain).trim().toLowerCase()}`;
  }

  // Updates the internal profile data
  setProfile({ id = null, fullName = '', studentNumber = '', email = '' } = {}) {
    this.#userID = id;
    this.#fullName = cleanString(fullName);
    this.#studentNumber = normalizeUniversityNumber(studentNumber);
    this.#email = cleanString(email).toLowerCase();
  }

  // Clears all profile data (used on logout)
  clearProfile() {
    this.#userID = null;
    this.#fullName = '';
    this.#studentNumber = '';
    this.#email = '';
  }

  // auth methods

  // login with university number + password
  async authenticate(uniNumber, password) {
    const cleanUni = normalizeUniversityNumber(uniNumber);

    if (!cleanUni) throw new Error('University number is required.');
    if (!password) throw new Error('Password is required.');

    // convert university number to email
    const targetEmail = this.formatStudentEmail(cleanUni);

    // sign in with supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: targetEmail,
      password,
    });

    if (error) throw error;

    // if login succeeded, load user's profile from db
    if (data?.user) 
        {
      const { data: profile, error: profileError } = await supabase
        .from(USER_TABLE)
        .select('student_number')
        .eq('user_id', data.user.id)
        .single();

      // profile must exist
      if (profileError || !profile) 
        {
        await supabase.auth.signOut();
        throw new Error('User profile not found.');
        }

      // make sure the student number matches
      const dbStudentNumber = cleanString(profile.student_number).toLowerCase();
      if (dbStudentNumber !== cleanUni.toLowerCase()) 
        {
        await supabase.auth.signOut();
        throw new Error(`University number (${cleanUni}) does not match this account.`);
        }

      // save the profile into this class
      this.setProfile(
        {
        id: data.user.id,
        fullName: data.user.user_metadata?.full_name ?? this.#fullName,
        studentNumber: profile.student_number,
        email: data.user.email ?? targetEmail,
        }
        );
    }

    return data;
  }

  // create a new account
  async newSignUp(name, uniNumber, password) {
    const cleanName = cleanString(name);
    const cleanUni = normalizeUniversityNumber(uniNumber);

    // validation
    if (!cleanName) throw new Error('Full name is required.');
    if (!isValidUniversityNumber(cleanUni)) {
      throw new Error('Invalid university number. Must start with S, T, or P.');
    }
    if (typeof password !== 'string' || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const targetEmail = this.formatStudentEmail(cleanUni);

    if (!isValidEmail(targetEmail)) {
      throw new Error('Could not generate a valid email address.');
    }

    // ((Choose role based on the first letter of the university number))
    const role = this.#roleFromUniversityNumber(cleanUni);

    // create the account in supabase
    const { data, error } = await supabase.auth.signUp({
      email: targetEmail,
      password,
      options: {
        data: {
          full_name: cleanName,
          student_number: cleanUni,
          role,
        },
      },
    });

    if (error) throw error;

    // supabase returns an empty identities array if email already exists
    if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
      throw new Error('An account with this email or university number already exists.');
    }

    // save the new profile
    if (data?.user) {
      this.setProfile({
        id: data.user.id,
        fullName: cleanName,
        studentNumber: cleanUni,
        email: targetEmail,
      });
    }

    return { ...data, email: targetEmail };
  }

  // verify the OTP code sent after signup
  async verifySignUpOtp(email, token) {
    const cleanEmail = cleanString(email).toLowerCase();
    const cleanToken = cleanString(token);

    if (!cleanEmail) throw new Error('Email address is missing.');
    if (!cleanToken) throw new Error('Verification token is missing.');

    const { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: 'signup',
    });

    if (error) throw error;

    // update the local profile after successful verification
    if (data?.user) {
      this.setProfile({
        id: data.user.id,
        fullName: data.user.user_metadata?.full_name ?? this.#fullName,
        studentNumber: data.user.user_metadata?.student_number ?? this.#studentNumber,
        email: data.user.email ?? cleanEmail,
      });
    }

    return data;
  }

  // logout
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    this.clearProfile();
  }

  // get the currently logged-in user (from Supabase)
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  }

  // get the current session (contains tokens, expiry, etc.)
  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) return null;
    return session;
  }

  // Listen for login/logout changes
  // Returns a function you can call to stop listening
  onAuthStateChange(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => callback(session)
    );
    return () => subscription?.unsubscribe();
  }

  // Converts the first letter of the university number into a role
  #roleFromUniversityNumber(cleanUni) {
    const prefix = cleanUni.charAt(0).toUpperCase();
    if (prefix === 'S') return 'student';
    if (prefix === 'T') return 'teacher';
    if (prefix === 'P') return 'postgrad';
    throw new Error('Invalid university number. Must start with S, T, or P.');
  }
}

// Create one shared instance that the rest of the app can import and use
export const authService = new User();
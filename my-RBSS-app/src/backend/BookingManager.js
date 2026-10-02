import { Booking } from './Booking.js';
import { Room } from './Room.js';
import { supabase } from '../supabaseClient.js';
import { CHECK_IN_GRACE_MINUTES } from '../frontend/utils/slots.js';

export class BookingManager {
  #activeBookings;

  constructor() {
    this.#activeBookings = [];
  }

  get getBookings() {
    return this.#activeBookings;
  }

  async #getUserId() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('You must be signed in to do that.');
    return user.id;
  }


  async fetchBookings() {
    const userId = await this.#getUserId();

    const { data, error } = await supabase
      .from('bookings')
      .select('*, rooms!bookings_room_fk(room_number, building_name)')
      .eq('user_id', userId)
      .order('start_time', { ascending: false });

    if (error) throw new Error(`Fetch error: ${error.message}`);

    this.#activeBookings = (data || [])
      .filter((row) => row.status === true)
      .map(
        (row) =>
          new Booking(
            row.booking_id,
            row.user_id,
            row.room_id,
            row.start_time,
            row.end_time,
            row.room_use,
            row.check_in_code,
            row.status,
            row.checked_in
          )
      );

    return data || [];
  }

  async fetchBusySlots() {
    const { data, error } = await supabase
      .from('booked_slots')
      .select('room_id, start_time, end_time');

    if (error) throw new Error(`Fetch error: ${error.message}`);
    return data || [];
  }

  async searchRooms({ building, minCapacity } = {}) {
    let query = supabase.from('rooms').select('*').eq('availability', true);

    if (building && building !== 'Any building') {
      query = query.eq('building_name', building);
    }
    if (minCapacity) {
      query = query.gte('capacity', minCapacity);
    }

    const { data, error } = await query.order('room_number');
    if (error) throw new Error(error.message);

    return (data || []).map((row) =>
      new Room(
        row.room_id,
        row.room_number,
        row.building,
        row.capacity,
        row.availability,
        row.amenities,
        row.image_url
      ).toObject()
    );
  }

  async createBooking(roomID, slot, roomUse) {
    const userId = await this.#getUserId();

    if (new Date(slot.start) < new Date()) {
      throw new Error('You cannot book a time that has already started.');
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: userId,
        room_id: roomID,
        start_time: slot.start,
        end_time: slot.end,
        room_use: roomUse,
        status: true,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23P01') {
        throw new Error('Sorry, someone just booked that room for this time. Please pick another slot.');
      }
      throw new Error(`Could not create booking: ${error.message}`);
    }

    const booking = new Booking(
      data.booking_id,
      userId,
      roomID,
      data.start_time,
      data.end_time,
      roomUse,
      data.check_in_code,
      data.status,
      data.checked_in
    );
    this.#activeBookings.push(booking);
    return booking.toObject();
  }

  
  async processCheckIn(bookingID, code) {
    const { data: row, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_id', bookingID)
      .single();

    if (error || !row) throw new Error('Booking not found.');
    if (row.status !== true) throw new Error('This booking has been cancelled.');
    if (row.checked_in) throw new Error('Already checked in.');

    const booking = new Booking(
      row.booking_id, row.user_id, row.room_id, row.start_time, row.end_time,
      row.room_use, row.check_in_code, row.status, row.checked_in
    );

    const graceMs = CHECK_IN_GRACE_MINUTES * 60 * 1000;
    const start = booking.getStartTime.getTime();
    if (Date.now() < start - graceMs) throw new Error('Too early to check in.');
    if (Date.now() > start + graceMs) throw new Error('The check-in window has closed.');

    if (!booking.checkIn(code)) throw new Error('Wrong check-in code.');

    const { error: updateError } = await supabase
      .from('bookings')
      .update({ checked_in: true })
      .eq('booking_id', bookingID);

    if (updateError) throw new Error(`Could not check in: ${updateError.message}`);
    return true;
  }

  async cancelBooking(bookingID, reason = 'Cancelled by user') {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: false, cancel_reason: reason })
      .eq('booking_id', bookingID)
      .select();

    if (error) throw new Error(`Could not cancel booking: ${error.message}`);
    if (!data || data.length === 0) throw new Error('Booking not found (or it is not yours).');

    const booking = this.#activeBookings.find((b) => b.getBookingID === bookingID);
    if (booking) booking.cancel(reason);
    this.#activeBookings = this.#activeBookings.filter((b) => b.getBookingID !== bookingID);

    return true;
  }

  
  async autoCancelUnclaimed() {
    for (const booking of [...this.#activeBookings]) {
      if (booking.isExpired()) {
        await this.cancelBooking(booking.getBookingID, `No check-in within ${CHECK_IN_GRACE_MINUTES} minutes`);
      }
    }
  }
}

export const bookingManager = new BookingManager();
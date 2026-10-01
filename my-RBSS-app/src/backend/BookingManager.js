import { Booking } from './Booking.js';
import { Room } from './Room.js';
import { supabase } from '../supabaseClient.js';

export class BookingManager {
  #activeBookings;

  constructor() {
    this.#activeBookings = [];
    this.ready = this.fetchBookings();
  }

  get getBookings() {
    return this.#activeBookings;
  }

  async fetchBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', true);

    if (error) throw new Error(`Fetch error: ${error.message}`);

    this.#activeBookings = [];
    data?.forEach((row) => {
      this.#activeBookings.push(
        new Booking(
          row.booking_id,
          row.user_id,
          row.room_id,
          row.start_time,
          row.end_time,
          row.check_in_code
        )
      );
    });
    return this.#activeBookings;
  }

  async searchRooms({ building, minCapacity } = {}) {
    let query = supabase.from('rooms').select('*').eq('availability', true);

    if (building && building !== 'Any building') {
      query = query.eq('building', building);
    }
    if (minCapacity) {
      query = query.gte('capacity', minCapacity);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return data.map(
      (row) =>
        new Room(
          row.room_id,
          row.room_number,
          row.building,
          row.capacity,
          row.availability,
          row.amenities
        )
    );
  }

  async createBooking(userID, roomID, slot, roomUse) {
    const checkInCode = Math.floor(1000 + Math.random() * 9000).toString();

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: userID,
        room_id: roomID,
        start_time: slot.start,
        end_time: slot.end,
        room_use: roomUse,
        check_in_code: checkInCode,
        status: true,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Could not create booking: ${error.message}`);
    }

    const booking = new Booking(
      data.booking_id,
      userID,
      roomID,
      slot.start,
      slot.end,
      checkInCode
    );
    this.#activeBookings.push(booking);
    return booking;
  }

  processCheckIn(bookingID, code) {
    const booking = this.#activeBookings.find((b) => b.getBookingID === bookingID);
    if (!booking) return false;
    return booking.checkIn(code);
  }

  async cancelBooking(bookingID, reason) {
    const booking = this.#activeBookings.find((b) => b.getBookingID === bookingID);
    if (booking) booking.cancel(reason);

    const { error } = await supabase
      .from('bookings')
      .update({ status: false, cancel_reason: reason })
      .eq('booking_id', bookingID);

    return !error;
  }

  autoCancelUnclaimed() {
    for (const booking of this.#activeBookings) {
      if (booking.isExpired && booking.isExpired()) {
        booking.cancel('No check-in within 30 minutes');
      }
    }
  }
}
CREATE TABLE users (user_id, full_name, student_number, email, role, is_active)
CREATE TABLE rooms (room_number, building, capacity, availability, amenities)
CREATE TABLE bookings (user_id, room_id, start_time, end_time, room_use, check_in_code, status)

INSERT INTO rooms (room_number, building, capacity, availability, amenities) VALUES
  ('G01',  'Library',      4,  true,  ARRAY['Whiteboard','Power outlets']),
  ('G02',  'Library',      4,  true,  ARRAY['Whiteboard','Power outlets']),
  ('G05',  'Library',      8,  true,  ARRAY['Projector','Whiteboard','Power outlets']),
  ('G06',  'Library',      2,  true,  ARRAY['Power outlets']),
  ('101',  'Humanities',   6,  true,  ARRAY['Whiteboard','TV screen']),
  ('102',  'Humanities',   6,  false, ARRAY['Whiteboard']),                 -- blocked for maintenance
  ('103',  'Humanities',   10, true,  ARRAY['Projector','Whiteboard','Video conferencing']),
  ('201',  'Science Block',4,  true,  ARRAY['Whiteboard']),
  ('202',  'Science Block',4,  true,  ARRAY['Whiteboard','Power outlets']),
  ('204',  'Science Block',12, true,  ARRAY['Projector','Whiteboard','Video conferencing','Power outlets']),
  ('B10',  'Commerce',     3,  true,  ARRAY['Whiteboard']),
  ('B11',  'Commerce',     20, true,  ARRAY['Projector','Video conferencing','Stage/podium']);


INSERT INTO users (user_id, full_name, student_number, email, role, is_active) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Naledi Mokoena',   '2023145678', 'naledi.mokoena@uni.ac.za',   'student', true),
  ('11111111-1111-1111-1111-111111111102', 'Thabo van Wyk',    '2023145679', 'thabo.vanwyk@uni.ac.za',     'student', true),
  ('11111111-1111-1111-1111-111111111103', 'Amahle Dlamini',   '2022134521', 'amahle.dlamini@uni.ac.za',   'student', true),
  ('11111111-1111-1111-1111-111111111104', 'Jacques Pretorius','2023145690', 'jacques.pretorius@uni.ac.za','student', true),
  ('11111111-1111-1111-1111-111111111105', 'Palesa Nkosi',     '2021123456', 'palesa.nkosi@uni.ac.za',     'student', true),
  ('11111111-1111-1111-1111-111111111106', 'Sipho Khumalo',    '2023145701', 'sipho.khumalo@uni.ac.za',    'student', false), -- deactivated, for testing UC01 Alt Flow 2
  ('11111111-1111-1111-1111-111111111107', 'Zanele Mahlangu',  '2022134588', 'zanele.mahlangu@uni.ac.za',  'student', true),
  ('22222222-2222-2222-2222-222222222201', 'Lerato Mabaso',    'ADMIN0001',  'lerato.mabaso@uni.ac.za',    'admin',   true),
  ('22222222-2222-2222-2222-222222222202', 'Johan Steyn',      'ADMIN0002',  'johan.steyn@uni.ac.za',      'admin',   true),
  ('33333333-3333-3333-3333-333333333301', 'Dr. Ayanda Zulu',  'MGR00001',   'ayanda.zulu@uni.ac.za',      'manager', true);


INSERT INTO bookings (user_id, room_id, start_time, end_time, room_use, check_in_code, status) VALUES
  ('11111111-1111-1111-1111-111111111101', 1, now() + interval '1 day' + interval '10 hour', now() + interval '1 day' + interval '11 hour', 'Studying', '4821', true),
  ('11111111-1111-1111-1111-111111111102', 3, now() + interval '2 day' + interval '14 hour', now() + interval '2 day' + interval '16 hour', 'Group discussion', '7093', true),
  ('11111111-1111-1111-1111-111111111103', 7, now() + interval '3 day' + interval '9 hour',  now() + interval '3 day' + interval '10 hour','Presentation practice', '1256', true),

  ('11111111-1111-1111-1111-111111111104', 9, now() + interval '20 minutes', now() + interval '80 minutes', 'Studying', '3390', true),

  ('11111111-1111-1111-1111-111111111105', 2, now() + interval '4 day' + interval '13 hour', now() + interval '4 day' + interval '14 hour', 'Studying', '6614', false),

  ('11111111-1111-1111-1111-111111111107', 5, now() - interval '2 day', now() - interval '2 day' + interval '1 hour', 'Group discussion', '2207', true),

  ('11111111-1111-1111-1111-111111111101', 4, now() + interval '5 day' + interval '11 hour', now() + interval '5 day' + interval '12 hour', 'Studying', '9081', false),


  ('11111111-1111-1111-1111-111111111103', 8, now() - interval '50 minutes', now() - interval '10 minutes', 'Studying', '5543', false);


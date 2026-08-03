-- Seed Default Admin User (BCrypt for Admin@1234)
INSERT INTO users (id, email, password_hash, full_name, phone_number, role, status, gender, profile_photo_url, profile_photo_type)
VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'admin@hostelsync.com',
    '$2a$10$7Q7q/nU73wS2E7P709qHjeE.x28H8DqVbXJ.Q16R4wW50KzV47Wly',
    'System Administrator',
    '+19876543210',
    'ADMIN',
    'APPROVED',
    'MALE',
    '/assets/avatars/default-male.webp',
    'DEFAULT'
);

-- Seed Default Warden User (BCrypt for Warden@1234)
INSERT INTO users (id, email, password_hash, full_name, phone_number, role, status, gender, profile_photo_url, profile_photo_type)
VALUES (
    'w2222222-2222-2222-2222-222222222222',
    'warden@hostelsync.com',
    '$2a$10$7Q7q/nU73wS2E7P709qHjeE.x28H8DqVbXJ.Q16R4wW50KzV47Wly',
    'Chief Warden',
    '+19876543211',
    'WARDEN',
    'APPROVED',
    'MALE',
    '/assets/avatars/default-male.webp',
    'DEFAULT'
);

-- Seed Default Hostel
INSERT INTO hostels (id, name, code, address, capacity)
VALUES (
    'h3333333-3333-3333-3333-333333333333',
    'Aryabhata Executive Hostel',
    'AEH-01',
    'University Campus, Campus Road, Building A',
    500
);

-- Seed Warden Profile linked to Hostel
INSERT INTO warden_profiles (id, user_id, assigned_hostel_id, employee_id)
VALUES (
    'wp222222-2222-2222-2222-222222222222',
    'w2222222-2222-2222-2222-222222222222',
    'h3333333-3333-3333-3333-333333333333',
    'EMP-WARDEN-001'
);

-- Seed Blocks
INSERT INTO blocks (id, hostel_id, name, block_code)
VALUES 
('b4444444-4444-4444-4444-444444444441', 'h3333333-3333-3333-3333-333333333333', 'Block A - Alpha', 'BLK-A'),
('b4444444-4444-4444-4444-444444444442', 'h3333333-3333-3333-3333-333333333333', 'Block B - Beta', 'BLK-B');

-- Seed Floors
INSERT INTO floors (id, block_id, floor_number)
VALUES 
('f5555555-5555-5555-5555-555555555551', 'b4444444-4444-4444-4444-444444444441', 1),
('f5555555-5555-5555-5555-555555555552', 'b4444444-4444-4444-4444-444444444441', 2);

-- Seed Sample Rooms
INSERT INTO rooms (id, floor_id, room_number, capacity, current_occupancy, room_type, status)
VALUES 
('r6666666-6666-6666-6666-666666666661', 'f5555555-5555-5555-5555-555555555551', '101', 2, 0, 'STANDARD', 'AVAILABLE'),
('r6666666-6666-6666-6666-666666666662', 'f5555555-5555-5555-5555-555555555551', '102', 2, 0, 'DELUXE', 'AVAILABLE'),
('r6666666-6666-6666-6666-666666666663', 'f5555555-5555-5555-5555-555555555552', '201', 3, 0, 'AC', 'AVAILABLE');

-- Seed Initial Mess Menu
INSERT INTO mess_menu (id, day_of_week, breakfast, lunch, snacks, dinner, special_notes)
VALUES
(gen_random_uuid(), 'Monday', 'Idli, Sambar, Coconut Chutney, Tea/Coffee', 'Rice, Dal Tadka, Paneer Butter Masala, Roti, Curd', 'Samosa, Tea', 'Veg Biryani, Raita, Gulab Jamun', 'Chef Special Dinner'),
(gen_random_uuid(), 'Tuesday', 'Puri Bhaji, Tea/Coffee', 'Rice, Rajma Masala, Aloo Gobi, Roti, Salad', 'Biscuits, Tea', 'Chapati, Mix Veg Curry, Rice, Butter Milk', 'Standard Menu'),
(gen_random_uuid(), 'Wednesday', 'Dosa, Chana Masala, Tea/Coffee', 'Veg Pulao, Dal Fry, Bhindi Fry, Curd', 'Veg Cutlet, Coffee', 'Roti, Kadhai Paneer, Rice, Sweet', 'Special Dessert Served'),
(gen_random_uuid(), 'Thursday', 'Poha, Upma, Tea/Coffee', 'Rice, Chole Masala, Jeera Aloo, Roti, Salad', 'Pakora, Tea', 'Roti, Veg Kolhapuri, Rice, Curd', 'Healthy Option'),
(gen_random_uuid(), 'Friday', 'Paratha, Curd, Tea/Coffee', 'Rice, Dal Makhani, Mix Veg, Roti, Salad', 'Bun Maska, Tea', 'Fried Rice, Manchurian, Soup', 'Indo-Chinese Special'),
(gen_random_uuid(), 'Saturday', 'Uttapam, Sambhar, Tea/Coffee', 'Rice, Kadi Pakoda, Aloo Jeera, Roti, Curd', 'French Fries, Coffee', 'Roti, Malai Kofta, Rice, Kheer', 'Weekend Feast'),
(gen_random_uuid(), 'Sunday', 'Bread Butter Jam, Omelette/Sprouts', 'Special Veg Thali / Chicken Curry, Rice, Roti', 'Tea, Cookies', 'Pulao, Dal Fry, Ice Cream', 'Sunday Grand Lunch');

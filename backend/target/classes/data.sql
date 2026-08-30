-- Seed data for local/demo use.
-- Runs on every startup (spring.sql.init.mode=always); duplicate-key errors on
-- re-runs are safely skipped because continue-on-error is enabled.

-- ===== Categories =====
INSERT INTO categories (id, name, description) VALUES
  (1, 'Electronics', 'General electronic gadgets and devices'),
  (2, 'Laptops', 'Laptops and notebooks for work and gaming'),
  (3, 'Mobiles', 'Smartphones and mobile accessories'),
  (4, 'Accessories', 'Cables, chargers, cases and other accessories'),
  (5, 'Home Appliances', 'Appliances for everyday home use');

-- ===== Products =====
INSERT INTO products (id, name, description, price, stock, image_url, category_id, created_at, updated_at) VALUES
  (1,  'Wireless Bluetooth Earbuds', 'Compact true-wireless earbuds with noise isolation and 24h battery case.', 1999.00, 120, 'https://picsum.photos/seed/earbuds/400/400', 1, NOW(), NOW()),
  (2,  '4K Smart TV 43-inch',        'Ultra HD smart TV with built-in streaming apps and voice remote.',        27999.00, 25,  'https://picsum.photos/seed/smarttv/400/400', 1, NOW(), NOW()),
  (3,  'Portable Bluetooth Speaker', 'Water-resistant speaker with deep bass and 12h playtime.',                 1499.00, 80,  'https://picsum.photos/seed/speaker/400/400', 1, NOW(), NOW()),
  (4,  'DevBook Pro 14 Laptop',      '14-inch laptop, 16GB RAM, 512GB SSD - ideal for development work.',        68999.00, 15,  'https://picsum.photos/seed/devbook/400/400', 2, NOW(), NOW()),
  (5,  'UltraLight Air Laptop 13',   'Ultra-portable 13-inch laptop, 8GB RAM, 256GB SSD, all-day battery.',      52999.00, 20,  'https://picsum.photos/seed/ultralight/400/400', 2, NOW(), NOW()),
  (6,  'Gaming Laptop X15',          '15.6-inch gaming laptop with dedicated GPU and 144Hz display.',            99999.00, 10,  'https://picsum.photos/seed/gaminglaptop/400/400', 2, NOW(), NOW()),
  (7,  'Galaxy Nova 5G Smartphone',  '6.5-inch AMOLED display, 128GB storage, 5G-ready smartphone.',             24999.00, 40,  'https://picsum.photos/seed/galaxynova/400/400', 3, NOW(), NOW()),
  (8,  'Pixel Lite Smartphone',      'Compact Android smartphone with dual camera and 5000mAh battery.',         17999.00, 45,  'https://picsum.photos/seed/pixellite/400/400', 3, NOW(), NOW()),
  (9,  'Rugged Outdoor Phone',       'Shockproof, waterproof smartphone built for outdoor use.',                 21999.00, 18,  'https://picsum.photos/seed/ruggedphone/400/400', 3, NOW(), NOW()),
  (10, 'USB-C Fast Charger 65W',     '65W GaN charger, compatible with laptops and smartphones.',                1299.00, 150, 'https://picsum.photos/seed/charger/400/400', 4, NOW(), NOW()),
  (11, 'Braided USB-C Cable 1m',     'Durable braided charging and data cable, 1 meter.',                        399.00,  300, 'https://picsum.photos/seed/cable/400/400', 4, NOW(), NOW()),
  (12, 'Laptop Sleeve 14-inch',      'Padded protective sleeve for 14-inch laptops.',                            799.00,  90,  'https://picsum.photos/seed/sleeve/400/400', 4, NOW(), NOW()),
  (13, 'Wireless Mouse',             'Ergonomic wireless mouse with silent clicks.',                             699.00,  200, 'https://picsum.photos/seed/mouse/400/400', 4, NOW(), NOW()),
  (14, 'Robot Vacuum Cleaner',       'Smart robot vacuum with app control and auto-recharge.',                   14999.00, 22,  'https://picsum.photos/seed/vacuum/400/400', 5, NOW(), NOW()),
  (15, 'Air Fryer 4L',               'Digital air fryer with 8 preset cooking modes.',                           4999.00,  60,  'https://picsum.photos/seed/airfryer/400/400', 5, NOW(), NOW()),
  (16, 'Inverter Microwave Oven',    '25L inverter microwave with grill and convection modes.',                  8999.00,  30,  'https://picsum.photos/seed/microwave/400/400', 5, NOW(), NOW()),
  (17, 'Smart Electric Kettle',      '1.7L electric kettle with temperature control.',                           1999.00,  70,  'https://picsum.photos/seed/kettle/400/400', 5, NOW(), NOW()),
  (18, 'Studio Headphones',          'Over-ear studio headphones with rich sound and comfort padding.',          3499.00,  50,  'https://picsum.photos/seed/headphones/400/400', 1, NOW(), NOW());

-- ===== Demo Users =====
-- Password for both demo accounts is: password123  (BCrypt hash below)
INSERT INTO users (id, name, email, password, role, created_at, updated_at) VALUES
  (1, 'Demo Customer', 'customer@example.com', '$2b$10$xDQCJaMHwGHxo.umUpCZkOLiPOZlD5a84Fo9dlcKdCEYNAHSes03K', 'CUSTOMER', NOW(), NOW()),
  (2, 'Admin User',    'admin@example.com',    '$2b$10$xDQCJaMHwGHxo.umUpCZkOLiPOZlD5a84Fo9dlcKdCEYNAHSes03K', 'ADMIN',    NOW(), NOW());

-- ===== Empty carts for demo users =====
INSERT INTO cart (id, user_id) VALUES
  (1, 1),
  (2, 2);

CREATE TABLE customer_support (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    acquired_subdivision VARCHAR(255),
    street_address VARCHAR(255),
    street_number VARCHAR(20),
    block VARCHAR(50),
    lot VARCHAR(50),
    subject VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

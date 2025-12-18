-- import.sql (overwrite existing)
-- Recreate schema used by JPA on app startup

DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS batch_records;
DROP TABLE IF EXISTS crops;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50),
    phone VARCHAR(20),
    blocked BOOLEAN DEFAULT FALSE
);

CREATE TABLE crops (
    crop_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farmer_id VARCHAR(255) NOT NULL,
    batch_id VARCHAR(255),
    crop_name VARCHAR(255) NOT NULL,
    price VARCHAR(255),
    quantity VARCHAR(255),
    description TEXT,
    crop_type VARCHAR(255),
    variety VARCHAR(255),
    location VARCHAR(255),
    qr_code_url VARCHAR(1024),
    quality_grade VARCHAR(64),
    status VARCHAR(64),
    actual_yield VARCHAR(255),
    estimated_yield VARCHAR(255),
    ai_confidence_score DOUBLE,
    expected_harvest_date DATE,
    actual_harvest_date DATE,
    sow_date DATE,
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_farmer_id (farmer_id),
    INDEX idx_batch_id (batch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE batch_records (
    batch_id VARCHAR(255) PRIMARY KEY,
    farmer_id VARCHAR(255),
    distributor_id VARCHAR(255),
    crop_type VARCHAR(255),
    total_quantity DECIMAL(12,2),
    remaining_quantity DECIMAL(12,2) DEFAULT 0,
    lifecycle_status VARCHAR(50) DEFAULT 'PLANTED',
    avg_quality_score DECIMAL(5,2),
    harvest_date DATE,
    status VARCHAR(50) DEFAULT 'PLANTED',
    is_blocked BOOLEAN DEFAULT FALSE,
    rejected_by VARCHAR(255),
    reject_reason TEXT,
    qr_code_url VARCHAR(1024),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_farmer_id (farmer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE listings (
    listing_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    crop_id BIGINT,
    farmer_id VARCHAR(255),
    batch_id VARCHAR(255),
    price DECIMAL(12,2),
    quantity DECIMAL(12,2),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_listing_crop (crop_id),
    INDEX idx_listing_batch (batch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
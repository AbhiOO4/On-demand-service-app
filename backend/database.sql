-- Drop database if exists (uncomment if needed)
-- DROP DATABASE IF EXISTS ondemand_service;

-- Create database
CREATE DATABASE ondemand_service;

\c ondemand_service

-- Enable PostGIS extension if not enabled
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table (both customers and workers)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    user_type VARCHAR(10) NOT NULL CHECK (user_type IN ('customer', 'worker')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Worker profiles
CREATE TABLE worker_profiles (
    worker_id INTEGER PRIMARY KEY REFERENCES users(user_id),
    skills TEXT[] NOT NULL,
    availability BOOLEAN DEFAULT true,
    current_location POINT,
    rating DECIMAL(3,2) DEFAULT 0,
    verified BOOLEAN DEFAULT false
);

-- Services catalog
CREATE TABLE services (
    service_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Insert some initial services
INSERT INTO services (title, description, category, base_price, image_url) VALUES
    ('Home Cleaning Service', 'Professional home cleaning service including dusting, vacuuming, and sanitizing', 'Home Cleaning', 200.00, '/images/services/cleaning-service.jpg'),
    ('Landscaping Service', 'Complete garden and lawn maintenance service', 'Gardening', 100.00, '/images/services/landscaping.jpg'),
    ('Fan Installation', 'Professional ceiling fan installation service', 'Electrical', 50.00, '/images/services/fan.jpg');

-- Service requests
CREATE TABLE service_requests (
    request_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(user_id),
    service_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    location POINT NOT NULL,
    address TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_worker INTEGER REFERENCES users(user_id),
    estimated_price DECIMAL(10,2)
);

-- Reviews
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    service_request_id INTEGER REFERENCES service_requests(request_id),
    customer_id INTEGER REFERENCES users(user_id),
    worker_id INTEGER REFERENCES users(user_id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

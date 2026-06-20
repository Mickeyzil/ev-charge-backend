CREATE DATABASE ev_charge_db;

USE ev_charge_db;

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, 
    phone VARCHAR(20) NOT NULL,
    car_model VARCHAR(50) NOT NULL
);

CREATE TABLE Stations (
    station_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    available_slots INT NOT NULL,
    total_slots INT NOT NULL,
    power_kw INT NOT NULL,
    price_kwh DECIMAL(5,2) NOT NULL,
    connectors VARCHAR(255) NOT NULL, 
    amenities VARCHAR(255) NOT NULL   
);

CREATE TABLE Reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    station_id INT NOT NULL,
    arrival_date DATE NOT NULL,
    arrival_time TIME NOT NULL,
    car_model VARCHAR(50) NOT NULL,
    connector_type VARCHAR(20) NOT NULL,
    
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (station_id) REFERENCES Stations(station_id) ON DELETE CASCADE
);
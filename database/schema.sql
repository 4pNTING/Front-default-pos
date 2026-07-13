-- ================================================================
-- MMS (Mall Management System) PostgreSQL Database Schema
-- ================================================================
-- Created: 2025-10-01
-- Description: Complete database schema for Mall Management System
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- 1. MASTER DATA TABLES (Reference/Lookup Tables)
-- ================================================================

-- Province Table (ແຂວງ)
CREATE TABLE provinces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name_lao VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- District Table (ເມືອງ)
CREATE TABLE districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name_lao VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    province_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE
);

-- Village Table (ບ້ານ)
CREATE TABLE villages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name_lao VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    district_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE
);

-- Gender Table (เພດ)
CREATE TABLE genders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nation Table (ສັນຊາດ)
CREATE TABLE nations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contract Type Table (ປະເພດສັນຍາ)
CREATE TABLE contract_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Currency Table (ສະກຸນເງິນ)
CREATE TABLE currencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    symbol VARCHAR(10),
    exchange_rate DECIMAL(15, 4) DEFAULT 1.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document Type Table (ປະເພດເອກະສານ)
CREATE TABLE document_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Room Status Table (ສະຖານະຫ້ອງ)
CREATE TABLE room_statuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Room Type Table (ປະເພດຫ້ອງ)
CREATE TABLE room_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Room Category Table (ໝວດຫ້ອງ)
CREATE TABLE room_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shop Category Table (ປະເພດຮ້ານ)
CREATE TABLE shop_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ownership Type Table (ປະເພດກາສິດ)
CREATE TABLE ownership_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Type Table (ປະເພດການຈ່າຍ)
CREATE TABLE payment_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leasing Type Table (ປະເພດການເຊົ່າ)
CREATE TABLE leasing_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exchange Rate Table (ອັດຕາແລກປ່ຽນ)
CREATE TABLE exchange_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    from_currency_id UUID NOT NULL,
    to_currency_id UUID NOT NULL,
    rate DECIMAL(15, 4) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    effective_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_currency_id) REFERENCES currencies(id),
    FOREIGN KEY (to_currency_id) REFERENCES currencies(id)
);

-- ================================================================
-- 2. CONTACT & CUSTOMER TABLES
-- ================================================================

-- Contact Table (ຂໍ້ມູນຕິດຕໍ່)
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    province_id UUID NOT NULL,
    district_id UUID NOT NULL,
    village_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (province_id) REFERENCES provinces(id),
    FOREIGN KEY (district_id) REFERENCES districts(id),
    FOREIGN KEY (village_id) REFERENCES villages(id)
);

-- Customer Table (ຂໍ້ມູນລູກຄ້າ)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    main_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company_shop VARCHAR(200),
    gender VARCHAR(20) NOT NULL,
    province_id UUID NOT NULL,
    district_id UUID NOT NULL,
    village_id UUID NOT NULL,
    phone VARCHAR(20) NOT NULL,
    nation_id UUID NOT NULL,
    contact_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (province_id) REFERENCES provinces(id),
    FOREIGN KEY (district_id) REFERENCES districts(id),
    FOREIGN KEY (village_id) REFERENCES villages(id),
    FOREIGN KEY (nation_id) REFERENCES nations(id),
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL
);

-- ================================================================
-- 3. BUILDING & ROOM TABLES
-- ================================================================

-- Floor Table (ຊັ້ນ)
CREATE TABLE floors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    floor_code VARCHAR(20) UNIQUE NOT NULL,
    floor_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Room Table (ຫ້ອງ)
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_code VARCHAR(50) UNIQUE NOT NULL,
    room_name VARCHAR(100) NOT NULL,
    floor_id UUID NOT NULL,
    room_type_id UUID NOT NULL,
    room_category_id UUID NOT NULL,
    ownership_type_id UUID NOT NULL,
    room_status_id UUID NOT NULL,
    width DECIMAL(10, 2) NOT NULL,
    length DECIMAL(10, 2) NOT NULL,
    area DECIMAL(10, 2) NOT NULL,
    extra_area DECIMAL(10, 2) DEFAULT 0,
    rent_price DECIMAL(15, 2) NOT NULL,
    common_price DECIMAL(15, 2) DEFAULT 0,
    total_price DECIMAL(15, 2) NOT NULL,
    currency_id UUID NOT NULL,
    attached_files TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (floor_id) REFERENCES floors(id),
    FOREIGN KEY (room_type_id) REFERENCES room_types(id),
    FOREIGN KEY (room_category_id) REFERENCES room_categories(id),
    FOREIGN KEY (ownership_type_id) REFERENCES ownership_types(id),
    FOREIGN KEY (room_status_id) REFERENCES room_statuses(id),
    FOREIGN KEY (currency_id) REFERENCES currencies(id)
);

-- ================================================================
-- 4. LEASING & CONTRACT TABLES
-- ================================================================

-- Payment Periods Table (ງວດການຈ່າຍ)
CREATE TABLE payment_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period_number INTEGER NOT NULL,
    period_name VARCHAR(100) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    due_date DATE NOT NULL,
    currency_id UUID NOT NULL,
    description TEXT,
    is_paid BOOLEAN DEFAULT FALSE,
    paid_date DATE,
    paid_amount DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (currency_id) REFERENCES currencies(id)
);

-- Leasing Contract Table (ສັນຍາເຊົ່າ)
CREATE TABLE leasing_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL,
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    document_type_id UUID NOT NULL,
    shop_category_id UUID NOT NULL,
    shop_name VARCHAR(200) NOT NULL,
    room_status_id UUID NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    billing_end_date DATE,
    attached_files TEXT[],
    payment_type_id UUID NOT NULL,
    payment_periods_id UUID,
    total_width DECIMAL(10, 2) DEFAULT 0,
    total_length DECIMAL(10, 2) DEFAULT 0,
    total_area DECIMAL(10, 2) DEFAULT 0,
    total_room_count INTEGER DEFAULT 0,
    total_rent DECIMAL(15, 2) DEFAULT 0,
    total_common_fee DECIMAL(15, 2) DEFAULT 0,
    total_utilities DECIMAL(15, 2) DEFAULT 0,
    rent_discount DECIMAL(15, 2) DEFAULT 0,
    service_discount DECIMAL(15, 2) DEFAULT 0,
    discount DECIMAL(15, 2) DEFAULT 0,
    security_deposit DECIMAL(15, 2) DEFAULT 0,
    advance_payment DECIMAL(15, 2) DEFAULT 0,
    insurance_fee DECIMAL(15, 2) DEFAULT 0,
    grand_total DECIMAL(15, 2) NOT NULL,
    currency_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (document_type_id) REFERENCES document_types(id),
    FOREIGN KEY (shop_category_id) REFERENCES shop_categories(id),
    FOREIGN KEY (room_status_id) REFERENCES room_statuses(id),
    FOREIGN KEY (payment_type_id) REFERENCES payment_types(id),
    FOREIGN KEY (payment_periods_id) REFERENCES payment_periods(id),
    FOREIGN KEY (currency_id) REFERENCES currencies(id)
);

-- Leasing Rooms (Join Table for Leasing and Rooms)
CREATE TABLE leasing_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leasing_contract_id UUID NOT NULL,
    room_id UUID NOT NULL,
    room_code VARCHAR(50) NOT NULL,
    room_name VARCHAR(100) NOT NULL,
    width DECIMAL(10, 2) NOT NULL,
    length DECIMAL(10, 2) NOT NULL,
    area DECIMAL(10, 2) NOT NULL,
    extra_area DECIMAL(10, 2) DEFAULT 0,
    rent_price DECIMAL(15, 2) NOT NULL,
    common_price DECIMAL(15, 2) DEFAULT 0,
    total_price DECIMAL(15, 2) NOT NULL,
    currency_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leasing_contract_id) REFERENCES leasing_contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (currency_id) REFERENCES currencies(id)
);

-- ================================================================
-- 5. UTILITY METER TABLES
-- ================================================================

-- Water Meter Table (ມິເຕີນ້ຳ)
CREATE TABLE water_meters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    room_code VARCHAR(50) NOT NULL,
    meter_number VARCHAR(100) NOT NULL,
    multiplier DECIMAL(10, 2) DEFAULT 1.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Water Master Table (ຂໍ້ມູນນ້ຳ)
CREATE TABLE water_masters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    leasing_contract_id UUID NOT NULL,
    water_meter_id UUID NOT NULL,
    prev_reading DECIMAL(15, 2) NOT NULL,
    multiplier DECIMAL(10, 2) DEFAULT 1.0,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    tax10 BOOLEAN DEFAULT FALSE,
    customer_name VARCHAR(200),
    room_code VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leasing_contract_id) REFERENCES leasing_contracts(id),
    FOREIGN KEY (water_meter_id) REFERENCES water_meters(id)
);

-- Electric Meter Table (ມິເຕີໄຟ)
CREATE TABLE electric_meters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    room_code VARCHAR(50) NOT NULL,
    meter_number VARCHAR(100) NOT NULL,
    multiplier DECIMAL(10, 2) DEFAULT 1.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Electric Master Table (ຂໍ້ມູນໄຟຟ້າ)
CREATE TABLE electric_masters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    leasing_contract_id UUID NOT NULL,
    electric_meter_id UUID NOT NULL,
    prev_reading DECIMAL(15, 2) NOT NULL,
    multiplier DECIMAL(10, 2) DEFAULT 1.0,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    tax10 BOOLEAN DEFAULT FALSE,
    customer_name VARCHAR(200),
    room_code VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leasing_contract_id) REFERENCES leasing_contracts(id),
    FOREIGN KEY (electric_meter_id) REFERENCES electric_meters(id)
);

-- ================================================================
-- INDEXES FOR PERFORMANCE
-- ================================================================

CREATE INDEX idx_districts_province ON districts(province_id);
CREATE INDEX idx_villages_district ON villages(district_id);
CREATE INDEX idx_customers_province ON customers(province_id);
CREATE INDEX idx_customers_district ON customers(district_id);
CREATE INDEX idx_customers_village ON customers(village_id);
CREATE INDEX idx_customers_main_id ON customers(main_id);
CREATE INDEX idx_rooms_floor ON rooms(floor_id);
CREATE INDEX idx_rooms_status ON rooms(room_status_id);
CREATE INDEX idx_rooms_code ON rooms(room_code);
CREATE INDEX idx_leasing_customer ON leasing_contracts(customer_id);
CREATE INDEX idx_leasing_contract_number ON leasing_contracts(contract_number);
CREATE INDEX idx_leasing_rooms_contract ON leasing_rooms(leasing_contract_id);
CREATE INDEX idx_leasing_rooms_room ON leasing_rooms(room_id);
CREATE INDEX idx_water_masters_contract ON water_masters(leasing_contract_id);
CREATE INDEX idx_electric_masters_contract ON electric_masters(leasing_contract_id);

-- ================================================================
-- TRIGGERS FOR UPDATED_AT
-- ================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_provinces_updated_at BEFORE UPDATE ON provinces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_districts_updated_at BEFORE UPDATE ON districts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_villages_updated_at BEFORE UPDATE ON villages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_genders_updated_at BEFORE UPDATE ON genders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nations_updated_at BEFORE UPDATE ON nations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_floors_updated_at BEFORE UPDATE ON floors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leasing_contracts_updated_at BEFORE UPDATE ON leasing_contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_water_masters_updated_at BEFORE UPDATE ON water_masters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_electric_masters_updated_at BEFORE UPDATE ON electric_masters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

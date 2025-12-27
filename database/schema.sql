-- Pinnacle GST Dashboard - Database Schema
-- PostgreSQL 14+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user', -- user, admin, ca
    password_hash VARCHAR(255), -- for email/password login
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT email_or_phone_required CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- OTP tokens table
CREATE TABLE IF NOT EXISTS otp_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    identifier VARCHAR(255) NOT NULL, -- email or phone
    otp_code VARCHAR(10) NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- GST connections table
CREATE TABLE IF NOT EXISTS gst_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    gstin VARCHAR(15) NOT NULL,
    gsp_username VARCHAR(255) NOT NULL,
    auth_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, gstin)
);

-- Sales invoices table
CREATE TABLE IF NOT EXISTS sales_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gst_connection_id UUID REFERENCES gst_connections(id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) NOT NULL,
    invoice_date DATE NOT NULL,
    customer_name VARCHAR(255),
    customer_gstin VARCHAR(15),
    invoice_type VARCHAR(50), -- B2B, B2C, Export
    taxable_value DECIMAL(15, 2),
    cgst_amount DECIMAL(15, 2),
    sgst_amount DECIMAL(15, 2),
    igst_amount DECIMAL(15, 2),
    cess_amount DECIMAL(15, 2),
    total_amount DECIMAL(15, 2),
    return_period VARCHAR(10), -- MMYYYY format
    filing_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase invoices table
CREATE TABLE IF NOT EXISTS purchase_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gst_connection_id UUID REFERENCES gst_connections(id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) NOT NULL,
    invoice_date DATE NOT NULL,
    supplier_name VARCHAR(255),
    supplier_gstin VARCHAR(15),
    invoice_type VARCHAR(50),
    taxable_value DECIMAL(15, 2),
    cgst_amount DECIMAL(15, 2),
    sgst_amount DECIMAL(15, 2),
    igst_amount DECIMAL(15, 2),
    cess_amount DECIMAL(15, 2),
    total_amount DECIMAL(15, 2),
    itc_available DECIMAL(15, 2),
    itc_claimed DECIMAL(15, 2),
    return_period VARCHAR(10),
    filing_status VARCHAR(50),
    reconciliation_status VARCHAR(50), -- matched, missing, mismatch
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ITC ledger table
CREATE TABLE IF NOT EXISTS itc_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gst_connection_id UUID REFERENCES gst_connections(id) ON DELETE CASCADE,
    return_period VARCHAR(10) NOT NULL,
    itc_available DECIMAL(15, 2) DEFAULT 0,
    itc_claimed DECIMAL(15, 2) DEFAULT 0,
    itc_reversed DECIMAL(15, 2) DEFAULT 0,
    itc_utilized DECIMAL(15, 2) DEFAULT 0,
    itc_balance DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(gst_connection_id, return_period)
);

-- Compliance alerts table
CREATE TABLE IF NOT EXISTS compliance_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gst_connection_id UUID REFERENCES gst_connections(id) ON DELETE CASCADE,
    alert_type VARCHAR(100), -- missing_invoice, mismatch, filing_delay
    severity VARCHAR(20), -- critical, high, medium, low
    title VARCHAR(255),
    description TEXT,
    related_entity VARCHAR(100), -- invoice_id, return_period, etc.
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_name VARCHAR(50), -- basic, professional, enterprise
    plan_price DECIMAL(10, 2),
    billing_cycle VARCHAR(20), -- monthly, yearly
    status VARCHAR(50) DEFAULT 'active', -- active, cancelled, expired
    current_period_start DATE,
    current_period_end DATE,
    razorpay_subscription_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2),
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(50), -- success, failed, pending
    razorpay_payment_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Export history table
CREATE TABLE IF NOT EXISTS export_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    export_type VARCHAR(50), -- pdf, excel, csv
    report_name VARCHAR(255),
    file_url TEXT,
    file_size_kb INTEGER,
    parameters JSONB, -- store export filters/parameters
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    compliance_alerts BOOLEAN DEFAULT true,
    auto_sync_enabled BOOLEAN DEFAULT true,
    sync_frequency VARCHAR(20) DEFAULT 'daily', -- hourly, daily, weekly
    theme VARCHAR(20) DEFAULT 'light',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_gst_connections_user ON gst_connections(user_id);
CREATE INDEX idx_gst_connections_gstin ON gst_connections(gstin);
CREATE INDEX idx_sales_invoices_connection ON sales_invoices(gst_connection_id);
CREATE INDEX idx_sales_invoices_date ON sales_invoices(invoice_date);
CREATE INDEX idx_purchase_invoices_connection ON purchase_invoices(gst_connection_id);
CREATE INDEX idx_purchase_invoices_date ON purchase_invoices(invoice_date);
CREATE INDEX idx_compliance_alerts_connection ON compliance_alerts(gst_connection_id);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gst_connections_updated_at BEFORE UPDATE ON gst_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_invoices_updated_at BEFORE UPDATE ON sales_invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_invoices_updated_at BEFORE UPDATE ON purchase_invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

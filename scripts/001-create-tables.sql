-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    name VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'individual', -- individual, ca, business, admin
    plan VARCHAR(50) NOT NULL DEFAULT 'free', -- free, individual, business, enterprise
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- GSTINs table
CREATE TABLE IF NOT EXISTS gstins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gstin VARCHAR(15) NOT NULL,
    auth_token TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, connected, error
    last_synced TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, gstin)
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan VARCHAR(50) NOT NULL, -- individual, business, enterprise
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, cancelled, expired
    amount DECIMAL(10, 2),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Invoices table (for sales/purchase transactions)
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gstin_id UUID NOT NULL REFERENCES gstins(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- sales, purchase
    invoice_number VARCHAR(100),
    invoice_date DATE NOT NULL,
    party_gstin VARCHAR(15),
    party_name VARCHAR(255),
    taxable_value DECIMAL(15, 2),
    igst DECIMAL(15, 2) DEFAULT 0,
    cgst DECIMAL(15, 2) DEFAULT 0,
    sgst DECIMAL(15, 2) DEFAULT 0,
    cess DECIMAL(15, 2) DEFAULT 0,
    total_tax DECIMAL(15, 2),
    invoice_value DECIMAL(15, 2),
    transaction_type VARCHAR(50), -- B2B, B2C, Export, etc.
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ITC Ledgers table
CREATE TABLE IF NOT EXISTS itc_ledgers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gstin_id UUID NOT NULL REFERENCES gstins(id) ON DELETE CASCADE,
    vendor_gstin VARCHAR(15) NOT NULL,
    vendor_name VARCHAR(255),
    invoice_number VARCHAR(100),
    invoice_date DATE NOT NULL,
    taxable_value DECIMAL(15, 2),
    igst DECIMAL(15, 2) DEFAULT 0,
    cgst DECIMAL(15, 2) DEFAULT 0,
    sgst DECIMAL(15, 2) DEFAULT 0,
    cess DECIMAL(15, 2) DEFAULT 0,
    total_itc DECIMAL(15, 2),
    eligible_itc DECIMAL(15, 2),
    status VARCHAR(50) NOT NULL DEFAULT 'available', -- available, claimed, blocked, reversed
    return_period VARCHAR(10), -- MMYYYY format
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Compliance Alerts table
CREATE TABLE IF NOT EXISTS compliance_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gstin_id UUID NOT NULL REFERENCES gstins(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- filing_delay, itc_mismatch, notice, etc.
    severity VARCHAR(50) NOT NULL, -- critical, high, medium, low
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, resolved, dismissed
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP
);

-- Filing Status table
CREATE TABLE IF NOT EXISTS filing_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gstin_id UUID NOT NULL REFERENCES gstins(id) ON DELETE CASCADE,
    return_type VARCHAR(50) NOT NULL, -- GSTR-1, GSTR-3B, etc.
    return_period VARCHAR(10) NOT NULL, -- MMYYYY format
    due_date DATE NOT NULL,
    filing_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, filed, late, missed
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(gstin_id, return_type, return_period)
);

-- Exports table (for tracking report exports)
CREATE TABLE IF NOT EXISTS exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gstin VARCHAR(15),
    report_type VARCHAR(100) NOT NULL,
    return_period VARCHAR(10),
    format VARCHAR(20) NOT NULL, -- pdf, excel, csv
    file_path TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_gstins_user_id ON gstins(user_id);
CREATE INDEX IF NOT EXISTS idx_gstins_gstin ON gstins(gstin);
CREATE INDEX IF NOT EXISTS idx_invoices_gstin_id ON invoices(gstin_id);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_itc_ledgers_gstin_id ON itc_ledgers(gstin_id);
CREATE INDEX IF NOT EXISTS idx_itc_ledgers_vendor ON itc_ledgers(vendor_gstin);
CREATE INDEX IF NOT EXISTS idx_compliance_alerts_gstin_id ON compliance_alerts(gstin_id);
CREATE INDEX IF NOT EXISTS idx_compliance_alerts_status ON compliance_alerts(status);
CREATE INDEX IF NOT EXISTS idx_filing_status_gstin_id ON filing_status(gstin_id);

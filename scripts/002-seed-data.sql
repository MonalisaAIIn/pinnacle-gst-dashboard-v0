-- Insert demo users
INSERT INTO users (email, phone, name, role, plan, created_at) VALUES
    ('admin@pinnacle.com', '+919876543210', 'Admin User', 'admin', 'enterprise', NOW()),
    ('ca@example.com', '+919876543211', 'CA Professional', 'ca', 'enterprise', NOW()),
    ('business@example.com', '+919876543212', 'Business Owner', 'business', 'business', NOW()),
    ('individual@example.com', '+919876543213', 'Individual User', 'individual', 'free', NOW())
ON CONFLICT (email) DO NOTHING;

-- Get user IDs for reference
DO $$
DECLARE
    business_user_id UUID;
    gstin_id UUID;
BEGIN
    -- Get business user ID
    SELECT id INTO business_user_id FROM users WHERE email = 'business@example.com';

    -- Insert demo GSTIN
    INSERT INTO gstins (user_id, gstin, status, auth_token, last_synced, created_at)
    VALUES (business_user_id, '27AAPFU0939F1ZV', 'connected', 'demo_token_123', NOW(), NOW())
    ON CONFLICT (user_id, gstin) DO UPDATE SET status = 'connected'
    RETURNING id INTO gstin_id;

    -- Insert demo invoices (Sales)
    INSERT INTO invoices (gstin_id, type, invoice_number, invoice_date, party_gstin, party_name, taxable_value, igst, cgst, sgst, total_tax, invoice_value, transaction_type, created_at)
    VALUES 
        (gstin_id, 'sales', 'INV-001', '2024-12-01', '29AABCT1332L1Z1', 'ABC Technologies', 100000, 18000, 0, 0, 18000, 118000, 'B2B', NOW()),
        (gstin_id, 'sales', 'INV-002', '2024-12-05', '27AACFM7404F1Z5', 'XYZ Corp', 75000, 0, 6750, 6750, 13500, 88500, 'B2B', NOW()),
        (gstin_id, 'sales', 'INV-003', '2024-12-10', NULL, 'Retail Customer', 5000, 0, 450, 450, 900, 5900, 'B2C', NOW()),
        (gstin_id, 'sales', 'INV-004', '2024-11-15', '29AABCT1332L1Z1', 'ABC Technologies', 150000, 27000, 0, 0, 27000, 177000, 'B2B', NOW()),
        (gstin_id, 'sales', 'INV-005', '2024-11-20', NULL, 'Export Customer', 200000, 0, 0, 0, 0, 200000, 'Export', NOW());

    -- Insert demo ITC Ledger entries
    INSERT INTO itc_ledgers (gstin_id, vendor_gstin, vendor_name, invoice_number, invoice_date, taxable_value, igst, cgst, sgst, total_itc, eligible_itc, status, return_period, created_at)
    VALUES 
        (gstin_id, '27AABCU9603R1ZM', 'Tech Supplies Ltd', 'VINV-101', '2024-12-01', 50000, 9000, 0, 0, 9000, 9000, 'available', '122024', NOW()),
        (gstin_id, '29AACFV3017B1Z3', 'Office Solutions', 'VINV-102', '2024-12-03', 30000, 0, 2700, 2700, 5400, 5400, 'available', '122024', NOW()),
        (gstin_id, '27AADCS5103E1Z1', 'Raw Materials Co', 'VINV-103', '2024-12-05', 80000, 14400, 0, 0, 14400, 14400, 'claimed', '122024', NOW()),
        (gstin_id, '29AAHCS2781A1Z3', 'Equipment Rental', 'VINV-104', '2024-11-10', 25000, 0, 2250, 2250, 4500, 0, 'blocked', '112024', NOW());

    -- Insert demo compliance alerts
    INSERT INTO compliance_alerts (gstin_id, type, severity, message, status, created_at)
    VALUES 
        (gstin_id, 'filing_delay', 'high', 'GSTR-3B for November 2024 is overdue. File immediately to avoid penalties.', 'active', NOW()),
        (gstin_id, 'itc_mismatch', 'medium', 'ITC mismatch of ₹5,400 detected in October 2024 returns.', 'active', NOW()),
        (gstin_id, 'notice', 'critical', 'Show cause notice received for FY 2023-24. Response due in 15 days.', 'active', NOW()),
        (gstin_id, 'reconciliation', 'low', '3 invoices from vendor "ABC Ltd" missing in GSTR-2B.', 'dismissed', NOW() - INTERVAL '5 days');

    -- Insert demo filing status
    INSERT INTO filing_status (gstin_id, return_type, return_period, due_date, filing_date, status, created_at)
    VALUES 
        (gstin_id, 'GSTR-1', '122024', '2025-01-11', NULL, 'pending', NOW()),
        (gstin_id, 'GSTR-3B', '122024', '2025-01-20', NULL, 'pending', NOW()),
        (gstin_id, 'GSTR-1', '112024', '2024-12-11', '2024-12-10', 'filed', NOW()),
        (gstin_id, 'GSTR-3B', '112024', '2024-12-20', '2024-12-22', 'late', NOW()),
        (gstin_id, 'GSTR-1', '102024', '2024-11-11', '2024-11-09', 'filed', NOW());

    -- Insert demo subscription
    INSERT INTO subscriptions (user_id, plan, status, amount, start_date, end_date, created_at)
    VALUES (business_user_id, 'business', 'active', 999.00, NOW(), NOW() + INTERVAL '1 month', NOW())
    ON CONFLICT DO NOTHING;

END $$;

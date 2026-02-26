# Sthiroot Wallet System - Complete Documentation

## Overview
A comprehensive digital wallet system integrated into the Sthiroot business management platform that supports Partners, Employees, and Stores with top-up/recharge requests, withdrawal requests, transaction tracking, and reporting capabilities.

---

## Database Schema (Based on Mock Data)

### 1. **Wallets Table**
Stores wallet information for each user (Partner/Employee/Store)

```sql
CREATE TABLE wallets (
  id VARCHAR(50) PRIMARY KEY,              -- WAL-P-001, WAL-E-001, WAL-S-001
  user_id VARCHAR(50) NOT NULL,            -- PTR-001, EMP-001, STR-001
  user_type ENUM('Partner', 'Employee', 'Store') NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_code VARCHAR(50) NOT NULL,
  balance DECIMAL(10, 2) DEFAULT 0.00,
  total_top_up DECIMAL(10, 2) DEFAULT 0.00,
  total_withdraw DECIMAL(10, 2) DEFAULT 0.00,
  total_received DECIMAL(10, 2) DEFAULT 0.00,
  total_spent DECIMAL(10, 2) DEFAULT 0.00,
  status ENUM('Active', 'Suspended', 'Frozen') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_user_type (user_type)
);
```

### 2. **Top-Up Requests Table**
Stores top-up/recharge requests from Partners and Stores

```sql
CREATE TABLE top_up_requests (
  id VARCHAR(50) PRIMARY KEY,              -- TUR-001
  request_number VARCHAR(50) UNIQUE NOT NULL,
  wallet_id VARCHAR(50) NOT NULL,
  user_id VARCHAR(50) NOT NULL,
  user_type ENUM('Partner', 'Store') NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_code VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_screenshot VARCHAR(500),
  transaction_id VARCHAR(255) NOT NULL,
  transaction_date TIMESTAMP NOT NULL,
  notes TEXT,
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_by VARCHAR(50),                 -- Accountant/Admin user_id
  reviewed_by_name VARCHAR(255),
  reviewed_at TIMESTAMP NULL,
  rejection_reason TEXT,
  whatsapp_notified BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (wallet_id) REFERENCES wallets(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_status (status),
  INDEX idx_user_id (user_id)
);
```

### 3. **Withdraw Requests Table**
Stores withdrawal requests from Partners, Employees, and Stores

```sql
CREATE TABLE withdraw_requests (
  id VARCHAR(50) PRIMARY KEY,              -- WDR-001
  request_number VARCHAR(50) UNIQUE NOT NULL,
  wallet_id VARCHAR(50) NOT NULL,
  user_id VARCHAR(50) NOT NULL,
  user_type ENUM('Partner', 'Employee', 'Store') NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_code VARCHAR(50) NOT NULL,
  requested_amount DECIMAL(10, 2) NOT NULL,
  bank_account_number VARCHAR(50),
  ifsc_code VARCHAR(20),
  upi_id VARCHAR(100),
  notes TEXT,
  status ENUM('Pending', 'Approved', 'Rejected', 'Processed') DEFAULT 'Pending',
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_by VARCHAR(50),
  reviewed_by_name VARCHAR(255),
  reviewed_at TIMESTAMP NULL,
  processed_at TIMESTAMP NULL,
  payment_screenshot VARCHAR(500),
  payment_transaction_id VARCHAR(255),
  rejection_reason TEXT,
  whatsapp_notified BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (wallet_id) REFERENCES wallets(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_status (status),
  INDEX idx_user_id (user_id)
);
```

### 4. **Wallet Transactions Table**
Stores all wallet transaction history

```sql
CREATE TABLE wallet_transactions (
  id VARCHAR(50) PRIMARY KEY,              -- TXN-001
  transaction_number VARCHAR(50) UNIQUE NOT NULL,
  wallet_id VARCHAR(50) NOT NULL,
  user_id VARCHAR(50) NOT NULL,
  user_type ENUM('Partner', 'Employee', 'Store') NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_code VARCHAR(50) NOT NULL,
  type ENUM('TopUp', 'Withdraw', 'Received', 'Spent', 'Refund', 'Commission', 'Reward', 'Deduction') NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  balance_before DECIMAL(10, 2) NOT NULL,
  balance_after DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  reference_type ENUM('TopUpRequest', 'WithdrawRequest', 'Order', 'AdminTransfer', 'Commission'),
  reference_id VARCHAR(50),
  performed_by VARCHAR(50),                -- For admin transfers
  performed_by_name VARCHAR(255),
  payment_screenshot VARCHAR(500),
  transaction_id VARCHAR(255),
  transaction_date TIMESTAMP NOT NULL,
  notes TEXT,
  status ENUM('Completed', 'Pending', 'Failed', 'Reported') DEFAULT 'Completed',
  reported_at TIMESTAMP NULL,
  report_reason TEXT,
  report_status ENUM('Pending', 'Resolved', 'Rejected'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (wallet_id) REFERENCES wallets(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_wallet_id (wallet_id),
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_transaction_date (transaction_date)
);
```

### 5. **Admin Money Transfers Table**
Stores direct money transfers from accountant/admin to wallets

```sql
CREATE TABLE admin_money_transfers (
  id VARCHAR(50) PRIMARY KEY,              -- AMT-001
  transfer_number VARCHAR(50) UNIQUE NOT NULL,
  recipient_wallet_id VARCHAR(50) NOT NULL,
  recipient_user_id VARCHAR(50) NOT NULL,
  recipient_user_type ENUM('Partner', 'Employee', 'Store') NOT NULL,
  recipient_user_name VARCHAR(255) NOT NULL,
  recipient_user_code VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  transfer_type ENUM('Reward', 'Incentive', 'Bonus', 'Refund', 'Adjustment', 'Other') NOT NULL,
  payment_screenshot VARCHAR(500) NOT NULL,
  transaction_id VARCHAR(255) NOT NULL,
  transaction_date TIMESTAMP NOT NULL,
  notes TEXT,
  sent_by VARCHAR(50) NOT NULL,            -- Accountant/Admin user_id
  sent_by_name VARCHAR(255) NOT NULL,
  status ENUM('Completed', 'Pending') DEFAULT 'Completed',
  transaction_record_id VARCHAR(50),       -- Link to wallet_transactions
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recipient_wallet_id) REFERENCES wallets(id),
  FOREIGN KEY (recipient_user_id) REFERENCES users(id),
  FOREIGN KEY (transaction_record_id) REFERENCES wallet_transactions(id),
  INDEX idx_recipient (recipient_user_id),
  INDEX idx_sent_by (sent_by)
);
```

### 6. **Reported Transactions Table**
Stores transaction issues reported by users

```sql
CREATE TABLE reported_transactions (
  id VARCHAR(50) PRIMARY KEY,              -- RPT-001
  report_number VARCHAR(50) UNIQUE NOT NULL,
  transaction_id VARCHAR(50) NOT NULL,
  transaction_number VARCHAR(50) NOT NULL,
  wallet_id VARCHAR(50) NOT NULL,
  user_id VARCHAR(50) NOT NULL,
  user_type ENUM('Partner', 'Employee', 'Store') NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_code VARCHAR(50) NOT NULL,
  report_reason VARCHAR(255) NOT NULL,
  report_details TEXT NOT NULL,
  expected_amount DECIMAL(10, 2),
  reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('Pending', 'UnderReview', 'Resolved', 'Rejected') DEFAULT 'Pending',
  reviewed_by VARCHAR(50),
  reviewed_by_name VARCHAR(255),
  reviewed_at TIMESTAMP NULL,
  resolution TEXT,
  resolution_date TIMESTAMP NULL,
  FOREIGN KEY (transaction_id) REFERENCES wallet_transactions(id),
  FOREIGN KEY (wallet_id) REFERENCES wallets(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_status (status),
  INDEX idx_user_id (user_id)
);
```

---

## Components Created

### 1. **Mock Data File**
- **File**: `/src/app/data/walletMockData.ts`
- **Purpose**: Comprehensive mock data for all wallet entities
- **Exports**:
  - Wallet interfaces (Wallet, TopUpRequest, WithdrawRequest, WalletTransaction, AdminMoneyTransfer, ReportedTransaction)
  - Mock data arrays for each entity
  - Ready for database integration

### 2. **Accountant Panel**
- **File**: `/src/app/components/accountant/AccountantWallet.tsx`
- **Features**:
  - Dashboard with summary cards (pending top-ups, withdrawals, reports, active wallets)
  - Top-up request approval/rejection with reason
  - Withdrawal request approval/rejection
  - Send money directly to any wallet (reward/incentive/bonus/etc.)
  - View and resolve reported transactions
  - View all wallets with balances
  - WhatsApp notification triggers
- **Tabs**:
  - Top-Up Requests
  - Withdraw Requests
  - Reported Transactions
  - All Wallets

### 3. **Employee Dashboard**
- **File**: `/src/app/components/employee/EmployeeDashboard.tsx`
- **Features**:
  - Wallet balance display
  - Monthly orders and revenue
  - RP (Reward Points) tracking
  - Employee information card
  - Wallet statistics
  - Performance metrics with progress bars
  - Recent wallet transactions

### 4. **Employee Wallet**
- **File**: `/src/app/components/employee/EmployeeWallet.tsx`
- **Features**:
  - Wallet balance card with total received/withdrawn
  - Submit withdrawal requests (UPI or Bank Transfer)
  - Report transaction issues
  - Transaction history table
  - Withdrawal requests tracking
  - Reported issues tracking
- **Tabs**:
  - Transaction History
  - Withdrawal Requests
  - Reported Issues

---

## User Flows

### **For Partners/Stores (Top-Up Request)**
1. Partner/Store navigates to wallet section
2. Fills top-up request form:
   - Amount
   - Payment screenshot
   - Transaction ID (from their bank)
   - Transaction date
   - Notes
3. Submits request → Status: "Pending"
4. Accountant reviews in Accountant Panel
5. Accountant approves/rejects with reason
6. If approved: Amount credited to wallet + WhatsApp notification
7. If rejected: WhatsApp notification with reason

### **For All Users (Withdrawal Request)**
1. User navigates to wallet section
2. Fills withdrawal request form:
   - Amount (cannot exceed wallet balance)
   - Payment method (UPI or Bank Transfer)
   - UPI ID or Bank details
   - Notes
3. Submits request → Status: "Pending"
4. Accountant reviews in Accountant Panel
5. Accountant approves/rejects
6. If approved: Accountant processes payment → uploads proof → Status: "Processed"
7. Amount deducted from wallet + notification sent

### **For Accountant (Send Money)**
1. Accountant clicks "Send Money" button
2. Fills form:
   - Recipient Type (Partner/Employee/Store)
   - Recipient ID
   - Amount
   - Transfer Type (Reward/Incentive/Bonus/etc.)
   - Payment screenshot
   - Transaction ID
   - Transaction date
   - Notes
3. Submits → Money immediately credited to recipient's wallet
4. Transaction record created

### **For Users (Report Transaction)**
1. User finds issue with a transaction (amount not received/incorrect amount)
2. Navigates to wallet → "Report Transaction"
3. Fills form:
   - Transaction number
   - Issue type
   - Expected amount
   - Detailed description
4. Submits → Status: "Pending"
5. Accountant reviews in Accountant Panel
6. Accountant resolves or rejects the report
7. If resolved: Missing amount credited + status updated

---

## Routes Added

### Employee Routes
- `/employee/dashboard` - Employee dashboard with KPIs
- `/employee/wallet` - Wallet management
- `/employee/create-order` - Create new order
- `/employee/orders` - View all orders
- `/employee/transactions` - Transaction history
- `/employee/points` - RP points history
- `/employee/my-offers` - Available offers

### Accountant Routes
- `/accountant/wallet` - Complete wallet management panel

---

## Notifications (WhatsApp Integration)

### Top-Up Request
- **Approved**: "✅ Your top-up request [TUR-XXX] for ₹XX,XXX has been approved! Amount credited to your wallet."
- **Rejected**: "❌ Your top-up request [TUR-XXX] for ₹XX,XXX has been rejected. Reason: [reason]"

### Withdrawal Request
- **Approved**: "✅ Your withdrawal request [WDR-XXX] for ₹XX,XXX has been approved and is being processed."
- **Processed**: "✅ ₹XX,XXX has been transferred to your account. Transaction ID: [id]"
- **Rejected**: "❌ Your withdrawal request [WDR-XXX] has been rejected. Reason: [reason]"

### Money Received
- "💰 You've received ₹XX,XXX in your wallet as [Reward/Incentive/etc.]. New balance: ₹XX,XXX"

---

## Implementation Notes

### Transaction Workflow
1. All transactions update `wallet_transactions` table
2. Wallet balance is updated atomically
3. `balance_before` and `balance_after` are recorded for audit trail
4. Reference IDs link transactions to their source (top-up request, order, etc.)

### Security Considerations
- All amounts are validated server-side
- Withdrawal amount cannot exceed wallet balance
- Payment screenshots are required for verification
- Transaction IDs are mandatory for audit trail
- All operations are logged with timestamps
- User cannot modify approved/rejected requests

### Performance Optimizations
- Indexes on frequently queried fields (status, user_id, wallet_id, dates)
- Pagination for transaction history
- Caching of wallet balances
- Batch processing for WhatsApp notifications

---

## Future Enhancements
1. Auto-verification using payment gateway APIs
2. QR code generation for top-up payments
3. Email notifications in addition to WhatsApp
4. Export transaction history to PDF/Excel
5. Wallet-to-wallet transfers between users
6. Scheduled automatic withdrawals
7. Multi-currency support
8. Wallet freeze/unfreeze by admin
9. Transaction dispute resolution workflow
10. Automated reconciliation reports

---

## Testing Checklist
- [ ] Top-up request creation and approval flow
- [ ] Top-up request rejection flow
- [ ] Withdrawal request with UPI
- [ ] Withdrawal request with Bank Transfer
- [ ] Send money from accountant to each user type
- [ ] Report transaction and resolution
- [ ] Wallet balance updates correctly
- [ ] Transaction history accuracy
- [ ] Insufficient balance validation
- [ ] WhatsApp notifications trigger
- [ ] Screenshot upload functionality
- [ ] Date validations
- [ ] Status transitions
- [ ] Role-based access control

---

## Conclusion
The wallet system is fully integrated with comprehensive mock data that directly maps to database schemas. All components are ready for backend API integration. The system supports all required user flows with proper validations, notifications, and audit trails.

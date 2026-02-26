# Sthiroot - Login Credentials Documentation

## System Login Credentials

### Access the system at: `/` (Login page)

---

## 1. Business Owner / Admin

**Role**: Full system access - Manage everything

**Credentials:**
- **Email**: `owner@sthiroot.com`
- **Password**: `owner123`

**Access to:**
- Dashboard with complete business overview
- Order Management
- Customer Management
- Store Management
- Product Management (CRUD operations)
- Stock Management
- Partner Hierarchy & Network
- Employee Management
- All Transactions
- Commission Management
- Offer Management & Creation
- Token Management
- Accounting & Financial Reports
- View all wallet activities

**Default Route:** `/dashboard`

---

## 2. Partner

**Role**: Network marketing partner - Build downline, earn commissions

**Credentials:**
- **Email**: `partner@sthiroot.com`
- **Password**: `partner123`

**Sample Partner Credentials:**
- Rajesh Kumar (PTR-001): `rajesh@sthiroot.com` / `partner123`
- Priya Sharma (PTR-002): `priya@sthiroot.com` / `partner123`

**Access to:**
- Personal Dashboard with earnings & network stats
- Digital Wallet (Balance: ₹45,000 for PTR-001)
- Create Orders (for customers)
- Transaction History
- RP (Reward Points) History
- My Network (Downline tree view)
- Sponsored Partners
- Available Offers
- **Wallet Features:**
  - View balance in header
  - Request top-up/recharge (with payment screenshot)
  - Request withdrawal (UPI/Bank)
  - View transaction history
  - Report transaction issues

**Default Route:** `/partner/dashboard`

---

## 3. Store Owner

**Role**: Franchise/Store operator - Manage store operations

**Credentials:**
- **Email**: `store@sthiroot.com`
- **Password**: `store123`

**Sample Store Credentials:**
- Mumbai Main Store (STR-001): `mumbai@sthiroot.com` / `store123`
- Delhi Branch (STR-002): `delhi@sthiroot.com` / `store123`

**Access to:**
- Store Dashboard with KPIs
- Digital Wallet (Balance: ₹125,000 for STR-001)
- Order Management (store-specific)
- Customer Management
- Stock Management
- Employee Management (store employees)
- Transaction History
- Commission Tracking
- Store Offers
- Store Settings
- **Wallet Features:**
  - View balance in header
  - Request top-up/recharge (with payment screenshot)
  - Request withdrawal (UPI/Bank)
  - View transaction history
  - Report transaction issues

**Default Route:** `/store/dashboard`

---

## 4. Employee

**Role**: Sales executive - Create orders, earn incentives

**Credentials:**
- **Email**: `employee@sthiroot.com`
- **Password**: `employee123`

**Sample Employee Credentials:**
- Amit Patel (EMP-001): `amit@sthiroot.com` / `employee123`
- Sneha Reddy (EMP-002): `sneha@sthiroot.com` / `employee123`

**Access to:**
- Employee Dashboard with performance metrics
- Digital Wallet (Balance: ₹18,000 for EMP-001)
- My Wallet (dedicated wallet page)
- Create Order
- Order List
- Transaction History
- Points History (RP tracking)
- My Offers
- **Wallet Features:**
  - View balance in header
  - Request withdrawal only (UPI/Bank)
  - View transaction history
  - Report transaction issues
  - Cannot top-up (only receives money from admin)

**Default Route:** `/employee/dashboard`

**Note:** Employees do NOT have top-up option, they only receive money from accountant/admin and can withdraw.

---

## 5. Business Accountant

**Role**: Financial management - Handle wallet requests & transactions

**Credentials:**
- **Email**: `accountant@sthiroot.com`
- **Password**: `accountant123`

**Sample Accountant Credentials:**
- Accountant Admin (ACC-001): `accountant@sthiroot.com` / `accountant123`

**Access to:**
- **Wallet Management Panel** (Main workspace)
  - Top-Up Requests (approve/reject with WhatsApp notification)
  - Withdraw Requests (approve/reject/process)
  - Reported Transactions (review & resolve)
  - All Wallets Overview
- **Send Money Feature:**
  - Send money directly to any wallet
  - Types: Reward, Incentive, Bonus, Refund, Adjustment
  - Upload payment screenshot & transaction ID
- Financial Reports

**Default Route:** `/accountant/wallet`

**Key Responsibilities:**
1. Review top-up requests with payment screenshots
2. Verify transaction IDs before approval
3. Process withdrawal requests
4. Send rewards/incentives to employees
5. Resolve reported transaction issues
6. Maintain financial records

---

## User Role Hierarchy

```
Business Owner (Top Level)
├── Business Accountant (Financial Operations)
├── Store Owners (Franchise Operators)
│   └── Store Employees
├── Partners (Network Marketing)
│   └── Downline Partners (Multi-level)
└── Employees (Sales Executives)
```

---

## Feature Access Matrix

| Feature | Owner | Accountant | Store | Partner | Employee |
|---------|-------|-----------|-------|---------|----------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| Digital Wallet | ❌ | ❌ | ✅ | ✅ | ✅ |
| Wallet Balance Header | ❌ | ❌ | ✅ | ✅ | ✅ |
| Top-Up Request | ❌ | ❌ | ✅ | ✅ | ❌ |
| Withdraw Request | ❌ | ❌ | ✅ | ✅ | ✅ |
| Approve Top-Ups | ❌ | ✅ | ❌ | ❌ | ❌ |
| Approve Withdrawals | ❌ | ✅ | ❌ | ❌ | ❌ |
| Send Money | ❌ | ✅ | ❌ | ❌ | ❌ |
| Product Management | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create Order | ❌ | ❌ | ✅ | ✅ | ✅ |
| View Network | ✅ | ❌ | ❌ | ✅ | ❌ |
| Offer Management | ✅ | ❌ | View | View | View |
| Reports | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Wallet Balance Preview (in Header)

When logged in as Partner, Employee, or Store Owner, you'll see a **Wallet button** in the top-right corner:

```
[Wallet Icon]  Wallet
               ₹45,000
```

**Click on it to:**
- View complete wallet details
- Submit requests (top-up/withdraw)
- View transaction history
- Report issues

**Also appears in:**
- User dropdown menu (when you click your profile)
- Shows role badge (Partner/Employee/Store)

---

## Testing Scenarios

### Scenario 1: Partner Top-Up Request Flow
1. Login as Partner: `partner@sthiroot.com`
2. See wallet balance in header: ₹45,000
3. Go to Dashboard (wallet widget visible)
4. Request top-up for ₹25,000
5. Upload payment screenshot
6. Logout → Login as Accountant: `accountant@sthiroot.com`
7. See pending request in "Top-Up Requests" tab
8. Review details → Approve
9. Partner receives WhatsApp notification
10. Partner wallet updated to ₹70,000

### Scenario 2: Employee Withdrawal Flow
1. Login as Employee: `employee@sthiroot.com`
2. See wallet balance in header: ₹18,000
3. Navigate to "My Wallet"
4. Click "Withdraw Money"
5. Enter amount: ₹8,000
6. Select UPI → Enter UPI ID
7. Submit request
8. Logout → Login as Accountant
9. Go to "Withdraw Requests" tab
10. Approve request
11. Upload payment proof
12. Process → Employee wallet deducted to ₹10,000

### Scenario 3: Accountant Send Money
1. Login as Accountant: `accountant@sthiroot.com`
2. Click "Send Money" button
3. Select: Employee → EMP-001
4. Amount: ₹5,000
5. Type: Reward
6. Upload screenshot & enter transaction ID
7. Submit → Money instantly credited
8. Employee sees ₹23,000 in wallet

### Scenario 4: Report Transaction Issue
1. Login as Employee
2. Go to "My Wallet" → "Transaction History"
3. Click "Report Transaction"
4. Enter transaction number: TXN-005
5. Select issue: "Amount not received"
6. Enter details & submit
7. Logout → Login as Accountant
8. Go to "Reported Issues" tab
9. Review report → Resolve & credit amount

---

## Quick Access URLs

- **Login**: `/`
- **Owner Dashboard**: `/dashboard`
- **Partner Dashboard**: `/partner/dashboard`
- **Store Dashboard**: `/store/dashboard`
- **Employee Dashboard**: `/employee/dashboard`
- **Employee Wallet**: `/employee/wallet`
- **Accountant Wallet Panel**: `/accountant/wallet`
- **Product Management**: `/products`
- **Offers Management**: `/offers`

---

## Security Notes

⚠️ **Important:**
- All credentials above are for **DEVELOPMENT/DEMO** purposes only
- Change default passwords in production
- Implement proper password hashing (bcrypt)
- Add 2FA for financial operations
- Set up proper session management
- Implement rate limiting for login attempts
- Add CAPTCHA for security
- Enable audit logging for all financial transactions

---

## Support

For system access issues or credential reset:
- Contact: support@sthiroot.com
- Admin Portal: Login as Owner and manage users
- Database: Check users table for user management

---

**System Version**: 1.0.0  
**Last Updated**: February 19, 2026  
**Documentation**: Complete login credentials for all user roles

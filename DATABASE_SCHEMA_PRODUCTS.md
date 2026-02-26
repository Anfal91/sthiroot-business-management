# Product Management System - Database Schema Documentation

## Overview
This document outlines the database schema for the Sthiroot Product Management System, which supports three types of products (Physical Products, Digital Courses, Events) and a Program system for creating product combos.

---

## Tables

### 1. Physical Products Table: `physical_products`

Stores comprehensive information about physical health and wellness products.

```sql
CREATE TABLE physical_products (
  id VARCHAR(50) PRIMARY KEY,                    -- Auto-generated: PRD-{timestamp}
  product_code VARCHAR(50) UNIQUE NOT NULL,      -- SKU/Product Code (e.g., WL-100)
  product_name VARCHAR(255) NOT NULL,
  
  -- Classification
  type ENUM('Product', 'Service', 'Program') NOT NULL,
  category ENUM('Wellness', 'Personal Care') NOT NULL,
  sub_category VARCHAR(100) NOT NULL,            -- Weight Loss, Diabetes, Skin Care, etc.
  brand_name VARCHAR(100) DEFAULT 'Meera Ayurveda',
  
  -- Manufacturer Details
  manufacturer_name VARCHAR(255),
  manufacturer_license VARCHAR(100),
  
  -- Product Status
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  launch_date DATE NOT NULL,
  
  -- Inventory
  stock_quantity INT DEFAULT 0,
  low_stock_alert_level INT DEFAULT 10,
  
  -- Product Details
  ingredients_count INT,
  ingredients_list TEXT,                          -- Full internal ingredient list
  fda_license VARCHAR(100),
  fssai_number VARCHAR(100),
  ayush_license VARCHAR(100),
  shelf_life_months INT,                          -- Shelf life in months
  min_order_quantity INT DEFAULT 1,
  
  -- Pricing (All amounts in INR)
  total_cost DECIMAL(10, 2),                      -- Manufacturing/procurement cost
  mrp DECIMAL(10, 2) NOT NULL,                    -- Maximum Retail Price
  pickup_centre_price DECIMAL(10, 2),             -- PP = 65% of MRP
  distributor_price DECIMAL(10, 2),               -- DP = 73% of MRP
  rp DECIMAL(10, 2),                              -- Reward Points = 41% of MRP
  tax_percent DECIMAL(5, 2),                      -- GST percentage
  tax_amount DECIMAL(10, 2),                      -- Calculated tax amount
  
  -- Media
  photos JSON,                                     -- Array of photo URLs (4-5 images)
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_product_code (product_code),
  INDEX idx_category (category),
  INDEX idx_status (status)
);
```

**Pricing Logic (Auto-calculated from MRP):**
- Pickup Centre Price (PP) = MRP × 0.65
- Distributor Price (DP) = MRP × 0.73
- RP (Reward Points) = MRP × 0.41
- Tax Amount = MRP × (tax_percent / 100)

---

### 2. Digital Courses Table: `digital_courses`

Stores information about digital educational courses and training programs.

```sql
CREATE TABLE digital_courses (
  id VARCHAR(50) PRIMARY KEY,                    -- Auto-generated: CRS-{timestamp}
  course_name VARCHAR(255) NOT NULL,
  course_description TEXT,
  course_thumbnail VARCHAR(500),                  -- Image URL (recommended: 1280x720)
  
  -- Course Content (can be expanded)
  duration_weeks INT,                             -- Course duration
  instructor_name VARCHAR(255),
  content_modules JSON,                           -- Array of module details
  
  -- Status
  status ENUM('Active', 'Inactive', 'Draft') DEFAULT 'Active',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_status (status)
);
```

---

### 3. Events Table: `events`

Stores information about physical events, workshops, and seminars.

```sql
CREATE TABLE events (
  id VARCHAR(50) PRIMARY KEY,                    -- Auto-generated: EVT-{timestamp}
  event_name VARCHAR(255) NOT NULL,
  event_description TEXT,
  location VARCHAR(500) NOT NULL,                 -- Full address/venue
  event_date DATE NOT NULL,
  
  -- Additional Details (expandable)
  event_time TIME,
  duration_days INT DEFAULT 1,
  max_capacity INT,
  registration_required BOOLEAN DEFAULT true,
  
  -- Status
  status ENUM('Upcoming', 'Ongoing', 'Completed', 'Cancelled') DEFAULT 'Upcoming',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_event_date (event_date),
  INDEX idx_status (status)
);
```

---

### 4. Programs (Product Combos) Table: `programs`

Stores bundled packages that combine physical products, digital courses, and events.

```sql
CREATE TABLE programs (
  id VARCHAR(50) PRIMARY KEY,                    -- Auto-generated: PGM-{timestamp}
  program_name VARCHAR(255) NOT NULL,
  program_description TEXT,
  
  -- Pricing
  combined_value DECIMAL(10, 2) NOT NULL,        -- Sum of all item values
  program_price DECIMAL(10, 2) NOT NULL,         -- Discounted selling price
  savings_amount DECIMAL(10, 2) GENERATED ALWAYS AS (combined_value - program_price) STORED,
  savings_percent DECIMAL(5, 2) GENERATED ALWAYS AS ((combined_value - program_price) / combined_value * 100) STORED,
  
  -- Metadata
  items_count INT NOT NULL,                       -- Total number of items in combo
  status ENUM('Active', 'Inactive', 'Draft') DEFAULT 'Active',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_status (status)
);
```

---

### 5. Program Items Junction Table: `program_items`

Links programs with their constituent products, courses, and events.

```sql
CREATE TABLE program_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  program_id VARCHAR(50) NOT NULL,
  item_type ENUM('physical_product', 'digital_course', 'event') NOT NULL,
  item_id VARCHAR(50) NOT NULL,                   -- ID from respective table
  
  -- Foreign keys
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  
  -- Unique constraint to prevent duplicates
  UNIQUE KEY unique_program_item (program_id, item_type, item_id),
  
  INDEX idx_program_id (program_id),
  INDEX idx_item_type (item_type)
);
```

**Note:** This junction table uses polymorphic relationships. The `item_id` can reference:
- `physical_products.id` when `item_type = 'physical_product'`
- `digital_courses.id` when `item_type = 'digital_course'`
- `events.id` when `item_type = 'event'`

---

## Sample Data

### Physical Product Example
```json
{
  "id": "PRD-001",
  "product_code": "WL-100",
  "product_name": "Weight Loss Premium Pack",
  "type": "Product",
  "category": "Wellness",
  "sub_category": "Weight Loss",
  "brand_name": "Meera Ayurveda",
  "status": "Active",
  "launch_date": "2025-06-15",
  "stock_quantity": 145,
  "low_stock_alert_level": 20,
  "ingredients_count": 83,
  "shelf_life_months": 24,
  "min_order_quantity": 1,
  "total_cost": 1500.00,
  "mrp": 5000.00,
  "pickup_centre_price": 3250.00,
  "distributor_price": 3650.00,
  "rp": 2050.00,
  "tax_percent": 18.00,
  "tax_amount": 900.00,
  "photos": [
    "https://example.com/product1.jpg",
    "https://example.com/product2.jpg"
  ]
}
```

### Digital Course Example
```json
{
  "id": "CRS-001",
  "course_name": "Healthy Living Masterclass",
  "course_description": "A comprehensive 8-week course covering nutrition, exercise, and mental wellness.",
  "course_thumbnail": "https://example.com/course-thumbnail.jpg",
  "status": "Active"
}
```

### Event Example
```json
{
  "id": "EVT-001",
  "event_name": "Health & Wellness Summit 2026",
  "location": "Mumbai Convention Center, Mumbai",
  "event_date": "2026-05-15",
  "status": "Upcoming"
}
```

### Program Example
```json
{
  "id": "PGM-001",
  "program_name": "Complete Wellness Package",
  "program_description": "All-inclusive wellness program with products, courses, and event access",
  "combined_value": 22000.00,
  "program_price": 18999.00,
  "items_count": 6,
  "status": "Active",
  "items": [
    {"item_type": "physical_product", "item_id": "PRD-001"},
    {"item_type": "physical_product", "item_id": "PRD-004"},
    {"item_type": "physical_product", "item_id": "PRD-005"},
    {"item_type": "digital_course", "item_id": "CRS-001"},
    {"item_type": "digital_course", "item_id": "CRS-004"},
    {"item_type": "event", "item_id": "EVT-001"}
  ]
}
```

---

## API Endpoints (Suggested)

### Physical Products
- `POST /api/products/physical` - Create physical product
- `GET /api/products/physical` - List all physical products
- `GET /api/products/physical/:id` - Get single physical product
- `PUT /api/products/physical/:id` - Update physical product
- `DELETE /api/products/physical/:id` - Delete physical product

### Digital Courses
- `POST /api/products/courses` - Create digital course
- `GET /api/products/courses` - List all courses
- `GET /api/products/courses/:id` - Get single course
- `PUT /api/products/courses/:id` - Update course
- `DELETE /api/products/courses/:id` - Delete course

### Events
- `POST /api/products/events` - Create event
- `GET /api/products/events` - List all events
- `GET /api/products/events/:id` - Get single event
- `PUT /api/products/events/:id` - Update event
- `DELETE /api/products/events/:id` - Delete event

### Programs (Combos)
- `POST /api/products/programs` - Create program
- `GET /api/products/programs` - List all programs
- `GET /api/products/programs/:id` - Get single program with all items
- `PUT /api/products/programs/:id` - Update program
- `DELETE /api/products/programs/:id` - Delete program

---

## Business Rules

### Physical Product Pricing
1. **Auto-calculation:** PP, DP, and RP are automatically calculated from MRP
2. **Tax calculation:** Tax amount is auto-calculated from MRP and tax percentage
3. **Stock alerts:** System should notify when stock falls below low_stock_alert_level

### Programs (Combos)
1. **Minimum items:** A program must have at least 1 item
2. **Pricing:** Program price should typically be less than combined_value (discount)
3. **Item validation:** All selected items must exist and be Active
4. **Auto-update:** If an item in a program becomes Inactive, notify admin

### General
1. **ID generation:** Use timestamp-based IDs for uniqueness
2. **Status management:** Inactive items should not appear in customer-facing interfaces
3. **Soft delete:** Consider implementing soft delete for data integrity

---

## Notes for Backend Implementation

1. **File Upload:** Implement file upload for product photos and course thumbnails
2. **Image Optimization:** Resize and optimize uploaded images
3. **Validation:** Validate pricing calculations on server-side
4. **Caching:** Cache product lists for better performance
5. **Search:** Implement full-text search for product names and descriptions
6. **Audit Trail:** Track changes to products for compliance

---

## Frontend Components

The following React components have been created:

1. **CreatePhysicalProduct.tsx** - Comprehensive form with all fields
2. **CreateDigitalCourse.tsx** - Simple form for courses
3. **CreateEvent.tsx** - Basic event creation form
4. **CreateProgram.tsx** - Combo builder with multi-select
5. **Products.tsx** - Main component with tabs for all product types

All components include form validation, auto-calculation logic, and success callbacks.

# Offer Management System - Database Schema Reference

This document provides a comprehensive database schema for implementing the Offer Management System in production.

## Overview

The offer management system allows business owners to create incentive programs for partners, employees, and stores based on various criteria such as matching RP, total orders, achievement levels, and tenure.

## Core Tables

### 1. `offers` Table

Stores the main offer/incentive configuration.

```sql
CREATE TABLE offers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  offer_for ENUM('partner', 'employee', 'store') NOT NULL,
  offer_on ENUM('matching_rp', 'total_orders', 'level', 'days_since_joining') NOT NULL,
  target_value DECIMAL(10, 2) NOT NULL,
  
  -- Reward configuration
  reward_type ENUM('cash', 'points', 'discount') NOT NULL,
  reward_value DECIMAL(10, 2) NOT NULL,
  reward_description VARCHAR(255) NOT NULL,
  
  -- Validity period
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Initial count flag (applicable only for orders and matching_rp)
  initial_count BOOLEAN DEFAULT FALSE,
  
  -- Status
  status ENUM('active', 'disabled', 'expired') DEFAULT 'active',
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_offer_for (offer_for),
  INDEX idx_status (status),
  INDEX idx_dates (start_date, end_date)
);
```

**Fields Explanation:**

- `offer_for`: Who the offer targets (partner, employee, or store)
- `offer_on`: What metric is being measured
  - `matching_rp`: Based on matching Reward Points
  - `total_orders`: Based on number of orders processed
  - `level`: Based on hierarchy level achieved
  - `days_since_joining`: Based on tenure/loyalty
- `target_value`: The goal value to achieve
- `initial_count`: When TRUE and applicable (orders/matching_rp only), baseline is set at offer start and only new activity counts
- `status`: Current state of the offer

### 2. `offer_progress` Table

Tracks individual progress towards offers.

```sql
CREATE TABLE offer_progress (
  id VARCHAR(50) PRIMARY KEY,
  offer_id VARCHAR(50) NOT NULL,
  user_id VARCHAR(50) NOT NULL, -- partner_id, employee_id, or store_id
  user_name VARCHAR(255) NOT NULL,
  user_type ENUM('partner', 'employee', 'store') NOT NULL,
  
  -- Progress tracking
  current_value DECIMAL(10, 2) DEFAULT 0,
  target_value DECIMAL(10, 2) NOT NULL,
  progress_percentage INT DEFAULT 0,
  
  -- Baseline for initial_count offers
  baseline_value DECIMAL(10, 2) DEFAULT NULL,
  
  -- Status
  status ENUM('not_started', 'in_progress', 'completed', 'expired') DEFAULT 'not_started',
  
  -- Timestamps
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  
  FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_offer (offer_id),
  INDEX idx_status (status),
  UNIQUE KEY unique_user_offer (offer_id, user_id)
);
```

**Fields Explanation:**

- `current_value`: Current achievement towards target
- `progress_percentage`: Calculated as (current_value / target_value) * 100
- `baseline_value`: For `initial_count=true` offers, stores the value at offer start time
  - Example: If user had 100 orders when offer started and initial_count=true, baseline=100
  - Only orders after the baseline count towards the offer
- `status`:
  - `not_started`: User hasn't begun working towards this offer
  - `in_progress`: Actively working towards target
  - `completed`: Target achieved
  - `expired`: Offer expired before completion

### 3. `offer_redemptions` Table

Records when rewards are claimed/distributed.

```sql
CREATE TABLE offer_redemptions (
  id VARCHAR(50) PRIMARY KEY,
  progress_id VARCHAR(50) NOT NULL,
  offer_id VARCHAR(50) NOT NULL,
  user_id VARCHAR(50) NOT NULL,
  
  -- Reward details
  reward_type ENUM('cash', 'points', 'discount') NOT NULL,
  reward_value DECIMAL(10, 2) NOT NULL,
  reward_description VARCHAR(255) NOT NULL,
  
  -- Redemption info
  redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  redeemed_by VARCHAR(50) NOT NULL, -- Admin who processed
  payment_reference VARCHAR(100),
  notes TEXT,
  
  FOREIGN KEY (progress_id) REFERENCES offer_progress(id) ON DELETE CASCADE,
  FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_offer (offer_id),
  INDEX idx_redeemed_at (redeemed_at)
);
```

## Supporting Views

### 1. Active Offers Summary View

```sql
CREATE VIEW active_offers_summary AS
SELECT 
  o.id,
  o.name,
  o.offer_for,
  o.offer_on,
  o.target_value,
  o.reward_description,
  COUNT(DISTINCT op.user_id) as total_participants,
  SUM(CASE WHEN op.status = 'completed' THEN 1 ELSE 0 END) as completed_count,
  SUM(CASE WHEN op.status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_count,
  ROUND(AVG(op.progress_percentage), 2) as avg_progress
FROM offers o
LEFT JOIN offer_progress op ON o.id = op.offer_id
WHERE o.status = 'active' 
  AND o.end_date >= CURDATE()
GROUP BY o.id;
```

### 2. User Offers Dashboard View

```sql
CREATE VIEW user_offers_dashboard AS
SELECT 
  op.user_id,
  op.user_type,
  o.id as offer_id,
  o.name as offer_name,
  o.description,
  o.offer_on,
  o.target_value,
  o.reward_description,
  o.start_date,
  o.end_date,
  o.status as offer_status,
  op.current_value,
  op.progress_percentage,
  op.status as progress_status,
  op.baseline_value,
  DATEDIFF(o.end_date, CURDATE()) as days_remaining
FROM offer_progress op
JOIN offers o ON op.offer_id = o.id
WHERE o.status = 'active' OR op.status IN ('completed', 'expired');
```

## Trigger Examples

### 1. Auto-calculate Progress Percentage

```sql
DELIMITER //
CREATE TRIGGER calculate_progress_percentage
BEFORE UPDATE ON offer_progress
FOR EACH ROW
BEGIN
  SET NEW.progress_percentage = LEAST(ROUND((NEW.current_value / NEW.target_value) * 100), 100);
  
  -- Auto-update status
  IF NEW.current_value >= NEW.target_value THEN
    SET NEW.status = 'completed';
    IF NEW.completed_at IS NULL THEN
      SET NEW.completed_at = CURRENT_TIMESTAMP;
    END IF;
  END IF;
END//
DELIMITER ;
```

### 2. Initialize Progress Record

```sql
DELIMITER //
CREATE TRIGGER initialize_offer_progress
AFTER INSERT ON offers
FOR EACH ROW
BEGIN
  -- For new offers, you might want to auto-create progress records
  -- for existing users based on offer_for type
  -- This is optional and depends on your business logic
  NULL;
END//
DELIMITER ;
```

## Stored Procedures

### 1. Update User Progress

```sql
DELIMITER //
CREATE PROCEDURE update_offer_progress(
  IN p_user_id VARCHAR(50),
  IN p_user_type VARCHAR(20),
  IN p_metric_type VARCHAR(50),
  IN p_new_value DECIMAL(10, 2)
)
BEGIN
  DECLARE v_offer_id VARCHAR(50);
  DECLARE v_initial_count BOOLEAN;
  DECLARE v_baseline DECIMAL(10, 2);
  DECLARE v_calculated_value DECIMAL(10, 2);
  DECLARE done INT DEFAULT FALSE;
  
  DECLARE offer_cursor CURSOR FOR
    SELECT id, initial_count
    FROM offers
    WHERE offer_for = p_user_type
      AND offer_on = p_metric_type
      AND status = 'active'
      AND start_date <= CURDATE()
      AND end_date >= CURDATE();
  
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
  
  OPEN offer_cursor;
  
  read_loop: LOOP
    FETCH offer_cursor INTO v_offer_id, v_initial_count;
    IF done THEN
      LEAVE read_loop;
    END IF;
    
    -- Get or create progress record
    INSERT INTO offer_progress (
      id,
      offer_id,
      user_id,
      user_type,
      current_value,
      target_value,
      baseline_value,
      status
    )
    SELECT 
      CONCAT('PROG-', UUID()),
      v_offer_id,
      p_user_id,
      p_user_type,
      0,
      target_value,
      CASE WHEN v_initial_count THEN p_new_value ELSE NULL END,
      'in_progress'
    FROM offers
    WHERE id = v_offer_id
    ON DUPLICATE KEY UPDATE
      current_value = p_new_value;
    
    -- Calculate actual progress considering baseline
    IF v_initial_count THEN
      SELECT baseline_value INTO v_baseline
      FROM offer_progress
      WHERE offer_id = v_offer_id AND user_id = p_user_id;
      
      SET v_calculated_value = GREATEST(0, p_new_value - IFNULL(v_baseline, 0));
    ELSE
      SET v_calculated_value = p_new_value;
    END IF;
    
    -- Update with calculated value
    UPDATE offer_progress
    SET current_value = v_calculated_value
    WHERE offer_id = v_offer_id AND user_id = p_user_id;
    
  END LOOP;
  
  CLOSE offer_cursor;
END//
DELIMITER ;
```

### 2. Expire Old Offers

```sql
DELIMITER //
CREATE PROCEDURE expire_old_offers()
BEGIN
  -- Update offer status
  UPDATE offers
  SET status = 'expired'
  WHERE end_date < CURDATE()
    AND status != 'expired';
  
  -- Update progress status for expired offers
  UPDATE offer_progress op
  JOIN offers o ON op.offer_id = o.id
  SET op.status = 'expired'
  WHERE o.status = 'expired'
    AND op.status = 'in_progress';
END//
DELIMITER ;
```

## Integration Points

### When to Update Progress

1. **Orders (`total_orders`)**:
   - Trigger: After order completion/confirmation
   - Update: Increment order count for user
   - Call: `update_offer_progress(user_id, user_type, 'total_orders', new_total)`

2. **Matching RP (`matching_rp`)**:
   - Trigger: After commission calculation
   - Update: Update matching RP total
   - Call: `update_offer_progress(user_id, user_type, 'matching_rp', new_matching_rp)`

3. **Level (`level`)**:
   - Trigger: When partner/employee level changes
   - Update: Update current level
   - Call: `update_offer_progress(user_id, user_type, 'level', new_level)`

4. **Days Since Joining (`days_since_joining`)**:
   - Trigger: Daily batch job or on-demand calculation
   - Update: Calculate days from join_date
   - Call: `update_offer_progress(user_id, user_type, 'days_since_joining', days_count)`

## Business Logic Rules

### Initial Count Behavior

```javascript
// Pseudo-code for initial count logic
function calculateProgressValue(offer, progress, newRawValue) {
  if (!offer.initial_count) {
    // Simple case: use raw value directly
    return newRawValue;
  }
  
  // Initial count is enabled
  if (progress.baseline_value === null) {
    // First time tracking - set baseline
    progress.baseline_value = newRawValue;
    return 0; // Start from 0
  }
  
  // Subtract baseline from new value
  return Math.max(0, newRawValue - progress.baseline_value);
}
```

### Completion and Reward Flow

1. User achieves target value
2. Progress status automatically set to `completed`
3. Notification sent to user and admin
4. Admin reviews and processes reward
5. Record created in `offer_redemptions`
6. Payment/points credited
7. User notified of reward distribution

## Sample Queries

### Get User's Active Offers with Progress

```sql
SELECT 
  o.name,
  o.description,
  o.reward_description,
  o.target_value,
  o.end_date,
  op.current_value,
  op.progress_percentage,
  op.status,
  DATEDIFF(o.end_date, CURDATE()) as days_left
FROM offers o
JOIN offer_progress op ON o.id = op.offer_id
WHERE op.user_id = ?
  AND o.status = 'active'
  AND op.status IN ('not_started', 'in_progress')
ORDER BY op.progress_percentage DESC;
```

### Get Leaderboard for Specific Offer

```sql
SELECT 
  op.user_id,
  op.user_name,
  op.current_value,
  op.progress_percentage,
  op.status,
  op.completed_at
FROM offer_progress op
WHERE op.offer_id = ?
ORDER BY 
  CASE WHEN op.status = 'completed' THEN 0 ELSE 1 END,
  op.progress_percentage DESC,
  op.completed_at ASC
LIMIT 50;
```

### Owner Dashboard Statistics

```sql
SELECT 
  COUNT(DISTINCT o.id) as total_offers,
  SUM(CASE WHEN o.status = 'active' THEN 1 ELSE 0 END) as active_offers,
  COUNT(DISTINCT op.user_id) as total_participants,
  SUM(CASE WHEN op.status = 'completed' THEN 1 ELSE 0 END) as total_completions,
  SUM(CASE WHEN op.status = 'completed' THEN o.reward_value ELSE 0 END) as total_rewards_owed
FROM offers o
LEFT JOIN offer_progress op ON o.id = op.offer_id
WHERE o.created_by = ?;
```

## Notes for Implementation

1. **Performance Considerations**:
   - Index all foreign keys
   - Consider partitioning `offer_progress` by date for large datasets
   - Cache active offers in Redis/memory

2. **Data Integrity**:
   - Use transactions when updating progress
   - Validate offer dates before insertion
   - Ensure baseline values are set correctly on first progress record

3. **Scheduled Jobs**:
   - Daily: Run `expire_old_offers()` procedure
   - Daily: Update `days_since_joining` progress for relevant offers
   - Real-time: Update order and RP-based offers on transaction events

4. **Frontend Data Requirements**:
   - Use views for dashboard queries
   - Cache user's active offers for quick access
   - Implement real-time updates via WebSocket for progress changes

5. **Testing Scenarios**:
   - Offer with initial_count enabled
   - Offer with initial_count disabled
   - Multiple simultaneous offers for same user
   - Offer expiration during active progress
   - Progress calculation accuracy

## Migration Strategy

1. Create tables in order: `offers` → `offer_progress` → `offer_redemptions`
2. Add indexes after initial data load for better performance
3. Create views and stored procedures
4. Set up scheduled jobs
5. Test with sample data before production deployment
6. Monitor query performance and optimize as needed

---

**Document Version:** 1.0  
**Last Updated:** February 17, 2026  
**Related Mock Data:** `/src/data/mockOfferData.ts`

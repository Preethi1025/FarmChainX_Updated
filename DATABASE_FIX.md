# Database Schema Fix

## Problem
The crops table has a `user_id` column that doesn't match the Crop model which uses `farmer_id`.

## Solution

Run these SQL commands in your MySQL database:

```sql
USE farmchainx;

-- Drop the old crops table
DROP TABLE IF EXISTS crops;

-- Create the new crops table with correct schema
CREATE TABLE crops (
    crop_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farmer_id VARCHAR(255) NOT NULL,
    batch_id VARCHAR(255) NOT NULL UNIQUE,
    crop_name VARCHAR(255) NOT NULL,
    price VARCHAR(255),
    quantity VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_farmer_id (farmer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verify the table structure
DESCRIBE crops;
```

## Steps to Execute

1. **Open MySQL Command Line or MySQL Workbench**
   - MySQL CLI: `mysql -u kavya -p farmchainx`
   - Enter password: `kavya126`

2. **Copy and paste the SQL commands above**

3. **Verify the table was created correctly**
   ```sql
   DESCRIBE crops;
   ```
   
   You should see these columns:
   - crop_id (BIGINT, AUTO_INCREMENT, PRIMARY KEY)
   - farmer_id (VARCHAR(255), NOT NULL)
   - batch_id (VARCHAR(255), NOT NULL, UNIQUE)
   - crop_name (VARCHAR(255), NOT NULL)
   - price (VARCHAR(255))
   - quantity (VARCHAR(255))
   - description (TEXT)
   - created_at (TIMESTAMP)

4. **Restart the backend server**
   ```bash
   cd c:\Users\KAVYA\Desktop\FarmChainX_Updated\backend
   .\mvnw spring-boot:run
   ```

5. **Test adding a crop**
   - Go to frontend, login as farmer
   - Add a new crop
   - Should work without errors

## If You Can't Access MySQL Directly

Alternative: Use Hibernate to auto-create the table

1. Stop the backend server
2. Open a terminal and run:
   ```bash
   cd c:\Users\KAVYA\Desktop\FarmChainX_Updated\backend
   .\mvnw clean spring-boot:run
   ```
   
Hibernate will automatically create the table on startup with the correct schema.

---

## Column Mapping

| Database Column | Java Field | Type | Notes |
|-----------------|-----------|------|-------|
| crop_id | cropId | BIGINT | Auto-increment primary key |
| farmer_id | farmerId | VARCHAR(255) | User ID (string) |
| batch_id | batchId | VARCHAR(255) | Unique batch identifier |
| crop_name | cropName | VARCHAR(255) | Crop name |
| price | price | VARCHAR(255) | Price per unit |
| quantity | quantity | VARCHAR(255) | Quantity available |
| description | description | TEXT | Crop description |
| created_at | createdAt | TIMESTAMP | Auto-set to current time |

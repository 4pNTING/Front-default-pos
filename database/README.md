# MMS PostgreSQL Database

## 📁 ไฟล์ในโฟลเดอร์นี้:

### **1. schema.sql**
- Schema ทั้งหมดของระบบ MMS
- รวม tables, indexes, triggers
- รองรับ PostgreSQL 12+

### **2. การ Import Database:**

```bash
# 1. สร้าง database
createdb mms_db

# 2. Import schema
psql -d mms_db -f schema.sql

# 3. Import mock data (ให้รัน INSERT statements จาก TypeScript services)
```

### **3. ERD Diagram:**

```
provinces → districts → villages
    ↓           ↓          ↓
    └─────── customers ────┘
                ↓
           leasing_contracts
                ↓
         leasing_rooms → rooms → floors
                              ↓
                         room_types
                         room_categories
                         room_statuses
```

### **4. Mock Data ที่มีอยู่:**

- ✅ **Provinces**: 3 รายการ (ນະຄອນຫຼວງວຽງຈັນ, ຈຳປາສັກ, ສະຫວັນນະເຂດ)
- ✅ **Districts**: 3 รายการ
- ✅ **Villages**: 3 รายການ
- ✅ **Customers**: 3 รายการ
- ✅ **Contacts**: 3 รายການ
- ✅ **Floors**: 3 ຊັ້ນ
- ✅ **Rooms**: 6 ຫ້ອງ
- ✅ **Leasing Contracts**: 4 ສັນຍາ
- ✅ **Payment Periods**: 4 ງວດ

### **5. การ Query ข้อมูล:**

```sql
-- ดู leasing พร้อม customer และ rooms
SELECT 
    lc.contract_number,
    lc.shop_name,
    c.first_name || ' ' || c.last_name AS customer_name,
    c.phone,
    COUNT(lr.id) AS room_count,
    lc.grand_total
FROM leasing_contracts lc
JOIN customers c ON c.id = lc.customer_id
LEFT JOIN leasing_rooms lr ON lr.leasing_contract_id = lc.id
GROUP BY lc.id, c.id;

-- ดูห้องว่าง
SELECT r.room_code, r.room_name, f.floor_name, rs.name AS status
FROM rooms r
JOIN floors f ON f.id = r.floor_id
JOIN room_statuses rs ON rs.id = r.room_status_id
WHERE rs.code = 'VACANT';
```

### **6. Connection String สำหรับ Node.js:**

```javascript
const connectionString = "postgresql://user:password@localhost:5432/mms_db";
```

---

**หมายเหตุ:** 
- ข้อมูล mock อยู่ใน TypeScript services แล้ว
- ใช้ schema.sql สำหรับสร้าง production database
- UUID เป็น primary key ทั้งหมด

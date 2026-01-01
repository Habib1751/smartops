# Backend Fix Required for Assignments Endpoint

## 🔴 Critical Issue

**Endpoint:** `GET /api/management/assignments`  
**Status:** 500 Internal Server Error  
**Error:** `{"error":"column e.event_name does not exist"}`

## 🔍 Root Cause

The backend SQL query is referencing a column `e.event_name` that doesn't exist in the events table. The column is likely named differently (e.g., `e.name`, `e.title`, or `e.event_title`).

## 🛠️ Fix Required in Backend

### Location
The backend Azure Function that handles `/api/management/assignments` needs to be updated.

### SQL Query Fix
Find the SQL query in the backend that looks similar to:
```sql
SELECT 
  a.*,
  t.name as technician_name,
  e.event_name,  -- ❌ This column doesn't exist
  v.name as venue_name
FROM assignments a
JOIN technicians t ON ...
JOIN events e ON ...
JOIN venues v ON ...
```

Change `e.event_name` to the correct column name (check your events table schema):
```sql
SELECT 
  a.*,
  t.name as technician_name,
  e.name as event_name,  -- ✅ Use correct column name
  v.name as venue_name
FROM assignments a
JOIN technicians t ON ...
JOIN events e ON ...
JOIN venues v ON ...
```

### Steps to Fix:

1. **Check Events Table Schema:**
   ```sql
   SELECT column_name 
   FROM information_schema.columns 
   WHERE table_name = 'events';
   ```

2. **Find the correct column name** (likely one of these):
   - `name`
   - `title`
   - `event_title`
   - `event_name` (if it exists without alias)

3. **Update the backend function:**
   - Locate: `/api/management/assignments` function
   - Fix the SQL query to use correct column name
   - Update the JOIN or SELECT clause

4. **Test the fix:**
   ```bash
   curl -X GET "https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net/api/management/assignments"
   ```

## ✅ Current Status

### Working Endpoints:
- ✅ `GET /api/management/technicians` - Returns 200 OK
- ✅ Frontend UI is 100% complete
- ✅ All API proxy routes created
- ✅ Assignment modal and components ready

### Not Working:
- ❌ `GET /api/management/assignments` - Returns 500 (SQL column error)
- ❌ Cannot create/update/delete assignments until backend is fixed
- ❌ Bulk operations won't work

## 📋 Test Command

After the backend is fixed, test with:

```powershell
# PowerShell
$headers = @{ 'Accept' = 'application/json' }
Invoke-WebRequest -Uri "https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net/api/management/assignments" -Headers $headers

# Expected Response: 200 OK with assignments data
```

## 🎯 Frontend Status

The frontend is **complete and ready**. Once the backend SQL is fixed:
1. Refresh the assignments page
2. All CRUD operations will work automatically
3. Bulk operations will function
4. Reports will be available

---

**Date:** December 30, 2025  
**Tested By:** Automated curl tests  
**Priority:** HIGH - Blocking assignment management feature

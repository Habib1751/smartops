# 🚨 Backend SQL Errors - Assignment Management Endpoints

## Summary

The backend has SQL errors on **GET by ID** and **PATCH (update)** endpoints for assignments. The GET list and DELETE endpoints work correctly.

---

## ✅ Working Endpoints

### 1. GET /api/management/assignments (LIST)
**Status**: ✅ **WORKING**
```bash
GET https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net/api/management/assignments?page=1&per_page=10
```
**Response**: 200 OK - Returns list of assignments with pagination

### 2. DELETE /api/management/assignments/:id
**Status**: ✅ **WORKING**
```bash
DELETE https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net/api/management/assignments/{id}
```
**Response**: 
- 200 OK - Assignment deleted
- 404 - Assignment not found

---

## ❌ Broken Endpoints

### 1. GET /api/management/assignments/:id (Single)
**Status**: ❌ **SQL ERROR**

**Request**:
```bash
GET https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net/api/management/assignments/a7c4e967-2b1c-4671-8a8d-6afff4eaff0c
```

**Error Response**:
```json
{
  "error": "column e.event_name does not exist"
}
```

**HTTP Status**: 500 Internal Server Error

---

### 2. PATCH /api/management/assignments/:id (Update)
**Status**: ❌ **SQL ERROR**

**Request**:
```bash
PATCH https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net/api/management/assignments/a7c4e967-2b1c-4671-8a8d-6afff4eaff0c

Body:
{
  "role_for_event": "Updated Role",
  "agreed_rate": 150
}
```

**Error Response**:
```json
{
  "error": "column e.event_name does not exist"
}
```

**HTTP Status**: 500 Internal Server Error

---

## 🔍 Root Cause

The SQL queries in the GET by ID and PATCH endpoints are likely using:
```sql
SELECT e.event_name FROM events e ...
```

But the actual column name is:
```sql
SELECT e.name FROM events e ...
```

**This is the same error that was fixed in the LIST endpoint.**

---

## 🛠️ Backend Fix Required

### Files to Check (Azure Functions)

Look for these endpoint handlers in your backend code:

1. **GET /api/management/assignments/:id**
   - File: Likely `assignments/[id].js` or `assignments.js`
   - Function: Handler for GET by ID

2. **PATCH /api/management/assignments/:id**
   - File: Same as above
   - Function: Handler for PATCH/UPDATE

### SQL Query Fix

**Find queries like**:
```sql
SELECT 
  a.*,
  t.name as technician_name,
  e.event_name,        -- ❌ WRONG
  v.venue_name,        -- ❌ Might be wrong too
  ...
FROM technician_assignments a
JOIN technicians t ON ...
JOIN events e ON ...
LEFT JOIN venues v ON ...
WHERE a.assignment_id = $1
```

**Change to**:
```sql
SELECT 
  a.*,
  t.name as technician_name,
  e.name as event_name,       -- ✅ CORRECT
  v.name as venue_name,       -- ✅ CORRECT (if applicable)
  ...
FROM technician_assignments a
JOIN technicians t ON t.technician_id = a.technician_id
JOIN events e ON e.event_id = a.event_id
LEFT JOIN venues v ON v.venue_id = e.venue_id
WHERE a.assignment_id = $1
```

### Test After Fix

```bash
# Test GET by ID
curl -X GET "https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net/api/management/assignments/a7c4e967-2b1c-4671-8a8d-6afff4eaff0c"

# Test PATCH
curl -X PATCH "https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net/api/management/assignments/a7c4e967-2b1c-4671-8a8d-6afff4eaff0c" \
  -H "Content-Type: application/json" \
  -d '{"role_for_event": "Test Update", "agreed_rate": 150}'
```

Expected: Both should return 200 OK with assignment data

---

## 🎯 Impact on Frontend

### Current Workaround
The frontend has been updated to work around these backend issues:

1. **Edit Operation**: 
   - ❌ Cannot use single GET to fetch assignment details
   - ✅ Uses data from list view (already loaded)
   - ✅ Edit modal populated from cached list data

2. **Update Operation**:
   - ❌ Backend UPDATE endpoint returns 500
   - ✅ Frontend shows user-friendly error message
   - ⚠️ User cannot update assignments until backend fixed

3. **Delete Operation**:
   - ✅ Fully working (backend endpoint OK)

### What Works Without Backend Fix
- ✅ View assignments list
- ✅ Search and filter assignments
- ✅ View statistics dashboard
- ✅ Delete assignments
- ✅ Open edit modal (uses cached data)

### What Doesn't Work
- ❌ Save edited assignments (PATCH fails)
- ❌ Refresh single assignment data (GET by ID fails)
- ❌ Create new assignments (untested, might work)

---

## 📋 Testing Checklist for Backend Team

After applying the SQL fix:

- [ ] Test GET /api/management/assignments (list) - Should still work
- [ ] Test GET /api/management/assignments/:id - Should return 200 with full assignment data
- [ ] Test PATCH /api/management/assignments/:id - Should return 200 with updated assignment
- [ ] Test DELETE /api/management/assignments/:id - Should still work
- [ ] Verify all JOINs include proper table aliases
- [ ] Verify column names match actual database schema
- [ ] Check for similar errors in other assignment endpoints:
  - [ ] POST /api/management/assignments (create)
  - [ ] GET /api/management/events/:id/assignments
  - [ ] Bulk operations endpoints

---

## 🔄 Frontend Update Plan

Once backend is fixed:

1. Remove workaround code
2. Re-enable direct GET by ID calls
3. Test full CRUD cycle:
   - Create → Read → Update → Delete
4. Test bulk operations
5. Update ASSIGNMENTS_QUICK_GUIDE.md to remove limitations

---

## 📞 Contact

**Tested by**: Frontend Team  
**Date**: December 30, 2025  
**Backend URL**: https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net  
**Test Assignment ID**: a7c4e967-2b1c-4671-8a8d-6afff4eaff0c

---

## ⚡ Priority: HIGH

**UPDATE and GET by ID are critical operations. Users cannot edit assignments until this is fixed.**

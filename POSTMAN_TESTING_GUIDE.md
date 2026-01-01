# 🔥 Postman Testing Guide - Broken Assignment Endpoints

## Setup Environment Variables

First, create a Postman Environment with these variables:

1. Click "Environments" in Postman
2. Create new environment: "SmartOps Backend"
3. Add these variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net` | (same) |
| `assignment_id` | `d8672bb7-3ceb-4821-af7c-ef15025df355` | (will update after tests) |
| `event_id` | `4f98b29d-d3c1-4a23-84ec-9b00a041f23a` | (will update) |
| `technician_id` | `63107dca-0073-4976-95b9-305d684b3d89` | (will update) |

---

## 🔴 Test 1: POST /api/management/assignments (CREATE) - BROKEN

### Step 1: Get Valid IDs First
Before creating, you need valid event_id and technician_id.

**Request to get IDs:**
```
Method: GET
URL: {{base_url}}/api/management/assignments?per_page=1
```

**Copy from response:**
- `data[0].event_id` → Save to `event_id` variable
- `data[0].technician_id` → Save to `technician_id` variable

### Step 2: Test CREATE Endpoint

**Request:**
```
Method: POST
URL: {{base_url}}/api/management/assignments
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "event_id": "{{event_id}}",
  "technician_id": "{{technician_id}}",
  "role_for_event": "Test Audio Technician",
  "call_time": "09:00:00",
  "estimated_finish_time": "18:00:00",
  "agreed_rate": 400.00,
  "notes": "Test assignment from Postman"
}
```

**Expected Result:**
```json
✅ SUCCESS (if backend fixed):
{
  "message": "Assignment created successfully",
  "data": {
    "assignment_id": "new-uuid-here",
    "event_id": "...",
    "technician_id": "...",
    ...
  }
}

❌ CURRENT ERROR (backend broken):
Status: 500 Internal Server Error
{
  "error": "column e.event_name does not exist"
}
```

---

## 🔴 Test 2: GET /api/management/assignments/:id - BROKEN

### Step 1: Get Assignment ID

**Request:**
```
Method: GET
URL: {{base_url}}/api/management/assignments?per_page=1
```

**Copy `data[0].assignment_id`** and save to `assignment_id` variable.

### Step 2: Test GET Single

**Request:**
```
Method: GET
URL: {{base_url}}/api/management/assignments/{{assignment_id}}
```

**Headers:** (none needed)

**Expected Result:**
```json
✅ SUCCESS (if backend fixed):
{
  "assignment_id": "d8672bb7-3ceb-4821-af7c-ef15025df355",
  "event_id": "...",
  "technician_id": "...",
  "technician_name": "Michael Peretz TEST",
  "event_name": "Some Event",
  "venue_name": "Some Venue",
  "role_for_event": "Lead Operator",
  "call_time": "08:00:00",
  "agreed_rate": 400.00,
  ...
}

❌ CURRENT ERROR (backend broken):
Status: 500 Internal Server Error
{
  "error": "column e.event_name does not exist"
}
```

---

## 🔴 Test 3: PATCH /api/management/assignments/:id - BROKEN

### Request:
```
Method: PATCH
URL: {{base_url}}/api/management/assignments/{{assignment_id}}
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "role_for_event": "Updated Role via Postman",
  "agreed_rate": 450.00,
  "total_hours_worked": 10,
  "notes": "Updated from Postman test"
}
```

**Expected Result:**
```json
✅ SUCCESS (if backend fixed):
{
  "message": "Assignment updated successfully",
  "data": {
    "assignment_id": "d8672bb7-3ceb-4821-af7c-ef15025df355",
    "role_for_event": "Updated Role via Postman",
    "agreed_rate": 450.00,
    ...
  }
}

❌ CURRENT ERROR (backend broken):
Status: 500 Internal Server Error
{
  "error": "column e.event_name does not exist"
}
```

---

## 🔴 Test 4: GET /api/management/events/:id/assignments - BROKEN

### Request:
```
Method: GET
URL: {{base_url}}/api/management/events/{{event_id}}/assignments
```

**Headers:** (none needed)

**Expected Result:**
```json
✅ SUCCESS (if backend fixed):
{
  "event": {
    "event_id": "4f98b29d-d3c1-4a23-84ec-9b00a041f23a",
    "event_name": "Concert Event",
    "event_date": "2024-12-15",
    "venue_name": "Main Arena"
  },
  "assignments": [
    {
      "assignment_id": "...",
      "technician_name": "John Doe",
      "role_for_event": "Lead Operator",
      ...
    }
  ],
  "total_crew": 5
}

❌ CURRENT ERROR (backend broken):
Status: 500 Internal Server Error
{
  "error": "column \"event_name\" does not exist"
}
```

---

## ✅ Bonus: Test Working Endpoints

### Test 5: GET List (WORKING)
```
Method: GET
URL: {{base_url}}/api/management/assignments?page=1&per_page=10
```
**Expected:** Status 200, returns list with pagination

### Test 6: DELETE (WORKING)
```
Method: DELETE
URL: {{base_url}}/api/management/assignments/{{assignment_id}}
```
**Expected:** Status 200 or 204

⚠️ **WARNING:** This will delete the assignment! Use with caution.

### Test 7: Bulk Send Invitations (WORKING)
```
Method: POST
URL: {{base_url}}/api/management/assignments/bulk/send-invitations
```
**Body:**
```json
{
  "assignment_ids": [
    "{{assignment_id}}"
  ]
}
```
**Expected:** Status 200, `sent_count: 1`

### Test 8: Bulk Update Payment (WORKING)
```
Method: POST
URL: {{base_url}}/api/management/assignments/bulk/update-payment
```
**Body:**
```json
{
  "assignment_ids": [
    "{{assignment_id}}"
  ],
  "payment_status": "approved",
  "payment_date": "2025-01-15"
}
```
**Expected:** Status 200, `updated_count: 1`

---

## 📋 Quick Test Checklist

Use this checklist when testing:

- [ ] Setup environment with `base_url` variable
- [ ] Get valid IDs from list endpoint
- [ ] Save `assignment_id`, `event_id`, `technician_id` to variables
- [ ] Test POST create → Should get 500 error ❌
- [ ] Test GET single → Should get 500 error ❌
- [ ] Test PATCH update → Should get 500 error ❌
- [ ] Test GET event assignments → Should get 500 error ❌
- [ ] Test GET list → Should work ✅
- [ ] Test DELETE → Should work ✅
- [ ] Take screenshots of errors
- [ ] Share error responses with backend team

---

## 🎯 What to Tell Backend Team

After testing, send them this:

**All 4 endpoints return same SQL error:**
```
{"error":"column e.event_name does not exist"}
```

**Affected endpoints:**
1. POST /api/management/assignments
2. GET /api/management/assignments/:id
3. PATCH /api/management/assignments/:id
4. GET /api/management/events/:id/assignments

**Root cause:** SQL queries use `e.event_name` and `v.venue_name` but actual columns are `e.name` and `v.name`.

**Fix needed:** Change SQL in Azure Functions to use:
```sql
SELECT e.name AS event_name, v.name AS venue_name
```

---

## 📸 Evidence Collection

For each broken endpoint, capture:
1. Request URL
2. Request body (if POST/PATCH)
3. Response status code (500)
4. Error message
5. Timestamp

This proves the issue to backend team.

---

**Last Updated:** December 31, 2025  
**Tested By:** Frontend Team  
**Backend Status:** NEEDS FIX ❌

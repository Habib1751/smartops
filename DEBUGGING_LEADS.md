# Debugging: Why Leads Don't Show

## Quick Checklist

### 1. Start Dev Server
```powershell
# Stop all node processes first
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Remove locks
Remove-Item -Path ".next\dev" -Recurse -Force -ErrorAction SilentlyContinue

# Start dev
npm run dev
```

### 2. Open Test Page
Go to: `http://localhost:3000/test-api`

Click both buttons:
- **Test Direct Fetch** - Tests raw connection to external API
- **Test fetchLeads()** - Tests using app's helper function

### 3. Check Browser Console (F12)
You should see logs like:
```
🔗 Building API URL: { base: "https://...", endpoint: "/api/leads", fullUrl: "https://.../api/leads" }
🌐 Fetching from: https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net/api/leads
📡 Response status: 200 OK
📦 Response data: { data: [...], meta: {...} }
📞 fetchLeads called with endpoint: /api/leads
📥 fetchLeads raw response: { data: [...], meta: {...} }
✅ fetchLeads returning: 1 items
```

### 4. Go to Leads Page
Navigate to: `http://localhost:3000/dashboard/leads`

Check console for:
```
🔍 Fetching leads with params: {}
🔗 Building API URL: ...
🌐 Fetching from: ...
📡 Response status: 200 OK
📦 Response data: ...
🔄 Mapping lead: { original: {...}, mapped: {...} }
✅ Mapped leads data: [...]
```

## Common Issues & Fixes

### Issue 1: "NEXT_PUBLIC_API_BASE_URL not set" warning
**Fix:** Check `.env.local` file has:
```env
NEXT_PUBLIC_API_BASE_URL=https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net
```

### Issue 2: CORS Error
```
Access to fetch at 'https://...' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Fix:** The external API needs to allow requests from `http://localhost:3000`

Add these headers on the external API:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Issue 3: Empty Array Returned
```
✅ fetchLeads returning: 0 items
```
**Possible causes:**
- External API has no leads data yet
- API is filtering out data
- Wrong endpoint URL

**Fix:** Test with curl:
```powershell
curl.exe -X GET "https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net/api/leads"
```

### Issue 4: Network Error
```
TypeError: Failed to fetch
```
**Possible causes:**
- External API is down
- Wrong URL in `.env.local`
- Network/firewall blocking request

**Fix:**
1. Verify external API is running
2. Check URL is correct (no trailing slash)
3. Test from command line with curl

### Issue 5: Data Exists But UI Shows "No leads found"
**Possible causes:**
- Data structure doesn't match expected format
- Mapping function not working
- Filter logic excluding results

**Fix:** Check console for mapped data structure:
```
🔄 Mapping lead: { original: {...}, mapped: {...} }
```

Verify `mapped` object has all required fields:
- `id`
- `name` or `phone`
- `status`
- `priority`

## Expected API Response Format

Your external API should return:
```json
{
  "data": [
    {
      "lead_id": "uuid",
      "phone": "+923244569838",
      "lead_status": "new",
      "lead_source": "whatsapp",
      "priority_level": "normal",
      "message_count": "0",
      "created_at": "2025-11-26T15:08:18.601Z",
      "updated_at": "2025-11-26T15:08:18.601Z"
    }
  ],
  "meta": {
    "limit": 50,
    "offset": 0,
    "returned": 1,
    "hasMore": false
  }
}
```

## Field Mapping Reference

| External API Field | UI Field | Fallback Value |
|--------------------|----------|----------------|
| `lead_id` | `id` | Required |
| `phone` | `name` (if no name), `phone` | "Unknown Customer" |
| `lead_status` | `status` | "new" |
| `lead_source` | `source` | "unknown" |
| `priority_level` | `priority` | "normal" |
| `message_count` | Badge on Messages button | "0" |
| `created_at` | `createdAt` | Current time |
| `updated_at` | `updatedAt` | Current time |

Fields not in API response show as "N/A" or "Not specified".

## Still Not Working?

1. Share the console output (all logs starting with 🔗🌐📡📦🔄✅❌)
2. Share the response from test-api page
3. Share any error messages

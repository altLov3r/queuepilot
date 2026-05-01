# QueuePilot Testing Guide

## Overview
This guide provides step-by-step instructions to test all features of QueuePilot after the crash fix implementation.

## Prerequisites
- Backend running on http://localhost:3001
- Frontend running on http://localhost:5174
- Browser with DevTools (F12) available

## Test Environment Setup

### 1. Start Backend
```bash
cd server
node src/server.js
```
Expected output: `Server running on port 3001`

### 2. Start Frontend
```bash
cd client
npm run dev
```
Expected output: `Local: http://localhost:5174/`

### 3. Open Browser
Navigate to: http://localhost:5174/

---

## Critical Tests (Must Pass)

### Test 1: Landing Page
**Steps:**
1. Open http://localhost:5174/
2. Verify "QueuePilot" title is visible
3. Verify "Try Demo" button is visible
4. Click "Try Demo"

**Expected Result:**
- ✅ Redirects to ticket input screen
- ✅ No console errors

---

### Test 2: Load "Normal Day" Scenario
**Steps:**
1. On ticket input screen, select "Normal Day" from dropdown
2. Click "Load Demo Tickets"
3. Verify tickets appear in textarea
4. Click "Analyze Tickets"
5. Wait for analysis to complete

**Expected Result:**
- ✅ Dashboard loads without crash
- ✅ Tickets display in cards
- ✅ Summary panel shows metrics
- ✅ Support Health Score displays
- ✅ Charts render (Priority, Risk, Team Workload)
- ✅ No blank white screen
- ✅ No console errors

**Check Console (F12):**
- Should see: "Analysis result:", followed by data object
- Should NOT see: "Cannot read properties of undefined"

---

### Test 3: Load "Crisis Mode" Scenario
**Steps:**
1. Click "Back to Input" button
2. Select "Crisis Mode" from dropdown
3. Click "Load Demo Tickets"
4. Click "Analyze Tickets"

**Expected Result:**
- ✅ Dashboard loads without crash
- ✅ High urgency tickets appear first
- ✅ Support Health Score is low (red)
- ✅ Multiple "HIGH" urgency badges visible
- ✅ Charts show crisis distribution
- ✅ No console errors

---

### Test 4: Load "Smooth Operations" Scenario
**Steps:**
1. Click "Back to Input"
2. Select "Smooth Operations"
3. Click "Load Demo Tickets"
4. Click "Analyze Tickets"

**Expected Result:**
- ✅ Dashboard loads without crash
- ✅ Support Health Score is high (green)
- ✅ Mostly "LOW" urgency badges
- ✅ Positive sentiment indicators
- ✅ No console errors

---

### Test 5: Load "Delivery Crisis" Scenario
**Steps:**
1. Click "Back to Input"
2. Select "Delivery Crisis"
3. Click "Load Demo Tickets"
4. Click "Analyze Tickets"

**Expected Result:**
- ✅ Dashboard loads without crash
- ✅ Many "delivery" category badges
- ✅ High urgency tickets present
- ✅ Logistics team has high workload
- ✅ No console errors

---

### Test 6: Load "Billing Complaints" Scenario
**Steps:**
1. Click "Back to Input"
2. Select "Billing Complaints"
3. Click "Load Demo Tickets"
4. Click "Analyze Tickets"

**Expected Result:**
- ✅ Dashboard loads without crash
- ✅ Many "billing" category badges
- ✅ Finance team has high workload
- ✅ Negative sentiment indicators
- ✅ No console errors

---

## Status Tracking Tests

### Test 7: Mark Ticket as Reviewed
**Steps:**
1. Analyze any scenario
2. Find a ticket with status "OPEN"
3. Click "Mark as Reviewed" button
4. Observe status change

**Expected Result:**
- ✅ Status badge changes to "REVIEWED" (blue)
- ✅ "Reviewed" timestamp appears
- ✅ Button changes to "Mark as Completed"
- ✅ Summary updates (reviewed count increases)
- ✅ No console errors

---

### Test 8: Mark Ticket as Completed
**Steps:**
1. Find a ticket with status "REVIEWED"
2. Click "Mark as Completed" button
3. Observe status change

**Expected Result:**
- ✅ Status badge changes to "COMPLETED" (green)
- ✅ "Completed" timestamp appears
- ✅ Button changes to "Reopen Ticket"
- ✅ Summary updates (completed count increases)
- ✅ No console errors

---

### Test 9: Reopen Ticket
**Steps:**
1. Find a ticket with status "COMPLETED"
2. Click "Reopen Ticket" button
3. Observe status change

**Expected Result:**
- ✅ Status badge changes back to "OPEN" (yellow)
- ✅ Timestamps remain visible
- ✅ Button changes to "Mark as Reviewed"
- ✅ Summary updates
- ✅ No console errors

---

## Search and Filter Tests

### Test 10: Search Tickets
**Steps:**
1. Analyze any scenario with multiple tickets
2. In search box, type "order"
3. Observe filtered results

**Expected Result:**
- ✅ Only tickets containing "order" are shown
- ✅ Other tickets are hidden
- ✅ Summary updates to reflect filtered tickets
- ✅ No console errors

---

### Test 11: Filter by Urgency
**Steps:**
1. Clear search box
2. Click "HIGH" urgency filter button
3. Observe filtered results

**Expected Result:**
- ✅ Only high urgency tickets shown
- ✅ Filter button is highlighted
- ✅ Summary reflects filtered data
- ✅ Click again to deselect
- ✅ No console errors

---

### Test 12: Filter by Category
**Steps:**
1. Clear all filters
2. Click "delivery" category filter
3. Observe filtered results

**Expected Result:**
- ✅ Only delivery tickets shown
- ✅ Filter button is highlighted
- ✅ Summary reflects filtered data
- ✅ No console errors

---

### Test 13: Sort by Priority
**Steps:**
1. Clear all filters
2. Click "Sort by: Priority" dropdown
3. Select "Priority"

**Expected Result:**
- ✅ Tickets reorder by priority score (highest first)
- ✅ Highest priority scores at top
- ✅ No console errors

---

### Test 14: Sort by Urgency
**Steps:**
1. Click "Sort by: Priority" dropdown
2. Select "Urgency"

**Expected Result:**
- ✅ Tickets reorder: HIGH → MEDIUM → LOW
- ✅ High urgency tickets at top
- ✅ No console errors

---

## Export Tests

### Test 15: Export JSON
**Steps:**
1. Analyze any scenario
2. Click "Export JSON" button
3. Check downloaded file

**Expected Result:**
- ✅ File downloads: `queuepilot-analysis-[timestamp].json`
- ✅ File contains all ticket data
- ✅ File contains summary data
- ✅ JSON is valid (can be opened in text editor)
- ✅ No console errors

---

### Test 16: Export CSV
**Steps:**
1. Click "Export CSV" button
2. Check downloaded file

**Expected Result:**
- ✅ File downloads: `queuepilot-analysis-[timestamp].csv`
- ✅ File contains 19 columns (including Status, Reviewed, Completed, etc.)
- ✅ CSV is valid (can be opened in Excel/Sheets)
- ✅ All ticket data is present
- ✅ No console errors

**CSV Columns to Verify:**
1. ID
2. Message
3. Category
4. Urgency
5. Sentiment
6. Priority Score
7. Customer Risk
8. SLA Recommendation
9. Assigned Team
10. Escalation Path
11. Suggested Reply
12. Internal Action
13. Estimated Resolution Time
14. Status
15. Reviewed
16. Completed
17. Reviewed At
18. Completed At
19. Tags

---

## Edge Case Tests

### Test 17: Empty Ticket List
**Steps:**
1. Click "Back to Input"
2. Clear textarea (delete all text)
3. Click "Analyze Tickets"

**Expected Result:**
- ✅ Shows error message or empty state
- ✅ Does NOT crash
- ✅ No blank white screen
- ✅ No console errors

---

### Test 18: Single Ticket
**Steps:**
1. Click "Back to Input"
2. Enter single ticket: "My order is late"
3. Click "Analyze Tickets"

**Expected Result:**
- ✅ Dashboard loads with 1 ticket
- ✅ Summary shows total: 1
- ✅ Charts render (may be minimal)
- ✅ No console errors

---

### Test 19: Rapid Scenario Switching
**Steps:**
1. Click "Back to Input"
2. Select "Normal Day", click "Load Demo Tickets", click "Analyze"
3. Immediately click "Back to Input"
4. Select "Crisis Mode", click "Load Demo Tickets", click "Analyze"
5. Repeat 3-4 times rapidly

**Expected Result:**
- ✅ App handles rapid switching
- ✅ No crashes
- ✅ Latest scenario displays correctly
- ✅ No console errors

---

### Test 20: Refresh During Analysis
**Steps:**
1. Click "Back to Input"
2. Load any scenario
3. Click "Analyze Tickets"
4. Immediately press F5 (refresh page)

**Expected Result:**
- ✅ Page reloads to landing page
- ✅ No crash
- ✅ Can start over normally
- ✅ No console errors

---

## Error Boundary Test

### Test 21: Verify Error Boundary Works
**Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. If app crashes for any reason, observe error boundary

**Expected Result:**
- ✅ If crash occurs, see friendly error page (not blank screen)
- ✅ Error page shows "Something Went Wrong"
- ✅ Error details are displayed
- ✅ "Reload Application" button is present
- ✅ Can click reload to recover

---

## Console Error Check

### Test 22: No Console Errors
**Steps:**
1. Open DevTools (F12)
2. Go to Console tab
3. Perform all tests above
4. Check for errors

**Expected Result:**
- ✅ No red error messages
- ✅ No "Cannot read properties of undefined"
- ✅ No "TypeError" messages
- ✅ Only info/log messages (blue/gray)

**Acceptable Console Messages:**
- ✅ "Analysis result:" (info)
- ✅ "Tickets updated:" (info)
- ✅ Vite HMR messages (info)

**Unacceptable Console Messages:**
- ❌ "Cannot read properties of undefined"
- ❌ "TypeError"
- ❌ "ReferenceError"
- ❌ Any red error messages

---

## Performance Tests

### Test 23: Large Dataset (50+ Tickets)
**Steps:**
1. Load "Crisis Mode" (15 tickets)
2. Verify smooth performance
3. Check dashboard responsiveness

**Expected Result:**
- ✅ Dashboard loads in < 2 seconds
- ✅ Scrolling is smooth
- ✅ Filters apply instantly
- ✅ No lag or freezing

---

## Visual Tests

### Test 24: UI Elements Display Correctly
**Steps:**
1. Analyze any scenario
2. Verify all UI elements are visible and styled

**Expected Result:**
- ✅ Badges have correct colors (urgency, category, sentiment, status)
- ✅ Charts render with colors
- ✅ Support Health Score has correct color (red/yellow/green)
- ✅ Buttons are styled and clickable
- ✅ Cards have shadows and borders
- ✅ Text is readable
- ✅ No layout issues

---

## Final Checklist

### All Tests Must Pass:
- [ ] Test 1: Landing Page
- [ ] Test 2: Normal Day Scenario
- [ ] Test 3: Crisis Mode Scenario
- [ ] Test 4: Smooth Operations Scenario
- [ ] Test 5: Delivery Crisis Scenario
- [ ] Test 6: Billing Complaints Scenario
- [ ] Test 7: Mark as Reviewed
- [ ] Test 8: Mark as Completed
- [ ] Test 9: Reopen Ticket
- [ ] Test 10: Search Tickets
- [ ] Test 11: Filter by Urgency
- [ ] Test 12: Filter by Category
- [ ] Test 13: Sort by Priority
- [ ] Test 14: Sort by Urgency
- [ ] Test 15: Export JSON
- [ ] Test 16: Export CSV
- [ ] Test 17: Empty Ticket List
- [ ] Test 18: Single Ticket
- [ ] Test 19: Rapid Scenario Switching
- [ ] Test 20: Refresh During Analysis
- [ ] Test 21: Error Boundary
- [ ] Test 22: No Console Errors
- [ ] Test 23: Large Dataset Performance
- [ ] Test 24: UI Elements Display

---

## If Tests Fail

### Debugging Steps:
1. **Check Console (F12)** - Look for specific error messages
2. **Check Network Tab** - Verify API calls succeed (200 status)
3. **Check Backend Logs** - Look for server errors
4. **Verify Backend Running** - http://localhost:3001/api/health should return OK
5. **Clear Browser Cache** - Hard refresh (Ctrl+Shift+R)
6. **Restart Both Servers** - Stop and restart backend and frontend

### Common Issues:
- **Blank white screen** → Check if ErrorBoundary is working, check console
- **API errors** → Verify backend is running on port 3001
- **Charts not rendering** → Check if data exists, verify conditional rendering
- **Status not updating** → Check backend ticketStore, verify API endpoints

---

## Success Criteria

✅ **All 24 tests pass**
✅ **No console errors**
✅ **No crashes or blank screens**
✅ **All 5 scenarios work**
✅ **Status tracking works**
✅ **Export functions work**
✅ **Search and filters work**
✅ **UI displays correctly**

---

## Test Results Template

```
QueuePilot Test Results
Date: [DATE]
Tester: [NAME]

Critical Tests:
[ ] Test 1-6: All scenarios load without crash
[ ] Test 7-9: Status tracking works
[ ] Test 10-14: Search/filter/sort works
[ ] Test 15-16: Export works
[ ] Test 17-20: Edge cases handled
[ ] Test 21: Error boundary works
[ ] Test 22: No console errors
[ ] Test 23-24: Performance and UI

Overall Status: PASS / FAIL
Notes: [Any issues or observations]
```

---

*Testing Guide Created by IBM Bob*
*Last Updated: 2026-05-01*
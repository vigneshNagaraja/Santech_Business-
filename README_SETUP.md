
Santech Business Solution — Timesheet (FINAL Package)
====================================================
This is the one zip to use. Upload exactly these files to your GitHub repo root.

INCLUDED
- index.html (branded PWA with mobile fixes, SMS fallback)
- manifest.json
- service-worker.js
- icons/ (192, 512, logo.png)
- apps_script.gs  (Google backend for email + approvals)
- README_SETUP.md (this file)

STEP 1 — GitHub Pages
1) Create/use repo (e.g., Santech_Business-).
2) Upload ALL files from this zip at the ROOT of the repo.
3) Settings → Pages → Source: Deploy from a branch, Branch: main, Folder: / (root).
4) Open your Pages URL (e.g., https://vigneshnagaraja.github.io/Santech_Business-/).
5) On iPhone → Share → Add to Home Screen (so they don’t need the link again).

STEP 2 — Google backend (free)
1) Make Google Sheet named: Santech Timesheets
2) Row 1 headers:
   timestamp, status, approval_code, manager_name, manager_email, employee_name, employee_email, week_ending, rate, total_hours, total_pay, rows_json, approver, decision_time
3) Extensions → Apps Script → paste apps_script.gs (replace SHEET_ID).
4) Deploy → New Deployment → Web app → Execute as Me → Who has access: Anyone → Authorize.
5) Copy the Web App URL and set it once in your browser console:
   localStorage.setItem('SCRIPT_URL', 'PASTE_WEB_APP_URL_HERE')
   Reload the page.

STEP 3 — WebIntoApp (optional, to get APK/IPA wrappers)
- Go to https://www.webintoapp.com/app-maker
- Paste your GitHub Pages URL
- Generate APK/IPA and install on phones. Updates come from your GitHub page.

SMS OFFLINE FLOW
- Employee taps Share via SMS → sends compact CODE to manager.
- Manager → Manager mode → paste CODE → Load from Code → review.
- For records + notifications, use online Submit/Approve when connected.

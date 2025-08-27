Super Company Timesheet — Deploy & Distribute
=============================================

Goal: share a mobile link your team can install like an app (offline-ready).

QUICK DEPLOY (pick one)
1) Netlify Drop (easiest): https://app.netlify.com/drop
   - Drag the *contents* of this folder.
   - Copy the URL and share it with your team.
2) GitHub Pages:
   - Create a repo, upload these files at the root.
   - Settings → Pages → Build from branch → main → /(root).

INSTALL ON PHONES
- Open the link.
- Add to Home Screen (Android Chrome: menu → Add to Home Screen; iOS Safari: Share → Add to Home Screen).

FIRST USE
- Tap Settings → enter Employee name + Team code (optional).
- Log entries (date, project, start/end, notes).
- Export CSV to email/WhatsApp/Teams when needed.

BRANDING
- Replace /icons/* with your logo (PNG 192px and 512px). Update manifest.json if names change.
- Change colors/text in index.html.

NEXT (optional, when you want cloud storage)
- Use Supabase/Firebase for central storage and approvals.
- Add login (email OTP) and role-based permissions.
- Build an admin web dashboard (projects, weekly approvals, exports).

Security note: This MVP stores data locally on each device (no server). Keep sensitive data minimal until you add secure backend + auth.


// Google Apps Script backend for Santech Timesheet (FINAL)
const SHEET_ID = 'REPLACE_WITH_YOUR_SHEET_ID';
const SHEET_NAME = 'Sheet1';

function doPost(e) {
  try {
    const path = (e.parameter.path||'').toString();
    const body = JSON.parse(e.postData.contents||'{}');
    if (path === '/request') return handleRequest(body);
    if (path === '/submit') return handleSubmit(body);
    if (path === '/approve') return handleApprove(body);
    return json({ ok:false, error:'Unknown path' });
  } catch (err) {
    return json({ ok:false, error: String(err) });
  }
}

function handleRequest(p){
  const appUrl = p.app_url || '';
  const week = p.weekEnding || '';
  const emp = p.emp_name || '';
  const empEmail = p.emp_email || '';
  const mgr = p.m_name || '';
  const mgrEmail = p.m_email || '';

  const link = appUrl + '?emp=' + encodeURIComponent(emp) +
               '&email=' + encodeURIComponent(empEmail) +
               '&mgr=' + encodeURIComponent(mgrEmail) +
               '&week=' + encodeURIComponent(week);

  const subj = 'Timesheet request — ' + (week||'');
  const html = 'Hi ' + emp + ',<br><br>' +
    'Please fill your timesheet here: <a href="' + link + '">Open Timesheet</a><br>' +
    'Week ending: ' + week + '<br><br>Regards,<br>' + mgr;

  GmailApp.sendEmail(empEmail, subj, html, {name:'Santech Timesheet', htmlBody: html, replyTo: mgrEmail});
  return json({ ok:true, link });
}

function handleSubmit(p){
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sh = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  let totalHours = 0;
  try{
    (p.rows||[]).forEach(r=>{
      if(r.tin && r.tout){
        const mins = hm(r.tout) - hm(r.tin) - (parseInt(r.lunch||'0',10)||0);
        if(mins>0) totalHours += mins/60.0;
      }
    });
  }catch(e){}
  const rate = parseFloat(p.rate||'0')||0;
  const totalPay = rate>0 ? (totalHours*rate) : 0;
  const code = makeCode();
  const row = [new Date(),'SUBMITTED',code,'',p.mgrEmail||'',p.empName||'',p.empEmail||'',p.weekEnding||'',rate,totalHours,totalPay,JSON.stringify(p.rows||[]),'',''];
  sh.appendRow(row);

  const subj = 'Timesheet submitted by ' + (p.empName||'') + ' — ' + (p.weekEnding||'');
  const html = 'Approval code: <b>' + code + '</b><br>' +
    'Employee: ' + (p.empName||'') + ' (' + (p.empEmail||'') + ')<br>' +
    'Week ending: ' + (p.weekEnding||'') + '<br><br>' +
    'Open the Manager page and paste the code to approve/reject.';
  GmailApp.sendEmail(p.mgrEmail||'', subj, html, {name:'Santech Timesheet', htmlBody: html, replyTo: p.empEmail||''});
  return json({ ok:true, totalHours, totalPay, code });
}

function handleApprove(p){
  const code = (p.code||'').toString().trim();
  const decision = (p.decision||'').toString().trim();
  const approver = (p.approver||'').toString().trim();
  if(!code || !decision) return json({ ok:false, error:'Missing code or decision' });

  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sh = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  const range = sh.getDataRange();
  const values = range.getValues();
  let foundRow = -1;
  for(let i=1;i<values.length;i++){
    if(values[i][2] === code){ foundRow = i+1; break; }
  }
  if(foundRow<0) return json({ ok:false, error:'Code not found' });

  sh.getRange(foundRow, 2).setValue(decision);
  sh.getRange(foundRow, 13).setValue(approver);
  sh.getRange(foundRow, 14).setValue(new Date());

  const empEmail = sh.getRange(foundRow, 7).getValue();
  const week = sh.getRange(foundRow, 8).getValue();
  const subj = 'Timesheet ' + decision + ' — ' + week;
  const html = 'Your timesheet for week ' + week + ' is <b>' + decision + '</b> by ' + approver + '.';
  GmailApp.sendEmail(empEmail, subj, html, {name:'Santech Timesheet', htmlBody: html});

  return json({ ok:true });
}

function json(o){ return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function hm(s){ const [h,m]=s.split(':').map(n=>parseInt(n,10)||0); return h*60+m; }
function makeCode(){ return Math.random().toString(36).substring(2,8).toUpperCase(); }

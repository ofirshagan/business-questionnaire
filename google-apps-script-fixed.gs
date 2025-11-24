// Google Apps Script - קוד מתוקן לקבלת נתונים מ-FormData
// =====================================================
// הדבק קוד זה ב-Google Apps Script שלך

function doPost(e) {
  try {
    // יצירת אובייקט נתונים מה-parameters
    const data = e.parameter;
    
    // קבלת הגיליון
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // אם אין כותרות, צור אותן
    if (sheet.getLastRow() === 0) {
      const headers = [
        'חותמת זמן',
        'מה גרם לך לחשוב על הקמת עסק?',
        'חזון העסק',
        'מה מניע אותך?',
        'אתגרים',
        'תחום העסק',
        'המוצר/שירות',
        'קהל יעד',
        'מה מייחד אותך?',
        'שלב נוכחי',
        'תקציב',
        'מימון',
        'מוכנות',
        'תחומי עזרה',
        'זמן השקעה',
        'מה הביא אותך?',
        'עניין בייעוץ',
        'שם מלא',
        'טלפון',
        'אימייל',
        'וואטסאפ'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.getRange(1, 1, 1, headers.length).setBackground('#4CAF50');
      sheet.getRange(1, 1, 1, headers.length).setFontColor('#FFFFFF');
    }
    
    // הכנת השורה החדשה
    const row = [
      data.timestamp || new Date().toLocaleString('he-IL'),
      data.q1 || '',
      data.q2 || '',
      data.q3 || '',
      data.q4 || '',
      data.q5 || '',
      data.q6 || '',
      data.q7 || '',
      data.q8 || '',
      data.q9 || '',
      data.q10 || '',
      data.q11 || '',
      data.q12 || '',
      data.q13 || '',
      data.q14 || '',
      data.q15 || '',
      data.q16 || '',
      data.q17a || '',
      data.q17b || '',
      data.q17c || '',
      data.q17d || ''
    ];
    
    // הוספת השורה לגיליון
    sheet.appendRow(row);
    
    // שליחת מייל אם מעוניין בייעוץ
    if (data.q16 === 'כן' || data.q16 === 'אולי') {
      sendEmailNotification(data);
    }
    
    // החזרת תשובת הצלחה
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'success',
        'row': sheet.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    console.error('Error: ', error.toString());
    
    // נסיון להוסיף לפחות את הנתונים הבסיסיים
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      sheet.appendRow([
        new Date().toLocaleString('he-IL'),
        'שגיאה בקבלת נתונים',
        error.toString()
      ]);
    } catch(e) {
      console.error('Failed to log error: ', e.toString());
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'error',
        'error': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendEmailNotification(data) {
  try {
    // הגדר את המייל שלך כאן
    const YOUR_EMAIL = 'shaganofir@gmail.com';
    
    const subject = `🔥 ליד חם חדש: ${data.q17a || 'לא צוין שם'} - ${data.q5 || 'תחום לא צוין'}`;
    
    const htmlBody = `
    <div style="direction: rtl; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">🎯 ליד חם חדש!</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px;">
        <div style="background: white; border-radius: 10px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <h2 style="color: #2d3748; border-bottom: 2px solid #667eea; padding-bottom: 10px;">📞 פרטי איש קשר</h2>
          <table style="width: 100%; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; font-weight: bold; width: 30%;">שם:</td>
              <td style="padding: 8px;">${data.q17a || 'לא צוין'}</td>
            </tr>
            <tr style="background: #f7fafc;">
              <td style="padding: 8px; font-weight: bold;">טלפון:</td>
              <td style="padding: 8px;"><strong style="color: #667eea;">${data.q17b || 'לא צוין'}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">אימייל:</td>
              <td style="padding: 8px;">${data.q17c || 'לא צוין'}</td>
            </tr>
            <tr style="background: #f7fafc;">
              <td style="padding: 8px; font-weight: bold;">וואטסאפ:</td>
              <td style="padding: 8px;">${data.q17d || data.q17b || 'לא צוין'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">רמת עניין:</td>
              <td style="padding: 8px;">
                <span style="background: ${data.q16 === 'כן' ? '#10b981' : '#f59e0b'}; color: white; padding: 4px 12px; border-radius: 20px; font-weight: bold;">
                  ${data.q16 || 'לא צוין'}
                </span>
              </td>
            </tr>
          </table>
          
          <h2 style="color: #2d3748; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-top: 30px;">💼 פרטי העסק</h2>
          <table style="width: 100%; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; font-weight: bold; width: 30%;">תחום:</td>
              <td style="padding: 8px;"><strong>${data.q5 || 'לא צוין'}</strong></td>
            </tr>
            <tr style="background: #f7fafc;">
              <td style="padding: 8px; font-weight: bold;">מוצר/שירות:</td>
              <td style="padding: 8px;">${data.q6 || 'לא צוין'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">קהל יעד:</td>
              <td style="padding: 8px;">${data.q7 || 'לא צוין'}</td>
            </tr>
            <tr style="background: #f7fafc;">
              <td style="padding: 8px; font-weight: bold;">שלב נוכחי:</td>
              <td style="padding: 8px;">${data.q9 || 'לא צוין'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">תקציב:</td>
              <td style="padding: 8px;"><strong>${data.q10 || 'לא צוין'}</strong></td>
            </tr>
          </table>
          
          <h2 style="color: #2d3748; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-top: 30px;">🎯 מוטיבציה ומוכנות</h2>
          <table style="width: 100%; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; font-weight: bold; width: 30%;">מה מניע:</td>
              <td style="padding: 8px;">${data.q3 || 'לא צוין'}</td>
            </tr>
            <tr style="background: #f7fafc;">
              <td style="padding: 8px; font-weight: bold;">רמת מוכנות:</td>
              <td style="padding: 8px;">
                <strong style="color: ${data.q12 === '100% מוכן' ? '#10b981' : '#f59e0b'};">
                  ${data.q12 || 'לא צוין'}
                </strong>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">זמן השקעה:</td>
              <td style="padding: 8px;">${data.q14 || 'לא צוין'}</td>
            </tr>
            <tr style="background: #f7fafc;">
              <td style="padding: 8px; font-weight: bold;">תחומי עזרה:</td>
              <td style="padding: 8px;">${data.q13 || 'לא צוינו'}</td>
            </tr>
          </table>
          
          ${data.q15 ? `
          <div style="background: #fef3c7; border-right: 4px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>מה הביא אותו/ה למלא את השאלון:</strong><br>
            ${data.q15}
          </div>
          ` : ''}
          
          <div style="margin-top: 30px; padding: 20px; background: #dcfce7; border-radius: 10px; text-align: center;">
            <h3 style="color: #14532d; margin: 0 0 10px 0;">⏰ פעולה מומלצת</h3>
            <p style="margin: 10px 0;">יש ליצור קשר תוך 24 שעות לתיאום שיחת ייעוץ</p>
            <a href="tel:${data.q17b}" style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 5px;">
              📞 חייג עכשיו
            </a>
            ${data.q17c ? `
            <a href="mailto:${data.q17c}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 5px;">
              ✉️ שלח מייל
            </a>
            ` : ''}
          </div>
        </div>
      </div>
      
      <div style="background: #2d3748; padding: 20px; text-align: center; color: #cbd5e0; font-size: 12px; border-radius: 0 0 10px 10px;">
        נשלח אוטומטית מטופס אפיון עסק | ${new Date().toLocaleString('he-IL')}
      </div>
    </div>
    `;
    
    MailApp.sendEmail({
      to: YOUR_EMAIL,
      subject: subject,
      htmlBody: htmlBody
    });
    
  } catch(error) {
    console.error('Error sending email: ', error.toString());
  }
}

// פונקציה לבדיקה
function doGet(e) {
  return ContentService
    .createTextOutput('Google Apps Script is ready! Use POST method to submit form data.')
    .setMimeType(ContentService.MimeType.TEXT);
}

// פונקציה לקבלת סטטיסטיקות
function getStatistics() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return {message: 'אין נתונים עדיין'};
  
  let stats = {
    total: data.length - 1,
    interested: 0,
    hot_leads: 0,
    by_source: {},
    by_budget: {},
    by_readiness: {}
  };
  
  // דלג על שורת הכותרות
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // עניין בייעוץ (עמודה 16)
    if (row[16] === 'כן') {
      stats.interested++;
      stats.hot_leads++;
    } else if (row[16] === 'אולי') {
      stats.interested++;
    }
    
    // תקציב (עמודה 10)
    const budget = row[10];
    if (budget) {
      stats.by_budget[budget] = (stats.by_budget[budget] || 0) + 1;
    }
    
    // מוכנות (עמודה 12)
    const readiness = row[12];
    if (readiness) {
      stats.by_readiness[readiness] = (stats.by_readiness[readiness] || 0) + 1;
    }
  }
  
  stats.conversion_rate = Math.round((stats.interested / stats.total) * 100) + '%';
  
  return stats;
}
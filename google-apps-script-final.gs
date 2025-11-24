// Google Apps Script - גרסה מתוקנת סופית
// =========================================

function doPost(e) {
  try {
    // נסה לקרוא את הנתונים מכמה מקורות אפשריים
    let data = {};
    
    // אפשרות 1: parameters רגילים
    if (e.parameter) {
      data = e.parameter;
    }
    // אפשרות 2: postData עם JSON
    else if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch(jsonError) {
        // אם זה לא JSON, נסה לפרסר כ-URL encoded
        const params = e.postData.contents.split('&');
        params.forEach(param => {
          const [key, value] = param.split('=');
          if (key && value) {
            data[decodeURIComponent(key)] = decodeURIComponent(value);
          }
        });
      }
    }
    
    // אם עדיין אין נתונים, תיעוד השגיאה
    if (Object.keys(data).length === 0) {
      throw new Error('No data received. Content: ' + (e.postData ? e.postData.contents : 'No postData'));
    }
    
    // קבלת הגיליון
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // אם אין כותרות, צור אותן
    if (sheet.getLastRow() === 0) {
      const headers = [
        'חותמת זמן',
        'שאלה 1: מה גרם לך',
        'שאלה 2: חזון',
        'שאלה 3: מוטיבציה', 
        'שאלה 4: אתגרים',
        'שאלה 5: תחום',
        'שאלה 6: מוצר/שירות',
        'שאלה 7: קהל יעד',
        'שאלה 8: ייחוד',
        'שאלה 9: שלב',
        'שאלה 10: תקציב',
        'שאלה 11: מימון',
        'שאלה 12: מוכנות',
        'שאלה 13: תחומי עזרה',
        'שאלה 14: זמן השקעה',
        'שאלה 15: מה הביא',
        'שאלה 16: עניין בייעוץ',
        'שם מלא',
        'טלפון',
        'אימייל',
        'וואטסאפ',
        'אישור',
        'מקור',
        'UTM Campaign',
        'UTM Source',
        'UTM Medium'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#5B21B6');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setHorizontalAlignment('center');
      sheet.setFrozenRows(1);
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
      data.q17d || '',
      data.q18 || '',
      data.source || 'Direct',
      data.utm_campaign || '',
      data.utm_source || '',
      data.utm_medium || ''
    ];
    
    // הוספת השורה
    sheet.appendRow(row);
    
    // שליחת התראה במייל לליד חם
    if (data.q16 === 'כן' || data.q16 === 'אולי') {
      sendEmailNotification(data);
    }
    
    // יצירת לינק לפגישה ב-Calendly
    const meetingLink = generateMeetingLink(data);
    
    // החזרת תשובה
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'success',
        'message': 'Data saved successfully',
        'row': sheet.getLastRow(),
        'meetingLink': meetingLink,
        'timestamp': new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    // לוג של השגיאה
    console.error('Error details:', error.toString());
    console.error('Stack:', error.stack);
    
    // נסיון לשמור לפחות את השגיאה
    try {
      const errorSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Errors') || 
                        SpreadsheetApp.getActiveSpreadsheet().insertSheet('Errors');
      errorSheet.appendRow([
        new Date().toLocaleString('he-IL'),
        error.toString(),
        JSON.stringify(e)
      ]);
    } catch(logError) {
      console.error('Failed to log error:', logError);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'message': error.toString(),
        'timestamp': new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // גם GET יכול לקבל נתונים (למקרה של fallback)
  if (e.parameter && Object.keys(e.parameter).length > 0) {
    return doPost(e);
  }
  
  return ContentService
    .createTextOutput('Script is ready! Send POST requests with form data.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function sendEmailNotification(data) {
  try {
    const YOUR_EMAIL = 'shaganofir@gmail.com';
    
    const subject = `🔥 ליד חם: ${data.q17a || 'לא צוין'} | ${data.q5 || 'תחום לא צוין'}`;
    
    const whatsappLink = `https://wa.me/972${(data.q17b || '').replace(/^0/, '').replace(/-/g, '')}?text=${encodeURIComponent('שלום ' + (data.q17a || '') + ', קיבלתי את פרטיך מהטופס. מתי נוח לך לשוחח?')}`;
    
    const htmlBody = `
    <div style="direction: rtl; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #5B21B6 0%, #1E3A8A 100%); padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">🎯 ליד חם חדש התקבל!</h1>
        <p style="color: #E9D5FF; margin: 10px 0 0 0;">${new Date().toLocaleString('he-IL')}</p>
      </div>
      
      <div style="background: #F9FAFB; padding: 30px; border: 1px solid #E5E7EB;">
        
        <!-- כרטיס איש קשר -->
        <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px;">
          <h2 style="color: #1F2937; margin: 0 0 20px 0; padding-bottom: 15px; border-bottom: 2px solid #5B21B6;">
            👤 פרטי איש קשר
          </h2>
          
          <table style="width: 100%;">
            <tr>
              <td style="padding: 10px; width: 30%; font-weight: 600; color: #4B5563;">שם מלא:</td>
              <td style="padding: 10px; font-size: 18px; color: #1F2937;">
                <strong>${data.q17a || 'לא צוין'}</strong>
              </td>
            </tr>
            <tr style="background: #F9FAFB;">
              <td style="padding: 10px; font-weight: 600; color: #4B5563;">טלפון:</td>
              <td style="padding: 10px;">
                <a href="tel:${data.q17b}" style="color: #5B21B6; font-size: 18px; font-weight: bold; text-decoration: none;">
                  📱 ${data.q17b || 'לא צוין'}
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: 600; color: #4B5563;">אימייל:</td>
              <td style="padding: 10px;">
                <a href="mailto:${data.q17c}" style="color: #5B21B6; text-decoration: none;">
                  ✉️ ${data.q17c || 'לא צוין'}
                </a>
              </td>
            </tr>
            <tr style="background: #F9FAFB;">
              <td style="padding: 10px; font-weight: 600; color: #4B5563;">רמת עניין:</td>
              <td style="padding: 10px;">
                <span style="background: ${data.q16 === 'כן' ? '#10B981' : '#F59E0B'}; color: white; padding: 6px 16px; border-radius: 20px; font-weight: bold; display: inline-block;">
                  ${data.q16 === 'כן' ? '🔥 חם מאוד!' : data.q16 === 'אולי' ? '⏳ מתלבט' : '❄️ קר'}
                </span>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- כרטיס עסק -->
        <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px;">
          <h2 style="color: #1F2937; margin: 0 0 20px 0; padding-bottom: 15px; border-bottom: 2px solid #5B21B6;">
            💼 פרטי העסק
          </h2>
          
          <div style="background: #F0F4FF; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <strong style="color: #5B21B6;">תחום העסק:</strong>
            <p style="margin: 5px 0; font-size: 18px; color: #1F2937;">${data.q5 || 'לא צוין'}</p>
          </div>
          
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px; width: 30%; font-weight: 600; color: #4B5563;">מוצר/שירות:</td>
              <td style="padding: 8px; color: #1F2937;">${data.q6 || 'לא צוין'}</td>
            </tr>
            <tr style="background: #F9FAFB;">
              <td style="padding: 8px; font-weight: 600; color: #4B5563;">קהל יעד:</td>
              <td style="padding: 8px; color: #1F2937;">${data.q7 || 'לא צוין'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: 600; color: #4B5563;">שלב נוכחי:</td>
              <td style="padding: 8px; color: #1F2937;">${data.q9 || 'לא צוין'}</td>
            </tr>
            <tr style="background: #F9FAFB;">
              <td style="padding: 8px; font-weight: 600; color: #4B5563;">תקציב:</td>
              <td style="padding: 8px;">
                <strong style="color: #5B21B6;">${data.q10 || 'לא צוין'}</strong>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: 600; color: #4B5563;">רמת מוכנות:</td>
              <td style="padding: 8px;">
                <strong style="color: ${data.q12 === '100% מוכן' ? '#10B981' : '#F59E0B'};">
                  ${data.q12 || 'לא צוין'}
                </strong>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- פעולות מומלצות -->
        <div style="background: linear-gradient(135deg, #DCFCE7, #BBF7D0); border-radius: 12px; padding: 25px; text-align: center;">
          <h3 style="color: #14532D; margin: 0 0 20px 0;">⚡ פעולות מיידיות</h3>
          
          <div style="display: inline-block; margin: 10px;">
            <a href="tel:${data.q17b}" style="display: inline-block; background: #10B981; color: white; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);">
              📞 התקשר עכשיו
            </a>
          </div>
          
          <div style="display: inline-block; margin: 10px;">
            <a href="${whatsappLink}" style="display: inline-block; background: #25D366; color: white; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; box-shadow: 0 4px 6px rgba(37, 211, 102, 0.2);">
              💬 WhatsApp
            </a>
          </div>
          
          ${data.q17c ? `
          <div style="display: inline-block; margin: 10px;">
            <a href="mailto:${data.q17c}" style="display: inline-block; background: #6366F1; color: white; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);">
              ✉️ שלח מייל
            </a>
          </div>
          ` : ''}
        </div>
        
      </div>
      
      <div style="background: #1F2937; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
        <p style="color: #9CA3AF; margin: 0; font-size: 12px;">
          נשלח אוטומטית ממערכת הלידים | שגן אופיר - ייעוץ עיסקי לעסקים וחברות
        </p>
      </div>
    </div>
    `;
    
    MailApp.sendEmail({
      to: YOUR_EMAIL,
      subject: subject,
      htmlBody: htmlBody
    });
    
  } catch(error) {
    console.error('Email error:', error);
  }
}

function generateMeetingLink(data) {
  // כאן אפשר להוסיף לינק ל-Calendly או Google Calendar
  // לדוגמה:
  const calendlyLink = 'https://calendly.com/shaganofir/consultation';
  const name = encodeURIComponent(data.q17a || '');
  const email = encodeURIComponent(data.q17c || '');
  
  return `${calendlyLink}?name=${name}&email=${email}`;
}

// פונקציות סטטיסטיקה
function getStatistics() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return {message: 'אין נתונים'};
  
  const stats = {
    total: data.length - 1,
    hotLeads: 0,
    warmLeads: 0,
    bySource: {},
    byBudget: {},
    conversionRate: 0
  };
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][16] === 'כן') stats.hotLeads++;
    if (data[i][16] === 'אולי') stats.warmLeads++;
    
    const budget = data[i][10];
    stats.byBudget[budget] = (stats.byBudget[budget] || 0) + 1;
    
    const source = data[i][22] || 'Direct';
    stats.bySource[source] = (stats.bySource[source] || 0) + 1;
  }
  
  stats.conversionRate = ((stats.hotLeads + stats.warmLeads) / stats.total * 100).toFixed(1) + '%';
  
  return stats;
}
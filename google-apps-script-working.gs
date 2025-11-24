// Google Apps Script - עדכן זה ב-Apps Script Editor שלך
// ========================================================
// עדכון: 24/11/2025

function doPost(e) {
  try {
    let data = {};
    
    // מקור 1: FormData (המשודרת ישירות)
    if (e.parameter && Object.keys(e.parameter).length > 0) {
      data = e.parameter;
    }
    // מקור 2: postData (נתונים גולמיים)
    else if (e.postData) {
      const contents = e.postData.contents;
      
      // נסה קודם JSON
      try {
        data = JSON.parse(contents);
      } catch(err) {
        // אם לא JSON, נסה URL-encoded
        try {
          const params = contents.split('&');
          params.forEach(param => {
            const [key, value] = param.split('=');
            if (key && value) {
              data[decodeURIComponent(key)] = decodeURIComponent(value);
            }
          });
        } catch(parseErr) {
          throw new Error('Failed to parse data');
        }
      }
    }
    
    // בדיקה אם יש נתונים
    if (!data || Object.keys(data).length === 0) {
      return ContentService.createTextOutput(
        JSON.stringify({
          status: 'error',
          message: 'No data received'
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    // קבלת הגיליון הפעיל
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // יצירת כותרות אם זו הפעם הראשונה
    if (sheet.getLastRow() === 0) {
      const headers = [
        'חותמת זמן',
        'Q1: מה גרם לך',
        'Q2: חזון',
        'Q3: מוטיבציה',
        'Q4: אתגרים',
        'Q5: תחום',
        'Q6: מוצר/שירות',
        'Q7: קהל יעד',
        'Q8: ייחוד',
        'Q9: שלב פיתוח',
        'Q10: תקציב',
        'Q11: מימון',
        'Q12: מוכנות',
        'Q13: תחומי עזרה',
        'Q14: זמן שבועי',
        'Q15: מה הביא',
        'Q16: עניין בייעוץ',
        'שם מלא',
        'טלפון',
        'אימייל',
        'וואטסאפ',
        'אישור יצירת קשר'
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
    const newRow = [
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
      data.q18 || ''
    ];
    
    // הוספת השורה לגיליון
    sheet.appendRow(newRow);
    
    // שליחת אימייל לבעלים (אופציונלי)
    if (data.q16 === 'כן' || data.q16 === 'אולי') {
      try {
        const emailSubject = `ליד חם חדש: ${data.q5}`;
        const emailBody = `
שם: ${data.q17a}
טלפון: ${data.q17b}
אימייל: ${data.q17c}
וואטסאפ: ${data.q17d}

תחום: ${data.q5}
מודעות בייעוץ: ${data.q16}
        `;
        
        // שנה את הכתובת לשלך
        MailApp.sendEmail('ofirshagan@gmail.com', emailSubject, emailBody);
      } catch(mailErr) {
        Logger.log('Email error: ' + mailErr);
      }
    }
    
    // החזר תשובה מוצלחת
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'success',
        message: 'Data received and saved'
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    Logger.log('Error in doPost: ' + error);
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'error',
        message: error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// פונקציית עזר לבדיקה
function doGet(e) {
  return ContentService.createTextOutput('Google Apps Script is running');
}

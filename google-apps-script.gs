// Google Apps Script - להעתקה ל-Apps Script Editor
// ==============================================
// 1. פתח Google Sheet חדש
// 2. לחץ על Extensions -> Apps Script
// 3. מחק את הקוד הקיים והדבק את הקוד הזה
// 4. לחץ על Deploy -> New Deployment
// 5. בחר Type: Web app
// 6. Execute as: Me
// 7. Who has access: Anyone
// 8. לחץ Deploy והעתק את ה-URL שיתקבל
// 9. הדבק את ה-URL באפליקציה במקום YOUR_GOOGLE_APPS_SCRIPT_URL_HERE

// הגדרת שם הגיליון
const SHEET_NAME = 'תשובות';

function doPost(e) {
  try {
    // קבלת הגיליון הפעיל
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) || 
                  SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
    
    // אם זו הפעם הראשונה, יצירת כותרות
    if (sheet.getLastRow() === 0) {
      const headers = [
        'חותמת זמן',
        'שאלה 1: מה גרם לך לחשוב על הקמת עסק?',
        'שאלה 2: חזון העסק בעוד שנה',
        'שאלה 3: מה מדרבן אותך?',
        'שאלה 4: מה מפחיד אותך?',
        'שאלה 5: תחום העסק',
        'שאלה 6: המוצר/שירות המרכזי',
        'שאלה 7: קהל היעד',
        'שאלה 8: מה מייחד אותך?',
        'שאלה 9: שלב הפיתוח',
        'שאלה 10: תקציב השקעה',
        'שאלה 11: מקור מימון',
        'שאלה 12: רמת מוכנות',
        'שאלה 13: תחומי עזרה נדרשים',
        'שאלה 14: זמן השקעה שבועי',
        'שאלה 15: מה גרם למילוי השאלון?',
        'שאלה 16: עניין בייעוץ',
        'שם מלא',
        'טלפון',
        'אימייל',
        'וואטסאפ',
        'אישור יצירת קשר'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // עיצוב הכותרות
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4CAF50');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setHorizontalAlignment('center');
      sheet.setFrozenRows(1);
    }
    
    // קבלת הנתונים מהבקשה
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error('No data received');
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
    
    // שליחת התראה באימייל (אופציונלי)
    if (data.q16 === 'כן' || data.q16 === 'אולי') {
      sendEmailNotification(data);
    }
    
    // החזרת תגובת הצלחה
    return ContentService
      .createTextOutput(JSON.stringify({ 
        'result': 'success',
        'message': 'Form submitted successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // טיפול בשגיאות
    console.error('Error: ', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        'result': 'error',
        'error': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// פונקציה לשליחת התראה באימייל על ליד חדש
function sendEmailNotification(data) {
  try {
    // החלף את הכתובת באימייל שלך
    const YOUR_EMAIL = 'your-email@gmail.com';
    
    const subject = `ליד חדש משאלון אפיון עסק: ${data.q17a || 'לא צוין שם'}`;
    
    const body = `
ליד חדש התקבל מהשאלון!

פרטי איש קשר:
================
שם: ${data.q17a || 'לא צוין'}
טלפון: ${data.q17b || 'לא צוין'}
אימייל: ${data.q17c || 'לא צוין'}
וואטסאפ: ${data.q17d || data.q17b || 'לא צוין'}
עניין בייעוץ: ${data.q16 || 'לא צוין'}

פרטי העסק:
================
תחום: ${data.q5 || 'לא צוין'}
מוצר/שירות: ${data.q6 || 'לא צוין'}
קהל יעד: ${data.q7 || 'לא צוין'}
שלב פיתוח: ${data.q9 || 'לא צוין'}

מוטיבציה ומוכנות:
================
מה גרם לו/ה לחשוב על עסק: ${data.q1 || 'לא צוין'}
מה מדרבן: ${data.q3 || 'לא צוין'}
רמת מוכנות: ${data.q12 || 'לא צוין'}
זמן השקעה שבועי: ${data.q14 || 'לא צוין'}

משאבים:
================
תקציב: ${data.q10 || 'לא צוין'}
מקור מימון: ${data.q11 || 'לא צוין'}

תחומי עזרה נדרשים:
================
${data.q13 || 'לא צוינו'}

מה גרם למילוי השאלון:
================
${data.q15 || 'לא צוין'}

זמן מילוי: ${data.timestamp || new Date().toLocaleString('he-IL')}
    `;
    
    // שליחת האימייל
    MailApp.sendEmail({
      to: YOUR_EMAIL,
      subject: subject,
      body: body
    });
    
  } catch (error) {
    console.error('Error sending email notification: ', error);
  }
}

// פונקציה לבדיקת GET (למטרות בדיקה)
function doGet(e) {
  return ContentService
    .createTextOutput('Google Apps Script is working! Use POST method to submit data.')
    .setMimeType(ContentService.MimeType.TEXT);
}

// פונקציות עזר לניתוח נתונים
// ================================

// פונקציה לקבלת סטטיסטיקות בסיסיות
function getStatistics() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return null;
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return null; // רק כותרות
  
  const stats = {
    totalResponses: data.length - 1,
    interestedInConsulting: 0,
    budgetRanges: {},
    targetAudience: {},
    readinessLevel: {},
    businessFields: {}
  };
  
  // ניתוח הנתונים (דלג על שורת הכותרות)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // עניין בייעוץ (עמודה 16)
    if (row[16] === 'כן' || row[16] === 'אולי') {
      stats.interestedInConsulting++;
    }
    
    // תקציב (עמודה 10)
    const budget = row[10];
    stats.budgetRanges[budget] = (stats.budgetRanges[budget] || 0) + 1;
    
    // קהל יעד (עמודה 7)
    const audience = row[7];
    stats.targetAudience[audience] = (stats.targetAudience[audience] || 0) + 1;
    
    // רמת מוכנות (עמודה 12)
    const readiness = row[12];
    stats.readinessLevel[readiness] = (stats.readinessLevel[readiness] || 0) + 1;
    
    // תחום עסק (עמודה 5)
    const field = row[5];
    if (field) {
      stats.businessFields[field] = (stats.businessFields[field] || 0) + 1;
    }
  }
  
  return stats;
}

// פונקציה ליצירת דוח ניתוח
function generateAnalysisReport() {
  const stats = getStatistics();
  if (!stats) {
    return 'אין נתונים לניתוח';
  }
  
  let report = `דוח ניתוח שאלון אפיון עסק
================================
נכון לתאריך: ${new Date().toLocaleString('he-IL')}

סה"כ משיבים: ${stats.totalResponses}
מעוניינים בייעוץ: ${stats.interestedInConsulting} (${Math.round(stats.interestedInConsulting / stats.totalResponses * 100)}%)

התפלגות תקציבים:
`;
  
  for (const [key, value] of Object.entries(stats.budgetRanges)) {
    report += `  ${key}: ${value} (${Math.round(value / stats.totalResponses * 100)}%)\n`;
  }
  
  report += `
התפלגות קהל יעד:
`;
  
  for (const [key, value] of Object.entries(stats.targetAudience)) {
    report += `  ${key}: ${value} (${Math.round(value / stats.totalResponses * 100)}%)\n`;
  }
  
  report += `
רמת מוכנות:
`;
  
  for (const [key, value] of Object.entries(stats.readinessLevel)) {
    report += `  ${key}: ${value} (${Math.round(value / stats.totalResponses * 100)}%)\n`;
  }
  
  // יצירת גיליון חדש עם הדוח
  const reportSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('דוח ניתוח') ||
                     SpreadsheetApp.getActiveSpreadsheet().insertSheet('דוח ניתוח');
  
  reportSheet.clear();
  reportSheet.getRange(1, 1).setValue(report);
  
  return report;
}

// פונקציה לייצוא לידים ל-CSV
function exportLeadsToCsv() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return null;
  
  const data = sheet.getDataRange().getValues();
  
  // יצירת CSV
  let csv = '';
  for (let i = 0; i < data.length; i++) {
    let row = '';
    for (let j = 0; j < data[i].length; j++) {
      let val = data[i][j];
      if (val.toString().indexOf(',') !== -1 || val.toString().indexOf('"') !== -1) {
        val = '"' + val.toString().replace(/"/g, '""') + '"';
      }
      row += val + ',';
    }
    csv += row.slice(0, -1) + '\n';
  }
  
  // שמירת הקובץ ב-Drive
  const blob = Utilities.newBlob(csv, 'text/csv', 'leads_export.csv');
  DriveApp.createFile(blob);
  
  return 'CSV file created in Google Drive';
}
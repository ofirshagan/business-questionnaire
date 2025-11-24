# נוסחאות לדשבורד ניתוח ב-Google Sheets

## הוראות:
1. פתח את ה-Google Sheet עם התשובות
2. צור גיליון חדש בשם "דשבורד"
3. העתק את הנוסחאות הבאות לתאים המתאימים

---

## נוסחאות סטטיסטיקה בסיסית

### A1: כותרת
```
="דשבורד ניתוח שאלון - עדכון אחרון: "&TEXT(NOW(),"DD/MM/YYYY HH:MM")
```

### A3: סה"כ משיבים
```
=COUNTA(תשובות!A:A)-1
```

### A5: מעוניינים בייעוץ
```
=COUNTIFS(תשובות!Q:Q,"כן")+COUNTIFS(תשובות!Q:Q,"אולי")
```

### A7: אחוז המעוניינים
```
=IFERROR(A5/A3,"0%")
```
פרמט כאחוז

---

## גרפים מומלצים

### התפלגות תקציבים (עמודה K)
```
=QUERY(תשובות!K:K,"SELECT K, COUNT(K) WHERE K != '' GROUP BY K LABEL COUNT(K) 'מספר משיבים'",1)
```

### קהל יעד (עמודה H)
```
=QUERY(תשובות!H:H,"SELECT H, COUNT(H) WHERE H != '' GROUP BY H LABEL COUNT(H) 'מספר משיבים'",1)
```

### רמת מוכנות (עמודה M)
```
=QUERY(תשובות!M:M,"SELECT M, COUNT(M) WHERE M != '' GROUP BY M LABEL COUNT(M) 'מספר משיבים'",1)
```

### תחומי עזרה מבוקשים (עמודה N)
```
=ARRAYFORMULA(
  {
    "שיווק דיגיטלי",COUNTIF(תשובות!N:N,"*שיווק דיגיטלי*");
    "תמחור",COUNTIF(תשובות!N:N,"*תמחור*");
    "תפעול",COUNTIF(תשובות!N:N,"*תפעול*");
    "תזרים מזומנים",COUNTIF(תשובות!N:N,"*תזרים מזומנים*");
    "רישוי",COUNTIF(תשובות!N:N,"*רישוי*");
    "מיקוד",COUNTIF(תשובות!N:N,"*מיקוד*")
  }
)
```

---

## פילוחים מתקדמים

### לידים חמים (מוכנים 100% + רוצים ייעוץ)
```
=QUERY(תשובות!A:V,"SELECT A,R,S,T WHERE M = '100% מוכן' AND (Q = 'כן' OR Q = 'אולי')",1)
```

### לידים לפי תקציב גבוה
```
=QUERY(תשובות!A:V,"SELECT A,F,K,R,S,T WHERE K = '50-250K' OR K = 'מעל 250K'",1)
```

### משיבים לפי תאריך (7 ימים אחרונים)
```
=QUERY(תשובות!A:V,"SELECT * WHERE A >= DATE '"&TEXT(TODAY()-7,"yyyy-mm-dd")&"'",1)
```

---

## מעקב ביצועים

### ממוצע תשובות יומי
```
=IFERROR(A3/DAYS(TODAY(),MIN(תשובות!A2:A)),0)
```

### ימים הכי פעילים
```
=QUERY(תשובות!A:A,"SELECT DAYOFWEEK(A)+1, COUNT(A) WHERE A IS NOT NULL GROUP BY DAYOFWEEK(A)+1 ORDER BY COUNT(A) DESC LABEL DAYOFWEEK(A)+1 'יום', COUNT(A) 'תשובות'",1)
```

### שעות הכי פעילות
```
=QUERY(תשובות!A:A,"SELECT HOUR(A), COUNT(A) WHERE A IS NOT NULL GROUP BY HOUR(A) ORDER BY HOUR(A) LABEL HOUR(A) 'שעה', COUNT(A) 'תשובות'",1)
```

---

## נוסחאות עיצוב מותנה

### סימון לידים חמים (עמודה Q)
הגדר עיצוב מותנה:
- טווח: Q2:Q
- נוסחה: `=$Q2="כן"`
- צבע רקע: ירוק

### סימון תקציב גבוה (עמודה K)
הגדר עיצוב מותנה:
- טווח: K2:K
- נוסחה: `=OR($K2="50-250K",$K2="מעל 250K")`
- צבע רקע: כחול

### סימון מוכנות גבוהה (עמודה M)
הגדר עיצוב מותנה:
- טווח: M2:M
- נוסחה: `=$M2="100% מוכן"`
- צבע רקע: זהב

---

## Pivot Tables מומלצים

### טבלת ציר 1: ניתוח לפי קהל יעד
- שורות: קהל יעד (H)
- עמודות: רמת מוכנות (M)
- ערכים: COUNT של שם (R)

### טבלת ציר 2: ניתוח תקציבים
- שורות: תקציב (K)
- עמודות: עניין בייעוץ (Q)
- ערכים: COUNT של שם (R)

### טבלת ציר 3: מקורות מימון
- שורות: מקור מימון (L)
- עמודות: תקציב (K)
- ערכים: COUNT של שם (R)

---

## סקריפטים אוטומטיים

### שליחת דוח שבועי
```javascript
function sendWeeklyReport() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const dashboardUrl = sheet.getUrl() + '#gid=' + sheet.getSheetByName('דשבורד').getSheetId();
  
  const stats = {
    total: sheet.getSheetByName('דשבורד').getRange('A3').getValue(),
    interested: sheet.getSheetByName('דשבורד').getRange('A5').getValue(),
    percentage: sheet.getSheetByName('דשבורד').getRange('A7').getValue()
  };
  
  const subject = `דוח שבועי - ${stats.total} משיבים חדשים`;
  const body = `
    סיכום שבועי של השאלון:
    
    סה"כ משיבים: ${stats.total}
    מעוניינים בייעוץ: ${stats.interested}
    אחוז המרה: ${stats.percentage}
    
    לצפייה בדשבורד המלא:
    ${dashboardUrl}
  `;
  
  MailApp.sendEmail('your-email@gmail.com', subject, body);
}
```

### הגדרת טריגר אוטומטי
ב-Apps Script:
1. לחץ על ⏰ (Triggers)
2. Add Trigger
3. Choose function: sendWeeklyReport
4. Time-based → Week timer → Every Monday

---

## טיפים נוספים

### יצירת גרפים:
1. סמן את הנתונים מהנוסחאות
2. Insert → Chart
3. בחר סוג גרף מתאים (עמודות/עוגה)
4. התאם צבעים ותוויות

### סינון חכם:
צור Data → Create a filter על הגיליון הראשי לסינון מהיר

### ייצוא לידים:
File → Download → CSV לייצוא הנתונים

### שיתוף הדשבורד:
Share → Anyone with link → Viewer לשיתוף קריאה בלבד

---

בהצלחה! 📊
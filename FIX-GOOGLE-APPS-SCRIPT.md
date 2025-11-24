# 🔧 Fix Google Apps Script - הוראות עדכון

## צעדים לתיקון:

### 1️⃣ עדכן את Google Apps Script:
1. פתח את [Google Apps Script שלך](https://script.google.com)
2. בחר את הפרויקט שמחובר לגיליון שלך
3. **מחק את כל הקוד הקיים** בעורך (Ctrl+A ואז Delete)
4. **העתק את הקוד החדש** מהקובץ `google-apps-script-working.gs`

### 2️⃣ הדבק את הקוד החדש:
- בחר הכל (Ctrl+A)
- הדבק את הקוד החדש (Ctrl+V)

### 3️⃣ שמור וערוך את הדיפלויי:
1. לחץ על **Deploy → New Deployment**
2. בחר **Type → Web app**
3. **Execute as:** Your Account
4. **Who has access:** Anyone
5. לחץ **Deploy**

### 4️⃣ עדכן את ה-URL באפליקציה:
- במקרה שהטוקן השתנה, עדכן ב-`questionnaire-app.html` שורה 1084

### 5️⃣ בדוק הכל:
- נסה למלא שאלון ושלח
- בדוק שהנתונים מופיעים בגיליון

## 🐛 בעיות נפוצות:

**Q: עדיין לא רואה תשובות?**
- A: בדוק ב-Apps Script → Executions (היסטוריה) אם יש שגיאות

**Q: סימנים לא בעברית?**
- A: וודא שהגיליון מוגדר ל-UTF-8

**Q: אחרי כמה תשובות זה הפסיק לעבוד?**
- A: בדוק אם יש מגבלות quota ב-Google Apps Script

---

**יצור הוראות**: 24 נובמבר 2025
**גרסה**: 2.0

# 🚀 שגן אופיר - שאלון אפיון עסקי

[![Deploy to GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue)](https://pages.github.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.0-orange)](https://github.com)

## 📱 אפליקציית Progressive Web App לאיסוף לידים

אפליקציה מתקדמת לאיסוף לידים איכותיים עבור יועצים עסקיים ומאמנים.

### ✨ פיצ'רים מרכזיים

- 🎨 עיצוב מודרני ורספונסיבי עם הלוגו שלך
- 📊 שליחה ישירה ל-Google Sheets
- 📧 התראות אוטומטיות במייל
- 💬 אינטגרציה עם WhatsApp
- 📅 קביעת פגישות ביומן
- 📈 Google Analytics מובנה
- 🔒 SSL מאובטח
- ⚡ טעינה מהירה ותמיכה אופליין

### 🛠️ התקנה מהירה

#### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/business-questionnaire.git
cd business-questionnaire
```

#### 2. עדכן את Google Apps Script
- פתח את `google-apps-script-final.gs`
- העתק את הקוד ל-Google Apps Script שלך
- החלף את האימייל בשורה 93

#### 3. עדכן את Google Analytics
- פתח את `index.html`
- חפש `G-XXXXXXXXXX`
- החלף ב-Google Analytics ID שלך

#### 4. Deploy to GitHub Pages
```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

- Settings → Pages → Source: Deploy from branch (main)
- המתן 2-3 דקות
- האפליקציה זמינה ב: `https://YOUR_USERNAME.github.io/business-questionnaire/`

### 📁 מבנה הפרויקט

```
business-questionnaire/
│
├── index.html              # האפליקציה הראשית
├── manifest.json           # הגדרות PWA
├── sw.js                   # Service Worker
├── app-icon.svg           # אייקון האפליקציה
├── google-apps-script.gs  # קוד ל-Google Sheets
├── README.md              # קובץ זה
└── LICENSE                # רישיון MIT
```

### 🔧 קונפיגורציה

#### Google Sheets
1. צור Google Sheet חדש
2. Extensions → Apps Script
3. הדבק את הקוד מ-`google-apps-script-final.gs`
4. Deploy → Web app → Anyone

#### WhatsApp
עדכן את המספר בשורה 2145 ב-`index.html`:
```javascript
const phone = '972549998817'; // החלף למספר שלך
```

#### Calendly (אופציונלי)
עדכן את הלינק בשורה 2158:
```javascript
const calendlyUrl = 'https://calendly.com/YOUR_USERNAME/consultation';
```

### 📊 ניתוח ביצועים

האפליקציה כוללת מעקב אוטומטי של:
- מספר צפיות
- אחוז השלמת טופס
- זמן מילוי ממוצע
- מקורות תנועה (UTM)
- המרות לפי שלב

### 🎨 התאמה אישית

#### שינוי צבעים
עדכן את המשתנים ב-CSS (שורה 95):
```css
:root {
    --primary-color: #1a1a1a;
    --accent-color: #5B21B6;
    --success-color: #10B981;
}
```

#### עדכון תכנים
- כותרות: שורות 842-850
- הצעת ערך: שורות 862-880
- המלצות: שורות 890-900

### 📈 תוצאות צפויות

- **40-60%** הגדלה באחוז מילוי
- **25-35%** יותר לידים איכותיים
- **זמן מילוי ממוצע:** 4-5 דקות
- **אחוז המרה:** 15-20%

### 🤝 תמיכה

- 📧 Email: shaganofir@gmail.com
- 📱 Phone: 054-9998817
- 💬 WhatsApp: [לחץ כאן](https://wa.me/972549998817)

### 📄 רישיון

MIT License - ראה [LICENSE](LICENSE) לפרטים

### 🙏 תודות

- Google Sheets API
- Progressive Web Apps
- Font Awesome Icons
- Google Fonts

---

**נבנה עם ❤️ על ידי אופיר שגן - ייעוץ עיסקי לעסקים וחברות**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://linkedin.com/in/ofirshagan)
[![Website](https://img.shields.io/badge/Website-Visit-green)](https://ofirshagan.com)
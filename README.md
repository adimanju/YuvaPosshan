# YuvaPoshan (ಯುವಪೋಷಣ್)
**Calm, Trustworthy School Attendance, School Meal Nutrition, and Child Growth Record Platform for South Indian Schools**

---

## 1. Design System & Tokens Proposal

### Color Palette (WCAG 2.1 AA Compliant)
- **Primary Brand Axis:**
  - Teal Primary: `#0D9488` (Light) / `#14B8A6` (Dark) — calm, clinical trust and primary actions
  - Indigo Authority: `#4338CA` (Light) / `#818CF8` (Dark) — administrative records and institutional governance
- **Semantic Attendance States:**
  - **Present (P):** `#059669` / `#10B981` (Emerald) — marked present in roll call
  - **Absent (A):** `#E11D48` / `#F43F5E` (Rose) — unexcused absence & health flags
  - **Late (L):** `#D97706` / `#FBBF24` (Amber) — delayed arrival & consecutive absence warnings
  - **Excused (E):** `#6366F1` / `#A5B4FC` (Indigo) — medical certificate or prior notice
- **Restrained Glassmorphism Tokens:**
  - Surface: `rgba(255, 255, 255, 0.78)` (Light) / `rgba(15, 23, 42, 0.72)` (Dark)
  - Backdrop Blur: `20px` to `24px`
  - Border: `1px solid rgba(255, 255, 255, 0.65)` (Light) / `1px solid rgba(255, 255, 255, 0.14)` (Dark)
  - Shadow: `0 10px 30px -10px rgba(15, 76, 92, 0.08)` (Light) / `0 12px 36px -10px rgba(0,0,0,0.55)` (Dark)
  - Canvas: Ambient slow-moving gradient with teal (`#14B8A6`), indigo (`#6366F1`), and amber (`#F59E0B`) blurred orbs

### Typography & Spacing
- **Primary Interface Font:** `Plus Jakarta Sans`
- **Data & Telemetry Figures:** `JetBrains Mono` with `font-variant-numeric: tabular-nums`
- **Native Indic Scripts:** `Noto Sans Kannada`, `Noto Sans Tamil`, `Noto Sans Telugu`, and `Noto Sans Malayalam`
- **Card Radius:** `20px` (`rounded-2xl` to `rounded-3xl` for mobile drawers)
- **Touch Target:** Minimum `44 × 44px` across all controls

---

## 2. Component Inventory

1. **Teacher Flagship Roll Call:**
   - `RollCallGrid`: Virtualized 125-student grid, 1-tap status cycling (`P → A → L → E`), keyboard shortcuts (`P`, `A`, `L`, `E`), and optimistic updates.
   - `AttendanceRing`: Live circular SVG progress ring showing percentage present + late.
   - `ConsecutiveAbsenceAlerts`: Automatic detector for $\ge 3$ consecutive absences with last contact date and one-tap "Log follow-up" dialog.
   - `MealCalorieLog`: Food item picker (ICMR-NIN IFCT 2020), live calculator: `(grams per child × kcal per 100g ÷ 100) × children served`, category donut, daily stacked bar, weekly target band, and CSV export.
   - `StudentHeatmapModal`: 14-day attendance calendar heatmap, physical stats (height, weight, BMI), and clear non-diagnostic medical disclaimer.

2. **Meal Inspection, Photo Gallery & Weekly Planning:**
   - `MealGallery`: Live documentary photographic register of school meals with mobile rear-camera snap (`capture="environment"`), file upload, real-time preview, dish filter/search, and a full-detail lightbox inspector with portion breakdown and temperature checks.
   - `WeeklyMealPlan`: Upcoming 6-day South Indian school menu under PM-POSHAN Upper Primary (Grades 5–8) with day-by-day focus, 6-day matrix overview, ICMR-NIN compliance metrics (715 kcal & 21.4g protein avg), millet special (Ragi Mudde Thursday), egg & vegetarian alternatives, and CSV export.
   - `MealInspectionHero`: Features an authentic documentary photograph of mid-day meals being served in a South Indian school courtyard with dark scrim, 4.7/5.0 live quality score tiles, kitchen inspection photo viewer, and quick feedback actions.
   - `MealFeedbackModal`: Multi-role inspection register (Teacher, Visiting Parent, SDMC Committee Member, Student Representative) recording temperature, portion sufficiency, taste stars, kitchen cleanliness shields, and speech microphone audio dictation.
   - `NutritionAssistantDrawer` ("Poshan Sahayak"): Multi-turn Gemini AI assistant for ICMR-NIN food composition tables, PM-POSHAN Upper Primary norms (700 kcal & 20g protein), seasonal South Indian millet menus, and parent communication advice.
   - `HealthCentresMapModal`: Locator for nearby Primary Health Centres (PHC Chandapura, UPHC Hebbagodi), Government Taluk General Hospital Anekal, and FCI Central Grain Supply Godowns for pediatric growth referrals and grain quality audits.

3. **Admin & Governance Console:**
   - `AdminDashboard`: 4-section comparative KPIs, small multiples, 500-student directory with pagination and CSV export, Growth Review Roster, and append-only cryptographic audit logs.

4. **Parent Portal (Mobile-First):**
   - `ParentPortal`: Low-bandwidth optimized child view with today's status, 14-day calendar, meals supplied, growth guidepost, and notification center.

5. **Universal Core Affordances:**
   - `CommandPalette`: `Cmd/Ctrl + K` fuzzy search supporting South Indian spelling variations (e.g. Laxmi ↔ Lakshmi).
   - `KeyboardShortcutsModal`: Press `?` for interactive shortcut legend.
   - `AuditBanner`: Visible privacy control and plain-language medical disclaimer.
   - `DesignTokensDrawer`: Live interactive design tokens and IA proposal inspector.
   - `LoginModal`: 1-click seeded demo accounts and forgot password workflow.

---

## 3. Information Architecture by Role

| Role | Primary Goal | Core Screens & Controls |
| :--- | :--- | :--- |
| **Class Teacher** | Fast 8:30 AM roll call & midday meal log | Today's Roll Call (125 students), Live Ring, Bulk Mark All / Copy Yesterday, Absence Alert Panel, Food Table & Calorie Ledger. |
| **Headmaster / Admin** | Compliance, nutrition oversight & data audit | School Overview (500 students), 4-Section Small Multiples, Paginated Directory with CSV Export, Growth Review Roster, Audit Log. |
| **Parent** | Low-bandwidth attendance & meal status | Linked Child Attendance, Mid-Day Meal Menu, Growth Guidepost with Disclaimer, Notification Center. |
| **Kitchen Supervisor** | Inventory & portion planning | Food inventory, standard grams per child, aggregate meal supply ledger. |

---

## 4. Demo Accounts & Credentials

Click **"Switch Account (Demo Login)"** in the top navigation or footer for 1-click access:

1. **Class Teacher (Grade 6A):**
   - Name: `Anitha Shenoy`
   - Email: `teacher.6a@yuvaposhan.edu.in`
   - Access: Grade 6A Roll Call (125 students), Absence Alerts, Meal Calorie Log.

2. **Headmaster / Administrator:**
   - Name: `Dr. K. S. Murthy`
   - Email: `headmaster@yuvaposhan.edu.in`
   - Access: School-wide KPIs (500 students), Section Comparison, Growth Review, Audit Log.

3. **Parent Portal:**
   - Name: `Ramesh Gowda`
   - Child Linked: `Lakshmi Narayanan` (YP-6A-001)
   - Access: Attendance Calendar, Meals Supplied, Growth Guidepost.

---

## 5. Development & Testing Instructions

### Run Development Server
```bash
npm run dev
```

### Run Pure Logic Unit Tests (Node Test Runner)
```bash
npx --yes tsx --test src/utils/rules.test.ts
```

### Type Checking & Lint
```bash
npm run lint
```

### Build Production Bundle
```bash
npm run build
```

---

## 6. Regulatory & Privacy Notice
- **Non-Diagnostic Policy:** YuvaPoshan is an educational administrative and nutrition record-keeping tool. It is **not** a clinical diagnostic tool. Every growth and nutrition indicator carries a plain-language note that it is informational and must be reviewed by a registered medical professional.
- **Calorie Attribution:** Calories are strictly recorded and displayed as **"food supplied per child"**, never as "food eaten".
- **Sensitive Data:** All student access operations are cryptographically timestamped in an append-only audit log.

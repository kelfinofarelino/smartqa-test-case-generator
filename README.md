# 🧪 SmartQA – Test Case Generator

> **A modern, interactive web app that automatically generates structured test cases from a feature description or user story — no backend required.**

![SmartQA Preview](https://img.shields.io/badge/SmartQA-Test%20Case%20Generator-f97316?style=for-the-badge&logo=testcafe&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📝 **Feature Input** | Textarea to describe your feature or user story in plain text |
| ⚡ **Quick Templates** | 5 built-in presets: Login, Checkout, Reset Password, Register, Search |
| ☑️ **Test Coverage Selector** | Toggle Positive, Negative, and Edge Case test generation independently |
| 🤖 **Auto Generator** | Keyword-based detection maps your input to the best test case blueprint |
| 🏷️ **Visual Badges** | Color-coded badges: 🟢 Positive · 🔴 Negative · 🟠 Edge Case |
| 🔍 **Filter Bar** | Filter test cases by type with live counters |
| 📋 **Copy Table** | Copy the full table to clipboard (tab-delimited, paste into any spreadsheet) |
| ⬇️ **Export CSV** | Download a UTF-8 CSV (Excel-compatible with BOM) |
| 💾 **Local Storage** | Last generated session auto-saved and restored on page reload |
| ⌨️ **Keyboard Shortcut** | `Ctrl + Enter` inside the textarea triggers generation |

---

## 🖥️ Preview

```
┌─────────────────────────────────────────────────────────┐
│  QA  SmartQA  Test Case Generator              💾 History│
├─────────────────────────────────────────────────────────┤
│  📋 Feature / User Story                                 │
│  ┌─────────────────────┐                                │
│  │ Quick Template  ▼   │                                │
│  └─────────────────────┘                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Describe your feature here…                     │   │
│  └─────────────────────────────────────────────────┘   │
│  ☑ Positive   ☑ Negative   ☑ Edge Case                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │        ⚙  Generate Test Cases                  │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│  [All 8] [Positive 2] [Negative 3] [Edge 3]  📋  ⬇ CSV│
│  ┌──────┬──────────┬──────────────┬──────────┬────────┐ │
│  │ ID   │ Type     │ Scenario     │ Steps    │ Result │ │
│  ├──────┼──────────┼──────────────┼──────────┼────────┤ │
│  │TC-01 │ Positive │ Login sukses │ 1. Open… │ Redir… │ │
│  │TC-02 │ Negative │ Wrong pass…  │ 1. Open… │ Error… │ │
│  └──────┴──────────┴──────────────┴──────────┴────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

No installation or build step needed. It's a **pure static web app**.

### Option 1 – Open directly in browser

```bash
git clone https://github.com/kelfinofarelino/smartqa-test-case-generator.git
cd smartqa-test-case-generator
# Open index.html in your browser
start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux
```

### Option 2 – Serve with a local dev server

```bash
# Using Python
python -m http.server 3000

# Using Node.js (npx)
npx serve .

# Using VS Code
# Install "Live Server" extension → right-click index.html → Open with Live Server
```

Then visit `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```
smartqa-test-case-generator/
├── index.html      # Main UI — semantic HTML with Tailwind CSS CDN
├── style.css       # Custom styles — cards, badges, buttons, animations
└── script.js       # Generator logic, filter, copy, CSV export, localStorage
```

### No external dependencies, no build toolchain, no Node modules.

---

## 🧩 How It Works

```
User Input (textarea)
        │
        ▼
  detectTemplateKey()   ──── keyword match ────► TC_DATA[key]  (curated blueprints)
        │
        └─── no match ──────────────────────────► buildGenericTestCases()  (fallback)
                                                         │
                                                         ▼
                                              Filter by selected coverage
                                             (Positive / Negative / Edge)
                                                         │
                                                         ▼
                                              Assign TC-01, TC-02… IDs
                                                         │
                                                         ▼
                                              Render HTML table  +  Save to localStorage
```

---

## 🗂️ Built-in Templates

| Template Key | Preset Name | Positive | Negative | Edge Case |
|---|---|:---:|:---:|:---:|
| `login` | Fitur Login Akun | 2 | 3 | 3 |
| `checkout` | Fitur Checkout Belanja | 2 | 3 | 3 |
| `reset` | Fitur Reset Password | 1 | 3 | 2 |
| `register` | Fitur Registrasi Pengguna | 1 | 3 | 2 |
| `search` | Fitur Pencarian Produk | 2 | 2 | 3 |
| *(any)* | Free-form text (fallback) | 2 | 3 | 3 |

---

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#0f172a` (slate-950) |
| Surface / Card | `#1e293b` (slate-800) |
| Primary Accent | `#f97316` (orange-500) |
| Text | `#e2e8f0` (slate-200) |
| Positive badge | `#4ade80` green on dark green bg |
| Negative badge | `#f87171` red on dark red bg |
| Edge Case badge | `#fb923c` orange on dark orange bg |
| Font | System UI stack (`-apple-system`, `Segoe UI`, `sans-serif`) |

---

## 📋 Table Columns

| Column | Description |
|---|---|
| **Test Case ID** | Auto-incrementing: `TC-01`, `TC-02`, … |
| **Test Type** | Color-coded badge — Positive / Negative / Edge Case |
| **Scenario Description** | One-line description of what is being tested |
| **Test Steps** | Step-by-step numbered actions to reproduce |
| **Expected Result** | The expected system behavior upon completion |

---

## 📤 Export Options

### Copy to Clipboard
Copies the table as **tab-separated values** — paste directly into Google Sheets, Excel, or Notion.

### Export to CSV
Downloads a **UTF-8 CSV with BOM** (`test-cases-<timestamp>.csv`), fully compatible with Microsoft Excel without encoding issues.

---

## 🔧 Customization

### Add a new template
1. Add an entry to `TEMPLATES` in [`script.js`](script.js) with the pre-filled textarea text.
2. Add the corresponding test case data to `TC_DATA` with `positive`, `negative`, and `edge` arrays.
3. Add the detection keyword(s) to `detectTemplateKey()`.
4. Add the `<option>` in the `#quickTemplate` select in [`index.html`](index.html).

### Change color scheme
All design tokens are in [`style.css`](style.css) — look for `.badge-*`, `.btn-primary`, and `.filter-btn.active`.

---

## 🛠️ Tech Stack

- **HTML5** — Semantic markup
- **Tailwind CSS** (CDN) — Utility-first layout and spacing
- **Vanilla CSS** — Custom component styles, animations, scrollbar
- **Vanilla JavaScript** (ES6+, strict mode) — Zero dependencies

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<div align="center">
  <sub>Built with ❤️ for QA Engineers &mdash; <strong>SmartQA Test Case Generator</strong></sub>
</div>

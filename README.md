# AI-in-Medicine Lab Website
This repository contains the source code for the AIMLab website.  
The site is deployed via GitHub Pages.
The project is currently under active development and not finalized.

## Architecture: Data-Driven Static Site

The website follows a **data-driven static architecture** to ensure maintainability:

- **UI (HTML/CSS)**  
  Layout and styling are defined in `.html` and `assets/css/style.css`.

- **Data (JSON)**  
  Dynamic content (people, publications, projects, news) is stored in `assets/data/*.json`.

- **Logic (JavaScript)**  
  `js/main.js` fetches JSON data and dynamically renders the content.

> Update content via JSON. Update layout via HTML/CSS.

## 📁 Project Structure

```text
/
├── *.html              # Pages (index, people, research, etc.)
├── assets/
│   ├── css/
│   │   └── style.css   # Global stylesheet
│   ├── data/           # JSON data sources (content layer)
│   │   ├── news.json, people.json, publications.json...
│   └── img/            # Logo, Avatars, Placeholders...
└── js/
    └── main.js         # Core script: fetch + render JSON data
```

## 🚀 Local Development

> **⚠️ Do NOT open `.html` files directly via `file://`**
> This project uses `fetch()` to load JSON, which will be blocked by browser security (CORS).

*✨ Hot reload is enabled — changes in HTML/CSS/JSON will auto-refresh.*

### Option 1: VS Code Live Server
1. Install the extension: **Live Server** (by Ritwick Dey).
2. Open `index.html` in your editor.
3. Click **"Go Live"** in the bottom right corner.
4. Visit: `http://127.0.0.1:5500`

### Option 2: Python Server
If you have Python installed, run this command in your terminal:
```bash
python -m http.server 8000
```
Then open your browser and visit: `http://localhost:8000`

---

## 🤝 Commit Convention

We follow **Conventional Commits** for a clean version history:
* **`feat`**: new feature / UI / data update
* **`fix`**: bug fix
* **`style`**: layout / CSS changes
* **`docs`**: documentation updates

**Examples:**
* `style: update homepage layout and navbar color`
* `feat(data): add new publication to publications.json`
* `feat(ui): add search bar to projects page`
* `fix: correct image path for member avatar`

---

## 🎨 Design & Color Guidelines

The visual design of this website is based on the **AIMLab logo**, using a primary palette of **blue, green, and white**.

To ensure visual consistency across the site, please use the predefined **CSS variables** in `assets/css/style.css` instead of hardcoding color values.

---

### 🔵 Primary Colors (Blue Palette)

Used for headings, emphasis, buttons, and key visual elements:

- `--blue-700` (#0b5bd3): Core primary color of the website  
- `--blue-900`, `--blue-800`, `--blue-600`:  
  Used for gradients, hover states, and darker backgrounds  

---

### 🟢 Accent Color (Green Palette)

Used for secondary emphasis, badges, or highlights:

- `--green-600` (#16a34a): Subtle accent color  

---

### ⚪ Background Colors

- `--bg` (#ffffff): Main background  
- `--bg-soft` (#f6f9ff): Light blue-tinted background for sections or footers  
- `--card` (#ffffff): Card component background  

---

### 📝 Typography (Text Colors)

- `--text-900` (#0f172a): Primary text  
- `--text-700` (#334155): Secondary text  
- `--text-500` (#64748b): Muted text (e.g., captions, dates, annotations)  

---

### ⚠️ Development Notes

When adding new styles:

- Always prioritize using the existing `:root` CSS variables  
- Avoid hardcoding hex color values  
- This ensures consistency and allows future extensibility (e.g., dark mode support)

---

## 📌 Contribution Notes

* **Update content** → `assets/data/*.json`
* **Update layout** → `.html` / `.css`
* **Rendering logic** → `js/main.js`

*For questions about data structure or rendering logic, contact the maintainer.*"# AI-in-Medicine-LAB.github.io" 

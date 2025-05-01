# Doppleit Vector v2 Pro

**Reflect Your Vision. Vector Precision.**

Doppleit Vector v2 Pro is a powerful, in-browser vector graphics editor designed for creators who demand precision and flexibility. Built with modern web technologies, it offers a vibrant, accessible interface for drawing, editing, and exporting vector graphics—all without server-side processing for maximum privacy.

---

## ✨ Features

- **Vector Drawing Tools:** Pen, rectangles, circles, and text
- **Advanced Color Management:** HSL, HEX, RGB, color wheel, sliders, eyedropper
- **Layer System:** Rename, reorder, toggle visibility/lock
- **Undo/Redo:** Full edit history (50 actions)
- **Export Options:** SVG, PNG, and JSON project save/load
- **Accessibility:** ARIA, high contrast, reduced motion, keyboard shortcuts
- **Performance:** Debounced redraws, real-time canvas previews
- **Responsive:** Mobile, touch, desktop — full support
- **Privacy-First:** All rendering stays in-browser

---

## 🚀 Installation

**No installation needed.** Just open `index.html` in your browser.

Or clone the repo:
```bash
git clone https://github.com/your-repo/doppleit-vector.git
cd doppleit-vector
python -m http.server
```

Navigate to [http://localhost:8000](http://localhost:8000)

---

## 🧰 Usage

- **Start Drawing:** Pen (1), Rectangle (2), Circle (3), Text (4)
- **Color Tools:** Use sliders, wheel, swatches, eyedropper
- **Layers:** Add, rename (double-click), reorder
- **Export:** Download as SVG, PNG, or JSON
- **Keyboard Shortcuts:**
  - `1-4` → Tool switch
  - `S` → Select Tool
  - `Esc` → Cancel / Deselect
  - `Ctrl+Z / Ctrl+Y` → Undo / Redo

---

## 🛡 Security

- ✅ Strict Content Security Policy
- ✅ Nonce-based style/script validation
- ✅ No data sent to server (fully offline)
- ✅ DOMPurify sanitation on any SVG content

---

## 🧑‍💻 Developer Notes

- Everything lives in `index.html`
- Written in Vanilla JS, CSS3, and HTML5
- Uses Canvas and SVG only — no WebGL or WebAssembly

---

## 📃 License

MIT © 2025 Doppleit

---

## 🗣 Contact

Have ideas or feedback?  
Open an issue or hit us at [doppleit.io/feedback](https://doppleit.io/feedback)

---

**Doppleit Vector v2 Pro** — Where creativity meets control.
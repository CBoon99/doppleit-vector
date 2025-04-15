# Cindara Vector

**Cindara Vector** is an open-source, browser-based vectorization tool built for simplicity, speed, and future expansion. It lets users upload raster images and convert them into clean, layered SVG vectors directly in the browser—no backend, no installs.

Created by **Carl Boon**, Cindara Vector is the first module in a growing suite of creative and symbolic tools under the **Cindara Labs** umbrella.

---

## ✨ Features

- 🖼️ Drag-and-drop raster input (PNG, JPG)
- 🧠 Modular vector engine (`vector.final.js`)
- 🌀 Edge tracing and layer segmentation
- 🎨 SVG preview + color editing
- 📦 Exportable vector files (timestamped)
- 🔄 Future-ready folder structure for uploads/output

---

## 🧱 Folder Structure

```
cindara-vector/
├── index.html              # Interface
├── css/style.css           # Branding
├── scripts/vector.final.js # Vector engine
├── assets/                 # Logo + icon
├── uploads/                # Image drop cache
├── output/                 # Exported SVGs
```

---

## 🚀 Vision

This project is the **entry point** to a larger recursive system that includes:

- Cindara Animate
- Cindara Sculpt
- CytoCoin (currency layer)
- Cindara Aid (charity layer)
- And more...

It’s not just a tool—it’s part of a mirror.

---

## 🛠️ Tech

- HTML / CSS / JavaScript
- No frameworks
- No dependencies
- Fully local, deployable on GitHub Pages or Netlify

---

## 📜 License

MIT — free to use, remix, and contribute.

---

## 🧠 Author

**Carl Boon**  
Recursive system architect, founder of the Spiral, builder of mirrors that reflect the soul.

> “Simple tools. Stunning results. Built for everyone.”

---

# What's New in Cindara Vector v1.0

---

## 🌟 Branding & Identity

- Renamed interface and console structure under **Cindara Labs**
- Refined UI with a clean, modern aesthetic:
  - Warm orange accents (`#ff8000`) for action elements
  - White canvas and panel backgrounds
  - Light gray ambient background (`#f4f4f4`)
- Buttons and layers use rounded, soft elements for accessible design
- Modular logging via `[Cindara.<Tier>]` (e.g. `[Cindara.Trace]`)

---

## 🧠 Structural Improvements

- Centralized logic into modular tiers:
  - `Core`, `Image`, `Trace`, `Visual`, `View`, `Export`
- Unified state under `_state` object, simplifying access + updates
- Touch/pinch/mouse gestures unified across devices
- Event listeners consolidated via `init()` bindings

---

## 🧵 Recursive Tracing Engine

- **Depth-first tracing** via `_followEdge()`  
- Early-exit boundary checks to reduce stack overhead
- `visited` Set ensures no double-trace paths
- Combined grayscale + contrast into a **single-pass edge detection**

---

## 🧰 Functional Flow

- File input triggers immediate canvas render
- `Trace.run()` generates paths layer-by-layer
- `Visual.renderLayers()` handles:
  - DOM drawing
  - Color pickers
  - Layer reordering
- Export system timestamps clean SVG filenames

---

## 🖱️ Interactivity

- Zoom & Pan: mouse wheel, click+drag, touch pinch/drag
- Layers: re-order via drag-and-drop, color editing inline
- Reset: view reset returns to default zoom & pan
- Fully mobile-friendly, touch-first layout with media queries

---

## 💡 Why It’s Fast

- Zero dependencies
- Canvas-based pixel access
- Minimal DOM reflow
- No external libraries, servers, or APIs

---

## 🚀 How to Use

1. Open `index.html` in any browser
2. Drop or upload a raster image (high-contrast logos work best)
3. Click **Trace Vector** to generate layered SVG paths
4. Adjust colors or layer order
5. Click **Export SVG** to download your vector file

---

> Built to be fast. Built to be kind. Built to reflect the user.

— Cindara Labs
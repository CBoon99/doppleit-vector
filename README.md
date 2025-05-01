# Doppleit Vector v2 Pro

**Reflect your vision. Vector precision.**

Doppleit Vector is a real-time, fully client-side image vectorization tool built for speed, clarity, and creative freedom — no installs, no uploads, no compromise.

---

## 🚀 Features

- 🎨 **Image-to-SVG Vectorization**
  - Drop in `.jpg`, `.jpeg`, or `.png`
  - Choose color detail and remove background
  - Get clean, scalable SVG output

- ⚙️ **Client-Side Performance**
  - No files are uploaded or stored
  - Uses a sandboxed [Potrace](https://potrace.sourceforge.net/) engine in a Web Worker
  - Fully sanitized output via [DOMPurify](https://github.com/cure53/DOMPurify)

- 🧠 **UX Focus**
  - Drag & drop or browse
  - Live progress bar
  - Animated loading spinner
  - Reset / reconvert flow
  - Dark-mode friendly Doppleit styling

- 🔐 **Security**
  - CSP-enforced
  - DOM injection protection (via DOMPurify)
  - SVGs generated and sandboxed in-browser
  - No analytics, no tracking, no data collection

---

## 🧪 Supported Inputs

- `.jpg`, `.jpeg`, `.png` up to **5MB**
- Non-image files are blocked
- Large or invalid files are rejected with user feedback

---

## 📄 Output

- Clean SVG with embedded path/image data
- Fully sanitized for browser-safe rendering
- Downloaded as: `doppleit-vector-[timestamp].svg`

---

## 🛠 Tech Stack

- HTML5 + CSS + JavaScript (no build tools required)
- [Potrace](https://github.com/tbyrne/potrace) (via CDN)
- [DOMPurify](https://github.com/cure53/DOMPurify)
- Hosted on Netlify / any static provider

---

## 📦 Local Setup

You can run it offline by opening `index.html` directly in a browser, or:

```bash
# Recommended (for CSP + local worker blob support)
npx serve
# Then open http://localhost:3000
```

---

## 📘 License

MIT — free to use, modify, or fork.  
Doppleit branding, logo, and visual identity © Carl Boon.

---

## ✨ Author

Built by **Carl Boon**  
🔗 [doppleit.com](https://doppleit.com) (coming soon)

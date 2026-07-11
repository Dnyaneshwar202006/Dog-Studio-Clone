# React Dog — Dogstudio-style 3D Scroll Experience

A React + Three.js recreation of the [Dogstudio](https://dogstudio.co) agency landing page: a scroll-driven 3D dog model rendered with `react-three-fiber`, animated with GSAP's `ScrollTrigger`, layered underneath a scrolling HTML/CSS marketing page.

## Tech Stack

| Tool | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 8** | Dev server / build tool |
| **@react-three/fiber** | React renderer for Three.js (declarative 3D scenes) |
| **@react-three/drei** | Helper hooks — `useGLTF`, `useTexture`, `useAnimations` |
| **three.js** | Underlying 3D engine, custom shader material |
| **gsap + @gsap/react + ScrollTrigger** | Scroll-linked animation timeline for the 3D model |

## Project Structure

```
React-dog/
├── index.html
├── src/
│   ├── main.jsx          # React root
│   ├── App.jsx            # Page layout: nav, hero, 4 scroll sections + <Canvas>
│   ├── App.css             # All styling (dark theme, section layouts)
│   └── components/
│       └── Dog.jsx         # The 3D dog model, materials, shader & scroll animation
└── public/
    ├── models/dog.drc.glb        # Draco-compressed 3D dog model + animation clip
    ├── dog_normals.jpg            # Normal map for the dog mesh
    ├── branches_diffuse.jpeg      # Diffuse map for background branches mesh
    ├── branches_normals.jpeg      # Normal map for branches mesh
    └── matcap/mat-1.png … mat-20.png   # 20 matcap textures used as swappable "materials"
```

## How It Works

### 1. Page layout (`App.jsx`)
A single `<main>` holds:
- A fixed, full-viewport `<Canvas>` (z-index: 1) — this is where the 3D dog lives, positioned behind everything else.
- A stack of HTML `<section>`s (z-index: 2) that scroll normally over the canvas: a hero/nav section, a project-titles section, a statement section, and a footer/about section.

Because the canvas is `position: fixed`, the dog model appears to stay "in place" in 3D space while the page content scrolls past it — the classic pinned-3D-background technique.

### 2. The 3D dog (`Dog.jsx`)
- **Model loading**: `useGLTF` loads a Draco-compressed `.glb` containing the dog mesh, a "branches" mesh (background geometry), and a baked animation clip (`"Take 001"`), which is auto-played via `useAnimations`.
- **Custom matcap shader**: Instead of a single static matcap texture, the dog and branches use a `MeshMatcapMaterial` whose shader is patched via `onBeforeCompile` to blend **two** matcap textures together using a `uProgress` uniform and a `smoothstep` based on the fragment's view-space position. This lets the entire model's "look" morph smoothly between two lighting/material styles.
- **Hover-driven material swap**: Each project title in `#section-2` (Tomorrowland, Navy Pier, MSI Chicago, etc.) has a `mouseenter` listener that picks a different matcap texture (`mat19`, `mat8`, `mat9`, `mat10`, `mat12`, `mat13`…) and animates `uProgress` from 1 → 0 with GSAP, cross-fading the dog's surface to that texture. On `mouseleave` from the titles list, it fades back to the default matcap (`mat2`).
- **Scroll-driven camera/model animation**: A GSAP timeline registered via `useGSAP`, tied to a `ScrollTrigger` spanning from `#section-1` to `#section-4` with `scrub: true`, moves and rotates `model.scene` (position/rotation tweens chained and partially overlapped using a GSAP position-parameter label `"third"`) so the dog turns and repositions itself as the user scrolls through the page.

### 3. Styling (`App.css`)
Dark theme (`black` background, `whitesmoke` text). Each `<section>` is `min-height: 100vh` and uses nested SCSS-style selectors (via a CSS-nesting-capable build) for the nav, hero text, and project-title layout. `#canvas-elem::after` overlays a background image behind the canvas for atmospheric depth.

## Running Locally

```bash
npm install
npm run dev       # start Vite dev server
npm run build      # production build
npm run preview    # preview the production build
```

## Notable Implementation Detail
The most technically interesting part of the codebase is the **dual-matcap shader blend** in `Dog.jsx`: rather than swapping materials outright (which would cause a visible pop), it injects custom GLSL into Three's built-in matcap fragment shader to sample two matcap textures and mix between them based on a uniform GSAP can tween — giving smooth, per-pixel cross-fades driven entirely from React/JS state.

# Daniel's AI Agents Office

An isometric 3D office that shows Daniel Nguyen's 14 AI agents across 5 departments. Built with Three.js 0.160 (loaded from unpkg CDN, zero build step), Kenney CC0 furniture models, Quaternius CC0 animated 3D robot models, and CSS2D labels.

![preview](assets/preview.png)

Live: https://daniel-agent-office.vercel.app · Embed demo: https://daniel-agent-office.vercel.app/embed-demo.html

## Features
- **3D AI Agents & Human Modes**: Toggle between cute animated 3D AI Robots (`RobotExpressive.glb`) and Human characters with `?chars=robot` (default) or `?chars=human`.
- **Interactive Agent Reactions**: Click on any agent handle in the department detail card to make that specific robot agent wave and greet you!
- **Zero Scroll Hijacking**: Normal page scroll is preserved. Mouse wheel zoom only activates when clicking into the section or holding Ctrl/Cmd.
- **Auto Low-Power Pause**: Rendering loop automatically sleeps when the section scrolls out of view or tab is backgrounded.
- **Visual Polish**: Parquet wood flooring, soft baked shadows, frosted glass partitions, live animated code/charts/waveforms on screens, and non-overlapping label layout.

## Structure
```
index.html        standalone full-screen page (section has data-standalone)
embed-demo.html   example portfolio page with the office as a 70vh section
src/config.js     <- EDIT HERE: rooms, agents, colours, status bubbles
src/main.js       scene, characters, animation, controls
src/office.css    styles, all scoped under #agent-office
src/section.html  markup to paste for a direct include
src/spline.js     optional Spline mode (set SPLINE_URL or ?spline=<url>)
assets/           Kenney Furniture Kit + Quaternius Robot Expressive (CC0)
```

## Editing agents and rooms
Open `src/config.js`. Each room in `DEPTS` has `id, name, color, floor, x, z, w, d` and `agents: [['@handle','role'], ...]`. Optional flags: `rack` (server rack), `mic` (podcast corner), `studio` (extra monitors and a TV). Status bubble texts per room `id` live in `ACT`.

## Embedding in a portfolio
**Option A: iframe (recommended & simplest)**
```html
<iframe src="https://daniel-agent-office.vercel.app/" title="Daniel's AI Agents Office"
  style="width:100%;height:70vh;min-height:420px;border:0;border-radius:24px;box-shadow:0 12px 36px rgba(0,0,0,0.08)" loading="lazy"></iframe>
```

**Option B: direct include (same page, no iframe)**
1. Add to `<head>`:
```html
<link rel="stylesheet" href="https://daniel-agent-office.vercel.app/src/office.css">
<script type="importmap">{"imports":{"three":"https://unpkg.com/three@0.160.0/build/three.module.js","three/addons/":"https://unpkg.com/three@0.160.0/examples/jsm/"}}</script>
```
2. Paste the contents of `src/section.html` where you want the office.
3. Before `</body>`:
```html
<script type="module" src="https://daniel-agent-office.vercel.app/src/main.js"></script>
<script type="module" src="https://daniel-agent-office.vercel.app/src/spline.js"></script>
```

## Performance options
- `?chars=robot` (default): 3D animated AI Robot agents.
- `?chars=human`: Kenney Human mini-characters.
- `?bloom=1` turns on the glow post-processing (off by default).
- `?noaa` turns off MSAA.
- Pixel ratio is capped at 1.25 and shadows are baked once after load.

## Deploy
Static site, no build. `vercel deploy --prod --yes` from this folder, or connect the GitHub repo in Vercel (framework preset: Other, no build command, output dir `.`).

## Credits
- Furniture & human mini-characters: Kenney (kenney.nl), CC0.
- Animated Robot model: Quaternius (quaternius.com), CC0.

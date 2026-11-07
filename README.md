# photo-slide-ui

A full-screen photo slideshow application built with Vue 3, TypeScript, and Vite. It streams and displays random photos from backend photo albums with smooth transitions, configurable intervals, and interactive keyboard controls.

## Features

- **Full-screen slideshow**: Seamless display of photos across all albums in randomized order.
- **Background preloading**: Next photo and metadata are preloaded automatically for zero-delay transitions.
- **Configurable display duration**: Default 10 seconds per image with dynamic speed adjustment.
- **Keyboard controls**:
  - `Space` / `→`: Immediately skip to the next photo.
  - `+` / `=`: Speed up slideshow duration (shorter interval).
  - `-` / `_`: Slow down slideshow duration (longer interval).
  - `P`: Pause / Resume slideshow.
  - `F`: Toggle full-screen mode.
- **Auto-hiding HUD**: On-screen progress bar and control buttons fade out during playback and reappear on mouse movement.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

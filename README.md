<img src="https://i.imgur.com/ehQfvy1.png" height="100" />

# ME Sniper Frontend

ME Sniper Frontend is a responsive React + TypeScript interface for real-time NFT rarity scouting during mint/reveal windows. It gives operators and collectors a faster way to rank traits and spot high-quality opportunities on the Magic Eden marketplace from a single dashboard, so decisions can be made before latency and competition increase.

This frontend is intentionally thin and operational: it focuses on rendering and interaction quality while the backend handles data-heavy ranking and marketplace aggregation.

## Tech Stack and Why Chosen

| Layer | Technology | Why chosen |
| --- | --- | --- |
| Runtime/UI | React 19, TypeScript | Modern component model and typed props/events for a maintainable single-page experience. |
| App build/dev | Vite 6 (`vite`) | Fast local feedback loop and simple production build pipeline for frontend delivery. |
| Code quality | ESLint (`npm run lint`) | Enforces consistent conventions and catches common issues before release. |
| Data access | `ipfs-http-client` | Supports content-addressed metadata lookup patterns commonly used in NFT workflows. |
| Ecosystem integration | `npm` scripts (`npm run dev`, `npm run build`, `npm run preview`) | Standard, reproducible frontend command model with minimal operator overhead. |

## Architecture Snapshot

- Frontend SPA loads metadata and ranking data from the backend API.
- It applies local filters (rarity/price criteria) and displays ranked results in the UI.
- It links to marketplace state (Magic Eden listings) for listing visibility during scouting.
- Backend source lives in a separate repository: [Rarity-Surf/me-sniper-backend](https://github.com/Rarity-Surf/me-sniper-backend).

## Install and Bootstrap

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open the printed local URL from Vite (for example `http://localhost:5173`) in your browser.

There are no project-defined command flags in `package.json` scripts.

If you need Vite options, pass them through the script after installing dependencies:

```bash
npm run dev -- --help
```

## Day-to-Day Use

- `npm run dev`: run the app with fast hot reload for feature work and validation.
- `npm run build`: run TypeScript checks and produce a production build.
- `npm run lint`: run static analysis for UI code quality issues.
- `npm run preview`: preview the latest build locally.

## Source

- This repo: React + TypeScript frontend.
- Backend API integration: [Rarity-Surf/me-sniper-backend](https://github.com/Rarity-Surf/me-sniper-backend).

# Learn & Play

Educational games for Bella — built with Next.js 15, Tailwind CSS v4, and TypeScript.

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000/gamified-learning
```

## Build for production

```bash
npm run build
# static output in /out
```

## Deploy

Push to `main` — GitHub Actions builds and deploys to GitHub Pages automatically.

## Adding a new game

1. Add an entry to `src/data/games.json`
2. Create `src/components/games/{game-id}/` with your game component
3. Register the `game-id` in the `switch` statement in `src/components/screens/GameScreen.tsx`
4. Set `"available": true` in `games.json` when ready to ship

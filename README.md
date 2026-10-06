# Halden contact centre: agent training floor

A 3D call centre simulation for training agents. You play the newest agent on a live floor of
15 agents and 3 team leaders, take realistic customer calls, and get a scorecard after each one.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # simulation and scenario tests
npm run build    # production build in dist/
```

## How it works

- `src/sim/engine.ts`: the floor simulation (arrivals, queue, routing, breaks, KPIs) and call scoring. No UI code.
- `src/sim/scenarios.ts`: the training calls. Add a scenario by appending to `SCENARIOS`.
- `src/sim/scenarios.tr.ts`: Turkish text for the same calls, in the same order.
- `src/i18n.ts`, `src/i18n.tr.ts`: language switch (English, Turkish). English text is the key; `npm test` fails if a string has no Turkish entry.
- `src/scene/Scene.tsx`: the 3D floor (react-three-fiber).
- `src/ui/`: top bar, call console, scorecard and dashboards.

Targets such as service level (80% in 20 s) and handle time are in `TARGETS` in the engine.

<<<<<<< HEAD
# Bizguard
=======
# BizGuard

BizGuard is a hackathon-ready business financial decision support web app.

## What is included

- Executive financial dashboard
- Editable business inputs
- Net profit, margin, cash runway and debt ratio calculations
- Financial health score
- Risk Center / early-warning indicators
- AI Advisor
- What-If scenario simulator
- Animated, responsive dark UI
- Demo data for Nova Retail

## Run locally

1. Install Node.js 18+.
2. Extract this folder.
3. Open a terminal in the project folder.
4. Run:

```bash
npm install
npm run dev
```

5. Open the local URL printed by Vite.

## Optional live AI

Create `.env` from `.env.example` and add:

```env
VITE_GEMINI_API_KEY=YOUR_KEY
```

Restart the dev server after adding the key.

For the hackathon, keep the built-in fallback enabled so the demo still works if an AI API is unavailable.

## Important

This is a decision-support prototype, not professional financial advice. The scenario simulator is a simple model, not a guaranteed forecast.
>>>>>>> ca382d3 (first commit)

# OnePort 365 Brain

Internal AI chat assistant for the OnePort 365 logistics team. Specialises in ocean freight, customs clearance, Nigeria import/export regulations, RFQs, and cargo classification.

## Setup

```bash
npm install
```

Add your OpenAI API key to `.env.local`:

```
OPENAI_API_KEY=sk-...
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub
2. Connect the repo on [vercel.com](https://vercel.com)
3. Add `OPENAI_API_KEY` as an environment variable in Vercel project settings
4. Deploy

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- TypeScript
- OpenAI API (gpt-4o) with streaming
- Lucide React icons

# Nowadays Demo

A full-stack AI-powered web app that generates branded executive approval memo PDFs for corporate events — built as a feature concept for [Nowadays](https://nowadays.ai), the AI-powered corporate event planning platform.

**Demo:** https://nowadaysdemo.vercel.app/
**Figma:** https://www.figma.com/design/WDZ3rCsOymQuJrJWkE8tBg/nowadays-application---event-approval-planner?node-id=3-8&t=vdDk0ciFXqf5dh2X-1

## The gap it fills

Nowadays already handles everything once an event is approved, venue sourcing, vendor negotiation, proposals. But nothing in their suite helps a People Ops manager or EA justify the spend internally *before* planning begins. This tool fills that gap.

## How it works

1. User fills in event type, guest type, budget, and goals
2. A structured prompt is sent to the Gemini API with the event context
3. Gemini returns a JSON object with all memo fields: title, cost estimates, city recommendation, executive summary, business case, and full budget breakdown
4. jsPDF builds a multi-section branded PDF entirely client-side from the parsed JSON
5. PDF opens in a new tab, ready to send to a CFO or exec team for budget approval

## Tech stack

- **React + TypeScript** — frontend, scaffolded with Figma Make and Vite
- **Google Gemini API** (gemini-2.5-flash) — structured JSON memo generation
- **jsPDF** — client-side PDF generation loaded via CDN, no install required
- **Tailwind CSS** — styling
- **Vercel** — deployment, Gemini API key stored as an environment variable

## Running the code
```bash
npm i
npm run dev
```

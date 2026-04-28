# TRICKY WAITLIST

**Live URL:**  
**Assignment:** Zero to Waitlist

---

## Your twist and why you think it works
Most waitlist pages just collect emails and show a generic "You're on the list!" message. This one gives users a reason to actually open, play, and share.

**Interior Design Quiz + Spin Wheel:**
1. User enters name + email (stored immediately to Airtable)
2. Answers 3 interior design MCQs — all correct → earn a spin
3. An animated spin wheel determines their prize (server-side weighted random — tamper-proof)
4. Wrong answers still get a consolation + a share the challenge with friends

---

## Stack choices and reasoning

- **Next.js 14** — API routes + frontend in one repo, one deploy
- **Tailwind CSS** — fast to write, easy to maintain
- **Airtable** — no schema setup, can read submissions directly
- **Vercel** — zero config deploy for Next.js


```
Landing → [name + email stored] → Quiz (3 MCQs) → 
  All correct → Spin Wheel → [prize determined server-side] → Result Page + Share
  Any wrong   → Consolation Page + Share
```

---

## What I'd Add With More Time

- **Referral codes** — Unique share links so each signup is attributed to a referrer, with a live leaderboard
- **Email delivery** — Automatically send the prize code via Resend/Sendgrid upon prize assignment
- **Admin dashboard** — A simple `/admin` route to view live signups and prize distribution breakdown
- **Rate limiting** — One spin per IP/email enforced via Upstash Redis
- **Richer animations** — Confetti on the result page for high-value wins, and more engaging micro-interactions throughout
- **Near-win mechanics** — Jackpot-style games where the result is delayed with near-miss moments, making the experience more suspenseful than a plain random spin
- **Statistical prize distribution** — Replace pure randomness with a controlled distribution model to ensure prize quotas are met over time
- **Tamper-proof quiz** — Move answer validation fully server-side so that quiz section cannot be tampered via browser DevTools
- **Contextual info panel** — A "Learn more" section on both the prize and consolation pages linking to relevant quiz

---

## AI Tools Used

- **Claude (claude.ai):** Used Claude to scaffold the initial project architecture and establish the overall app flow. Handed off all the boilerplate work — route setup, Airtable integration, canvas drawing, and base UI components — so could focus on product decisions and refinement.
- **What worked well:** Claude was fast and accurate for repetitive but precise work like the Airtable client, Tailwind styling, and spin wheel canvas. The UI output was clean enough to ship with minor tweaks.
- **What didn't:** The spin wheel rotation math was wrong on the first pass — the pointer wasn't landing on the correct segment. Took a few refinements in the logic to get the clockwise/counter-clockwise mapping right. The existing email check and status-based routing also needed manual intervention; Claude's first attempt had the condition inverted and didn't account for all status transitions correctly.

---

## Local Setup

```bash
cp .env.local.example .env.local
# Fill in AIRTABLE_API_KEY and AIRTABLE_BASE_ID

npm install
npm run dev
```

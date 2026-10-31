# Mohamed Alaa Portfolio

Static HTML pages are served directly by Vercel. The shared AI assistant is
available on the CV and project pages. Both it and the Arabic chatbot demo call
the Vercel serverless function at `/api/chat`, which keeps Google AI Studio API
keys on the server and uses Gemini.

## Configure locally

1. Copy `.env.example` to `.env.local`.
2. Set `GEMINI_API_KEYS` to one or more Google AI Studio API keys, separated by
   commas or new lines. Keep `.env.local` private; it is ignored by Git.
3. Optionally set `GEMINI_MODEL`; the default is `gemini-flash-lite-latest`.
4. Run `vercel dev` to test the pages and serverless function locally.

Opening an HTML file directly or using a static-only local server does not run
the `/api/chat` function. Use `vercel dev` or deploy the project to Vercel for
the AI chat to work.

## Deploy to Vercel

Import the repository into Vercel and add the same environment variables in
**Project Settings → Environment Variables** for the environments you use.
Redeploy after changing environment variables. Vercel deploys `index.html`,
`project.html`, and `api/chat.js` without a frontend build step.

The API rotates keys with an in-memory counter per running serverless instance,
so Vercel may not preserve one global order across requests handled by different
instances. If Gemini rejects a key or reports a quota limit, the API tries the
remaining configured keys in rotation order. At most five keys are supported.

The shared assistant is grounded in facts and demo limitations published across
the CV and project pages. The Arabic chatbot demo can also answer general
programming and AI questions, but is instructed to distinguish those answers
from verified project details.

The shared assistant conversation is retained for the current browser session
while navigating between the CV and project pages.

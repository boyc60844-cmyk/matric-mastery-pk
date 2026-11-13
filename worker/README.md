# Matric Mastery AI — Cloudflare Workers AI Backend (v3.8.0)

## Overview

This directory contains the prepared source code and configuration for **Matric Mastery AI**, a dedicated educational AI assistant engineered specifically for Class 9 and 10 students across all Punjab Boards (BISE Lahore, Multan, Faisalabad, Gujranwala, Rawalpindi, Sargodha, Sahiwal, Bahawalpur, DG Khan) and the Federal Board (FBISE).

## Architecture & Model Selection

- **Provider**: Cloudflare Workers AI
- **Text Model (Active Target)**: `@cf/meta/llama-3.1-8b-instruct-fast`
  - **Pricing & Free Capacity**: 4,119 input Neurons / 1M tokens ($0.045/M) and 34,868 output Neurons / 1M tokens ($0.384/M). Within Cloudflare's 10,000 free daily Neurons allowance, this provides **~563 realistic student queries/day** (~238 requests/day even at the maximum 1,024 output token cap) — approximately 6× more daily student capacity than a 70B model.
  - **Lifecycle Status**: Verified active in the Cloudflare Workers AI catalog (not part of the May 30, 2026 or November 20, 2026 deprecations).
- **Vision Model (Separated & Gated)**: `@cf/meta/llama-3.2-11b-vision-instruct`
  - **Default State**: Disabled (`ENABLE_VISION_MODEL = "false"`). Image inference cannot run until the parent/guardian account holder explicitly reviews and accepts Meta's Llama 3.2 Community License and Acceptable Use Policy in the Cloudflare Dashboard and sets `ENABLE_VISION_MODEL = "true"`.
- **Binding**: Native Cloudflare `env.AI` (zero API tokens stored or exposed in client browser code)
- **Deployment Runtime**: Cloudflare Edge Workers (`Workers Free` plan)

## Free-First Financial & Billing Safeguards

- **Daily Allocation**: Operates strictly within Cloudflare's **10,000 free daily Neurons** allowance (resets daily at `00:00 UTC`).
- **Zero Paid Billing / No Credit Card**: Runs on the Cloudflare **Workers Free** plan without attaching a payment method or upgrading to Workers Paid.
- **Zero Paid Fallback**: Client `model` overrides are ignored/blocked server-side. When the 10,000 Neuron limit is reached, the Worker returns `HTTP 429` (`quotaExhausted: true`) and points students to `/strategies`, `/paper-hacks`, and `/past-papers` until reset.
- **No Scripted Masquerade**: When unconfigured or exhausted, the frontend displays transparent status notices instead of fake AI outputs.

## Student Privacy & Security Safeguards

1. **Zero Logging**: Student prompts, questions, solutions, and uploaded image bytes are never logged to Cloudflare console or persistent storage.
2. **Payload & Input Protection**:
   - Maximum request body: 5 MB
   - Maximum image size (when enabled): 4 MB (JPEG, PNG, WebP only)
   - Maximum prompt length: 2,000 characters
   - Maximum output tokens: 1,024 tokens
   - Maximum history context: 10 messages (client-supplied system roles stripped)
3. **CORS Enforcement**: Only authorized origins listed in `ALLOWED_ORIGINS` may call the API from a browser (`403 CORS_FORBIDDEN` otherwise).
4. **Student Advisory**: Instructs students never to submit personal documents (CNIC, B-form, phone numbers, or roll number slips).

## Parent / Guardian Deployment Checklist

1. **Account Setup (Workers Free Only — No Payment Method)**:
   - Sign in or create a Cloudflare account under parent/guardian supervision on the **Free** plan (do NOT add a credit card or upgrade to Workers Paid).
2. **Option A — Deploy via Cloudflare GitHub Integration (Workers Builds)**:
   - In Cloudflare Dashboard → **Workers & Pages** → **Create** → **Import a repository**, select your Matric Mastery GitHub repository.
   - Set **Worker name**: `matric-mastery-ai-worker` (must match `name` in `worker/wrangler.toml`).
   - Set **Root directory**: `worker` (so Cloudflare deploys only `worker/index.ts` and does not build or deploy the main Vite website).
   - Leave **Build command** blank (no separate build step required; Wrangler bundles `index.ts` directly).
   - Set **Deploy command**: `npx wrangler deploy`.
   - Under **Build watch paths**, include `worker/**` so unrelated website changes do not redeploy the Worker.
3. **Option B — Deploy Manually via Wrangler CLI**:
   ```bash
   npx wrangler login
   npx wrangler deploy --config worker/wrangler.toml
   ```
   *(Or from inside `worker/`: `cd worker && npx wrangler deploy` — `worker/wrangler.toml` is already configured.)*
4. **Configure Frontend Environment Variable & Redeploy Website**:
   - Record the Worker's assigned `https://matric-mastery-ai-worker.<subdomain>.workers.dev` URL.
   - In Vercel Project Settings → Environment Variables, add `VITE_AI_WORKER_URL` set to your Worker URL (no trailing slash).
   - Redeploy the frontend so the browser client connects to your Worker.
5. **Verify Live Endpoints**:
   - `curl https://<your-worker>.workers.dev/api/ai/health` → confirm `status: "ok"`, `bindingConfigured: true`, `models.text: "@cf/meta/llama-3.1-8b-instruct-fast"`, `visionEnabled: false`.
   - Test a text question on `/ai` from the production domain and inspect Neuron count in Cloudflare Dashboard → AI → Workers AI.
6. **(Optional Later) Enabling Vision**:
   - Only after the parent/guardian reviews and accepts Meta's Llama 3.2 license for `@cf/meta/llama-3.2-11b-vision-instruct` in the Cloudflare Dashboard, update `ENABLE_VISION_MODEL = "true"` in `worker/wrangler.toml` and redeploy.

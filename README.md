# Agent Assistant — Backend

The backend service for Agent Assistant, a real estate AI tool that helps agents generate professional marketing content from property photos in seconds.

> Built as a personal project to explore AI-powered content generation, streaming APIs, and multi-service cloud architecture.

---

## What It Does

Real estate agents upload photos of a property along with its geocode. The backend:

1. Fetches structured property data (address, acreage, bedrooms, bathrooms, sqft) from the [Montana Cadastral API](https://svc.mt.gov/msl/cadastralapi/)
2. Optimizes uploaded images and stores them in Supabase Storage
3. Passes the property data and images to OpenAI's vision model
4. Streams AI-generated marketing copy back to the client in real time

Agents can generate content tailored for six different platforms: Instagram, Facebook, Twitter/X, TikTok, MLS listings, and open house announcements — each with its own system prompt tuned for tone, format, and fair housing compliance.

---

## Tech Stack

- **Runtime:** Node.js 20
- **Framework:** Express 5
- **Auth:** Firebase Authentication (JWT verification middleware)
- **Database:** Supabase (PostgreSQL)
- **File Storage:** Supabase Storage
- **AI:** OpenAI GPT with vision
- **Image Processing:** Sharp (resized to 512×512 before sending to OpenAI to reduce token costs)
- **Email:** Resend (feedback form submissions)
- **Rate Limiting:** express-rate-limit (15 req / 15 min on content generation)
- **Validation:** Zod

---

## Architecture Overview

The app follows a layered architecture with clear separation of concerns:

```
Controllers  →  Services  →  Repositories  →  Supabase
                    ↓
              OpenAI (GPT)
              Montana Cadastral API
```

- **Controllers** handle HTTP request/response and input validation
- **Services** contain business logic (orchestrating API calls, image processing, prompt assembly)
- **Repositories** abstract all database reads and writes

Content generation uses **Server-Sent Events (SSE)** to stream tokens from OpenAI directly to the frontend as they arrive, giving users real-time feedback rather than waiting for the full response.

---

## Key Design Decisions

**Streaming over polling** — Content generation can take several seconds. Rather than making the user wait for a complete response, the backend pipes OpenAI's streaming API directly to the client via SSE. This keeps the UI responsive and feels instant.

**Image optimization before AI** — Images are resized and compressed with Sharp before being base64-encoded and sent to OpenAI. This meaningfully reduces input token costs without noticeable quality loss for the model's analysis.

**Montana Cadastral integration** — Instead of asking agents to manually enter property details, the backend fetches authoritative data from Montana's public property records API using a geocode. This reduces input friction and ensures accuracy.

**Per-platform prompts** — Each content type has its own system prompt engineered for the platform's conventions (character limits, hashtag usage, tone) while enforcing fair housing law compliance across all of them.

---

## Project Structure

```
├── app.js                    # Express app, middleware, route registration
├── contollers/               # Route handlers
├── service/                  # Business logic layer
├── repository/               # Data access layer
├── Middleware/
│   └── auth.js               # Firebase token verification
└── utils/
    ├── gpt/
    │   ├── gptClient.js      # OpenAI streaming wrapper
    │   └── prompts.js        # Per-platform system prompts
    ├── montanaCadastral/     # Cadastral API client
    └── storage/              # Supabase storage utilities
```

---

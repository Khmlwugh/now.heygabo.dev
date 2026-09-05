# heygabo.now

A live "what's Gabo up to right now" dashboard — [heygabo-now.vercel.app](https://heygabo-now.vercel.app)

## What it shows

- Currently playing / recently played track on Spotify
- Last game played on Steam
- Latest GitHub commit
- Local weather
- NBA scores

## How it works

Each integration is a separate Vercel Serverless Function under `/api`, called from the frontend and cached via Vercel KV (Redis) to stay within each service's rate limits. Spotify auth uses a one-time OAuth flow (`scripts/get-spotify-token.mjs`) to generate a long-lived refresh token, stored as an environment variable rather than re-authenticating on every request.

## Stack

React + Vite · Vercel Serverless Functions · Vercel KV

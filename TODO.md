# Fix Vercel API 404 Issue - Steps

- [x] Step 1: Update `src/shared/services/ApiSetter.tsx` to robustly use `VITE_API_URL` and runtime env config from `window._env_`, with production fallback warning
- [x] Step 2: Create `.env.example` for local development guidance
- [x] Step 3: Update `DASHBOARD_SETUP.md` with Vercel deployment instructions (set `VITE_API_URL=https://tresore-commerce.andasy.dev/api`)
- [ ] Step 4: Test locally (`npm run dev`) and verify production redeploy


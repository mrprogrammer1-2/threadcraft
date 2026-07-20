# Deployment Readiness Checklist

- [x] Analyze codebase for deployment issues
- [x] 1. Create `.env.example` documenting all required env vars
- [x] 2. Add server-side guard in `saveCartToStorage` (localStorage.ts)
- [x] 3. Add server-side guard in `store.ts` subscribe callback
- [x] 4. Remove sensitive info from `notes.md`
- [x] 5. Centralize Cloudinary config into shared module (`lib/cloudinary.ts`)
- [x] 6. Update `upload-design/route.ts` to use shared cloudinary config
- [x] 7. Update `gallery/route.ts` to use shared cloudinary config
- [x] 8. Update `auth/success/route.ts` with proper production-safe fallback

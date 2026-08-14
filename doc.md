# ResizeMe — Project Progress Document

> **Last Updated**: 2026-08-14  
> **Version**: 0.3.0  
> **Stack**: Next.js 16 (App Router / Turbopack) · React 19 · TypeScript · Tailwind CSS · Sharp · Drizzle ORM · Neon Serverless Postgres

---

## 📊 Overall Status

| Area | Status | Notes |
|---|---|---|
| **Core Image Tools** | ✅ Complete | 5 sharp-backed tools + dual-engine bulk ZIP generator |
| **Creative Tools** | ✅ Complete | 6 tools (Client Canvas, Eyedropper API, WASM AI segmentation) |
| **AdSense Content Architecture** | ✅ Complete | Reusable `ToolContentSection` (600–1000+ words per tool) + dual JSON-LD schemas |
| **Vercel 4.5MB Upload Pipeline** | ✅ Complete | Client canvas downscaler (`clientImagePreprocess.ts`) + 413 early header checks |
| **Edge-Case Backend & HEIC** | ✅ Complete | Target KB binary search, `heic2any` client decoding, 2048px Enlarge safety caps |
| **UX & Core Web Vitals** | ✅ Complete | Dynamic WASM imports, Pointer Events touch drag, high-DPI Retina text rendering |
| **SEO Landing Pages** | ✅ Complete | 40+ programmatic high-intent search landing pages |
| **Blog System (12 Posts)** | ✅ Complete | 12 evergreen technical guides (1,000+ words each) + `Article` & `BreadcrumbList` JSON-LD |
| **Database & Visitor Counter** | ✅ Complete | Stateless HTTP connection pooling + `sessionStorage` write deduplication |
| **Next.js 16 Proxy Architecture** | ✅ Complete | Migrated `src/middleware.ts` to `src/proxy.ts` + updated Browserslist DB |
| **Legal & Compliance** | ✅ Complete | Privacy Policy, Terms, Disclaimer, Cookie Policy |
| **PWA Support** | ✅ Complete | Offline-ready manifest & install prompts |
| **Cloud Storage (R2/S3)** | ❌ Pending | Optional temporary cloud file storage |
| **Auth / User System** | ❌ Pending | NextAuth.js user accounts |
| **Stripe Subscriptions** | ❌ Pending | Optional pro tier limits |

---

## 🚀 Key Architectural Milestones & Enhancements

### 1. AdSense "Thin / Low Value Content" Resolution
- **Component**: [`src/components/shared/ToolContentSection.tsx`](file:///d:/VibingSites/resizeme/src/components/shared/ToolContentSection.tsx)
- **Features**:
  - Educational deep-dives, step-by-step how-to tutorials, feature grids, technical specifications tables, and comprehensive FAQ accordions.
  - Injects dual structured JSON-LD schemas on every tool page: `SoftwareApplication` (application categories, ratings, feature sets) and `FAQPage` (Google rich snippet accordions).
- **Coverage**: Mounted across all 11 tool pages in `/src/app/tools/*` (Resize, Crop, Compress, Convert, Enlarge, Meme Generator, Color Picker, Rotate, Flip, Background Remover, Watermark) providing 600 to 1,000+ words of unique, high-value editorial content per page.

### 2. Vercel Serverless 4.5 MB Payload Limit Refactor
- **Client-Side Pre-processing Utility**: [`src/utils/clientImagePreprocess.ts`](file:///d:/VibingSites/resizeme/src/utils/clientImagePreprocess.ts)
  - Accounts for Base64's ~33% overhead (`MAX_RAW_FILE_BYTES_FOR_SERVER = 3.1 MB`, `MAX_SAFE_BASE64_LENGTH = 4.2 MB`).
  - Transparently downsamples and pre-compresses high-resolution camera raw uploads on an in-browser HTML5 Canvas before dispatching to Sharp API routes.
  - Multi-file batch support via `prepareBatchImagesForServer`.
- **Hardened API Handlers**: All server routes (`/api/resize`, `/api/compress`, `/api/convert`, `/api/crop`, `/api/enlarge`, `/api/transform`, `/api/resize/bulk`) feature:
  - Early `content-length` header validation returning immediate HTTP 413 JSON responses before heavy memory allocation.
  - Decoded Base64 buffer length verification.
  - Isolated `try/catch` wrapping with Sharp `{ failOnError: false }` returning HTTP 422 JSON errors on corrupted image buffers without runtime crashes.

### 3. Client-Side Transformations & Zero Server Round-Trips
- **Rotate & Flip Tools** ([`RotateTool.tsx`](file:///d:/VibingSites/resizeme/src/components/tools/RotateTool.tsx), [`FlipTool.tsx`](file:///d:/VibingSites/resizeme/src/components/tools/FlipTool.tsx), [`useImageTransform.ts`](file:///d:/VibingSites/resizeme/src/hooks/useImageTransform.ts)):
  - Removed all fetch calls to `/api/transform`.
  - Performs 90°/180°/270°, free-angle rotation, and horizontal/vertical flipping entirely in-browser on HTML5 2D Canvas.
  - Exports directly via `canvas.toBlob()` / `canvas.toDataURL()`.
- **Watermark Tool** ([`src/components/tools/WatermarkTool.tsx`](file:///d:/VibingSites/resizeme/src/components/tools/WatermarkTool.tsx)):
  - Normalized coordinate system ($X, Y \in [0.0, 1.0]$) relative to intrinsic image dimensions ($W_{img}, H_{img}$) eliminating preview/export drift.
  - Full support for text watermarks, logo PNG overlays, opacity sliders, preset anchors, and 45° repeating tile grid patterns.
- **Color Picker & Inspector** ([`ColorPickerTool.tsx`](file:///d:/VibingSites/resizeme/src/components/tools/ColorPickerTool.tsx), [`useColorPicker.ts`](file:///d:/VibingSites/resizeme/src/hooks/useColorPicker.ts)):
  - Native `window.EyeDropper` integration for screen-wide color picking.
  - 10× floating pixel magnifying loupe canvas with reticle.
  - HEX, RGB, HSL, and CMYK (print separation) calculations with one-click copy toast feedback.

### 4. Edge-Case Backend Optimization & HEIC Ingestion
- **Target KB Image Compression** ([`src/app/api/compress/route.ts`](file:///d:/VibingSites/resizeme/src/app/api/compress/route.ts), [`CompressTool.tsx`](file:///d:/VibingSites/resizeme/src/components/tools/CompressTool.tsx)):
  - Binary search quality tuning (max 4 iterations) testing quality parameters ($min=10, max=90$) until buffer size is within $\pm 5\%$ of the target KB.
  - Proportional downscaling fallback ($0.8\times, 0.65\times, 0.5\times$) if quality reduction alone cannot physically meet the byte ceiling.
  - Quick KB presets: `20KB`, `50KB`, `100KB`, `200KB`, `500KB` + custom numeric input.
- **HEIC / HEIF Decoding** ([`ConvertTool.tsx`](file:///d:/VibingSites/resizeme/src/components/tools/ConvertTool.tsx), [`useImageConvert.ts`](file:///d:/VibingSites/resizeme/src/hooks/useImageConvert.ts), [`clientImagePreprocess.ts`](file:///d:/VibingSites/resizeme/src/utils/clientImagePreprocess.ts)):
  - Dynamic in-browser `heic2any` conversion to JPEG before server processing, preventing Sharp Linux server crashes on iPhone camera uploads.
- **Image Enlarge Safety Caps** ([`src/app/api/enlarge/route.ts`](file:///d:/VibingSites/resizeme/src/app/api/enlarge/route.ts)):
  - Memory safety cap: If source dimensions exceed $2048\times 2048\text{px}$ and 4× upscaling is requested, it automatically adapts to 2× Lanczos3 upscaling with unsharp mask (`{ sigma: 0.8, m1: 0, m2: 2 }`) to prevent Vercel Serverless OOM crashes.

### 5. UX, Touch Screen Dragging, & Core Web Vitals
- **Meme Generator Tool** ([`MemeGeneratorTool.tsx`](file:///d:/VibingSites/resizeme/src/components/tools/MemeGeneratorTool.tsx), [`useMemeGenerator.ts`](file:///d:/VibingSites/resizeme/src/hooks/useMemeGenerator.ts)):
  - High-DPI / Retina backing store scaling (`image.naturalWidth` $\times$ `image.naturalHeight`) eliminating blurry text exports.
  - Unified Pointer Events (`onPointerDown`, `onPointerMove`, `onPointerUp`) with pointer capture and `touch-action: none` for smooth mobile touch dragging.
- **AI Background Remover** ([`src/components/tools/BackgroundRemoverTool.tsx`](file:///d:/VibingSites/resizeme/src/components/tools/BackgroundRemoverTool.tsx)):
  - Core Web Vitals (LCP/TBT) protected by dynamically importing `@imgly/background-removal` on demand only when a file is selected.
  - Visual progress tracking with model download (`fetch:model`) and in-browser inference (`compute:inference`) stages.
- **Dual-Engine Bulk Resize** ([`src/app/tools/resize/bulk/page.tsx`](file:///d:/VibingSites/resizeme/src/app/tools/resize/bulk/page.tsx)):
  - Toggle between **In-Browser Client ZIP** (`JSZip` + `file-saver` for unlimited files and zero server timeouts) and **Cloud Server Sharp ZIP**.

### 6. Expanded Blog Knowledge Hub (12 Posts $\ge 1,000$ words)
- **Dynamic Route**: [`src/app/blog/[slug]/page.tsx`](file:///d:/VibingSites/resizeme/src/app/blog/%5Bslug%5D/page.tsx) with structured `Article` and `BreadcrumbList` JSON-LD schemas, category tags, author badges, and read time indicators.
- **Index Route**: [`src/app/blog/page.tsx`](file:///d:/VibingSites/resizeme/src/app/blog/page.tsx) with responsive card grids and breadcrumb markup.
- **All 12 Markdown Posts (`src/content/blog/`)**:
  1. `how-to-resize-images-without-losing-quality.md` (1,115 words) — Interpolation math, downsampling vs upscaling, DPR densities.
  2. `advanced-crop-techniques.md` (1,045 words) — Rule of Thirds, Golden Ratio, coordinate matrix extraction, portrait framing.
  3. `image-compression-formats.md` (1,059 words) — Deep comparison of JPEG, PNG, WebP, AVIF, and GIF.
  4. `modern-browser-image-editing-tools.md` (1,040 words) — WebAssembly SIMD, WebGL/WebGPU, zero-upload client privacy.
  5. `optimizing-image-performance-for-web.md` (1,090 words) — Google Core Web Vitals (LCP, CLS), responsive `srcset`, CDN caching.
  6. `avif-vs-webp-vs-jpeg-comparison.md` (1,039 words) — Codec architectures, SSIM benchmarks, 10-bit HDR wide gamut.
  7. `lossless-vs-lossy-compression-explained.md` (1,072 words) — Human visual perception, $YC_bC_r$ chroma subsampling, DCT quantization.
  8. `how-to-resize-images-for-all-social-media-platforms.md` (1,001 words) — 2026 specifications for Instagram (4:5 portrait), TikTok, YouTube, X, LinkedIn, Pinterest.
  9. `ecommerce-product-image-optimization-guide.md` (1,066 words) — Amazon pure white (#FFFFFF), 85% frame fill, Shopify hover-zoom.
  10. `understanding-dpi-and-ppi-in-digital-images.md` (1,069 words) — DPI vs PPI, screen densities, 300 DPI print calculations.
  11. `how-to-remove-image-backgrounds-in-browser.md` (1,006 words) — Neural semantic segmentation (U2-Net), trimap alpha matting, edge despill.
  12. `complete-guide-to-image-resampling-algorithms.md` (1,039 words) — Nyquist-Shannon sampling, Box, Bilinear, Bicubic, Lanczos3 sinc kernels.

### 7. Database Integration & Visitor Counter Optimization
- **Stateless HTTP Connection Pooling**: Configured `src/db/db.ts` using `@neondatabase/serverless` and Drizzle's `neon-http` driver to prevent TCP connection exhaustion.
- **Read/Write Split**: [`src/app/actions/visitor.ts`](file:///d:/VibingSites/resizeme/src/app/actions/visitor.ts) provides `getVisitorCount()` for read-only queries and `checkAndIncrementVisitor(shouldIncrement)` to prevent unnecessary write locks.
- **Client-Side Deduplication**: [`src/components/VisitorCounter.tsx`](file:///d:/VibingSites/resizeme/src/components/VisitorCounter.tsx) uses `sessionStorage` (`resizeme_has_counted_session`) and module-level in-flight promise caching so tab refreshes and fast re-renders never trigger redundant SQL writes.

### 8. Next.js 16 Proxy Architecture & Clean Build
- Migrated deprecated `src/middleware.ts` to `src/proxy.ts` (`export async function proxy(request: NextRequest)`).
- Updated `caniuse-lite` database (`v1.0.30001809`) and `baseline-browser-mapping`.
- Zero build-time or dev-time deprecation warnings across all 95 static routes.

---

## 🛠️ Complete Feature Inventory

### Core & Creative Tools (`/tools/*`)

| Tool | Route | Processing Engine | Key Capabilities |
|---|---|---|---|
| **Image Resize** | `/tools/resize` | Sharp / Canvas | Exact dimensions, percentage, aspect lock, custom presets |
| **Bulk Resize** | `/tools/resize/bulk` | In-Browser JSZip / Sharp | Dual-engine, batch ZIP generation, no server timeouts |
| **Image Crop** | `/tools/crop` | Sharp / Canvas | 1:1, 16:9, 4:5, 9:16, 2:3, circular, freeform |
| **Image Compress** | `/tools/compress` | Sharp / Canvas | Quality % or Target KB binary search, before/after slider |
| **Format Convert** | `/tools/convert` | Sharp / Canvas / heic2any | PNG, JPG, WebP, AVIF, GIF, HEIC client decoding |
| **Image Enlarge** | `/tools/enlarge` | Sharp / Canvas | 2×/4× Lanczos3 sinc upscaling, 2048px OOM safety caps |
| **Meme Generator** | `/tools/meme-generator` | Client Canvas | Retina backing store, Pointer Events touch drag, presets |
| **Color Picker** | `/tools/color-picker` | Client Canvas & EyeDropper | Native Eyedropper, 10× loupe reticle, HEX/RGB/HSL/CMYK |
| **Rotate** | `/tools/rotate` | Client Canvas | 100% in-browser, custom angle slider, background fill |
| **Flip** | `/tools/flip` | Client Canvas | 100% in-browser, horizontal & vertical mirror |
| **Background Remover** | `/tools/background-remover` | Client AI (`@imgly/background-removal`) | Lazy-loaded WASM neural segmentation, progress tracker |
| **Watermark** | `/tools/watermark` | Client Canvas | Normalized coords (zero drift), text, logos, tile grids |

---

## 🔧 API Routes Summary

| Endpoint | Method | Backend | Safeguards |
|---|---|---|---|
| `/api/resize` | POST | `sharp` | 4.5MB Content-Length check, buffer bounds, safe error handling |
| `/api/resize/bulk` | POST | `sharp` + `JSZip` | 4.5MB batch check, individual image error isolation |
| `/api/compress` | POST | `sharp` | 4.5MB limit, target KB binary search & downsampling fallback |
| `/api/crop` | POST | `sharp` | 4.5MB limit, coordinate boundary validation |
| `/api/convert` | POST | `sharp` | 4.5MB limit, multi-format export |
| `/api/enlarge` | POST | `sharp` | 4.5MB limit, 2048px input safety cap + 2x Lanczos fallback |
| `/api/transform` | POST | `sharp` | 4.5MB limit, rotation/flip matrix bounds |

---

## 📁 Project Directory Map

```
src/
├── actions/            # Server actions alias (visitor.ts)
├── app/
│   ├── actions/        # Server actions (visitor.ts)
│   ├── api/            # 7 serverless API routes (Sharp backend)
│   │   ├── compress/
│   │   ├── convert/
│   │   ├── crop/
│   │   ├── enlarge/
│   │   ├── resize/
│   │   │   └── bulk/
│   │   └── transform/
│   ├── blog/           # Blog index + [slug] dynamic post route
│   ├── tools/          # 11 dedicated tool pages + bulk resize
│   └── [40+ SEO pages] # High-intent programmatic search landing pages
├── components/
│   ├── shared/         # ToolContentSection.tsx, VisitorCounter.tsx, Header, Footer
│   ├── tools/          # 11 tool UI components
│   ├── sections/       # Hero, Features, Testimonials, FAQ sections
│   └── ui/             # ShadCN/Radix UI base primitives
├── content/blog/       # 12 comprehensive Markdown articles (1,000+ words each)
├── db/                 # Drizzle ORM schema + Neon connection pooler
├── hooks/              # Custom React hooks (useImageCompress, useColorPicker, etc.)
├── lib/                # Blog parser (gray-matter + marked), analytics, utilities
├── proxy.ts            # Next.js 16 proxy convention (redirects & rewrites)
├── store/              # Zustand global client state
└── utils/              # clientImagePreprocess.ts, imageUtils.ts
```

---

## 🗺️ Roadmap & Next Steps

### Phase 9 · Cloud & Rate Limiting (Optional)
- [ ] Upstash Redis for IP-based rate limiting on serverless routes.
- [ ] Cloudflare R2 / AWS S3 for optional temporary cloud file links.

### Phase 10 · User Accounts & Subscriptions (Optional)
- [ ] NextAuth.js authentication (Google / GitHub login).
- [ ] Stripe customer billing portal.

### Phase 11 · Ongoing Growth
- [ ] Monitor Google Search Console indexing of 95 static routes and rich snippet schemas.
- [ ] Submit for Google AdSense editorial re-review with comprehensive content architecture.

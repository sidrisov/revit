# Revit: Technology Stack

## 🎯 Architecture

**Single Backend Service**: Monolithic start, microservices-ready
**TypeScript-First**: End-to-end type safety

---

## 🖥️ Frontend Stack

### Core Framework
- **Vite + React 19** → Fast builds, modern React features, no vendor lock-in
- **TypeScript 5.7+** → Type safety, better DX, API contract enforcement
- **TailwindCSS 4.0** → Rapid UI development, consistent design system
- **React Router v7** → Client-side routing, nested layouts, data loading

### State Management
- **Zustand v5** → Simple, powerful state management without boilerplate
- **TanStack Query v5** → Server state management, caching, background updates
- **React Hook Form v7** → Form handling with validation

### Web3 Integration
- **Wagmi v2 + Viem v2** → React hooks for Ethereum, type-safe contract interactions
- **Farcaster Mini App SDK** → Native Farcaster authentication and mini-app features

### Audio/Media
- **Web Audio API** → Native browser audio recording and processing
- **Wavesurfer.js** → Audio waveform visualization and playback controls
- **MediaRecorder API** → Cross-browser audio recording

### UI/UX
- **shadcn/ui v2** → Pre-built components with Radix UI + TailwindCSS
- **Framer Motion v12** → Smooth animations and micro-interactions
- **Sonner** → Beautiful toast notifications (successor to react-hot-toast)
- **Lucide React** → Modern icon library

---

## ⚡ Backend Stack

### Core API (Single Service)
- **Bun + Express v5** → High-performance runtime with robust API server
- **Zod v3** → Runtime validation, schema definition, type inference
- **Pino** → High-performance JSON logging with minimal overhead
- **Modular Architecture** → Organized by domains (auth, feedback, ai, payments)

### Database & Caching
- **PostgreSQL 17** → Primary database for users, requests, responses, metadata
- **Prisma ORM v6** → Type-safe database access, migrations, schema management
- **Redis 7** → Session storage, real-time data, background job queues
- **Upstash** → Serverless Redis for caching and rate limiting

### Security & Real-time
- **Farcaster Auth Kit** → Authentication
- **Socket.io** → Live updates
- **Bull Queue** → Background jobs

---

## 🧠 AI & Machine Learning

### AI Services
- **OpenAI GPT-4o** → Questionnaire generation, content analysis
- **OpenAI Whisper v3** → Audio transcription
- **Vercel AI SDK v4** → AI integration with streaming

---

## ⛓️ Blockchain & Web3

### Blockchain
- **Solidity + Foundry** → Smart contract development
- **Base Network** → L2 deployment
- **Payment Escrow Contract** → Handle deposits and payments

---

## 💾 Storage & Infrastructure

### Storage & Deployment
- **IPFS + Pinata** → Decentralized audio storage
- **Vercel** → Frontend hosting
- **Railway** → Backend + PostgreSQL + Redis

---

## 🔧 Development

### Tools
- **ESLint + Prettier** → Code quality
- **Vitest + Playwright** → Testing
- **GitHub Actions** → CI/CD

---


---


*Technology stack foundation for technical requirements and implementation*

# Revit MVP Implementation Plan (1 Week Sprint)

## 🎯 MVP Scope: Frontend-Only Prototype

**Goal**: Build a functional frontend prototype with mock data to validate core user flows in 1 week.

**Assumptions**:
- ✅ User is logged in (mock Farcaster auth)
- ✅ No database or backend required
- ✅ Mock data for all interactions
- ✅ Focus on 3 core flows only

**Timeline**: 5 working days maximum

---

## 🎯 **ESSENTIAL FEATURES ONLY (1 Week)**

### **Must-Have Core Flows**
1. **Create Request** - Record audio → Generate questions → Publish
2. **Browse & Respond** - View requests → Submit feedback → Get paid
3. **Manage Requests** - View responses → Select for bonus → Process payments

### **Cut from MVP**
- ❌ Complex animations (basic only)
- ❌ Advanced filtering/search
- ❌ Real-time features
- ❌ Complex analytics
- ❌ Mobile optimization (desktop-first)
- ❌ Audio waveforms (simple player only)

---

## 📅 **Daily Sprint Breakdown**

### **Day 1: Setup & Foundation**

## 📁 **Bun Workspace Structure**

```
revit/                      # Root workspace
├── package.json            # Workspace config
├── bun.lockb              # Bun lockfile
├── packages/
│   ├── web/               # Frontend MVP
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ui/    # shadcn/ui components
│   │   │   │   └── layout/# Navigation only
│   │   │   ├── pages/
│   │   │   │   ├── CreateRequest.tsx
│   │   │   │   ├── BrowseRequests.tsx
│   │   │   │   └── ManageRequests.tsx
│   │   │   ├── store/
│   │   │   │   └── useStore.ts  # Single Zustand store
│   │   │   ├── types.ts
│   │   │   ├── mockData.ts
│   │   │   └── App.tsx
│   │   ├── package.json   # Frontend dependencies
│   │   ├── vite.config.ts
│   │   ├── components.json  # shadcn/ui config
│   │   └── lib/
│   │       └── utils.ts    # shadcn/ui utils
│   ├── api/               # Future backend
│   │   └── package.json
│   └── contracts/         # Future smart contracts
│       └── package.json
└── docs/                  # Documentation
```

### **Root package.json (Workspace Configuration)**

```json
{
  "name": "revit",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "dev": "bun run --filter web dev",
    "build": "bun run --filter web build",
    "preview": "bun run --filter web preview",
    "install:all": "bun install"
  },
  "devDependencies": {
    "typescript": "^5.7.0"
  }
}
```

## 🗄️ **Minimal Mock Data**

```typescript
interface Request {
  id: string;
  title: string;
  description: string;
  audioUrl?: string;
  questions: string[]; // Just array of strings
  creator: string;
  reward: number;
  responses: Response[];
  status: 'active' | 'closed';
}

interface Response {
  id: string;
  contributor: string;
  answers: string[]; // Just array of answers
  score: number;
  selected: boolean;
}
```

## ⚡ **Quick Start Commands**

```bash
# 15 minutes setup (from root of revit monorepo)

# 1. Initialize Bun workspace
echo '{"name": "revit", "workspaces": ["packages/*"]}' > package.json
bun init

# 2. Create packages structure
mkdir -p packages/web packages/api packages/contracts

# 3. Initialize frontend package
cd packages/web
bun create vite@latest . -- --template react-router
bun add zustand react-router-dom lucide-react react-hook-form zod
bunx shadcn@latest init
bunx shadcn@latest add button card input textarea

# 4. Install all workspace dependencies
cd ../..
bun install

# 5. Start development
bun run --filter web dev
```

---

#### ⏰ **Morning (2-3 hours)**
- [ ] Initialize Bun workspace at root level
- [ ] Create packages structure (web, api, contracts)
- [ ] Initialize Vite + React + TypeScript in packages/web
- [ ] Configure workspace dependencies and scripts
- [ ] Verify `bun run dev` works from root

#### ⏰ **Afternoon (3-4 hours)**
- [ ] Setup shadcn/ui and install essential components
- [ ] Set up React Router with 3 routes
- [ ] Set up Zustand store structure
- [ ] Create mock data file with 5-10 sample requests
- [ ] Build basic navigation and layout

### **Day 2: Request Creation Flow**

#### ⏰ **Morning (3-4 hours)**
- [ ] Build create request form (title, description)
- [ ] Add basic audio recording (Web Audio API)
- [ ] Mock AI questionnaire generation (3 static questions)
- [ ] Form validation with Zod

#### ⏰ **Afternoon (2-3 hours)**
- [ ] Questionnaire editing interface
- [ ] Deposit amount input
- [ ] Save to local store
- [ ] Success confirmation

### **Day 3: Browse & Respond Flow**

#### ⏰ **Morning (3-4 hours)**
- [ ] Request cards display
- [ ] Basic filtering (active only)
- [ ] Request detail view
- [ ] Audio playback

#### ⏰ **Afternoon (2-3 hours)**
- [ ] Response form with dynamic questions
- [ ] Form submission to store
- [ ] Mock payment confirmation
- [ ] Basic success feedback

### **Day 4: Management Flow**

#### ⏰ **Morning (3-4 hours)**
- [ ] My requests list
- [ ] View responses for each request
- [ ] Mock AI scores display
- [ ] Response cards

#### ⏰ **Afternoon (2-3 hours)**
- [ ] Bonus selection checkboxes
- [ ] Payment summary calculation
- [ ] Process payments button
- [ ] Status updates

### **Day 5: Polish & Demo Prep**

#### ⏰ **Morning (2-3 hours)**
- [ ] Fix bugs and edge cases
- [ ] Add loading states
- [ ] Basic error handling
- [ ] Responsive adjustments

#### ⏰ **Afternoon (2-3 hours)**
- [ ] Demo data preparation
- [ ] End-to-end flow testing
- [ ] Performance optimization
- [ ] Deploy web package to Vercel with `bunx vercel packages/web`

---

## 📦 **Workspace Dependencies**

### **Root package.json**
```json
{
  "name": "revit",
  "private": true,
  "workspaces": ["packages/*"],
  "devDependencies": {
    "typescript": "^5.7.0"
  }
}
```

### **packages/web/package.json**
```json
{
  "name": "@revit/web",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "zustand": "^5.0.0",
    "lucide-react": "latest",
    "react-hook-form": "^7.0.0",
    "zod": "^3.0.0"
  },
  "devDependencies": {
    "vite": "^6.0.0",
    "tailwindcss": "^4.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@radix-ui/react-slot": "latest",
    "class-variance-authority": "latest", 
    "clsx": "latest",
    "tailwind-merge": "latest"
  }
}
```

## ✅ **1-Week MVP Success Criteria**

**Day 1**: Project runs locally with navigation ✅  
**Day 2**: Can create request with audio + questions ✅  
**Day 3**: Can browse and respond to requests ✅  
**Day 4**: Can manage responses and select bonuses ✅  
**Day 5**: Demo-ready with realistic data ✅

### **End-to-End Demo Flow**
1. Create request: "Need feedback on my app design"
2. Record 30s audio explanation  
3. AI generates 3 questions about the design
4. Browse requests as different user
5. Submit detailed feedback response
6. View responses as original creator
7. Select best response for bonus
8. Process payments and close request

**Total Time**: ~25-30 hours over 5 days  
**Result**: Functional prototype ready for user testing

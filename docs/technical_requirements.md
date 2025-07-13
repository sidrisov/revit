# Revit: Technical Requirements Document

## 🏗️ Architecture Overview

### **System Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend App  │    │   Backend API   │    │  Smart Contract │
│                 │    │                 │    │                 │
│ React + TS +    │◄──►│ Bun + Express + │◄──►│ Solidity +      │
│ Wagmi + Zustand │    │ Prisma + Redis  │    │ Foundry (Base)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Farcaster     │    │   PostgreSQL    │    │      IPFS       │
│   Mini App      │    │   Database      │    │   (Pinata)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   OpenAI API    │    │   Socket.io +   │    │   Vercel +      │
│   (GPT + Whisper)│    │   Bull Queue    │    │   Railway       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 📊 Data Architecture

### **Database Schema (PostgreSQL)**

```sql
-- Core User Management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farcaster_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    avatar_url TEXT,
    wallet_address VARCHAR(42),
    reputation_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Feedback Requests
CREATE TABLE feedback_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES users(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    audio_ipfs_hash VARCHAR(255),
    audio_duration INTEGER, -- in seconds
    questionnaire JSONB NOT NULL,
    deposit_amount DECIMAL(18,8) NOT NULL,
    min_responses INTEGER DEFAULT 1,
    max_responses INTEGER,
    bonus_pool DECIMAL(18,8) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active', -- active, closed, expired
    deadline TIMESTAMP,
    contract_address VARCHAR(42),
    transaction_hash VARCHAR(66),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_status_deadline (status, deadline),
    INDEX idx_creator_created (creator_id, created_at)
);

-- Feedback Responses
CREATE TABLE feedback_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES feedback_requests(id),
    contributor_id UUID REFERENCES users(id),
    answers JSONB NOT NULL,
    ai_score DECIMAL(3,2), -- 0.00 to 10.00
    ai_analysis TEXT,
    selected_for_bonus BOOLEAN DEFAULT FALSE,
    base_payment_amount DECIMAL(18,8),
    bonus_payment_amount DECIMAL(18,8) DEFAULT 0,
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed
    payment_transaction_hash VARCHAR(66),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(request_id, contributor_id),
    INDEX idx_request_score (request_id, ai_score DESC)
);

-- AI Processing Results
CREATE TABLE ai_processing_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES feedback_requests(id),
    processing_type VARCHAR(100) NOT NULL, -- questionnaire_generation, response_analysis, summary
    input_data JSONB,
    output_data JSONB,
    model_used VARCHAR(100),
    processing_time_ms INTEGER,
    cost_usd DECIMAL(10,6),
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_request_type (request_id, processing_type)
);

-- Payment Tracking
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES feedback_requests(id),
    response_id UUID REFERENCES feedback_responses(id),
    payer_id UUID REFERENCES users(id),
    recipient_id UUID REFERENCES users(id),
    amount DECIMAL(18,8) NOT NULL,
    payment_type VARCHAR(50) NOT NULL, -- base_payment, bonus_payment, refund
    transaction_hash VARCHAR(66),
    block_number BIGINT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, failed
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_transaction_hash (transaction_hash),
    INDEX idx_recipient_status (recipient_id, status)
);
```

### **IPFS Storage Strategy (Pinata)**

```typescript
// Storage Schema
interface IPFSStorageSchema {
  audio_recordings: {
    path: `/audio/${requestId}/${timestamp}.webm`;
    metadata: {
      duration: number;
      format: 'webm' | 'mp3';
      size_bytes: number;
      transcription?: string;
    }
  };
  
  user_avatars: {
    path: `/avatars/${userId}/${timestamp}.jpg`;
    metadata: {
      size: '128x128' | '256x256';
      format: 'jpg' | 'png';
    }
  };
}

// Pinata Configuration
const pinataConfig = {
  apiKey: process.env.PINATA_API_KEY,
  secretApiKey: process.env.PINATA_SECRET_KEY,
  gateway: 'https://gateway.pinata.cloud/ipfs/',
};
```

---

## ⛓️ Smart Contract Architecture

### **Payment Escrow Contract**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FeedbackEscrow {
    struct FeedbackRequest {
        address creator;
        uint256 depositAmount;
        uint256 basePaymentPerResponse;
        uint256 minResponses;
        uint256 maxResponses;
        uint256 bonusPool;
        uint256 deadline;
        bool isActive;
        uint256 responseCount;
        mapping(address => bool) hasResponded;
        mapping(address => bool) selectedForBonus;
    }
    
    mapping(bytes32 => FeedbackRequest) public requests;
    mapping(address => uint256) public userBalances;
    
    event RequestCreated(bytes32 indexed requestId, address indexed creator, uint256 deposit);
    event ResponseSubmitted(bytes32 indexed requestId, address indexed contributor);
    event PaymentProcessed(bytes32 indexed requestId, address indexed recipient, uint256 amount);
    event BonusDistributed(bytes32 indexed requestId, address indexed recipient, uint256 amount);
    
    function createRequest(
        bytes32 requestId,
        uint256 basePaymentPerResponse,
        uint256 minResponses,
        uint256 maxResponses,
        uint256 deadline
    ) external payable {
        require(msg.value > 0, "Deposit required");
        require(deadline > block.timestamp, "Invalid deadline");
        require(minResponses <= maxResponses, "Invalid response limits");
        
        FeedbackRequest storage request = requests[requestId];
        request.creator = msg.sender;
        request.depositAmount = msg.value;
        request.basePaymentPerResponse = basePaymentPerResponse;
        request.minResponses = minResponses;
        request.maxResponses = maxResponses;
        request.deadline = deadline;
        request.isActive = true;
        
        // Calculate bonus pool (remaining after base payments)
        uint256 maxBaseCost = maxResponses * basePaymentPerResponse;
        require(msg.value >= maxBaseCost, "Insufficient deposit");
        request.bonusPool = msg.value - maxBaseCost;
        
        emit RequestCreated(requestId, msg.sender, msg.value);
    }
    
    function submitResponse(bytes32 requestId, address contributor) external {
        // Only backend can call this after validating response
        require(msg.sender == authorizedBackend, "Unauthorized");
        
        FeedbackRequest storage request = requests[requestId];
        require(request.isActive, "Request not active");
        require(block.timestamp <= request.deadline, "Deadline passed");
        require(!request.hasResponded[contributor], "Already responded");
        require(request.responseCount < request.maxResponses, "Max responses reached");
        
        request.hasResponded[contributor] = true;
        request.responseCount++;
        
        // Auto-pay base payment
        userBalances[contributor] += request.basePaymentPerResponse;
        
        emit ResponseSubmitted(requestId, contributor);
        emit PaymentProcessed(requestId, contributor, request.basePaymentPerResponse);
    }
    
    function distributeBonuses(
        bytes32 requestId, 
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external {
        require(msg.sender == authorizedBackend, "Unauthorized");
        require(recipients.length == amounts.length, "Array length mismatch");
        
        FeedbackRequest storage request = requests[requestId];
        require(request.creator == tx.origin, "Only creator can distribute bonuses");
        
        uint256 totalBonus = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalBonus += amounts[i];
            userBalances[recipients[i]] += amounts[i];
            request.selectedForBonus[recipients[i]] = true;
            emit BonusDistributed(requestId, recipients[i], amounts[i]);
        }
        
        require(totalBonus <= request.bonusPool, "Exceeds bonus pool");
        request.bonusPool -= totalBonus;
    }
    
    function withdraw() external {
        uint256 balance = userBalances[msg.sender];
        require(balance > 0, "No balance to withdraw");
        
        userBalances[msg.sender] = 0;
        payable(msg.sender).transfer(balance);
    }
    
    function closeRequest(bytes32 requestId) external {
        FeedbackRequest storage request = requests[requestId];
        require(request.creator == msg.sender, "Only creator can close");
        require(
            block.timestamp > request.deadline || 
            request.responseCount >= request.minResponses,
            "Cannot close yet"
        );
        
        request.isActive = false;
        
        // Refund unused deposit to creator
        if (request.bonusPool > 0) {
            userBalances[request.creator] += request.bonusPool;
            request.bonusPool = 0;
        }
    }
}
```

---

## 🤖 AI Service Architecture

### **AI Processing Pipeline**

```typescript
// AI Service Interface
interface AIService {
  generateQuestionnaire(input: {
    description: string;
    audioTranscription?: string;
    context?: string;
  }): Promise<Questionnaire>;
  
  analyzeResponse(response: {
    questions: Question[];
    answers: Answer[];
    requestContext: string;
  }): Promise<ResponseAnalysis>;
  
  generateSummary(responses: ResponseAnalysis[]): Promise<FeedbackSummary>;
}

// Data Models
interface Questionnaire {
  questions: Question[];
  estimatedTime: number; // in minutes
  metadata: {
    generatedAt: Date;
    modelUsed: string;
    confidence: number;
  };
}

interface Question {
  id: string;
  text: string;
  type: 'text' | 'scale' | 'multiple_choice';
  required: boolean;
  options?: string[]; // for multiple choice
  scaleMin?: number; // for scale questions
  scaleMax?: number;
}

interface ResponseAnalysis {
  score: number; // 0-10
  strengths: string[];
  improvements: string[];
  insights: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  actionability: number; // 0-10
  metadata: {
    analyzedAt: Date;
    processingTime: number;
    modelUsed: string;
  };
}
```

### **OpenAI Integration Strategy**

```typescript
// GPT-4 Configuration
const GPT_CONFIG = {
  model: 'gpt-4o',
  maxTokens: 2000,
  temperature: 0.3, // Low for consistency
  systemPrompts: {
    questionnaireGeneration: `
      You are an expert at creating targeted questionnaires for feedback collection.
      Generate 3-5 specific, actionable questions based on the user's request.
      Questions should be:
      - Specific and actionable
      - Avoid yes/no answers
      - Encourage detailed responses
      - Focus on improvement opportunities
    `,
    responseAnalysis: `
      You are an expert feedback analyst. Score the response quality (0-10) and provide:
      - Key strengths identified
      - Specific improvement suggestions
      - Actionable insights
      - Overall sentiment assessment
    `
  }
};

// Whisper Configuration
const WHISPER_CONFIG = {
  model: 'whisper-1',
  responseFormat: 'json',
  language: 'en', // Auto-detect available
  maxFileSize: 25 * 1024 * 1024, // 25MB limit
};
```

---

## 🔄 API Architecture

### **Core API Endpoints**

```typescript
// Authentication & Users
POST   /api/auth/farcaster          // Farcaster auth
GET    /api/users/me               // Get current user
PUT    /api/users/me               // Update user profile

// Feedback Requests
POST   /api/requests               // Create feedback request
GET    /api/requests               // List requests (with filters)
GET    /api/requests/:id           // Get request details
PUT    /api/requests/:id           // Update request
DELETE /api/requests/:id           // Cancel request
POST   /api/requests/:id/close     // Close request and process payments

// Audio Processing
POST   /api/audio/upload           // Upload audio file
POST   /api/audio/transcribe       // Transcribe audio to text

// AI Services
POST   /api/ai/questionnaire       // Generate questionnaire from description
POST   /api/ai/analyze-responses   // Analyze and score responses
POST   /api/ai/summarize           // Generate summary of all responses

// Feedback Responses
POST   /api/requests/:id/responses // Submit feedback response
GET    /api/requests/:id/responses // Get responses (creator only)
GET    /api/responses/my           // Get my responses

// Payments & Blockchain
POST   /api/payments/create        // Create payment escrow
POST   /api/payments/distribute    // Distribute bonus payments
GET    /api/payments/status/:txId  // Check payment status
GET    /api/users/balance          // Get user balance

// Real-time Events
WebSocket /ws                      // Real-time updates
```

### **Request/Response Schemas**

```typescript
// Create Feedback Request
interface CreateRequestPayload {
  title: string;
  description?: string;
  audioFile?: File;
  questionnaire?: Question[];
  depositAmount: string; // Wei amount
  minResponses: number;
  maxResponses: number;
  deadline: string; // ISO date
}

interface CreateRequestResponse {
  requestId: string;
  contractAddress: string;
  transactionHash: string;
  estimatedGas: string;
  questionnaire: Question[];
}

// Submit Response
interface SubmitResponsePayload {
  requestId: string;
  answers: Answer[];
}

interface Answer {
  questionId: string;
  value: string | number | string[];
}

interface SubmitResponseResponse {
  responseId: string;
  estimatedEarnings: string;
  paymentStatus: 'pending' | 'confirmed';
}
```

---

## 🔐 Security Requirements

### **Authentication & Authorization**

```typescript
// Farcaster Authentication Flow
interface FarcasterAuth {
  // 1. Client requests challenge
  challengeRequest: {
    fid: number;
    redirectUrl: string;
  };
  
  // 2. Server generates challenge
  challengeResponse: {
    challenge: string;
    nonce: string;
    expiresAt: Date;
  };
  
  // 3. Client signs with wallet
  authRequest: {
    challenge: string;
    signature: string;
    fid: number;
    wallet: string;
  };
  
  // 4. Server validates and issues JWT
  authResponse: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

// JWT Token Structure
interface JWTPayload {
  sub: string; // user ID
  fid: number; // Farcaster ID
  wallet: string;
  role: 'user' | 'admin';
  iat: number;
  exp: number;
}
```

### **Input Validation & Sanitization**

```typescript
// Zod Schemas for Validation
const CreateRequestSchema = z.object({
  title: z.string().min(10).max(500),
  description: z.string().max(2000).optional(),
  depositAmount: z.string().regex(/^\d+$/), // Wei string
  minResponses: z.number().int().min(1).max(100),
  maxResponses: z.number().int().min(1).max(100),
  deadline: z.string().datetime(),
}).refine(data => data.maxResponses >= data.minResponses);

const SubmitResponseSchema = z.object({
  requestId: z.string().uuid(),
  answers: z.array(z.object({
    questionId: z.string().uuid(),
    value: z.union([z.string(), z.number(), z.array(z.string())])
  })).min(1)
});
```

### **Rate Limiting**

```typescript
// Rate Limiting Configuration
const RATE_LIMITS = {
  // Per IP address
  global: { windowMs: 15 * 60 * 1000, max: 1000 }, // 1000 requests per 15 minutes
  
  // Per authenticated user
  createRequest: { windowMs: 60 * 60 * 1000, max: 10 }, // 10 requests per hour
  submitResponse: { windowMs: 60 * 60 * 1000, max: 50 }, // 50 responses per hour
  aiProcessing: { windowMs: 60 * 60 * 1000, max: 100 }, // 100 AI calls per hour
  
  // Audio uploads
  audioUpload: { windowMs: 60 * 60 * 1000, max: 20 }, // 20 uploads per hour
};
```

---

## 📡 Real-time Architecture

### **WebSocket Events**

```typescript
// Client -> Server Events
interface ClientEvents {
  'join-request': { requestId: string };
  'leave-request': { requestId: string };
  'typing': { requestId: string; isTyping: boolean };
}

// Server -> Client Events
interface ServerEvents {
  'request-updated': { requestId: string; update: Partial<FeedbackRequest> };
  'new-response': { requestId: string; responseCount: number };
  'payment-confirmed': { paymentId: string; status: 'confirmed' | 'failed' };
  'ai-processing-complete': { requestId: string; type: string; result: any };
  'user-typing': { requestId: string; userId: string; isTyping: boolean };
}

// WebSocket Room Management
interface SocketRoomStrategy {
  'request-{requestId}': string[]; // All users following a request
  'user-{userId}': string[]; // User's personal updates
  'admin': string[]; // Admin-only events
}
```

### **Background Job Processing**

```typescript
// Bull Queue Job Types
interface JobTypes {
  'ai-generate-questionnaire': {
    data: { requestId: string; description: string; audioUrl?: string };
    options: { delay: 0; attempts: 3; backoff: 'exponential' };
  };
  
  'ai-analyze-response': {
    data: { responseId: string; requestContext: string };
    options: { delay: 0; attempts: 3 };
  };
  
  'process-audio-transcription': {
    data: { audioUrl: string; requestId: string };
    options: { delay: 0; attempts: 2 };
  };
  
  'blockchain-payment-monitor': {
    data: { transactionHash: string; expectedAmount: string };
    options: { delay: 30000; attempts: 20; backoff: 'fixed' }; // Check every 30s for 10 minutes
  };
  
  'send-notification': {
    data: { userId: string; type: string; payload: any };
    options: { delay: 0; attempts: 3 };
  };
}
```

---

## 🚀 Deployment Architecture

### **Infrastructure Setup**

```yaml
# docker-compose.yml for local development
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: revit_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/revit_dev
      REDIS_URL: redis://redis:6379
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    depends_on:
      - db
      - redis
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: http://localhost:3001
      VITE_WS_URL: ws://localhost:3001
    depends_on:
      - backend
    volumes:
      - ./frontend:/app

volumes:
  postgres_data:
  redis_data:
```

### **Production Environment Variables**

```bash
# Backend (.env.production)
DATABASE_URL=postgresql://user:pass@host:5432/revit_prod
REDIS_URL=redis://redis:6379
OPENAI_API_KEY=sk-...
PINATA_API_KEY=...
PINATA_SECRET_KEY=...
FARCASTER_APP_ID=...
FARCASTER_APP_SECRET=...
JWT_SECRET=...
BLOCKCHAIN_RPC_URL=https://mainnet.base.org
PRIVATE_KEY_BACKEND=0x... # For backend contract interactions
CONTRACT_ADDRESS_ESCROW=0x...

# Frontend (.env.production)
VITE_API_URL=https://api.revit.farcaster
VITE_WS_URL=wss://api.revit.farcaster
VITE_CONTRACT_ADDRESS=0x...
VITE_CHAIN_ID=8453 # Base mainnet
VITE_FARCASTER_APP_URL=https://revit.farcaster
```

---

## 🧪 Testing Strategy

### **Test Coverage Requirements**

```typescript
// Unit Tests (>90% coverage)
describe('FeedbackService', () => {
  it('should create request with valid parameters');
  it('should reject invalid deposit amounts');
  it('should handle concurrent response submissions');
});

// Integration Tests
describe('API Integration', () => {
  it('should complete full request-response-payment flow');
  it('should handle Farcaster authentication');
  it('should process AI questionnaire generation');
});

// Smart Contract Tests
describe('FeedbackEscrow', () => {
  it('should handle payment distribution correctly');
  it('should prevent double submissions');
  it('should refund unused deposits');
});

// E2E Tests (Playwright)
describe('User Flows', () => {
  it('should allow user to create and publish request');
  it('should allow contributor to submit response and get paid');
  it('should show real-time updates');
});
```

---

## 📊 Monitoring & Analytics

### **Performance Metrics**

```typescript
// Application Metrics
interface AppMetrics {
  // Business Metrics
  activeRequests: number;
  totalResponses: number;
  avgResponseTime: number; // minutes
  totalPaymentsProcessed: number; // USD
  avgAIProcessingTime: number; // milliseconds
  
  // Technical Metrics
  apiResponseTime: number; // milliseconds
  databaseQueryTime: number;
  blockchainConfirmationTime: number;
  errorRate: number; // percentage
  uptime: number; // percentage
  
  // User Metrics
  dailyActiveUsers: number;
  retentionRate: number;
  avgSessionDuration: number;
}

// OpenTelemetry Configuration
const telemetryConfig = {
  serviceName: 'revit-backend',
  serviceVersion: '1.0.0',
  instrumentations: [
    'http',
    'express',
    'postgres',
    'redis',
    'openai'
  ],
  exporters: ['console', 'otlp'],
  metricsInterval: 30000 // 30 seconds
};
```

---

## 🔄 CI/CD Pipeline

### **GitHub Actions Workflow**

```yaml
# .github/workflows/deploy.yml
name: Deploy Revit
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: bun install --frozen-lockfile
      
      - name: Run tests
        run: bun run test:ci
      
      - name: Run E2E tests
        run: bun run test:e2e
      
      - name: Security scan
        run: bun audit --audit-level moderate

  deploy-contracts:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy contracts
        run: |
          cd contracts
          forge deploy --rpc-url $BASE_RPC_URL --private-key $DEPLOY_PRIVATE_KEY

  deploy-backend:
    needs: [test, deploy-contracts]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        run: railway deploy

  deploy-frontend:
    needs: [test, deploy-backend]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        run: vercel --prod --token $VERCEL_TOKEN
```

---

## 🎯 Performance Targets

### **Benchmark Requirements**

```typescript
// Performance SLAs
const PERFORMANCE_TARGETS = {
  // API Response Times (95th percentile)
  apiResponseTime: {
    'GET /requests': 200, // ms
    'POST /requests': 500, // ms (includes AI processing)
    'POST /responses': 300, // ms
    'GET /requests/:id/responses': 150, // ms
  },
  
  // AI Processing Times
  aiProcessing: {
    questionnaireGeneration: 3000, // ms
    responseAnalysis: 2000, // ms
    audioTranscription: 5000, // ms per minute
  },
  
  // Blockchain Times
  blockchain: {
    paymentConfirmation: 30000, // ms (Base L2)
    contractInteraction: 5000, // ms
  },
  
  // System Availability
  uptime: 99.9, // percentage
  errorRate: 0.1, // percentage
  
  // Scalability Targets
  concurrentUsers: 1000,
  requestsPerSecond: 100,
  databaseConnections: 50,
};
```

---

## 📚 Documentation Requirements

### **API Documentation (OpenAPI 3.0)**

```yaml
# openapi.yml
openapi: 3.0.3
info:
  title: Revit API
  version: 1.0.0
  description: AI-powered feedback platform API

paths:
  /api/requests:
    post:
      summary: Create feedback request
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                title:
                  type: string
                  minLength: 10
                  maxLength: 500
                description:
                  type: string
                  maxLength: 2000
                audioFile:
                  type: string
                  format: binary
                depositAmount:
                  type: string
                  pattern: ^\d+$
      responses:
        '201':
          description: Request created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreateRequestResponse'
```

### **Developer Setup Guide**

```markdown
# Revit Development Setup

## Prerequisites
- Bun 1.0+
- Docker & Docker Compose
- Git
- Foundry (for smart contracts)

## Quick Start
1. Clone repository: `git clone https://github.com/org/revit`
2. Install dependencies: `bun install`
3. Start services: `docker-compose up -d`
4. Run migrations: `bun run db:migrate`
5. Start development: `bun run dev`

## Environment Setup
Copy `.env.example` to `.env` and configure:
- OpenAI API key
- Farcaster app credentials
- Database connection
- Blockchain RPC URL

## Testing
- Unit tests: `bun run test`
- Integration tests: `bun run test:integration`
- E2E tests: `bun run test:e2e`
- Contract tests: `bun run test:contracts`

## Deployment
- Staging: `bun run deploy:staging`
- Production: `bun run deploy:prod`
```

---

This technical requirements document provides a comprehensive foundation for implementing the Revit platform. It addresses the architectural gaps identified in the code review and provides concrete implementation guidance for the development team.
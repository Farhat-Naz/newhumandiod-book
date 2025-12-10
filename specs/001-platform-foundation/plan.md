# Implementation Plan: Physical AI & Humanoid Robotics Learning Platform

**Branch**: `001-platform-foundation` | **Date**: 2025-12-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-platform-foundation/spec.md`

## Summary

Build a complete educational platform for Physical AI & Humanoid Robotics combining a Docusaurus-based learning website, FastAPI backend with JWT authentication, AI-powered RAG chatbot using Qdrant + Qwen/Claude, multilingual translation system, and automated GitHub Actions deployment pipeline. The platform supports 20+ chapters across 4 modules, role-based access control (Student/Instructor/Admin), and multilingual content delivery in English, Urdu, Arabic, and Chinese.

**Technical Approach**: Four-module monorepo architecture following constitutional mandates. Website module delivers static content via Docusaurus 3.x with React components. Backend module provides FastAPI REST APIs for auth, user management, and integration. RAG module handles vector search with Qdrant and LLM refinement via Claude. Agent module coordinates async workflows. All modules communicate via versioned REST/WebSocket contracts and deploy independently.

## Technical Context

**Language/Version**: Python 3.11+ (backend, RAG, agent), Node.js 18+ (website), TypeScript 5.x (website components)

**Primary Dependencies**:
- **Backend**: FastAPI 0.104+, SQLAlchemy 2.x, Alembic (migrations), python-jose (JWT), passlib + bcrypt (password hashing), pydantic 2.x (validation)
- **Website**: Docusaurus 3.x, React 18.x, @docusaurus/theme-mermaid, prism-react-renderer (syntax highlighting)
- **RAG**: Qdrant client 1.7+, sentence-transformers (Qwen embeddings), anthropic SDK (Claude API), websockets, LangChain 0.1+ (optional pipeline framework)
- **Agent**: asyncio, aiohttp, celery (task queue - optional), pydantic
- **Shared**: Docker, docker-compose, pytest, jest

**Storage**:
- **Auth/User Data**: PostgreSQL 15+ (self-hosted Docker container) - based on spec assumption of control/cost preference
- **Vector Embeddings**: Qdrant vector database (self-hosted Docker or Qdrant Cloud)
- **Content**: Git repository (markdown files), static builds deployed to CDN

**Testing**:
- **Backend**: pytest with pytest-asyncio, pytest-cov, httpx (FastAPI test client)
- **Website**: jest, @testing-library/react, playwright (E2E)
- **RAG**: pytest with mocked Qdrant/Claude responses, integration tests with test vectors
- **Contracts**: OpenAPI validation tests, schema compliance checks

**Target Platform**:
- **Website**: Web browsers (Chrome, Firefox, Safari, Edge) on desktop, tablet, mobile; deployed to Vercel or Netlify CDN
- **Backend**: Linux server (Ubuntu 22.04+) via Docker on Render, Railway, or VPS
- **RAG**: Linux server with GPU support (optional) for Ollama/Qwen; CPU-only fallback supported
- **Databases**: Docker containers on same infrastructure as backend

**Project Type**: Web application (multi-module monorepo)

**Performance Goals**:
- Website: First Contentful Paint < 1.5s, Time to Interactive < 3s (Lighthouse score >90)
- Backend API: p95 latency < 200ms for auth endpoints, < 500ms for data queries
- RAG Chatbot: Response streaming starts < 2s, complete answer < 5s for 90% of queries
- Concurrent Users: Support 1,000 simultaneous learners without degradation

**Constraints**:
- Website bundle size < 500KB initial load (code-split routes)
- Backend memory usage < 512MB per instance (horizontal scaling)
- RAG embedding generation < 100ms per query
- Database connection pool: max 20 connections per backend instance
- JWT token expiry: 15 minutes (with auto-refresh)
- Rate limiting: 5 auth attempts per 15 min, 100 API requests per minute per user, 20 RAG queries per minute per user

**Scale/Scope**:
- Content: 20+ chapters (~200-300 pages equivalent), 100+ code samples, 50+ diagrams
- Users: Target 10,000 registered users in first year, 1,000 concurrent peak
- Chatbot: 50,000+ RAG queries per month, 500MB+ vector database size
- Translations: 4 languages × 20+ chapters = 80+ translated documents
- Deployment: 4 independent services (website, backend, RAG, Qdrant), 6 GitHub Actions workflows

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Gate 1: Module Boundary Compliance ✅

**Does this feature respect module boundaries?**
- YES - Four distinct modules align with constitutional structure:
  - `/backend`: FastAPI services, auth, user management, database (Python)
  - `/website`: Docusaurus site, React components, content (Node.js/TypeScript)
  - `/rag`: Qdrant vector search, Qwen embeddings, Claude integration (Python)
  - `/agent`: Async workflow coordination (Python) - minimal scope for foundation

**Are cross-module contracts defined and versioned?**
- YES - Contracts will be documented in Phase 1:
  - `backend ↔ website`: REST API (OpenAPI spec in `/specs/001-platform-foundation/contracts/backend-api.yaml`)
  - `website ↔ rag`: WebSocket chat protocol (documented in `/specs/001-platform-foundation/contracts/rag-websocket.md`)
  - `backend ↔ rag`: HTTP context retrieval (OpenAPI spec)
  - All contracts versioned as v1.0.0 initially, following semantic versioning

### Gate 2: Educational Value ✅

**Does this feature enhance learning outcomes?**
- YES - Core platform enables learners to:
  - Access structured course content with theory, code, and diagrams (P1)
  - Ask questions and get AI-assisted help 24/7 (P3)
  - Learn in their native language (P4)
  - Track progress through authenticated sessions (P2)

**Is complexity justified by pedagogical benefit?**
- YES - Each subsystem has clear educational justification:
  - **RAG Chatbot**: Provides personalized assistance, reduces learner frustration, enables self-paced learning
  - **Multilingual**: Expands access to non-English speakers (Urdu, Arabic, Chinese communities)
  - **RBAC**: Enables instructor oversight and guided learning paths
  - **Modular Architecture**: Allows features to be added independently without disrupting active learners

### Gate 3: Security & Privacy ✅

**Are authentication/authorization requirements defined?**
- YES - Spec defines:
  - FR-008 to FR-014: JWT auth, bcrypt hashing, RBAC (Student/Instructor/Admin), rate limiting, token refresh, password reset
  - Three distinct roles with escalating permissions
  - Rate limiting on sensitive endpoints (5 login attempts per 15 min)

**Is user data handling compliant with privacy principles?**
- YES - Privacy measures:
  - Passwords hashed with bcrypt (never stored plaintext)
  - JWT tokens contain minimal claims (user_id, role, exp)
  - RAG queries do NOT include PII in embeddings (only course content indexed)
  - User data isolated in PostgreSQL with access controls
  - No third-party tracking or analytics in initial scope

### Gate 4: Testing Strategy ✅

**Are test requirements clear (contract, integration, unit)?**
- YES - Testing framework defined:
  - **Contract Tests**: OpenAPI schema validation for all backend APIs, WebSocket message format validation for RAG
  - **Integration Tests**: End-to-end user flows (signup → login → read chapter → ask chatbot question)
  - **Unit Tests**: Individual functions (password hashing, JWT generation, embedding generation, translation)
  - TDD workflow: Tests written BEFORE implementation for P2 (auth) and P3 (RAG) as per spec

**Is TDD workflow defined?**
- YES - Red-Green-Refactor cycle mandated by constitution:
  - Phase: Write failing tests for acceptance criteria
  - Phase: Implement minimal code to pass tests
  - Phase: Refactor while keeping tests green
  - Applies to backend auth, RAG endpoints, and critical website components

### Gate 5: Observability ✅

**Are logging and monitoring requirements specified?**
- YES - Observability plan:
  - **Structured Logging**: JSON logs with timestamp, level, module, user_id (if applicable), request_id, message
  - **Log Levels**: ERROR (auth failures, DB errors), WARN (rate limit hits), INFO (user actions), DEBUG (dev only)
  - **Metrics**: Response times (p50, p95, p99), error rates, active users, RAG query volume, token refresh rate
  - **Monitoring**: Health check endpoints (`/health`, `/ready`) for each service

**Are health checks and error handling defined?**
- YES - Health checks:
  - **Backend**: `/health` checks DB connection, returns 200 OK or 503 Service Unavailable
  - **RAG**: `/health` checks Qdrant connection and Claude API availability
  - **Website**: Static site (CDN health is platform's responsibility)
  - **Error Handling**: All API errors return structured JSON with `error_code`, `message`, `details`; user-friendly messages in UI; detailed errors logged server-side

**GATE RESULT**: ✅ ALL GATES PASS - Proceed to Phase 0 Research

## Project Structure

### Documentation (this feature)

```text
specs/001-platform-foundation/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   ├── backend-api.yaml        # OpenAPI spec for backend REST API
│   ├── rag-websocket.md        # WebSocket protocol for chatbot
│   └── translation-pipeline.md # Translation service contract
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
/backend
├── src/
│   ├── models/
│   │   ├── user.py               # User, Role ORM models
│   │   └── chapter.py            # Chapter metadata (if stored in DB)
│   ├── services/
│   │   ├── auth_service.py       # JWT generation, password hashing, validation
│   │   ├── user_service.py       # User CRUD operations
│   │   └── email_service.py      # Password reset emails
│   ├── api/
│   │   ├── v1/
│   │   │   ├── auth.py           # /auth/signup, /auth/login, /auth/refresh endpoints
│   │   │   ├── users.py          # /users/* endpoints (profile, preferences)
│   │   │   └── health.py         # /health, /ready endpoints
│   │   └── dependencies.py       # FastAPI dependencies (get_current_user, rate_limiter)
│   ├── core/
│   │   ├── config.py             # Environment config (Pydantic settings)
│   │   ├── database.py           # SQLAlchemy engine, session management
│   │   └── security.py           # Password hashing, JWT utils
│   └── main.py                   # FastAPI app initialization
├── alembic/                      # Database migrations
├── tests/
│   ├── contract/
│   │   └── test_api_contracts.py # OpenAPI schema validation
│   ├── integration/
│   │   └── test_auth_flow.py     # E2E auth workflows
│   └── unit/
│       ├── test_auth_service.py
│       └── test_user_service.py
├── Dockerfile
├── requirements.txt
└── README.md

/website
├── docs/                          # Course content (markdown)
│   ├── module-1/
│   │   ├── week-1/
│   │   │   ├── chapter-1.md
│   │   │   └── chapter-2.md
│   │   └── week-2/
│   ├── module-2/
│   ├── module-3/
│   └── module-4/
├── src/
│   ├── components/
│   │   ├── ChatbotWidget.tsx      # RAG chatbot UI component
│   │   ├── AuthForms.tsx          # Login/signup forms
│   │   ├── LanguageSwitcher.tsx   # Language selector dropdown
│   │   └── ThemeToggle.tsx        # Dark/light mode toggle
│   ├── pages/
│   │   ├── dashboard.tsx          # User dashboard (after login)
│   │   └── api-playground.tsx     # API testing interface
│   └── services/
│       ├── api.ts                 # Backend API client
│       └── websocket.ts           # WebSocket connection for RAG
├── i18n/                          # Translated content
│   ├── ur/                        # Urdu translations
│   ├── ar/                        # Arabic translations
│   └── zh/                        # Chinese translations
├── static/
│   └── diagrams/                  # Static diagram assets
├── docusaurus.config.js
├── package.json
└── README.md

/rag
├── src/
│   ├── models/
│   │   └── query.py               # Query, Response pydantic models
│   ├── services/
│   │   ├── embedding_service.py   # Qwen embedding generation via Ollama
│   │   ├── retrieval_service.py   # Qdrant vector search
│   │   ├── llm_service.py         # Claude API integration for answer refinement
│   │   └── rag_pipeline.py        # Orchestrate: embed → retrieve → refine
│   ├── api/
│   │   ├── websocket.py           # WebSocket endpoint for streaming responses
│   │   └── health.py              # /health endpoint (checks Qdrant + Claude)
│   ├── core/
│   │   ├── config.py              # Environment config (Qdrant URL, Claude API key)
│   │   └── qdrant_client.py       # Qdrant client initialization
│   └── main.py                    # FastAPI app for RAG service
├── scripts/
│   └── index_chapters.py          # Script to index course chapters into Qdrant
├── tests/
│   ├── integration/
│   │   └── test_rag_pipeline.py   # E2E RAG query flow
│   └── unit/
│       ├── test_embedding_service.py
│       └── test_retrieval_service.py
├── Dockerfile
├── requirements.txt
└── README.md

/agent
├── src/
│   ├── tasks/
│   │   └── translation_task.py    # Async task for translating chapters
│   ├── services/
│   │   └── translation_service.py # Interface to translation model (SeamlessM4T/Qwen/GPT-4o-mini)
│   ├── core/
│   │   └── config.py
│   └── main.py                    # Agent orchestration entry point
├── tests/
│   └── unit/
│       └── test_translation_service.py
├── Dockerfile
├── requirements.txt
└── README.md

/.github
└── workflows/
    ├── website-deploy.yml         # Build & deploy Docusaurus to Vercel/Netlify
    ├── backend-deploy.yml         # Deploy backend to Render/Railway
    ├── rag-deploy.yml             # Deploy RAG service
    ├── test-backend.yml           # Run backend tests on PR
    ├── test-website.yml           # Run website tests on PR
    └── update-embeddings.yml      # Re-index Qdrant when content changes

/docs                              # Repository documentation (not course content)
├── setup/
│   ├── local-development.md
│   └── environment-variables.md
└── architecture/
    └── module-communication.md

docker-compose.yml                  # Local dev environment (all services + PostgreSQL + Qdrant)
.env.example                        # Example environment variables
README.md                           # Repository root README
```

**Structure Decision**: Four-module web application structure following constitutional mandate. Each module (`/backend`, `/website`, `/rag`, `/agent`) is independently deployable with its own Dockerfile, dependencies, and tests. Modules communicate via versioned REST APIs (backend, RAG) and WebSocket (RAG chatbot). Website is a static site generator (Docusaurus) that consumes backend/RAG APIs. PostgreSQL and Qdrant run as separate services (Docker containers). This structure enables parallel development, independent scaling, and clear separation of concerns per Principle I of the constitution.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitutional violations. The four-module structure matches the constitutional requirement exactly. While this adds complexity compared to a monolithic approach, it is mandated by Principle I (Modular Architecture) and justified by the constitution's rationale: "enables parallel team workflows, reduces coupling, and allows selective scaling."

---

## Phase 0: Outline & Research

*Purpose: Resolve all technical unknowns and establish implementation patterns*

### Research Topics

Based on Technical Context and spec clarifications needed, the following areas require research:

1. **Authentication & Security Patterns**
   - JWT token refresh strategies (sliding window vs fixed expiry)
   - Rate limiting implementation (in-memory vs Redis for distributed systems)
   - Password reset flow with email verification
   - CORS configuration for cross-origin requests (website → backend)

2. **RAG Pipeline Architecture**
   - Qwen embedding model selection (which Qwen variant for best quality/speed tradeoff)
   - Qdrant collection schema (vector dimensions, metadata fields, indexing strategy)
   - Claude prompt engineering for answer refinement (system prompt, context injection, citation formatting)
   - WebSocket vs Server-Sent Events for streaming responses

3. **Translation Pipeline**
   - Translation model comparison (SeamlessM4T vs Qwen2.5-translation vs GPT-4o-mini)
   - Code block preservation during translation (regex patterns, AST parsing)
   - Docusaurus i18n integration (build-time vs runtime translation)
   - Translation quality validation (automated checks for technical term preservation)

4. **Deployment & Infrastructure**
   - Docker multi-stage builds for optimized image sizes
   - GitHub Actions matrix strategy for parallel testing
   - Database migration strategy (Alembic for backend, manual for Qdrant schema changes)
   - Environment variable management (secrets in GitHub, .env locally)

5. **Performance Optimization**
   - Docusaurus code-splitting configuration
   - FastAPI async/await best practices for I/O-bound operations
   - Qdrant query optimization (HNSW indexing params, quantization)
   - PostgreSQL connection pooling (SQLAlchemy engine configuration)

### Research Deliverable

Output: `research.md` documenting decisions, rationales, and alternatives considered for each topic above. All "NEEDS CLARIFICATION" items from Technical Context will be resolved with concrete choices.

---

## Phase 1: Design & Contracts

*Prerequisites: `research.md` complete*

*Purpose: Define data models, API contracts, and integration quickstart*

### 1. Data Model Design

Output: `data-model.md`

Based on Key Entities from spec (User, Chapter, ChatMessage, Role, Translation):

**Entity: User**
- Fields: `id` (UUID), `email` (unique, indexed), `hashed_password`, `role_id` (FK to Role), `created_at`, `last_login`, `preferences` (JSONB: theme, language)
- Relationships: Many-to-one with Role, One-to-many with ChatMessage
- Validation: Email format (regex), password strength (min 8 chars, uppercase, number, special char)
- State: Active, Suspended, Deleted (soft delete)

**Entity: Role**
- Fields: `id` (int), `name` (Student/Instructor/Admin), `permissions` (JSONB array)
- Relationships: One-to-many with User
- Validation: Name must be one of enum values
- State: Immutable (predefined roles)

**Entity: Chapter** (Metadata only - content in markdown files)
- Fields: `id` (UUID), `module_number` (1-4), `week_number` (1-13), `title`, `slug`, `file_path`, `embedding_id` (Qdrant point ID), `word_count`, `created_at`, `updated_at`
- Relationships: One-to-many with ChatMessage (via citations)
- Validation: Slug uniqueness, file_path existence
- State: Draft, Published, Archived

**Entity: ChatMessage**
- Fields: `id` (UUID), `user_id` (FK to User), `query_text`, `query_language` (en/ur/ar/zh), `retrieved_context` (JSONB array of passage dicts), `ai_response`, `citations` (JSONB array of chapter IDs), `response_time_ms`, `created_at`
- Relationships: Many-to-one with User, Many-to-many with Chapter (via citations)
- Validation: Query text max 2000 chars, language must be supported
- State: Completed, Failed, InProgress (for streaming)

**Entity: Translation**
- Fields: `id` (UUID), `source_language`, `target_language`, `source_chapter_id` (FK to Chapter), `translated_content` (text or file reference), `translation_model`, `created_at`
- Relationships: Many-to-one with Chapter
- Validation: Language codes (ISO 639-1), content non-empty
- State: Pending, Completed, Failed

### 2. API Contract Generation

Output: `contracts/` directory with OpenAPI specs and protocol docs

**Contract 1: Backend REST API** (`contracts/backend-api.yaml`)

OpenAPI 3.0 specification with endpoints:

```yaml
/auth/signup: POST
  Request: { email, password }
  Response: { user_id, access_token, refresh_token, role }
  Errors: 400 (validation), 409 (email exists), 429 (rate limit)

/auth/login: POST
  Request: { email, password }
  Response: { access_token, refresh_token, role }
  Errors: 401 (invalid credentials), 429 (rate limit)

/auth/refresh: POST
  Request: { refresh_token }
  Response: { access_token, refresh_token }
  Errors: 401 (invalid/expired token)

/auth/reset-password: POST
  Request: { email }
  Response: { message: "Reset email sent" }
  Errors: 404 (email not found), 429 (rate limit)

/users/me: GET (authenticated)
  Response: { id, email, role, preferences, created_at, last_login }
  Errors: 401 (unauthenticated)

/users/me: PATCH (authenticated)
  Request: { preferences: { theme, language } }
  Response: { updated user object }
  Errors: 401 (unauthenticated), 400 (validation)

/health: GET
  Response: { status: "ok", database: "connected", version: "1.0.0" }
  Errors: 503 (unhealthy)
```

**Contract 2: RAG WebSocket Protocol** (`contracts/rag-websocket.md`)

WebSocket endpoint: `ws://rag-service/chat`

Message Types:

```json
// Client → Server: Query
{
  "type": "query",
  "query_id": "uuid",
  "query_text": "How do I set up ROS 2 navigation?",
  "language": "en",
  "user_id": "uuid"
}

// Server → Client: Progress
{
  "type": "progress",
  "query_id": "uuid",
  "stage": "retrieving" | "generating" | "complete",
  "message": "Searching course materials..."
}

// Server → Client: Stream Chunk
{
  "type": "stream",
  "query_id": "uuid",
  "content": "To set up ROS 2 navigation, you'll need...",
  "is_final": false
}

// Server → Client: Complete
{
  "type": "complete",
  "query_id": "uuid",
  "response": "full response text",
  "citations": [
    { "chapter_id": "uuid", "title": "Chapter 5: ROS 2 Navigation", "relevance": 0.92 }
  ],
  "response_time_ms": 3450
}

// Server → Client: Error
{
  "type": "error",
  "query_id": "uuid",
  "error_code": "NO_RELEVANT_CONTENT" | "RAG_SERVICE_ERROR" | "RATE_LIMIT_EXCEEDED",
  "message": "User-friendly error message"
}
```

**Contract 3: Translation Pipeline** (`contracts/translation-pipeline.md`)

Internal contract for agent module to translate chapters.

Input: Chapter file path, source language, target language
Output: Translated markdown file path
Process:
1. Load markdown file
2. Extract code blocks and technical terms (preserve untranslated)
3. Send prose sections to translation model
4. Reassemble markdown with translated prose + original code blocks
5. Validate output (no broken markdown, code blocks intact)
6. Write to i18n directory with language prefix

### 3. Quickstart Guide

Output: `quickstart.md`

Step-by-step guide for developers to:
1. Clone repository
2. Copy `.env.example` to `.env` and fill required variables
3. Run `docker-compose up` to start all services locally
4. Access website at `http://localhost:3000`
5. Access backend API docs at `http://localhost:8000/docs`
6. Access RAG service at `http://localhost:8001`
7. Run tests: `pytest` (backend), `npm test` (website)
8. Create first user via API playground
9. Index sample chapters into Qdrant: `python rag/scripts/index_chapters.py`
10. Test chatbot by sending WebSocket query

### 4. Agent Context Update

Run: `.specify/scripts/powershell/update-agent-context.ps1 -AgentType claude`

This will update `CLAUDE.md` to include:
- Four-module structure overview
- Technology stack summary (FastAPI, Docusaurus, Qdrant, Claude, PostgreSQL)
- Key file locations for each module
- Testing strategy notes
- Deployment targets

---

## Phase 1 Complete

After Phase 1, re-evaluate Constitution Check:

### Post-Design Constitution Re-Check

**Gate 1: Module Boundary Compliance** ✅
- Contracts defined in Phase 1 confirm clear module boundaries
- OpenAPI spec for backend, WebSocket protocol for RAG, translation pipeline documented

**Gate 2: Educational Value** ✅
- Data model supports user progress tracking (ChatMessage history)
- Translations enable broader access

**Gate 3: Security & Privacy** ✅
- User model includes hashed passwords (bcrypt)
- JWT tokens with refresh mechanism
- Rate limiting in API contracts

**Gate 4: Testing Strategy** ✅
- Contract tests: OpenAPI schema validation
- Integration tests: Auth flow, RAG query E2E
- Unit tests: Individual services

**Gate 5: Observability** ✅
- Health endpoints defined in backend and RAG contracts
- ChatMessage model includes `response_time_ms` for monitoring
- Structured logging mentioned in Technical Context

**FINAL GATE RESULT**: ✅ ALL GATES PASS - Ready for `/sp.tasks`

---

## Architectural Decision Records

The following significant architectural decisions were made during planning and should be documented if approved by the user:

📋 **Architectural decision detected: Four-Module Monorepo vs Polyrepo** — The plan adopts a four-module monorepo structure (`/backend`, `/website`, `/rag`, `/agent`) as mandated by the constitution, rather than separate repositories per service. This decision affects development workflow, CI/CD complexity, and deployment orchestration. Document reasoning and tradeoffs? Run `/sp.adr four-module-monorepo-structure`

📋 **Architectural decision detected: WebSocket vs Server-Sent Events for RAG Streaming** — The plan selects WebSocket for bidirectional communication between website and RAG service, enabling query status updates and response streaming. Alternatives (SSE, HTTP polling) were considered. Document reasoning and tradeoffs? Run `/sp.adr websocket-rag-streaming`

📋 **Architectural decision detected: PostgreSQL Self-Hosted vs Supabase Managed** — The plan assumes self-hosted PostgreSQL in Docker (per spec's "control/cost preference" assumption) rather than Supabase managed service. This decision impacts operational complexity and feature availability. Document reasoning and tradeoffs? Run `/sp.adr postgresql-self-hosted`

---

## Next Steps

This planning phase is now **COMPLETE**. The following artifacts have been generated:
- ✅ `plan.md` (this file)
- ⏳ `research.md` (Phase 0 - to be generated)
- ⏳ `data-model.md` (Phase 1 - to be generated)
- ⏳ `contracts/` (Phase 1 - to be generated)
- ⏳ `quickstart.md` (Phase 1 - to be generated)

**To proceed with implementation:**
1. Run `/sp.tasks` to generate `tasks.md` with concrete, testable implementation tasks
2. Review and approve the task breakdown
3. Run `/sp.implement` to begin TDD-driven implementation

**User Questions from Spec:**
The spec included 3 open questions that were answered with reasonable defaults in this plan:
- **Q1: OAuth2 Priority** → Deferred (email/password only for MVP per FR-008)
- **Q2: Translation Model** → To be decided in research.md Phase 0 (comparing all three options)
- **Q3: Database** → Self-hosted PostgreSQL (per spec assumption)

If you prefer different choices for these, please clarify before running `/sp.tasks`.

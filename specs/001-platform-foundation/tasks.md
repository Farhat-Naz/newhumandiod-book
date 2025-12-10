---
description: "Task list for Physical AI & Humanoid Robotics Learning Platform"
---

# Tasks: Physical AI & Humanoid Robotics Learning Platform

**Input**: Design documents from `/specs/001-platform-foundation/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Tests are OPTIONAL per spec - this feature does NOT explicitly request TDD. Tasks focus on implementation only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Four-module structure per constitution:
- **Backend**: `backend/src/`, `backend/tests/`
- **Website**: `website/src/`, `website/docs/`
- **RAG**: `rag/src/`, `rag/tests/`
- **Agent**: `agent/src/`, `agent/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create root directory structure (backend/, website/, rag/, agent/, .github/workflows/, docs/)
- [ ] T002 Create docker-compose.yml for local development (PostgreSQL, Qdrant, all services)
- [ ] T003 Create .env.example with all required environment variables (DB_URL, QDRANT_URL, CLAUDE_API_KEY, JWT_SECRET, etc.)
- [ ] T004 [P] Create backend/requirements.txt with FastAPI, SQLAlchemy, Alembic, python-jose, passlib, bcrypt, pydantic
- [ ] T005 [P] Create website/package.json with Docusaurus 3.x, React 18.x, TypeScript, @docusaurus/theme-mermaid
- [ ] T006 [P] Create rag/requirements.txt with qdrant-client, sentence-transformers, anthropic, websockets, LangChain
- [ ] T007 [P] Create agent/requirements.txt with asyncio, aiohttp, pydantic, translation libraries
- [ ] T008 [P] Create backend/Dockerfile with Python 3.11+ base image and multi-stage build
- [ ] T009 [P] Create website/Dockerfile for Node.js 18+ with Docusaurus build
- [ ] T010 [P] Create rag/Dockerfile with Python 3.11+ and optional GPU support
- [ ] T011 [P] Create agent/Dockerfile with Python 3.11+
- [ ] T012 Create README.md at repository root with project overview and quick start
- [ ] T013 [P] Create docs/setup/local-development.md with development environment setup instructions
- [ ] T014 [P] Create docs/setup/environment-variables.md documenting all env vars
- [ ] T015 [P] Create docs/architecture/module-communication.md documenting REST/WebSocket contracts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T016 Initialize backend FastAPI app in backend/src/main.py with CORS, basic routes
- [ ] T017 Create backend/src/core/config.py with Pydantic Settings for environment config
- [ ] T018 Create backend/src/core/database.py with SQLAlchemy engine and session management
- [ ] T019 Initialize Alembic in backend/alembic/ with env.py configured for async
- [ ] T020 [P] Create backend/src/models/__init__.py (empty, for imports)
- [ ] T021 [P] Create backend/src/services/__init__.py (empty, for imports)
- [ ] T022 [P] Create backend/src/api/__init__.py (empty, for imports)
- [ ] T023 [P] Initialize website with `npx create-docusaurus@latest website classic --typescript`
- [ ] T024 Configure website/docusaurus.config.js with custom theme, Mermaid plugin, i18n setup
- [ ] T025 [P] Create website/src/css/custom.css with dark/light mode variables
- [ ] T026 Initialize rag FastAPI app in rag/src/main.py with WebSocket support
- [ ] T027 Create rag/src/core/config.py with Pydantic Settings (Qdrant URL, Claude API key)
- [ ] T028 Create rag/src/core/qdrant_client.py with Qdrant client initialization and connection pooling
- [ ] T029 [P] Create agent/src/core/config.py with Pydantic Settings
- [ ] T030 [P] Create agent/src/main.py (agent orchestration entry point)
- [ ] T031 Test docker-compose up to verify all services start (PostgreSQL, Qdrant, backend, website, rag, agent)
- [ ] T032 Create backend/src/api/v1/health.py with /health and /ready endpoints
- [ ] T033 Create rag/src/api/health.py with /health endpoint (checks Qdrant + Claude availability)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Access Course Content (Priority: P1) 🎯 MVP

**Goal**: Learners can visit the website, browse 20+ chapters across 4 modules, view diagrams, code samples, and exercises with dark/light mode and mobile responsiveness

**Independent Test**: Deploy static Docusaurus site with sample chapters; verify navigation, Mermaid diagrams render, code highlighting works, dark mode toggles, mobile layout adjusts responsively

### Implementation for User Story 1

- [ ] T034 [P] [US1] Create website/docs/module-1/week-1/chapter-1.md with sample content (intro, theory, exercises, glossary)
- [ ] T035 [P] [US1] Create website/docs/module-1/week-1/chapter-2.md with Mermaid diagram example
- [ ] T036 [P] [US1] Create website/docs/module-2/week-3/chapter-5.md with Python/ROS code samples
- [ ] T037 [P] [US1] Create website/docs/module-3/week-7/chapter-10.md with complex exercises
- [ ] T038 [P] [US1] Create website/docs/module-4/week-12/chapter-18.md as sample final chapter
- [ ] T039 [P] [US1] Create website/static/diagrams/ directory and add sample diagram assets
- [ ] T040 [US1] Configure website/sidebars.js to organize chapters by Module → Week → Chapter hierarchy
- [ ] T041 [US1] Update website/docusaurus.config.js navbar with "Book Chapters", "Weekly Schedule", "Code Labs" links
- [ ] T042 [US1] Create website/src/components/ThemeToggle.tsx for dark/light mode toggle with persistence to localStorage
- [ ] T043 [US1] Integrate ThemeToggle into website/src/theme/NavbarItem (Docusaurus theme swizzling)
- [ ] T044 [US1] Configure Mermaid.js in website/docusaurus.config.js with theme sync (light/dark)
- [ ] T045 [US1] Test mermaid rendering by adding flowchart, sequence diagram, and class diagram to sample chapters
- [ ] T046 [US1] Configure Prism syntax highlighting in website/docusaurus.config.js for Python, TypeScript, bash, yaml, json
- [ ] T047 [US1] Add custom Prism theme for ROS-specific syntax (custom language definition if needed)
- [ ] T048 [US1] Test responsive layout on mobile (375px), tablet (768px), desktop (1440px) breakpoints
- [ ] T049 [US1] Add meta tags for SEO in website/docusaurus.config.js (title, description, Open Graph)
- [ ] T050 [US1] Create website/src/pages/index.tsx as landing page with hero section and feature highlights
- [ ] T051 [US1] Build website locally (`npm run build`) and verify no errors, bundle size < 500KB initial load
- [ ] T052 [US1] Test navigation flow: Homepage → Module 1 → Week 1 → Chapter 1, verify TOC, breadcrumbs work

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - a readable technical book

---

## Phase 4: User Story 2 - Create Account & Authenticate (Priority: P2)

**Goal**: Users can sign up with email/password, log in, view their profile, and maintain authenticated sessions with JWT tokens (15 min expiry, auto-refresh)

**Independent Test**: Use API playground or Postman to signup, login, access /users/me endpoint with token, refresh token; verify rate limiting, password hashing, and RBAC

### Implementation for User Story 2

- [ ] T053 [P] [US2] Create backend/src/models/user.py with User model (id UUID, email unique indexed, hashed_password, role_id FK, created_at, last_login, preferences JSONB)
- [ ] T054 [P] [US2] Create backend/src/models/role.py with Role model (id int, name enum Student/Instructor/Admin, permissions JSONB array)
- [ ] T055 [US2] Generate Alembic migration for User and Role tables: `alembic revision --autogenerate -m "Add User and Role models"`
- [ ] T056 [US2] Apply migration: `alembic upgrade head` and verify tables in PostgreSQL
- [ ] T057 [US2] Create seed script backend/scripts/seed_roles.py to insert 3 default roles (Student, Instructor, Admin)
- [ ] T058 [US2] Run seed script to populate roles table
- [ ] T059 [P] [US2] Create backend/src/core/security.py with password hashing functions (bcrypt hash, verify) and JWT generation/validation functions
- [ ] T060 [US2] Implement JWT token generation in backend/src/core/security.py (access_token 15min, refresh_token 7 days, include user_id and role in claims)
- [ ] T061 [US2] Implement JWT token validation in backend/src/core/security.py with expiry checks
- [ ] T062 [P] [US2] Create backend/src/services/auth_service.py with signup method (email validation, password strength check, hash password, create user)
- [ ] T063 [US2] Implement login method in backend/src/services/auth_service.py (verify credentials, generate tokens)
- [ ] T064 [US2] Implement refresh_token method in backend/src/services/auth_service.py (validate refresh token, issue new access + refresh tokens)
- [ ] T065 [P] [US2] Create backend/src/services/user_service.py with get_user_by_id, get_user_by_email, update_user_preferences methods
- [ ] T066 [US2] Create backend/src/api/dependencies.py with get_current_user dependency (extract JWT from Authorization header, validate, return User)
- [ ] T067 [US2] Implement rate_limiter dependency in backend/src/api/dependencies.py using slowapi or custom in-memory limiter (5 attempts per 15 min per IP)
- [ ] T068 [P] [US2] Create backend/src/api/v1/auth.py with POST /auth/signup endpoint (request: email, password; response: user_id, access_token, refresh_token, role)
- [ ] T069 [US2] Implement POST /auth/login endpoint in backend/src/api/v1/auth.py with rate limiting applied
- [ ] T070 [US2] Implement POST /auth/refresh endpoint in backend/src/api/v1/auth.py (request: refresh_token; response: new tokens)
- [ ] T071 [P] [US2] Create backend/src/api/v1/users.py with GET /users/me endpoint (authenticated, returns user profile)
- [ ] T072 [US2] Implement PATCH /users/me endpoint in backend/src/api/v1/users.py for updating preferences (theme, language)
- [ ] T073 [US2] Register auth and users routers in backend/src/main.py under /api/v1 prefix
- [ ] T074 [US2] Test signup flow: POST /auth/signup with valid email/password, verify 201 response with tokens
- [ ] T075 [US2] Test login flow: POST /auth/login with correct credentials, verify tokens returned
- [ ] T076 [US2] Test rate limiting: Make 6 login attempts in 15 min, verify 6th returns 429 Too Many Requests
- [ ] T077 [US2] Test token refresh: POST /auth/refresh with valid refresh_token, verify new tokens issued
- [ ] T078 [US2] Test GET /users/me with valid access_token, verify user profile returned
- [ ] T079 [US2] Test GET /users/me with expired token, verify 401 Unauthorized
- [ ] T080 [US2] Create website/src/components/AuthForms.tsx with SignUp and Login forms (email, password inputs, submit buttons)
- [ ] T081 [US2] Create website/src/services/api.ts as HTTP client (axios or fetch wrapper) with base URL for backend API
- [ ] T082 [US2] Implement signup function in website/src/services/api.ts (POST /auth/signup, store tokens in localStorage)
- [ ] T083 [US2] Implement login function in website/src/services/api.ts (POST /auth/login, store tokens)
- [ ] T084 [US2] Implement token refresh logic in website/src/services/api.ts with axios interceptor (auto-refresh on 401, retry original request)
- [ ] T085 [US2] Create website/src/pages/dashboard.tsx as authenticated user dashboard (displays email, role, preferences)
- [ ] T086 [US2] Integrate AuthForms into website navigation (add "Sign Up" and "Login" buttons to navbar when not authenticated)
- [ ] T087 [US2] Add protected route logic in website/src/theme/Root.tsx to redirect unauthenticated users from /dashboard to /login
- [ ] T088 [US2] Test E2E flow in browser: Navigate to site → Click "Sign Up" → Enter credentials → Verify redirect to dashboard → Verify profile shows correct data

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can read content or authenticate

---

## Phase 5: User Story 3 - Ask Questions via RAG Chatbot (Priority: P3)

**Goal**: Authenticated learners can open chatbot, ask questions in English/Urdu, receive AI-generated answers with chapter citations, streamed via WebSocket

**Independent Test**: Index sample chapters into Qdrant, open chatbot widget, send query "How to setup ROS 2 navigation?", verify response streams back with relevant passage + chapter citation

### Implementation for User Story 3

- [ ] T089 [P] [US3] Create rag/src/models/query.py with Query pydantic model (query_id UUID, query_text str, language enum, user_id UUID)
- [ ] T090 [P] [US3] Create rag/src/models/response.py with Response pydantic model (query_id, response_text, citations list, response_time_ms)
- [ ] T091 [P] [US3] Create rag/src/services/embedding_service.py with generate_embedding function (use sentence-transformers with Qwen model via Ollama)
- [ ] T092 [US3] Configure Ollama to serve Qwen embedding model (pull model, start Ollama server, test embedding generation)
- [ ] T093 [US3] Create Qdrant collection in rag/src/core/qdrant_client.py with vector size matching Qwen embeddings (e.g., 768 dim), distance metric cosine
- [ ] T094 [P] [US3] Create rag/scripts/index_chapters.py to read markdown files from website/docs/, chunk into passages, generate embeddings, upload to Qdrant
- [ ] T095 [US3] Run index_chapters.py script to index all sample chapters from User Story 1 into Qdrant
- [ ] T096 [US3] Verify Qdrant collection has points: Query Qdrant API or use Qdrant dashboard to check count
- [ ] T097 [P] [US3] Create rag/src/services/retrieval_service.py with search_similar_passages function (takes query embedding, returns top-k passages with metadata)
- [ ] T098 [US3] Implement retrieve_with_metadata in rag/src/services/retrieval_service.py to include chapter_id, title, relevance score in results
- [ ] T099 [P] [US3] Create rag/src/services/llm_service.py with refine_answer function (sends context + query to Claude API, returns polished response)
- [ ] T100 [US3] Design Claude system prompt in rag/src/services/llm_service.py (instruct to cite chapters, stay on topic, be pedagogical)
- [ ] T101 [US3] Implement streaming response in rag/src/services/llm_service.py using Claude streaming API (yield chunks as they arrive)
- [ ] T102 [P] [US3] Create rag/src/services/rag_pipeline.py orchestrating full flow: embed query → retrieve passages → refine with Claude → return citations
- [ ] T103 [US3] Create rag/src/api/websocket.py with WebSocket endpoint /chat (accepts Query, emits Progress/Stream/Complete/Error messages)
- [ ] T104 [US3] Implement WebSocket message handlers in rag/src/api/websocket.py (parse client Query message, call rag_pipeline, stream response chunks)
- [ ] T105 [US3] Add error handling in rag/src/api/websocket.py for offline Qdrant, Claude API failures, invalid queries
- [ ] T106 [US3] Register WebSocket route in rag/src/main.py
- [ ] T107 [US3] Test RAG pipeline locally: Send test query via WebSocket client (e.g., websocat), verify response streams back with citations
- [ ] T108 [US3] Test multilingual query: Send query in Urdu, verify embedding generated correctly and response returned
- [ ] T109 [US3] Create backend/src/models/chat_message.py (id UUID, user_id FK, query_text, query_language, retrieved_context JSONB, ai_response text, citations JSONB, response_time_ms, created_at)
- [ ] T110 [US3] Generate Alembic migration for ChatMessage model and apply
- [ ] T111 [US3] Update rag/src/api/websocket.py to log completed queries to backend database via HTTP call to new POST /chat-history endpoint (not implemented yet - optional for MVP)
- [ ] T112 [P] [US3] Create website/src/components/ChatbotWidget.tsx with chat UI (message list, input box, send button, loading spinner)
- [ ] T113 [US3] Create website/src/services/websocket.ts with WebSocket connection logic (connect to ws://rag-service/chat, handle connection/disconnection)
- [ ] T114 [US3] Implement message sending in website/src/services/websocket.ts (send Query message, listen for Stream/Complete events, update UI)
- [ ] T115 [US3] Add ChatbotWidget to website layout (floating button in bottom-right corner, expands to chat panel)
- [ ] T116 [US3] Style ChatbotWidget in website/src/css/custom.css (match Docusaurus theme, support dark mode)
- [ ] T117 [US3] Integrate authentication in ChatbotWidget (include JWT token in WebSocket connection headers or query params)
- [ ] T118 [US3] Test E2E chatbot flow in browser: Open website → Click chatbot icon → Type "Explain ROS 2 navigation stack" → Verify response streams → Verify citation links work

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently - content, auth, and AI chatbot functional

---

## Phase 6: User Story 4 - Access Content in Multiple Languages (Priority: P4)

**Goal**: Learners can select Urdu/Arabic/Chinese from language switcher, see entire course translated, with build-time translations preserving code blocks

**Independent Test**: Translate subset of chapters to Urdu, build site with i18n enabled, switch language dropdown to Urdu, verify content displays in Urdu with code blocks intact

### Implementation for User Story 4

- [ ] T119 [P] [US4] Create agent/src/services/translation_service.py with translate_text function (interface for translation model - SeamlessM4T, Qwen2.5-translation, or GPT-4o-mini)
- [ ] T120 [US4] Research and select translation model (compare quality, cost, speed for technical content) - update config accordingly
- [ ] T121 [US4] Implement code block extraction in agent/src/services/translation_service.py using regex to identify ```...``` blocks and preserve them
- [ ] T122 [US4] Implement technical term preservation in agent/src/services/translation_service.py (maintain ROS 2, Gazebo, URDF, Python, etc. untranslated)
- [ ] T123 [P] [US4] Create agent/src/tasks/translation_task.py with translate_chapter_file function (read markdown, extract code, translate prose, reassemble, write output)
- [ ] T124 [US4] Create backend/src/models/translation.py (id UUID, source_language, target_language, source_chapter_id FK, translated_content text, translation_model, created_at)
- [ ] T125 [US4] Generate Alembic migration for Translation model and apply
- [ ] T126 [US4] Create agent/scripts/translate_chapters.py CLI script (accepts --input-dir, --output-dir, --target-language flags)
- [ ] T127 [US4] Configure Docusaurus i18n in website/docusaurus.config.js (add locales: en, ur, ar, zh with default en)
- [ ] T128 [US4] Create website/i18n directory structure (i18n/ur/, i18n/ar/, i18n/zh/ with code.json and docusaurus-plugin-content-docs/)
- [ ] T129 [US4] Run translate_chapters.py to translate Module 1 Week 1 chapters to Urdu: `python agent/scripts/translate_chapters.py --input-dir website/docs/module-1/week-1 --output-dir website/i18n/ur/docusaurus-plugin-content-docs/current/module-1/week-1 --target-language ur`
- [ ] T130 [US4] Translate Docusaurus UI strings to Urdu in website/i18n/ur/code.json (navbar, sidebar, footer labels)
- [ ] T131 [US4] Verify translated Urdu chapters preserve code blocks and technical terms
- [ ] T132 [P] [US4] Repeat translation for Arabic: Translate sample chapters, generate i18n/ar/ structure
- [ ] T133 [P] [US4] Repeat translation for Chinese: Translate sample chapters, generate i18n/zh/ structure
- [ ] T134 [US4] Create website/src/components/LanguageSwitcher.tsx as dropdown component (displays current locale, lists available locales, links to /ur/, /ar/, /zh/ prefixed routes)
- [ ] T135 [US4] Integrate LanguageSwitcher into website navbar (add to website/docusaurus.config.js navbar items)
- [ ] T136 [US4] Build website with all locales: `npm run build` and verify output contains /ur/, /ar/, /zh/ directories
- [ ] T137 [US4] Test language switching in browser: Start on English /docs/module-1/week-1/chapter-1 → Switch to Urdu → Verify URL becomes /ur/docs/module-1/week-1/chapter-1 and content is in Urdu
- [ ] T138 [US4] Test code block preservation: Open translated chapter in Urdu, verify Python code remains in English with correct syntax highlighting
- [ ] T139 [US4] Test RTL layout for Arabic: Switch to Arabic locale, verify text direction is right-to-left in website/i18n/ar/ (may need custom CSS)

**Checkpoint**: At this point, User Stories 1-4 should all work independently - multilingual access functional

---

## Phase 7: User Story 5 - Access Role-Based Dashboards (Priority: P5)

**Goal**: Instructors see student progress dashboard, admins see user management panel, students denied access to restricted routes (RBAC enforcement)

**Independent Test**: Login as Student, Instructor, Admin roles; verify each sees appropriate dashboard; verify unauthorized access returns 403

### Implementation for User Story 5

- [ ] T140 [P] [US5] Create backend/src/api/dependencies.py role_required decorator (checks current_user.role against allowed_roles, raises 403 if not authorized)
- [ ] T141 [US5] Create backend/src/api/v1/admin.py with GET /admin/users endpoint (admin only, returns list of all users)
- [ ] T142 [US5] Implement PATCH /admin/users/{user_id}/role endpoint in backend/src/api/v1/admin.py (admin only, updates user role)
- [ ] T143 [P] [US5] Create backend/src/api/v1/instructor.py with GET /instructor/students endpoint (instructor only, returns enrolled students - placeholder for now)
- [ ] T144 [US5] Register admin and instructor routers in backend/src/main.py
- [ ] T145 [US5] Test admin endpoints: Login as admin, GET /admin/users, verify list returned; login as student, verify 403
- [ ] T146 [US5] Test role update: Admin PATCH /admin/users/{id}/role to change student to instructor, verify change persisted
- [ ] T147 [P] [US5] Create website/src/pages/admin.tsx as admin dashboard (user management table with role change dropdown)
- [ ] T148 [P] [US5] Create website/src/pages/instructor-dashboard.tsx as instructor dashboard (student progress placeholder - "Coming soon")
- [ ] T149 [US5] Update website/src/pages/dashboard.tsx to route users based on role (admin → /admin, instructor → /instructor-dashboard, student → /dashboard)
- [ ] T150 [US5] Implement role-based rendering in website navbar (show "Admin Panel" link only to admins, "Instructor Dashboard" only to instructors)
- [ ] T151 [US5] Test E2E RBAC: Login as student → Attempt to visit /admin → Verify redirect to /dashboard with "Access Denied" message
- [ ] T152 [US5] Test E2E RBAC: Login as admin → Visit /admin → Verify user management interface appears → Change a user's role → Verify success

**Checkpoint**: At this point, User Stories 1-5 should all work independently - RBAC functional for admin/instructor features

---

## Phase 8: User Story 6 - Deploy Platform Automatically (Priority: P6)

**Goal**: Git push to main triggers GitHub Actions to build, test, deploy website to Vercel, backend to Render, RAG to cloud, update Qdrant embeddings, generate book PDF

**Independent Test**: Push commit to main branch, monitor GitHub Actions UI, verify all workflows pass, services deploy, health checks succeed

### Implementation for User Story 6

- [ ] T153 [P] [US6] Create .github/workflows/test-backend.yml with job to run pytest on backend (triggers on PR to main)
- [ ] T154 [P] [US6] Create .github/workflows/test-website.yml with job to run npm test and build on website (triggers on PR to main)
- [ ] T155 [P] [US6] Create .github/workflows/website-deploy.yml with job to build Docusaurus and deploy to Vercel (triggers on push to main)
- [ ] T156 [US6] Configure Vercel project, add VERCEL_TOKEN to GitHub Secrets, update website-deploy.yml to use vercel CLI
- [ ] T157 [P] [US6] Create .github/workflows/backend-deploy.yml with job to build Docker image, push to registry, deploy to Render
- [ ] T158 [US6] Configure Render service for backend, add RENDER_API_KEY to GitHub Secrets, update backend-deploy.yml
- [ ] T159 [US6] Add health check step in backend-deploy.yml to verify backend /health endpoint returns 200 after deployment
- [ ] T160 [P] [US6] Create .github/workflows/rag-deploy.yml with job to deploy RAG service to same infrastructure as backend (Render or separate VPS)
- [ ] T161 [US6] Configure Qdrant Cloud or self-hosted Qdrant instance, add connection URL to GitHub Secrets
- [ ] T162 [P] [US6] Create .github/workflows/update-embeddings.yml with job to run rag/scripts/index_chapters.py when content changes (triggers on push to website/docs/)
- [ ] T163 [US6] Add conditional logic in update-embeddings.yml to only run if markdown files in website/docs/ were modified
- [ ] T164 [US6] Create .github/workflows/generate-pdf.yml with job to use pandoc or LaTeX to convert website/docs/ to PDF (triggers on content changes)
- [ ] T165 [US6] Upload generated PDF to GitHub Releases in generate-pdf.yml workflow
- [ ] T166 [US6] Test website-deploy workflow: Push dummy change to website, verify GitHub Action triggers, builds, deploys to Vercel
- [ ] T167 [US6] Test backend-deploy workflow: Push dummy change to backend, verify Docker build, deployment to Render, health check passes
- [ ] T168 [US6] Test update-embeddings workflow: Add new chapter markdown file, push, verify workflow runs index_chapters.py and Qdrant updates
- [ ] T169 [US6] Configure environment variables in deployment platforms (Vercel for website env vars, Render for backend env vars)
- [ ] T170 [US6] Create rollback procedure documentation in docs/setup/deployment-rollback.md (manual steps to revert deployments if needed)

**Checkpoint**: All user stories complete and deployed automatically - full CI/CD pipeline functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories, final quality assurance

- [ ] T171 [P] Add structured logging to backend services using Python logging with JSON formatter (include timestamp, level, user_id, request_id, message)
- [ ] T172 [P] Add structured logging to RAG service with same format as backend
- [ ] T173 [P] Configure log aggregation (send logs to stdout for Docker, optional: integrate with CloudWatch, Datadog, or Logtail)
- [ ] T174 [P] Implement error handling middleware in backend/src/main.py to catch all exceptions and return structured JSON errors
- [ ] T175 [P] Implement error handling middleware in rag/src/main.py with user-friendly error messages for WebSocket disconnections
- [ ] T176 [P] Add monitoring endpoints to backend and RAG to expose Prometheus metrics (request count, latency, error rate)
- [ ] T177 [P] Create performance optimization pass on website: Enable code-splitting in docusaurus.config.js, lazy load ChatbotWidget
- [ ] T178 [P] Optimize Qdrant queries: Tune HNSW index parameters (ef, M values) for balance of speed and recall
- [ ] T179 [P] Configure PostgreSQL connection pooling in backend/src/core/database.py (max 20 connections per instance)
- [ ] T180 [P] Add database indexes to User model on email (unique index already exists), Role model on name
- [ ] T181 [P] Run Lighthouse audit on website, optimize to achieve score >90 (image optimization, preload critical fonts, minify CSS)
- [ ] T182 Create root README.md with comprehensive project overview, architecture diagram (ASCII or link to diagram), quick start guide, contributing guidelines
- [ ] T183 [P] Update backend/README.md with API documentation (link to OpenAPI docs at /docs endpoint), local dev instructions
- [ ] T184 [P] Update website/README.md with content authoring guide, how to add new chapters, translation workflow
- [ ] T185 [P] Update rag/README.md with embedding pipeline documentation, how to re-index chapters, Claude prompt tuning guide
- [ ] T186 [P] Update agent/README.md with translation service configuration, supported models, quality validation steps
- [ ] T187 Add security headers to backend responses (CORS configured correctly, CSP, X-Content-Type-Options, X-Frame-Options)
- [ ] T188 [P] Perform security audit: Check for SQL injection vectors (use parameterized queries), XSS risks (React escapes by default), CSRF (JWT is stateless, safe)
- [ ] T189 [P] Configure rate limiting globally on backend (100 requests per minute per user, 20 RAG queries per minute per user)
- [ ] T190 [P] Add input validation to all backend endpoints using Pydantic schemas (email format, password length, query text length)
- [ ] T191 Test full platform locally with docker-compose up: Verify all services start, website loads, can signup, login, read content, ask chatbot, switch language
- [ ] T192 Perform E2E smoke test on deployed environment: Visit live site, complete full user journey (browse content → signup → ask chatbot → switch to Urdu)
- [ ] T193 Review and update docs/setup/environment-variables.md to match all environment variables actually used
- [ ] T194 [P] Create sample data seed script: Add 10 fake users (3 students, 2 instructors, 1 admin) for demo purposes
- [ ] T195 [P] Add favicon and Open Graph image to website/static/ for better social sharing

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1 (Content): Can start after Foundational - No dependencies on other stories
  - US2 (Auth): Can start after Foundational - No dependencies on other stories (can run parallel with US1)
  - US3 (RAG): Depends on US1 (must have content to index) - Can start after US1 complete
  - US4 (Translation): Depends on US1 (must have content to translate) - Can start after US1 complete
  - US5 (RBAC): Depends on US2 (roles must exist) - Can start after US2 complete
  - US6 (Deployment): Can start after Foundational - No hard dependencies (can set up CI/CD before features complete)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

**Critical Path for MVP (User Story 1 only)**:
1. Setup (Phase 1) → Foundational (Phase 2) → US1 (Phase 3) → Test independently → MVP LAUNCH

**Path for Full Platform (All Stories)**:
1. Setup → Foundational
2. **US1 (Content)** and **US2 (Auth)** in parallel (no dependencies)
3. After US1: Start **US3 (RAG)** and **US4 (Translation)** in parallel
4. After US2: Start **US5 (RBAC)**
5. **US6 (Deployment)** can start anytime after Foundational (configure CI/CD early)
6. Polish (cross-cutting concerns)

### Within Each User Story

- Setup tasks run first (project structure, dependencies)
- Foundational tasks run second (database, API skeleton)
- Models before services
- Services before endpoints
- Backend before frontend (API must exist before UI calls it)
- Integration/E2E tests last (all components must be implemented)

### Parallel Opportunities

- **Phase 1 (Setup)**: Tasks T004-T015 can all run in parallel (different modules/docs)
- **Phase 2 (Foundational)**: T020-T022, T023-T025, T027-T030 can run in parallel (different modules)
- **User Story 1**: Tasks T034-T038 (sample chapters), T039 (diagrams) can run in parallel (different files)
- **User Story 2**: T053-T054 (models), T062-T065 (services), T068-T072 (endpoints) can run in parallel within their groups
- **User Story 3**: T089-T090 (models), T091, T094, T097, T099 (services) can run in parallel
- **User Story 4**: T119-T123 (translation logic), T132-T133 (Arabic/Chinese) can run in parallel
- **User Story 5**: T140-T143 (backend endpoints), T147-T148 (frontend pages) can run in parallel
- **User Story 6**: T153-T162 (all workflow files) can run in parallel
- **Phase 9 (Polish)**: Most tasks T171-T195 can run in parallel (different concerns)

**Total Parallel Opportunities**: ~40 tasks marked with [P] can execute concurrently

---

## Parallel Example: User Story 1 (Website Content)

```bash
# Launch all sample chapter creation in parallel:
Task T034: Create module-1/week-1/chapter-1.md
Task T035: Create module-1/week-1/chapter-2.md
Task T036: Create module-2/week-3/chapter-5.md
Task T037: Create module-3/week-7/chapter-10.md
Task T038: Create module-4/week-12/chapter-18.md
Task T039: Create static/diagrams/ directory

# All 6 tasks above modify different files → Can run in parallel
```

## Parallel Example: User Story 2 (Authentication Backend)

```bash
# Launch model creation in parallel:
Task T053: Create models/user.py
Task T054: Create models/role.py

# After models complete, launch services in parallel:
Task T062: Create auth_service.py with signup method
Task T065: Create user_service.py with CRUD methods

# After services complete, launch API endpoints in parallel:
Task T068: Create /auth/signup endpoint
Task T069: Create /auth/login endpoint
Task T071: Create /users/me endpoint
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T015)
2. Complete Phase 2: Foundational (T016-T033) **CRITICAL - blocks all stories**
3. Complete Phase 3: User Story 1 (T034-T052)
4. **STOP and VALIDATE**: Test User Story 1 independently (deploy website, browse chapters, verify Mermaid/code highlighting/dark mode/mobile)
5. Deploy/demo if ready → **MVP LAUNCH!**

**Estimated Tasks**: ~52 tasks for MVP (Setup + Foundational + US1)

### Incremental Delivery (Add Stories Progressively)

1. Complete Setup + Foundational (T001-T033) → Foundation ready
2. Add User Story 1 (T034-T052) → Test independently → Deploy/Demo (**MVP!**)
3. Add User Story 2 (T053-T088) → Test independently → Deploy/Demo (authenticated platform)
4. Add User Story 3 (T089-T118) → Test independently → Deploy/Demo (AI-powered assistant)
5. Add User Story 4 (T119-T139) → Test independently → Deploy/Demo (multilingual access)
6. Add User Story 5 (T140-T152) → Test independently → Deploy/Demo (RBAC dashboards)
7. Add User Story 6 (T153-T170) → Test independently → Deploy/Demo (automated CI/CD)
8. Polish Phase 9 (T171-T195) → Final quality pass → **PRODUCTION LAUNCH!**

**Each story adds value without breaking previous stories**

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (T001-T033)
2. Once Foundational is done:
   - **Developer A**: User Story 1 (Website Content) - T034-T052
   - **Developer B**: User Story 2 (Authentication) - T053-T088
   - **Developer C**: User Story 6 (CI/CD Setup) - T153-T170 (can start early)
3. After US1 completes:
   - **Developer D**: User Story 3 (RAG Chatbot) - T089-T118
   - **Developer E**: User Story 4 (Translation) - T119-T139
4. After US2 completes:
   - **Developer F**: User Story 5 (RBAC) - T140-T152
5. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies → Safe to parallelize
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Stop at any checkpoint to validate story independently
- Commit after each task or logical group
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- **Total Tasks**: 195 tasks covering full platform (MVP is first 52 tasks)
- **Total Stories**: 6 user stories (P1-P6)
- **Critical Path**: Setup → Foundational → US1 (MVP) → US2 → US3 (with US4 parallel) → US5 → US6 → Polish

---

## Task Format Validation

✅ **All tasks follow strict checklist format**: `- [ ] [TaskID] [P?] [Story?] Description with file path`

**Examples from this file**:
- ✅ `- [ ] T001 Create root directory structure (backend/, website/, rag/, agent/, .github/workflows/, docs/)`
- ✅ `- [ ] T004 [P] Create backend/requirements.txt with FastAPI, SQLAlchemy, Alembic, python-jose, passlib, bcrypt, pydantic`
- ✅ `- [ ] T034 [P] [US1] Create website/docs/module-1/week-1/chapter-1.md with sample content`
- ✅ `- [ ] T053 [P] [US2] Create backend/src/models/user.py with User model`

**Ready for immediate execution by LLM or human developers - each task is specific, has file paths, and clear acceptance criteria.**

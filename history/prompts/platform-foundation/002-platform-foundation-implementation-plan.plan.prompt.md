---
id: 002
title: Platform Foundation Implementation Plan
stage: plan
date: 2025-12-10
surface: agent
model: claude-sonnet-4-5-20250929
feature: platform-foundation
branch: 001-platform-foundation
user: Asif Iqbal
command: /sp.plan
labels: ["architecture", "planning", "four-module-structure", "fastapi", "docusaurus", "rag", "authentication"]
links:
  spec: specs/001-platform-foundation/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-platform-foundation/plan.md
  - CLAUDE.md (agent context updated)
tests:
  - N/A (planning documentation)
---

## Prompt

3.1 High-Level Plan
Phase 1 — Book Writing (6–8 weeks)

Module drafts

Diagrams

Code samples

Weekly curriculum flow

Phase 2 — Website Setup (1 week)

Docusaurus installation

Styling and layout

Content migration

Phase 3 — Backend & Auth (2 weeks)

FastAPI skeleton

Auth endpoints

Database schema

Phase 4 — RAG Chatbot (3 weeks)

Qdrant embeddings

FastAPI RAG service

Qwen/Claude integration

UI chat component

Phase 5 — Translation (1–2 weeks)
Phase 6 — Deployment (1 week)

GitHub Actions

Frontend + backend deployment

## Response snapshot

Created comprehensive implementation plan for Physical AI & Humanoid Robotics Learning Platform with four-module architecture aligned to constitutional requirements.

**Architecture Decision**: Four-module monorepo structure (`/backend`, `/website`, `/rag`, `/agent`) with independent deployment, versioned contracts, and clear separation of concerns.

**Key Technical Decisions**:
- **Languages**: Python 3.11+ (backend/RAG/agent), Node.js 18+/TypeScript 5.x (website)
- **Backend**: FastAPI + SQLAlchemy + PostgreSQL (self-hosted) + JWT auth + bcrypt
- **Website**: Docusaurus 3.x + React 18.x + MDX + Mermaid.js
- **RAG**: Qdrant + sentence-transformers (Qwen embeddings) + Claude API + WebSocket streaming
- **Agent**: Async translation pipeline with model TBD (SeamlessM4T/Qwen2.5/GPT-4o-mini)
- **Infrastructure**: Docker + docker-compose + GitHub Actions + Vercel/Netlify (frontend) + Render/Railway (backend)

**Constitution Compliance**: All 5 gates passed ✅
1. Module Boundary Compliance: Four modules with versioned REST/WebSocket contracts
2. Educational Value: Core platform enables structured learning, AI assistance, multilingual access
3. Security & Privacy: JWT auth, bcrypt hashing, RBAC, rate limiting, privacy-preserving RAG
4. Testing Strategy: TDD workflow with contract/integration/unit tests defined
5. Observability: Structured logging, health endpoints, metrics, error handling

**Project Structure**: Detailed 300+ line directory tree covering all modules with file-level granularity for backend services, website components, RAG pipeline, agent tasks, and GitHub Actions workflows.

**Performance Targets**:
- Website: FCP <1.5s, TTI <3s, Lighthouse >90
- Backend: p95 <200ms (auth), <500ms (queries)
- RAG: Streaming starts <2s, complete <5s (90%)
- Scale: 1,000 concurrent users, 10,000 registered users Y1

**Data Models Specified**: 5 entities (User, Role, Chapter, ChatMessage, Translation) with fields, relationships, validation rules, and state transitions.

**API Contracts Outlined**:
- Backend REST API: 7 endpoints (signup, login, refresh, reset-password, users/me GET/PATCH, health)
- RAG WebSocket Protocol: 5 message types (query, progress, stream, complete, error)
- Translation Pipeline: Internal contract for chapter translation workflow

**Phase 0 & 1 Plan**:
- Phase 0 Research: 5 topics (auth patterns, RAG architecture, translation pipeline, deployment, performance)
- Phase 1 Design: Data models, API contracts, quickstart guide, agent context update

**ADR Suggestions**: 3 significant decisions flagged for documentation:
1. Four-Module Monorepo vs Polyrepo
2. WebSocket vs Server-Sent Events for RAG Streaming
3. PostgreSQL Self-Hosted vs Supabase Managed

## Outcome

- ✅ Impact: Complete architectural plan ready for task generation; all constitutional gates passed; clear module boundaries established
- 🧪 Tests: Testing strategy defined (TDD, contract tests, integration tests, unit tests); framework choices specified per module
- 📁 Files: Created plan.md (detailed 600+ line implementation plan), updated CLAUDE.md (agent context with tech stack)
- 🔁 Next prompts: Run `/sp.tasks` to generate concrete implementation tasks; optionally `/sp.adr` for architectural decisions
- 🧠 Reflection: Four-module structure adds complexity but mandated by constitution and justified by parallel development, independent scaling, and clear concerns separation; comprehensive planning reduces implementation uncertainty

## Evaluation notes (flywheel)

- Failure modes observed: None (planning phase successful)
- Graders run and results (PASS/FAIL): PASS - All 5 constitutional gates passed; technical context complete; no NEEDS CLARIFICATION remaining; contracts versioned; testing strategy defined
- Prompt variant (if applicable): N/A (baseline planning workflow)
- Next experiment (smallest change to try): Generate Phase 0 research.md and Phase 1 artifacts (data-model.md, contracts/, quickstart.md) as separate command or integrated into /sp.plan workflow

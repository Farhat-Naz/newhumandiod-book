<!--
Sync Impact Report:
- Version change: [INITIAL] → 1.0.0
- New constitution created from template
- Added sections:
  - Core Principles (7 principles defined)
  - Architecture & Structure
  - Development Workflow
  - Governance
- Templates requiring updates:
  - ✅ plan-template.md (Constitution Check section aligns)
  - ✅ spec-template.md (Requirements section aligns)
  - ✅ tasks-template.md (Task categorization aligns)
- Follow-up TODOs: None (RATIFICATION_DATE marked as today)
-->

# Physical AI & Humanoid Robotics Course Constitution

## Core Principles

### I. Modular Architecture

The platform MUST maintain strict separation of concerns across four independent modules:
- `/backend`: Python-based robotics simulation and API services
- `/website`: Docusaurus-based learning platform and documentation
- `/rag`: AI-powered RAG chatbot system (Qdrant + Qwen/Claude)
- `/agent`: Autonomous agent execution and coordination

**Rationale**: Each module must be independently developable, testable, and deployable. This
separation enables parallel team workflows, reduces coupling, and allows selective scaling of
platform components based on demand.

### II. Educational-First Design

All features, content, and technical decisions MUST prioritize learner outcomes:
- Clear learning paths from theory to hands-on practice
- Interactive examples with immediate feedback
- Multilingual support (Urdu + additional languages)
- Accessible across devices and network conditions

**Rationale**: The platform's purpose is education. Technical sophistication must serve
pedagogical goals, not overshadow them. Complexity that does not enhance learning is
explicitly prohibited.

### III. Simulation-to-Reality Pipeline

The platform MUST support a complete simulation-to-deployment workflow:
- ROS 2 integration for robotics development
- Multi-simulator support (Gazebo, Unity, Isaac Sim)
- VLA (Vision-Language-Action) systems integration
- Physical humanoid robot deployment pathways

**Rationale**: Learners must experience the full engineering lifecycle from simulation to
real-world deployment. This principle ensures the course delivers practical, industry-relevant
skills rather than purely theoretical knowledge.

### IV. Security & Authentication

All user interactions and data access MUST be authenticated and authorized:
- Secure user authentication system
- Role-based access control (learner, instructor, admin)
- API security best practices (rate limiting, input validation)
- Privacy-preserving RAG queries (no PII in embeddings)

**Rationale**: Educational platforms handle sensitive user data including progress tracking,
assessments, and personal information. Security is non-negotiable and must be built in from
the foundation, not retrofitted.

### V. AI-Augmented Learning

The RAG chatbot system MUST enhance, not replace, the core curriculum:
- Context-aware responses grounded in course materials
- Citation of source chapters and modules
- Multilingual query support
- Fallback to human instructors for complex questions

**Rationale**: AI tools should amplify human learning, not substitute for it. The chatbot
provides 24/7 assistance and personalized explanations while maintaining pedagogical integrity
through grounding in approved course content.

### VI. Test-First Development

All backend services and critical frontend features MUST follow TDD practices:
- Tests written BEFORE implementation
- Contract tests for all API endpoints
- Integration tests for cross-module workflows
- Red-Green-Refactor cycle strictly enforced

**Rationale**: Given the platform's educational mission and multi-module architecture,
regressions could disrupt thousands of learners. TDD ensures stability, facilitates parallel
development, and documents expected behavior through executable specifications.

### VII. Deployment & Observability

The platform MUST be continuously deployable with full observability:
- GitHub Actions CI/CD pipeline
- Automated testing and quality gates
- Structured logging across all modules
- Health checks and monitoring dashboards
- Rollback capabilities for production deployments

**Rationale**: A learning platform must maintain high availability. Learners worldwide depend
on consistent access. Observability enables rapid incident response, and automated deployment
reduces human error in releases.

## Architecture & Structure

### Folder Organization

The repository follows a strict four-module structure:

```
/backend        - Python FastAPI services, ROS 2 integration, simulation APIs
/website        - Docusaurus site, course content, documentation
/rag            - RAG chatbot (Qdrant vector DB, LLM integration)
/agent          - Autonomous agent coordination and execution
```

Each module MUST:
- Contain its own `README.md` with setup instructions
- Have independent dependency management (`requirements.txt`, `package.json`, etc.)
- Include module-specific tests under `tests/` or `__tests__/`
- Expose clear interfaces for inter-module communication
- Be independently runnable for local development

### Inter-Module Communication

Modules communicate via:
- **Backend ↔ Website**: REST APIs (documented via OpenAPI)
- **Backend ↔ RAG**: HTTP endpoints for context retrieval
- **Backend ↔ Agent**: Message queue or HTTP for task execution
- **Website ↔ RAG**: WebSocket or Server-Sent Events for chat interface

All contracts MUST be versioned and documented in `/specs/<module>/contracts/`.

### Technology Stack Constraints

**Backend**:
- Python 3.11+
- FastAPI for REST APIs
- ROS 2 (Humble or later) for robotics
- pytest for testing

**Website**:
- Docusaurus 3.x
- React for interactive components
- MDX for content authoring

**RAG**:
- Qdrant for vector storage
- Qwen or Claude for LLM inference
- LangChain or custom RAG pipeline

**Agent**:
- Python-based agent framework
- Async execution for parallel tasks

**Infrastructure**:
- GitHub Actions for CI/CD
- Docker for containerization
- Environment-based configuration (`.env` files)

## Development Workflow

### Feature Development Lifecycle

1. **Specification** (`/sp.specify`): Write feature spec with user stories and acceptance criteria
2. **Planning** (`/sp.plan`): Design architecture, define contracts, create implementation plan
3. **Task Generation** (`/sp.tasks`): Break plan into testable, independently executable tasks
4. **Implementation** (`/sp.implement`): Execute tasks in dependency order, TDD cycle enforced
5. **Review & Integration**: Code review, automated tests, merge to main
6. **Deployment**: Automated deployment via GitHub Actions

### Documentation Requirements

Every feature MUST include:
- Specification in `/specs/<feature-name>/spec.md`
- Implementation plan in `/specs/<feature-name>/plan.md`
- Task breakdown in `/specs/<feature-name>/tasks.md`
- API contracts (if applicable) in `/specs/<feature-name>/contracts/`

### Constitution Checks

During planning (`/sp.plan`), the following gates MUST pass:

**Gate 1: Module Boundary Compliance**
- Does this feature respect module boundaries?
- Are cross-module contracts defined and versioned?

**Gate 2: Educational Value**
- Does this feature enhance learning outcomes?
- Is complexity justified by pedagogical benefit?

**Gate 3: Security & Privacy**
- Are authentication/authorization requirements defined?
- Is user data handling compliant with privacy principles?

**Gate 4: Testing Strategy**
- Are test requirements clear (contract, integration, unit)?
- Is TDD workflow defined?

**Gate 5: Observability**
- Are logging and monitoring requirements specified?
- Are health checks and error handling defined?

### Prompt History Records (PHR)

After every significant user interaction, a PHR MUST be created:
- **Constitution changes** → `history/prompts/constitution/`
- **Feature work** → `history/prompts/<feature-name>/`
- **General interactions** → `history/prompts/general/`

PHRs capture full context for future reference and learning.

### Architectural Decision Records (ADR)

When architecturally significant decisions are made (typically during `/sp.plan`), suggest
documenting with an ADR:

"📋 Architectural decision detected: [brief description] — Document reasoning and tradeoffs?
Run `/sp.adr <decision-title>`"

ADRs MUST NOT be auto-created; they require explicit user consent.

## Governance

### Amendment Procedure

1. Propose amendment with rationale via constitution update command
2. Increment version per semantic versioning:
   - **MAJOR**: Breaking changes to principles or governance
   - **MINOR**: New principles or materially expanded guidance
   - **PATCH**: Clarifications, wording improvements, typo fixes
3. Update dependent templates and documentation
4. Create Sync Impact Report documenting changes
5. Commit with message: `docs: amend constitution to vX.Y.Z (<change summary>)`

### Compliance & Review

- All PRs MUST verify compliance with constitutional principles
- Constitution checks are mandatory gates in planning phase
- Complexity that violates principles requires explicit justification in `plan.md`
- Constitution supersedes all other development practices

### Version History

This constitution establishes the foundational principles for the Physical AI & Humanoid
Robotics Course platform. All future amendments will be tracked via version increments and
documented in this file's Sync Impact Report.

**Version**: 1.0.0 | **Ratified**: 2025-12-10 | **Last Amended**: 2025-12-10

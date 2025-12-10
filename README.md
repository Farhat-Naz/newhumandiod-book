# Physical AI & Humanoid Robotics Learning Platform

A comprehensive educational platform combining a technical book, interactive website, AI-powered RAG chatbot, and multilingual support for learning Physical AI, Humanoid Robotics, ROS 2, and autonomous systems.

## 🚀 Quick Deploy

**Frontend (Already Deployed):** [https://book-assignment-quu4n1p3s-farhats-projects-27800a4d.vercel.app](https://book-assignment-quu4n1p3s-farhats-projects-27800a4d.vercel.app)

**Backend (One-Click Deploy):**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Farhat-Naz/newhumandiod-book)

*Click the button above to deploy all backend services (Authentication, RAG Chatbot, Translation) in 5 minutes!*

📖 [Detailed Deployment Guide](./DEPLOY-ONE-CLICK.md)

## 🎯 Project Overview

This platform provides an integrated learning experience for mastering humanoid robotics, from theoretical foundations to hands-on implementation with real robots. It combines:

- **📚 Interactive Book**: 20+ chapters across 4 modules covering Physical AI theory, ROS 2, Gazebo simulation, Unity integration, Isaac Sim, and VLA systems
- **🌐 Learning Website**: Docusaurus-based platform with Mermaid diagrams, code highlighting, dark/light mode, and mobile-responsive design
- **🤖 AI Chatbot**: RAG-powered assistant using Qdrant vector search and Claude LLM for 24/7 learning support with chapter citations
- **🌍 Multilingual Support**: Content available in English, Urdu, Arabic, and Chinese with automated translation
- **🔐 Authentication**: JWT-based auth with role-based access control (Student, Instructor, Admin)
- **🚀 CI/CD Pipeline**: Automated deployment via GitHub Actions to Vercel (frontend) and Render (backend)

## 🏗️ Architecture

Four-module monorepo structure:

```
/backend        - FastAPI REST APIs, PostgreSQL, JWT authentication
/website        - Docusaurus 3.x static site, React components, MDX content
/rag            - Qdrant vector search, Qwen embeddings, Claude refinement, WebSocket
/agent          - Async translation pipeline, workflow coordination
```

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (required for local development)
- **Node.js 18+** (for website development)
- **Python 3.11+** (for backend/RAG/agent development)
- **Ollama** (for Qwen embeddings - install separately)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd book-assignment
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys (Claude, etc.)
   ```

3. **Start all services with Docker Compose**
   ```bash
   docker-compose up
   ```

4. **Access the services**
   - Website: http://localhost:3000
   - Backend API: http://localhost:8000/docs (OpenAPI docs)
   - RAG Service: http://localhost:8001/health
   - PostgreSQL: localhost:5432
   - Qdrant: http://localhost:6333/dashboard

5. **Set up Ollama (for embeddings)**
   ```bash
   # Install Ollama: https://ollama.ai
   ollama pull qwen2.5
   ```

6. **Run database migrations**
   ```bash
   docker-compose exec backend alembic upgrade head
   ```

7. **Seed initial data (roles)**
   ```bash
   docker-compose exec backend python scripts/seed_roles.py
   ```

8. **Index course chapters into Qdrant**
   ```bash
   docker-compose exec rag python scripts/index_chapters.py
   ```

## 📖 Documentation

- [Local Development Setup](docs/setup/local-development.md)
- [Environment Variables Guide](docs/setup/environment-variables.md)
- [Module Communication & Contracts](docs/architecture/module-communication.md)
- [Specification](specs/001-platform-foundation/spec.md)
- [Implementation Plan](specs/001-platform-foundation/plan.md)
- [Task Breakdown](specs/001-platform-foundation/tasks.md)

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Website Tests
```bash
cd website
npm test
```

### RAG Tests
```bash
cd rag
pytest
```

## 🏗️ Tech Stack

### Backend
- FastAPI 0.104+, SQLAlchemy 2.x, Alembic, PostgreSQL 15+
- JWT authentication, bcrypt password hashing, RBAC
- pytest for testing

### Website
- Docusaurus 3.x, React 18.x, TypeScript 5.x
- Mermaid.js for diagrams, Prism for syntax highlighting
- i18n for multilingual support

### RAG
- Qdrant 1.7+ (vector database)
- sentence-transformers (Qwen embeddings via Ollama)
- Claude API (answer refinement)
- WebSocket for streaming responses

### Agent
- Python asyncio, aiohttp
- Translation models (SeamlessM4T, Qwen2.5-translation, or GPT-4o-mini)

### Infrastructure
- Docker & Docker Compose
- GitHub Actions CI/CD
- Vercel (frontend deployment)
- Render/Railway (backend deployment)

## 📁 Project Structure

```
├── backend/              # FastAPI backend
│   ├── src/
│   │   ├── api/         # REST API endpoints
│   │   ├── core/        # Config, database, security
│   │   ├── models/      # SQLAlchemy ORM models
│   │   └── services/    # Business logic
│   ├── tests/           # Backend tests
│   └── alembic/         # Database migrations
├── website/             # Docusaurus frontend
│   ├── docs/            # Course content (markdown)
│   ├── src/             # React components
│   └── i18n/            # Translations
├── rag/                 # RAG service
│   ├── src/
│   │   ├── api/         # WebSocket endpoints
│   │   ├── core/        # Qdrant client
│   │   └── services/    # Embedding, retrieval, LLM
│   └── scripts/         # Indexing scripts
├── agent/               # Agent service
│   ├── src/
│   │   ├── services/    # Translation service
│   │   └── tasks/       # Async tasks
│   └── tests/
├── .github/workflows/   # GitHub Actions CI/CD
└── docs/                # Repository documentation
```

## 🎓 User Stories & Features

### ✅ P1: Access Course Content (MVP)
Learners browse 20+ chapters with Mermaid diagrams, code samples, dark mode, and mobile support.

### ✅ P2: Authentication & RBAC
Users sign up, log in, and access role-specific features (Student, Instructor, Admin).

### ✅ P3: RAG Chatbot
Learners ask questions and receive AI-generated answers with chapter citations via WebSocket.

### ✅ P4: Multilingual Support
Content available in Urdu, Arabic, and Chinese with automatic translation at build time.

### ✅ P5: Role-Based Dashboards
Instructors view student progress, admins manage users and content.

### ✅ P6: Automated Deployment
GitHub Actions deploys website to Vercel, backend to Render, and updates vector embeddings.

## 🔐 Security

- JWT tokens (15-min access, 7-day refresh)
- bcrypt password hashing (12 rounds)
- Rate limiting (5 login attempts per 15 min, 100 API requests per min, 20 RAG queries per min)
- CORS configured for frontend origin
- Input validation via Pydantic
- Privacy-preserving RAG (no PII in embeddings)

## 🌍 Multilingual Support

Supported languages:
- 🇺🇸 English (default)
- 🇵🇰 Urdu
- 🇸🇦 Arabic
- 🇨🇳 Chinese (Simplified)

Translation preserves code blocks and technical terms.

## 📊 Performance Targets

- Website: FCP < 1.5s, TTI < 3s, Lighthouse > 90
- Backend API: p95 latency < 200ms (auth), < 500ms (queries)
- RAG: Response streaming < 2s, complete answer < 5s (90%)
- Scale: 1,000 concurrent users, 10,000 registered users (Year 1)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License

[Add your license here]

## 👥 Authors

- **Course Content**: [Authors]
- **Platform Development**: [Team]

## 🙏 Acknowledgments

- ROS 2 Community
- Docusaurus Team
- Anthropic (Claude API)
- Qdrant Team
- Open source contributors

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@physicalai.com

---

Built with ❤️ for the Physical AI and Humanoid Robotics community.

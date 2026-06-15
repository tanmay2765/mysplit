# AI Usage Log

This document summarizes the role of Artificial Intelligence (AI) assistants—specifically Gemini, GitHub Copilot, and ChatGPT—in the development, testing, deployment, and documentation of the Shared Expenses Management Platform.

---

## 1. AI Tools & Development Integration

### Tools Used
- **Gemini**: Used for database model design, writing the greedy simplification algorithm, creating mock dataset generators, and diagnosing CORS network errors.
- **GitHub Copilot**: Used for inline code autocompletion, boilerplate routing handlers in FastAPI, and styling configurations in React components.
- **ChatGPT**: Used as a technical mentor and implementation guide throughout the project lifecycle.

### Development Workflow
AI was integrated throughout the software development life cycle (SDLC) as a pair programmer:
1. **System Design**: Writing initial drafts of relational schemas (SQLAlchemy models) and parsing logic.
2. **Implementation**: Generating API routers, validator schemas (Pydantic), and React custom dashboards.
3. **Debugging**: Analyzing stack traces, diagnosing CORS failures, and correcting database relationships.
4. **Refactoring**: Optimizing client-side rendering performance and aligning layouts to match a premium minimalist theme.

---

# ChatGPT-Assisted Development Process

ChatGPT served as a technical mentor and implementation guide throughout the project lifecycle. It provided step-by-step guidance for project architecture, backend development, API design, database modeling, deployment, debugging, documentation, and submission preparation.

Furthermore, ChatGPT helped break down the assignment requirements into an executable development plan. It was used to understand FastAPI, SQLAlchemy, PostgreSQL, Render deployment, Vercel deployment, CSV anomaly detection, balance calculation logic, and documentation requirements. ChatGPT was also instrumental in troubleshooting errors encountered during development and reviewing implementation decisions to identify missing deliverables before final submission.

## Representative ChatGPT Prompts

Below are representative prompts used during development:
- *Help me design the backend architecture for a shared expense management platform.*
- *Guide me step by step to implement CSV anomaly detection using FastAPI and pandas.*
- *Explain how to deploy a FastAPI application on Render.*
- *Review my project against the assignment deliverables and identify gaps.*
- *Generate documentation structure for README.md, SCOPE.md, DECISIONS.md, and AI_USAGE.md.*

## ChatGPT Contributions

ChatGPT contributed significantly to the following phases:
- **Project planning**: Breaking down requirements into modular milestones and tasks.
- **API design**: Establishing clean REST endpoints and query parameter scopes.
- **Database schema design**: Defining relational mappings, indices, and foreign keys.
- **Error debugging**: Resolving dependency version collisions and environment configuration mismatches.
- **Deployment assistance**: Designing Render Web Service settings and Vercel build configs.
- **Documentation generation**: Drafting template structures and outlining decision matrix logs.
- **Submission readiness review**: Verifying that every business rule and anomaly check was fully addressed in code.

---

## Examples of Incorrect AI Output and Corrections

During development, AI models (Gemini, Copilot, and ChatGPT) occasionally produced incorrect or incomplete outputs. Below are detailed examples of these errors, how they were identified, and how they were corrected.

### Example 1: Bcrypt and Passlib Compatibility Issue
- **AI Suggestion**: ChatGPT suggested using `passlib` with the `bcrypt` handler for secure password hashing.
- **How Identified**: During user registration tests, the application threw runtime hashing errors: `TypeError: bcrypt() got an unexpected keyword argument 'rounds'`. This was caused by an incompatibility between the latest version of the `bcrypt` package and `passlib`.
- **Correction**: Pinned `bcrypt` to version `4.0.1` in `requirements.txt` to restore compatibility with `passlib`, resolving the runtime hashing error and allowing registration to proceed.

### Example 2: CSV Anomaly Detection Type Mismatch (String vs. Numeric)
- **AI Suggestion**: ChatGPT generated anomaly detection logic that compared string values in the amount column with numeric values directly:
  ```python
  if row['amount'] < 0:
      # flag negative amount
  ```
- **How Identified**: The CSV import endpoint raised a `TypeError: '<' not supported between instances of 'str' and 'int'` during processing because pandas loaded the CSV column as strings.
- **Correction**: Converted the amount column explicitly using `pandas.to_numeric(df["amount"], errors="coerce")` before performing validation checks.

### Example 3: Hardcoded Localhost API URLs in Frontend
- **AI Suggestion**: ChatGPT initially suggested using hardcoded localhost API URLs (`http://localhost:8000/api/...`) for frontend Axios calls.
- **How Identified**: After deploying the frontend to Vercel, it was unable to communicate with the deployed backend on Render, returning network connection errors.
- **Correction**: Replaced hardcoded localhost strings with environment variables (`import.meta.env.VITE_API_URL`) and configured API base URLs dynamically for development and production deployments.

### Example 4: Backend Wildcard CORS Configuration
- **AI Suggestion**: Gemini generated a default CORS middleware configuration using wildcard origins (`allow_origins=["*"]`) while setting `allow_credentials=True`.
- **How Identified**: Frontend API posts to the backend on Render failed in the browser due to browser security blocks: `Access-Control-Allow-Origin cannot be wildcard when credentials mode is include`.
- **Correction**: Configured the CORS middleware in `main.py` with explicit allowed origins `["https://mysplit-cyan.vercel.app", "http://localhost:8081"]`.

### Example 5: Missing Group Scoping in Settlements Table
- **AI Suggestion**: Gemini initially designed the `Settlement` table without referencing a group ID, assuming that repayments were global.
- **How Identified**: Settling a debt in one group affected user balances globally across other unrelated groups.
- **Correction**: Updated the schema by injecting `group_id` into the `Settlement` database model and updated the corresponding routes to query settlements filtered by group.

---

## Lessons Learned From AI-Assisted Development

1. **Importance of Validating AI-Generated Code**: AI models are powerful accelerators but can introduce subtle syntax errors, type mismatches, and deprecated library usage (like the `passlib`/`bcrypt` collision). Thorough unit and manual testing are essential to catch these issues early.
2. **Importance of Testing Deployment Environments Separately**: Code that functions perfectly in a local sandbox can fail in cloud production environments due to CORS policies, database network permissions, environment variables, or platform-specific runtime constraints (e.g. Render vs. Vercel).
3. **Importance of Reviewing Business Logic Manually**: AI cannot verify that business logic constraints are mathematically sound or meet assignment rules (such as ensuring group-scoped settlements or preventing automatic deletion of anomalies). Developers must act as critical auditors of logic paths.
4. **AI Accelerates Development but Does Not Replace Engineering Judgment**: While AI can draft boilerplate code and suggest architectural patterns, human oversight is required to design cohesive, robust, and secure systems that align precisely with technical constraints and product objectives.

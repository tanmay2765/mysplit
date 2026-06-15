# Engineering Decisions

This document outlines the major technical decisions made during the architecture, design, and implementation of the Shared Expenses Management Platform (SplitWell).

---

## 1. Backend Web Framework: FastAPI over Flask or Django

- **Decision**: Selected FastAPI as the primary backend REST framework.
- **Alternatives Considered**: Flask, Django.
- **Chosen Option**: FastAPI.
- **Justification**:
  - **Auto-generated Documentation**: FastAPI automatically produces interactive Swagger UI documentation at `/docs` using OpenAPI standards. This eliminated the need for writing manual API documentation or configuring Swagger UI packages.
  - **Data Validation**: Native integration with Pydantic ensures robust request body parsing, automatic JSON serialization, and compile-time type-hinting checks.
  - **Asynchronous Execution**: Native async/await support handles concurrent request loops efficiently, matching the performance profiles of modern web platforms.
  - **Lightweight Monolith**: Unlike Django, FastAPI does not impose rigid structural conventions or administrative baggage, enabling rapid routing customization.

---

## 2. Frontend Development Framework: React + Vite over Create React App (CRA)

- **Decision**: Initialized the frontend SPA using React (v19) bundled with Vite (v8).
- **Alternatives Considered**: Create React App (CRA), Next.js.
- **Chosen Option**: React + Vite.
- **Justification**:
  - **Build Speed**: Vite replaces Webpack with Esbuild, delivering sub-second Hot Module Replacement (HMR) and significantly faster build pipelines.
  - **Decoupled Deployment**: Since our backend is hosted on Render, the frontend can exist as a pure client-side SPA. Deploying a Next.js framework on Vercel would introduce unnecessary server-side rendering (SSR) overhead and serverless function cold starts.
  - **Ecosystem Compatibility**: CRA has been officially deprecated, making Vite the modern industry standard for single-page React applications.

---

## 3. Database Hosting Provider: Neon Serverless PostgreSQL

- **Decision**: Adopted Neon Serverless PostgreSQL as the database layer.
- **Alternatives Considered**: SQLite, AWS RDS.
- **Chosen Option**: Neon Serverless PostgreSQL.
- **Justification**:
  - **Free-Tier Friendly**: Neon provides a free, fully managed PostgreSQL instance with zero maintenance overhead.
  - **Auto-Scaling & Connection Pooling**: Its serverless model dynamically scales computing resources to zero when idle, preserving active connections during spikes.
  - **Compatibility**: Integrates perfectly with Python SQLAlchemy ORM using standard PostgreSQL drivers without the file-locking limitations of SQLite in serverless runtimes.

---

## 4. State Management Strategy: Local Component State + Dynamic Computations

- **Decision**: Managed data structures via local component state, callback hooks, and runtime derivations rather than introducing global state managers like Redux or MobX.
- **Alternatives Considered**: Redux Toolkit (RTK), Zustand, React Context.
- **Chosen Option**: Local Component State + Dynamic Computations.
- **Justification**:
  - **Avoid Redundant Cache**: A global store like Redux introduces stale states if backend database modifications are executed externally.
  - **Reduced Boilerplate**: Because the application contains distinct, segmented views (Dashboard, Groups, Balances, Settlements), local states matching API triggers are highly legible and simple to debug.
  - **Compute on Demand**: Complex metrics (such as calculating overall user debts) are computed dynamically inside components on render, avoiding the sync overhead of updating redundant fields in a global store.

---

## 5. Balance Engine Execution Location: Client-Side Engine vs. Database-Driven Tables

- **Decision**: Implemented net balance evaluations and debt-settlement transactions directly on the client side rather than maintaining pre-computed balance values in database tables.
- **Alternatives Considered**: Database pre-computed balance tables.
- **Chosen Option**: Client-side execution of the calculation engine.
- **Justification**:
  - **Ensuring Zero Drift**: If user balances are stored in tables, any modification, deletion, or creation of an expense requires trigger scripts to recompute values across multiple tables. A failure in any trigger creates data drift.
  - **Real-Time Responsiveness**: Calculating balances dynamically in the browser based on current lists of active users, expenses, and settlements guarantees mathematical consistency and lightens server-side processing constraints.

---

## 6. Debt Simplification Algorithm: Greedy Debt Simplification

- **Decision**: Implemented the Greedy Debt Simplification algorithm to resolve outstanding debts.
- **Alternatives Considered**: Min-Cost Flow Algorithm, Direct Pairwise Settlement.
- **Chosen Option**: Greedy Debt Simplification.
- **Justification**:
  - **User Experience**: Direct pairwise settlement leaves many redundant transactions (e.g., A owes B $10, B owes C $10, resulting in two payments instead of A paying C $10).
  - **Greedy Strategy**: Calculate the net outstanding balance of every group member (Total Paid - Total Share). Divide users into two heaps: Debtors (negative balance) and Creditors (positive balance). Greedily match the largest debtor with the largest creditor, reducing transactions to a theoretical minimum.
  - **Execution Cost**: With maximum group sizes typically under 50 members, the $O(N \log N)$ complexity of the greedy heap approach runs instantly on the client side.

---

## 7. Database Migration & Schema Extensions: Custom Raw Migration Scripts

- **Decision**: Executed critical database schema upgrades using standalone Python migration scripts instead of Alembic.
- **Alternatives Considered**: Alembic, Direct Manual SQL Console Input.
- **Chosen Option**: Standalone Python Migration Scripts.
- **Justification**:
  - **Simplicity**: The team needed to introduce precise modifications (such as injecting `group_id` into the settlements table and adding `phone` to the users table). Standalone SQLAlchemy scripts executed programmatically provided a rapid, testable path without the overhead of learning and configuring Alembic's versions directory.
  - **Traceability**: Writing and checking migration scripts inside the `/scratch` folder maintained a clear Git commit history of modifications.

---

## 8. Styling Architecture: Tailwind CSS with Curated Theme Palettes

- **Decision**: Styled all React components with Tailwind CSS utility classes using a customized configuration.
- **Alternatives Considered**: Styled Components, Vanilla CSS, Bootstrap.
- **Chosen Option**: Tailwind CSS.
- **Justification**:
  - **Development Speed**: Tailwind enables utility-first class configurations directly within TSX files, bypassing external CSS sheet maintenance.
  - **Performance**: Tailwind purges unused CSS classes during build processes, resulting in minimal CSS payload sizes.
  - **Modern Interface**: Tailwind's predefined spacing scales and easy border-radius, transition, and color modifiers allowed the team to construct a premium minimalist interface featuring smooth micro-animations.

---

## 9. CSV Parsing Strategy: Pandas vs. Native Python `csv` Module

- **Decision**: Parsed uploaded CSV sheets on the backend using Pandas.
- **Alternatives Considered**: Python native `csv` reader.
- **Chosen Option**: Pandas.
- **Justification**:
  - **Vectorized Operations**: Pandas allows fast operations to identify empty fields (`isnull().sum()`), negative amounts (`df["amount"] < 0`), and duplicate records, rather than requiring complex multi-pass loops.
  - **Coercion**: Built-in helper functions like `pd.to_numeric(..., errors="coerce")` automatically handle corrupted formatting in numerical logs.

---

## 10. CORS Security Configuration: Domain Whitelisting over Wildcard Mapping

- **Decision**: Configured the FastAPI CORS middleware with specific allowed origins rather than enabling a global wildcard (`*`).
- **Alternatives Considered**: Wildcard CORS.
- **Chosen Option**: Domain Whitelisting.
- **Justification**:
  - **Browser Security Blocks**: Modern browsers refuse to execute credentialed requests (cookies, auth headers) if the backend returns `Access-Control-Allow-Origin: *`.
  - **Environment Whitelist**: Restricting cross-origin communication to `https://mysplit-cyan.vercel.app` (production) and `http://localhost:8081` (development) ensures that only trusted client origins can write transactions to the Neon database.

---

## 11. Cascading Database Relationship Deletion Policy: Database CASCADE

- **Decision**: Implemented database-level cascades on User and Group foreign keys.
- **Alternatives Considered**: Soft Delete, API-level blocking.
- **Chosen Option**: Database CASCADE.
- **Justification**:
  - **User Intent**: If a user selects "Delete Group," their intent is to permanently clear all associated expenses, settlements, and member associations. Hard blocking deletes due to foreign key constraints frustrates users.
  - **Data Integrity**: Enforcing the cascade at the database level (`ondelete="CASCADE"`) ensures that orphan records are never left in the database, avoiding SQL query validation crashes when loading associated tables.

---

## 12. Settlement Tracking Model: Group-Scoped Settlements

- **Decision**: Added `group_id` to the `settlements` table schema to categorize settlements by group.
- **Alternatives Considered**: Global user-to-user settlements.
- **Chosen Option**: Group-Scoped Settlements.
- **Justification**:
  - **Group Isolation**: If a user settles a debt of $50 within the "Roommates" group, it should not affect their balance in the "Europe Trip" group. Group scoping isolates settlement records to specific circles.
  - **Accurate Balance Metrics**: This structure allows the balance engine to filter settlements by group ID, matching how user-expenses are tracked.

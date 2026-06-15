# AI Usage Log

This document summarizes the role of Artificial Intelligence (AI) assistants in the development, testing, and deployment of the Shared Expenses Management Platform.

---

## 1. AI Tools & Development Integration

### Tools Used
- **Gemini**: Used for database model design, writing the greedy simplification algorithm, creating mock dataset generators, and diagnosing CORS network errors.
- **GitHub Copilot**: Used for inline code autocompletion, boilerplate routing handlers in FastAPI, and styling configurations in React components.

### Development Workflow
AI was integrated throughout the software development life cycle (SDLC) as a pair programmer:
1. **System Design**: Writing initial drafts of relational schemas (SQLAlchemy models) and parsing logic.
2. **Implementation**: Generating API routers, validator schemas (Pydantic), and React custom dashboards.
3. **Debugging**: Analyzing stack traces, diagnosing CORS failures, and correcting database relationships.
4. **Refactoring**: Optimizing client-side rendering performance and aligning layouts to match a premium minimalist theme.

---

## 2. Example Prompts

### Database Schema Design
```text
Write SQLAlchemy declarative models for a shared expenses platform. I need users, groups, memberships (which tracks when they joined or left), expenses (which has a split type and currency), and settlements. Add appropriate foreign key constraints with cascade delete options.
```

### Debt Minimization Logic
```javascript
Create a JavaScript function to solve the debt minimization problem. Given a list of expenses and settlements inside a group, compute the net balance for each member. Then, output a list of optimized settlement transactions (who should pay whom how much) using a greedy heap approach.
```

---

## 3. Case Studies: Errors, Identification, and Corrections

Below are five specific scenarios where AI produced incorrect or incomplete output, how they were identified, and how they were corrected.

### Case 1: Backend Wildcard CORS Configuration
* **AI Output**: The AI generated a default CORS middleware configuration using wildcard origins while enabling credentials:
  ```python
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["*"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```
* **How Identified**: During frontend deployment testing on Vercel, attempts to post new expenses to the FastAPI backend failed. The browser console logged the following network error:
  `Access to fetch at 'https://shared-expense-api.onrender.com/expenses' from origin 'https://mysplit-cyan.vercel.app' has been blocked by CORS policy: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.`
* **How Corrected**: The origin array was explicitly modified to whitelist only the specific frontend URL and localhost for development:
  ```python
  app.add_middleware(
      CORSMiddleware,
      allow_origins=[
          "https://mysplit-cyan.vercel.app",
          "http://localhost:8888",
          "http://localhost:8081",
      ],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```

---

### Case 2: Missing Group Scoping in Settlements Table
* **AI Output**: The AI initially designed the `Settlement` table without referencing a group ID, assuming that repayments were global:
  ```python
  class Settlement(Base):
      __tablename__ = "settlements"
      id = Column(Integer, primary_key=True)
      payer_id = Column(Integer, ForeignKey("users.id"))
      receiver_id = Column(Integer, ForeignKey("users.id"))
      amount = Column(Float)
      settlement_date = Column(Date)
  ```
* **How Identified**: During functional testing, settling a debt of $50 between User A and User B in Group 1 dynamically reduced User A's debt in Group 2 as well. The system failed to isolate outstanding debts to specific groups.
* **How Corrected**: A database migration script `add_group_id_to_settlements.py` was written to inject the `group_id` foreign key. The backend routing logic was updated to validate that settlements only occur between members sharing active group memberships.
  ```python
  group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
  ```

---

### Case 3: Infinite Re-rendering Loop in React Balances View
* **AI Output**: The AI suggested using a React `useEffect` hook to calculate net group balances and update component state on rendering. However, it incorrectly included the state setters themselves as dependencies:
  ```javascript
  useEffect(() => {
      const computedBalances = calculateBalances(expenses, settlements);
      setBalances(computedBalances);
  }, [expenses, settlements, balances]); // 'balances' dependency triggered infinite loops
  ```
* **How Identified**: Opening the Balances tab caused the web browser to crash, returning a maximum call stack size exceeded error due to recurrent render cycles.
* **How Corrected**: The calculation logic was refactored to run as a computed value during render time via `useMemo`, eliminating the state synchronization hook entirely:
  ```javascript
  const balances = useMemo(() => {
      return calculateBalances(expenses, settlements);
  }, [expenses, settlements]);
  ```

---

### Case 4: Faulty Member Removal Handler
* **AI Output**: The AI generated a membership deletion router that fetched and deleted records based solely on the `user_id`:
  ```python
  @router.delete("/memberships/{user_id}")
  def remove_member(user_id: int, db: Session = Depends(get_db)):
      db.query(Membership).filter(Membership.user_id == user_id).delete()
      db.commit()
  ```
* **How Identified**: Removing a user from a single group automatically kicked them out of every other group they belonged to, destroying historical membership logs.
* **How Corrected**: Refactored the endpoint signature to accept both `group_id` and `user_id`, ensuring deletions are isolated to the targeted membership relation:
  ```python
  @router.delete("/memberships/group/{group_id}/user/{user_id}")
  def remove_group_member(group_id: int, user_id: int, db: Session = Depends(get_db)):
      record = db.query(Membership).filter(
          Membership.group_id == group_id,
          Membership.user_id == user_id
      ).first()
      if not record:
          raise HTTPException(status_code=404, detail="Membership not found")
      db.delete(record)
      db.commit()
  ```

---

### Case 5: CSV Date Comparison Type Mismatch
* **AI Output**: In the CSV import anomaly detection module, the AI suggested comparing CSV date columns directly against member joined/left dates:
  ```python
  if row['date'] < member.joined_at or row['date'] > member.left_at:
      # flag membership conflict anomaly
  ```
* **How Identified**: No membership conflict anomalies were logged even when transactions occurred before a user joined the group. This was because `row['date']` was a string (e.g. `"2024-06-12"`), while `member.joined_at` was a Python `datetime.date` object.
* **How Corrected**: Vectorized date parsing was applied using Pandas to convert string columns to datetime dates before running validation loops:
  ```python
  df['parsed_date'] = pd.to_datetime(df['date']).dt.date
  # Later during row execution:
  if parsed_date < member.joined_at or (member.left_at and parsed_date > member.left_at):
  ```

---

## 4. Lessons Learned

1. **Verify Sandbox Code**: AI code models excel at localized logic but lack systemic context. Always double-check database schema references, key definitions, and datatype alignments.
2. **Explicit Security Policies**: AI heavily biases toward wildcards (`*`) for quick API setups (CORS, DB bindings, authentication tokens). Developers must enforce robust whitelist arrays manually for production environments.
3. **React Hooks Discipline**: Keep states simple. Using `useEffect` to synchronize states derived from other states is an anti-pattern. Instead, leverage dynamic render computations (`useMemo`).
4. **Unit Validation on Vector Services**: Data science libraries like Pandas automate data processing but require strict type matching at boundaries when interacting with databases.

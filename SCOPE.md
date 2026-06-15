# Scope & Data Heuristics Specifications

This document outlines the database schema specifications and detail specs for the CSV import anomaly detection subsystem.

## 1. Database Schema Specifications

The Neon Serverless PostgreSQL instance contains 7 fully normalized tables:

### Users Table (`users`)
Stores registered members' profiles.
- `id` (Integer, Primary Key, Auto-increment)
- `name` (VARCHAR, Nullable=False)
- `email` (VARCHAR, Unique=True, Nullable=False)
- `phone` (VARCHAR, Nullable=True)
- `password_hash` (VARCHAR, Nullable=False)

### Groups Table (`groups`)
Stores expense sharing circles.
- `id` (Integer, Primary Key, Auto-increment)
- `name` (VARCHAR, Nullable=False)

### Memberships Table (`memberships`)
Tracks user enrollment in groups over time.
- `id` (Integer, Primary Key, Auto-increment)
- `user_id` (Integer, Foreign Key references `users.id`)
- `group_id` (Integer, Foreign Key references `groups.id`)
- `joined_at` (Date, Nullable=False)
- `left_at` (Date, Nullable=True)

### Expenses Table (`expenses`)
Logs expenses split among group members.
- `id` (Integer, Primary Key, Auto-increment)
- `title` (VARCHAR, Nullable=False)
- `amount` (Double Precision, Nullable=False)
- `currency` (VARCHAR, Default='INR')
- `split_type` (VARCHAR, Default='equal')
- `expense_date` (Date, Nullable=False)
- `paid_by` (Integer, Foreign Key references `users.id`)
- `group_id` (Integer, Foreign Key references `groups.id`)

### Settlements Table (`settlements`)
Logs recorded payments to resolve outstanding debts.
- `id` (Integer, Primary Key, Auto-increment)
- `payer_id` (Integer, Foreign Key references `users.id`)
- `receiver_id` (Integer, Foreign Key references `users.id`)
- `group_id` (Integer, Foreign Key references `groups.id`)
- `amount` (Double Precision, Nullable=False)
- `settlement_date` (Date, Nullable=False)

### Anomalies Table (`anomalies`)
Stores details of import anomalies flagged for manual audit.
- `id` (Integer, Primary Key, Auto-increment)
- `type` (VARCHAR, Nullable=False)
- `description` (TEXT, Nullable=False)
- `severity` (VARCHAR, Nullable=False)
- `action` (VARCHAR, Nullable=False)
- `status` (VARCHAR, Default='Pending')
- `original_name` (VARCHAR, Nullable=True)
- `suggested_name` (VARCHAR, Nullable=True)
- `import_report_id` (Integer, Foreign Key references `import_reports.id`)

### Import Reports Table (`import_reports`)
Maintains metadata regarding bulk uploads.
- `id` (Integer, Primary Key, Auto-increment)
- `date` (Date, Nullable=False)
- `rows_processed` (Integer, Nullable=False)
- `anomalies` (Integer, Nullable=False)
- `status` (VARCHAR, Default='Completed')

---

## 2. CSV Anomaly Detection Subsystem

When a CSV sheet is uploaded, the parser validates each row against 7 heuristic anomaly detection rules. Flagged items are saved as `anomalies` associated with the report, preventing auto-deletion of problematic data.

### Anomaly Heuristics Reference Matrix

| Anomaly Type | Severity | Description | Detection Heuristic | Resolution Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Missing Value** | High | Vital data cells (date, amount, payer) are empty. | Row validation checks: `if not row.amount or not row.payer or not row.date`. | Row is skipped; logged for manual entry. |
| **Missing Currency** | Medium | Transaction logged without a base currency denomination. | String validation: Checks if the currency cell is null or empty. | Fallback defaults to `INR (₹)`. |
| **Duplicate Expense** | High | Multiple records of the same cost on the identical date. | Match checking: `if exists(Expense) with matching title, date, amount, paid_by, group_id`. | Row is flagged; user resolves to keep one or both. |
| **Negative Amount** | High | Cost column is negative (e.g. -450). | Valuation check: `if amount < 0`. | Row is processed as a refund credit instead of cost. |
| **Settlement Logged As Expense** | Medium | Debt payoff logged as standard expense (e.g. "Tanmay paid Pallav"). | Keyword scanning: regex matches `(?:settle\|paid back\|clear debt)`. | transaction is moved automatically to Settlements. |
| **User Name Variation** | Low | Payer name has minor spelling differences (e.g. "Priya S" vs "Priya"). | String similarity: Levenshtein distance matching against group members. | System normalizes the name to the matched DB User. |
| **Membership Conflict** | High | User charged for expense dated before they joined or after they left. | Date comparison: Checks if `expense_date` lies outside `[joined_at, left_at]`. | Excludes the conflicted user from that specific split. |

---

## 3. Anomaly Log Sample

The system logs anomalies in the database following this JSON format:

```json
[
  {
    "id": 101,
    "type": "Name Variation",
    "description": "'Priya S' may be the same registered user as 'Priya'",
    "severity": "Low",
    "action": "Normalize name to 'Priya'",
    "status": "Pending",
    "original_name": "Priya S",
    "suggested_name": "Priya"
  },
  {
    "id": 102,
    "type": "Duplicate Expense",
    "description": "Two identical entries for 'Dinner at Thalassa' (₹4,800) on 2024-06-12",
    "severity": "High",
    "action": "Flag for duplicate removal review",
    "status": "Pending"
  },
  {
    "id": 103,
    "type": "Membership Conflict",
    "description": "Sam was charged for 'Scuba Diving' on 2024-06-11, which is before join date 2024-06-14",
    "severity": "High",
    "action": "Exclude Sam from splitting this expense",
    "status": "Pending"
  }
]
```

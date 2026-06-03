# Stage 1

## Priority Inbox — Approach & Design

### Problem
Students receive a high volume of notifications (Placements, Events, Results).
They lose track of important ones. We need to always surface the **top N most important unread notifications**.

---

## Priority Algorithm

Each notification is assigned a **priority score** based on two factors:

### 1. Type Weight (Importance)
| Type      | Weight |
|-----------|--------|
| Placement | 3      |
| Result    | 2      |
| Event     | 1      |

Placement notifications are most critical (career-impacting), followed by academic Results, then general Events.

### 2. Recency
More recent notifications rank higher within the same type.
Recency is derived from the `Timestamp` field converted to Unix milliseconds.

### Score Formula
```
priorityScore = typeWeight * 1,000,000,000,000 + timestampInMs
```

Multiplying typeWeight by a large constant ensures type always dominates over recency.
Within the same type, newer notifications rank higher.

---

## Example

Given these notifications:
- Placement @ 10:00 AM → Score: 3_000_000_XXXXXXXXXX (highest)
- Result @ 11:00 AM    → Score: 2_000_000_XXXXXXXXXX
- Event @ 12:00 PM     → Score: 1_000_000_XXXXXXXXXX (lowest, even though newest)

A Placement from yesterday always outranks an Event from today.

---

## Maintaining Top 10 Efficiently

Since new notifications keep coming in, a production system would use a **Min-Heap of size N**:

- Keep a min-heap of size 10 (min = lowest priority at top)
- For each new notification:
  - If heap size < 10 → push it
  - If its score > heap's minimum → replace the minimum
- This gives O(log N) insertion and always maintains the top 10

For this implementation (batch fetch from API), we sort all notifications by score and slice the top 10 — O(n log n).

---

## How to Run

```bash
cd notification_app_be   # or wherever priorityInbox.ts is placed
npm install
npx ts-node priorityInbox.ts
```

---

## Files
- `priorityInbox.ts` — Main algorithm
- `Notification_System_Design.md` — This document
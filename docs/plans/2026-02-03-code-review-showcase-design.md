# Code Review Showcase Design

## Overview

A Remotion composition showcasing Claude Code catching an N+1 query performance issue during PR code review—before it ships to production.

## Concept

**Title:** "Claude Code Catches N+1 Before It Ships"

**Narrative:** User asks Claude to review a PR. Claude reads the diff, spots a loop with a database call inside, explains why it's problematic, and shows the eager-loading fix.

**Duration:** ~25-30 seconds

**Theme:** `modernTheme` or `oceanTheme`

## Visual Layout

Terminal-first with code popups appearing inline as Claude examines files. Consistent with existing showcases (MultiAgentShowcase, SecurityFixesShowcase).

## Timeline

### Phase 1 - Setup (frames 0-60)

- Hero overlay fades in: "PR Code Review" / "Catching N+1 Before It Ships"
- Hero fades out, terminal appears
- Claude Code header (version, model, project path)
- User command types: `/review-pr 247`

### Phase 2 - Analysis (frames 60-180)

- Status: "Using code-reviewer to analyze PR #247"
- Status: "Read 3 files · src/api/handlers.py, src/models/items.py, tests/test_handlers.py"
- Step header: "Step 1: Analyzing changes"
- Status: "Found 1 potential performance issue"
- Warning callout appears:
  ```
  ⚠ N+1 Query Pattern Detected

  Location: src/api/handlers.py:42-44
  Severity: High (scales linearly with data)
  ```
- Code popup shows problematic code:
  ```python
  for item in items:
      item.details = db.query(Details).filter_by(id=item.detail_id).first()
  ```
- Explanation: "Each iteration executes a separate database query. With 100 items, this runs 100 queries instead of 1."

### Phase 3 - The Fix (frames 180-280)

- Status: "Suggesting optimized approach..."
- Code popup shows the fix:
  ```python
  detail_ids = [item.detail_id for item in items]
  details = db.query(Details).filter(Details.id.in_(detail_ids)).all()
  details_map = {d.id: d for d in details}
  for item in items:
      item.details = details_map[item.detail_id]
  ```
- Final status: "Suggested fix added to review · 100 queries → 1 query"

## Content

### Command
```
> /review-pr 247
```

### Terminal Lines (in sequence)

1. "Using code-reviewer to analyze PR #247"
2. "Read 3 files · src/api/handlers.py, src/models/items.py, tests/test_handlers.py"
3. Step 1: Analyzing changes
4. "Found 1 potential performance issue"
5. Warning callout (N+1 detection)
6. Bad code block
7. Explanation text
8. "Suggesting optimized approach..."
9. Fix code block
10. "Suggested fix added to review · 100 queries → 1 query"

### Bad Code
```python
# src/api/handlers.py:42-44
def get_items_with_details(items):
    for item in items:
        item.details = db.query(Details).filter_by(id=item.detail_id).first()
    return items
```

### Fixed Code
```python
# src/api/handlers.py:42-48
def get_items_with_details(items):
    detail_ids = [item.detail_id for item in items]
    details = db.query(Details).filter(Details.id.in_(detail_ids)).all()
    details_map = {d.id: d for d in details}  # O(1) lookups
    for item in items:
        item.details = details_map[item.detail_id]
    return items
```

## Components

### Reuse Existing
- `Background` - gradient background
- `TerminalWindow` - main terminal chrome
- `CommandLine` - typing animation for command
- `StatusMessage` - info/muted status lines
- `StepHeader` - "Step 1: ..." markers
- `CodeBlock` - syntax-highlighted code display
- `Scanlines` - CRT overlay effect

### New Components
- `WarningCallout` - styled warning box with yellow/orange border, warning icon, for the N+1 detection alert

## File Structure
```
src/compositions/CodeReviewShowcase/
├── index.tsx    # Main composition
└── data.ts      # PHASE timings, code snippets, terminal lines
```

## Hero Overlay
- Accent text: "PR Code Review"
- Main text: "Catching N+1 Before It Ships"
- Fades out before terminal content begins

## Notes
- No `Branding` component (per project rules)
- Thumbnail-ready first frame with hero overlay
- Terminal scrolls as content grows
- Code popups fade in/out with spring animations

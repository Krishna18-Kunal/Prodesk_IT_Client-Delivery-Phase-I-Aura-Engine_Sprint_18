
# Aura Engine

This file contains reusable understanding, extending, reviewing and testing the Aura Engine inventory management project.

## Project Context

Aura Engine is a full-stack inventory management dashboard built with:

- React and Vite for the frontend.
- Node.js and Express for the backend.
- MongoDB and Mongoose for data storage.
- Zod for request validation.
- Recharts for dashboard visualizations.

The project includes inventory search, filtering, sorting, server-side pagination, analytics, CSV export, CRUD API endpoints and a seed script that generates 50,000 synthetic product records.

## 1. Understand the Existing Project

```text
Review the existing Aura Engine repository before making changes.

Explain the frontend, backend, database models, API routes, controllers,
middleware and data flow.

Identify the main files responsible for each feature.

Do not invent files or functionality that are not present in the repository.
```

## 2. Debug an Existing Issue

```text
I am working on the Aura Engine project.

Diagnose the issue using the error message, relevant source code and
project configuration that I provide.

Identify the root cause before proposing a fix.

Give me the exact file path and complete corrected code or a minimal
safe patch.

Preserve existing working features and explain how to verify the fix.
```

## 3. Improve Backend API Performance

```text
Review the Aura Engine Express and MongoDB API for performance.

Focus on query efficiency, pagination, filtering, sorting, indexes,
aggregation pipelines and avoiding unnecessary database operations.

Recommend measurable improvements.

Do not claim a performance target has been achieved unless it has
been benchmarked.
```

## 4. Improve Frontend Performance

```text
Review the Aura Engine React frontend for rendering and network performance.

Examine search debouncing, API request cancellation, pagination,
state updates, chart rendering and large data handling.

Preserve the current design and behavior unless a change is necessary.

Explain the impact and provide test steps.
```

## 5. Add an Inventory Feature

```text
Add the following feature to Aura Engine:

[DESCRIBE FEATURE]

First inspect the existing component structure, API conventions,
Mongoose model, validation and styling.

Implement the feature consistently across the frontend and backend
where required.

Include loading, empty, validation and error states.

Do not break existing search, filters, sorting, pagination,
analytics or CSV export.

List all files changed and provide manual test steps.
```

## 6. Improve Analytics

```text
Review the existing Aura Engine analytics implementation.

Verify that each metric and chart is calculated from the correct
MongoDB data.

Check aggregation accuracy, empty-data handling, API response shape
and frontend chart behavior.

Suggest additional useful inventory metrics only when they can be
calculated from available fields.
```

## 7. Review API Validation and Security

```text
Perform a security-focused review of the Aura Engine backend.

Inspect request validation, error handling, CORS, rate limiting,
security headers, database access and write endpoints.

Identify specific risks and recommend fixes.

Do not expose secrets.

Clearly identify missing production controls, including
authentication or authorization if they are not implemented.
```

## 8. Write or Update Tests

```text
Create a practical test plan for the Aura Engine feature or API:

[NAME FEATURE OR ENDPOINT]

Cover successful requests, invalid input, missing records, empty
results, pagination boundaries, filters, sorting and database errors
where relevant.

Use the testing framework already present in the repository.

If none is configured, recommend a suitable option and show the
required setup before writing tests.
```

## 9. Prepare for Deployment

```text
Review Aura Engine for deployment to a frontend host, a Node.js
backend host and MongoDB Atlas.

Check build scripts, environment variables, API base URL configuration,
CORS, health checks and secret handling.

Provide platform-specific settings only after checking the actual
project files.

Do not assume deployment has succeeded until the live URLs have
been tested.
```

## 10. Update Project Documentation

```text
Update the Aura Engine README based on the actual current repository.

Document verified features, technology stack, folder structure,
environment variables, local setup, API routes, seed-data warning,
testing steps and deployment guidance.

Do not include secrets, invented endpoints, unverified performance
claims or confidential client information.
```

## Working Rules for Assisted Changes

1. Inspect relevant existing files before editing.
2. Preserve the current architecture and working functionality.
3. Avoid replacing entire files when a small patch is sufficient.
4. Provide exact Windows CMD and PowerShell commands when setup steps are needed.
5. Never ask the user to publish `.env`, database passwords, tokens or private keys.
6. Explain database-destructive commands before asking the user to run them.
7. Never run the seed script against a production database.
8. Include verification steps after each meaningful change.
9. Distinguish implemented features from proposed improvements.
10. Do not claim that code, tests, benchmarks or deployments succeeded without evidence.

## Example Change Request Template

```text
Feature or issue:
[Describe the requested change]

Expected behavior:
[Explain what should happen]

Current behavior:
[Explain what happens now]

Relevant files or error:
[Paste file paths, code, logs or screenshots]

Constraints:
- Preserve existing working features.
- Do not expose secrets.
- Keep the implementation consistent with Aura Engine.
- Provide exact steps to test the result.
```

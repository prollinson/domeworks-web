# Playbook: Document Collection & Verification

**Source engagement:** AICPA
**Version:** 1.0
**Last updated:** 2026-03-06
**Repeatability:** High

## Overview

Automates the collection, organization, and verification of supporting documents required for audit engagements. Replaces manual email chasing and spreadsheet tracking with automated intake, classification, and completeness checks.

## Inputs

| Input                   | Type                    | Source                             | Trigger                 |
| ----------------------- | ----------------------- | ---------------------------------- | ----------------------- |
| Document request list   | Spreadsheet             | Google Sheets                      | Engagement kickoff      |
| Supporting documents    | Files (PDF, XLSX, DOCX) | Email / Google Drive shared folder | Ongoing / client upload |
| Client contact list     | CSV                     | CRM or manual entry                | Engagement kickoff      |
| Prior period workpapers | Files                   | Internal document store            | Engagement kickoff      |

## Outputs

| Output                      | Format           | Destination             | Frequency                   |
| --------------------------- | ---------------- | ----------------------- | --------------------------- |
| Collection status dashboard | Live dashboard   | Google Sheets / web app | Real-time                   |
| Outstanding items reminder  | Email            | Client contacts         | Configurable (daily/weekly) |
| Completeness report         | PDF              | Engagement lead         | On-demand / milestone       |
| Verified document package   | Organized folder | Google Drive            | On completion               |

## Tools Used

- **Google Workspace (Drive, Sheets, Gmail)** — Document storage, tracking spreadsheet, automated reminder emails
- **Slack** — Team notifications for new uploads and status changes
- **Automation platform (n8n / Make)** — Orchestration layer connecting Drive, Sheets, Gmail, and Slack
- **PDF parsing (optional)** — Extract metadata and verify document types match requests

## Workflow Steps

1. **Initialize engagement** — Create tracking sheet from document request template; populate client contacts and due dates.
   - Automated: Partial (template generation automated, customization manual)
   - Owner: Engagement lead

2. **Distribute requests** — Send personalized document request emails to client contacts with secure upload links.
   - Automated: Yes
   - Owner: System

3. **Monitor uploads** — Watch shared Drive folder for new files; match uploads against request list using filename patterns and metadata.
   - Automated: Yes
   - Owner: System

4. **Classify and verify** — Check file type, naming conventions, and basic completeness (e.g., date range coverage, page count).
   - Automated: Partial (file type and naming automated; content verification manual)
   - Owner: System + Analyst

5. **Send reminders** — Auto-send follow-up emails for outstanding items based on configurable schedule.
   - Automated: Yes
   - Owner: System

6. **Escalate overdue items** — Flag items past due date; notify engagement lead via Slack with summary of gaps.
   - Automated: Yes
   - Owner: System

7. **Package and deliver** — Organize verified documents into structured folder hierarchy; generate completeness report.
   - Automated: Partial (folder organization automated; final sign-off manual)
   - Owner: System + Engagement lead

## Hours Estimate

| Phase                        | Manual (hrs/month) | Automated (hrs/month) | Savings |
| ---------------------------- | ------------------ | --------------------- | ------- |
| Request distribution         | 4                  | 0.5                   | 88%     |
| Upload monitoring & matching | 10                 | 1                     | 90%     |
| Reminder follow-ups          | 6                  | 0.5                   | 92%     |
| Status reporting             | 4                  | 0.5                   | 88%     |
| Document organization        | 6                  | 1                     | 83%     |
| **Total**                    | **30**             | **3.5**               | **88%** |

## ROI Estimate

| Metric                         | Value                             |
| ------------------------------ | --------------------------------- |
| Monthly labor cost (manual)    | $3,000 (30 hrs @ $100/hr blended) |
| Monthly labor cost (automated) | $350 (3.5 hrs @ $100/hr)          |
| Monthly savings                | $2,650                            |
| Implementation cost            | $8,000 - $12,000                  |
| Payback period                 | 3-5 months                        |

## Adaptation Notes

- **Document request lists** vary by engagement type (audit, review, compilation) — template library needed per service line
- **Upload mechanism** can swap Google Drive for SharePoint, Box, or client-specific portals
- **Verification rules** are engagement-specific; maintain a rules config per engagement type
- **Reminder cadence** should be client-configurable; some clients prefer weekly batched reminders over daily
- This is the strongest candidate for productization (Audit-in-a-Box) due to universal applicability across audit firms

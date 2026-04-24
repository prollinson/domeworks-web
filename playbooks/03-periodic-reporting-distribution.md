# Playbook: Periodic Reporting & Distribution

**Source engagement:** AICPA
**Version:** 1.0
**Last updated:** 2026-03-06
**Repeatability:** Medium

## Overview

Automates the assembly, formatting, and distribution of recurring reports (financial summaries, audit status updates, board packages). Replaces manual copy-paste from multiple sources with automated data aggregation, template population, and multi-channel delivery.

## Inputs

| Input                  | Type              | Source                                     | Trigger                      |
| ---------------------- | ----------------- | ------------------------------------------ | ---------------------------- |
| Financial data         | Spreadsheet / API | Accounting system (QuickBooks, Xero, etc.) | Schedule (monthly/quarterly) |
| Engagement status data | Spreadsheet       | Google Sheets (tracking sheets)            | Schedule                     |
| Narrative sections     | Document          | Google Docs (analyst-written)              | Before report deadline       |
| Distribution list      | CSV / Contacts    | CRM or manual entry                        | Engagement setup             |

## Outputs

| Output                  | Format           | Destination          | Frequency           |
| ----------------------- | ---------------- | -------------------- | ------------------- |
| Formatted report        | PDF / Google Doc | Google Drive archive | Monthly / Quarterly |
| Executive summary email | HTML email       | Leadership / board   | Monthly / Quarterly |
| Data extract            | CSV / XLSX       | Internal analytics   | On generation       |
| Delivery confirmation   | Log entry        | Tracking sheet       | Per distribution    |

## Tools Used

- **Google Workspace (Sheets, Docs, Gmail, Drive)** — Data sources, report templates, delivery, archival
- **Slack** — Notify team when report is ready for review or distributed
- **Automation platform (n8n / Make)** — Data aggregation, template population, scheduling, distribution
- **Charting library (optional)** — Auto-generate charts/graphs from data for insertion into reports

## Workflow Steps

1. **Aggregate data** — Pull latest data from accounting systems, tracking sheets, and other sources into a staging sheet.
   - Automated: Yes
   - Owner: System

2. **Populate report template** — Insert data, charts, and standard narrative blocks into report template.
   - Automated: Partial (data/charts automated; narrative review manual)
   - Owner: System + Analyst

3. **Quality check** — Flag anomalies (missing data, significant variances from prior period, formatting issues).
   - Automated: Partial (anomaly detection automated; judgment calls manual)
   - Owner: System + Analyst

4. **Route for review** — Send draft to engagement lead for approval; notify via Slack.
   - Automated: Yes
   - Owner: System

5. **Finalize and format** — Apply final formatting, convert to PDF, add cover page and table of contents.
   - Automated: Yes
   - Owner: System

6. **Distribute** — Send to distribution list via email; archive to designated Drive folder; log delivery.
   - Automated: Yes
   - Owner: System

7. **Confirm receipt** — Track email opens/bounces; follow up on failed deliveries.
   - Automated: Partial (tracking automated; manual follow-up for bounces)
   - Owner: System + Admin

## Hours Estimate

| Phase                     | Manual (hrs/month) | Automated (hrs/month) | Savings |
| ------------------------- | ------------------ | --------------------- | ------- |
| Data aggregation          | 6                  | 0.5                   | 92%     |
| Report assembly           | 8                  | 2                     | 75%     |
| Review routing            | 2                  | 0.5                   | 75%     |
| Formatting & finalization | 4                  | 0.5                   | 88%     |
| Distribution & tracking   | 3                  | 0.5                   | 83%     |
| **Total**                 | **23**             | **4**                 | **83%** |

## ROI Estimate

| Metric                         | Value                             |
| ------------------------------ | --------------------------------- |
| Monthly labor cost (manual)    | $2,300 (23 hrs @ $100/hr blended) |
| Monthly labor cost (automated) | $400 (4 hrs @ $100/hr)            |
| Monthly savings                | $1,900                            |
| Implementation cost            | $8,000 - $14,000                  |
| Payback period                 | 4-7 months                        |

## Adaptation Notes

- **Report templates** are highly client-specific; each engagement needs a custom template (one-time setup cost)
- **Data source connectors** vary (QuickBooks vs. Xero vs. NetSuite) — abstraction layer recommended
- **Narrative sections** remain the primary manual bottleneck; AI-assisted drafting could reduce this further (future enhancement)
- **Compliance requirements** may dictate specific report formats or delivery methods (encrypted email, secure portal)
- Lower repeatability than Playbooks #1 and #2 due to higher customization per client, but high value per engagement

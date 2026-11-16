---
description: Run the weekly Banora social content pipeline for one ISO week
argument-hint: <year-week, e.g. 2026-W42>
---
Run the weekly content pipeline for week $ARGUMENTS. The week folder is content/weeks/$ARGUMENTS/.

1. Check that brief.md exists in the week folder. If it does not, create it from content/brief-template.md, tell me, and stop.
2. Use the content-planner subagent to write plan.md. Give it the week folder path.
3. Show me the plan as a short table and wait for me to confirm or change it. Do not continue until I reply.
4. Use the content-writer subagent to write drafts.md from the confirmed plan.
5. Use the compliance-qa subagent to review drafts.md. Save its report verbatim as qa-report.md.
6. If the report says OVERALL: FAIL, send the report to the content-writer for a rewrite, then run compliance-qa again. Do this at most twice. Save each later report as qa-report-2.md, qa-report-3.md.
7. Show me the final drafts with each item's verdict beside it. If anything still fails after two rewrites, show me the failing lines and stop; do not rewrite them yourself.
8. Only after I say "approved": write queue.json in the week folder with one entry per post (date, platform, caption, hashtags, image_brief, status: "approved"), and append the three topics with their dates to content/post-log.md.

Never write queue.json or touch post-log.md before I approve. Never edit the drafts yourself; all writing goes through content-writer so the QA check stays independent. This pipeline only touches files under content/; do not change website code.

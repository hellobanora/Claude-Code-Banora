---
name: site-monitor
description: "Automated site monitoring and health checks for Banora Chiropractic — daily cron jobs that verify the booking system, AI chatbot, page loading, SSL, and uptime. Alerts you before patients notice anything is broken. Use this skill whenever the user mentions monitoring, uptime, health checks, cron jobs, automated checks, site status, downtime detection, alerts, booking system monitoring, chatbot monitoring, error detection, or wants to know if the website is working properly. Also trigger when the user says 'is the site up', 'is the bot working', 'is booking working', or asks about any kind of automated oversight or watchdog system for the website."
---

# Site Monitor — Banora Chiropractic

You build the watchdog system that runs every day, checks everything that matters, and tells you the moment something breaks. Patients don't report broken booking forms — they just leave. You need to know before they do.

## What We're Monitoring

Every check answers one question: can a patient do what they came to do?

### Critical (Check Every 15 Minutes)

These directly prevent bookings. If any of these fail, someone needs to know immediately.

| Check | What It Tests | Failure Means |
|---|---|---|
| **Homepage loads** | HTTP 200 response, page renders, LCP under 4s | Site is down — patients see nothing |
| **Booking page loads** | /book returns 200, iframe/link is present | Nobody can book online |
| **SSL certificate valid** | Certificate not expired, not expiring within 14 days | Browser shows security warning — patients leave |

### Important (Check Every Hour)

These affect patient experience but aren't immediate emergencies.

| Check | What It Tests | Failure Means |
|---|---|---|
| **Chatbot responds** | POST to /api/chat returns valid response within 10s | Bot is dead — questions go unanswered |
| **Contact form works** | /contact loads, form elements present | Patients can't send enquiries |
| **Key pages load** | /about, /team, /services/back-pain all return 200 | Content pages broken |
| **Response time** | All pages respond under 3 seconds | Site is slow — patients bounce |

### Daily Checks

Deeper checks that don't need to run constantly but catch drift.

| Check | What It Tests | Failure Means |
|---|---|---|
| **All pages return 200** | Crawl every page in sitemap.xml | Broken pages you don't know about |
| **No console errors** | Headless browser check for JS errors | Frontend bugs affecting functionality |
| **DNS resolving** | banorachiropractic.com.au resolves correctly | Domain configuration issue |
| **Booking URL accessible** | IconPractice booking URL returns 200 | Third-party booking system is down |
| **Sitemap valid** | /sitemap.xml is valid XML, contains all expected pages | SEO impact — Google can't crawl properly |
| **Robots.txt correct** | /robots.txt exists and isn't blocking important pages | Accidentally deindexing the site |
| **Schema markup valid** | Homepage JSON-LD parses without errors | Rich results disappear from Google |
| **Image assets loading** | Key images (hero, team photos) return 200 | Broken images on visible pages |

### Weekly Checks

| Check | What It Tests | Failure Means |
|---|---|---|
| **SSL expiry countdown** | Days until certificate expires | Prevent surprise expiry |
| **Domain expiry** | Days until domain registration expires | Prevent losing the domain |
| **Google indexing status** | Site still appears in Google search results | Potential deindexing issue |
| **Lighthouse scores** | Performance, accessibility, SEO scores | Site quality has degraded |
| **Dependency vulnerabilities** | npm audit for security issues | Known vulnerabilities in packages |

## Implementation

### Architecture

```
lib/
├── monitoring/
│   ├── checks/
│   │   ├── homepage.ts        # Homepage load check
│   │   ├── booking.ts         # Booking system check
│   │   ├── chatbot.ts         # Chatbot API check
│   │   ├── ssl.ts             # SSL certificate check
│   │   ├── pages.ts           # All pages crawl
│   │   ├── dns.ts             # DNS resolution check
│   │   ├── sitemap.ts         # Sitemap validation
│   │   ├── schema.ts          # Schema markup validation
│   │   └── performance.ts     # Response time checks
│   ├── alerting.ts            # Notification dispatch
│   ├── logger.ts              # Check result logging
│   ├── runner.ts              # Orchestrates check execution
│   └── types.ts               # Shared types
app/
├── api/
│   ├── cron/
│   │   ├── health-check/route.ts    # Every 15 min — critical checks
│   │   ├── hourly-check/route.ts    # Every hour — important checks
│   │   ├── daily-check/route.ts     # Daily — full crawl
│   │   └── weekly-check/route.ts    # Weekly — deep checks
│   └── status/route.ts             # Public status endpoint
```

### Core Types

```typescript
// lib/monitoring/types.ts

export type CheckSeverity = 'critical' | 'important' | 'info';
export type CheckStatus = 'pass' | 'fail' | 'degraded';

export interface CheckResult {
  name: string;
  status: CheckStatus;
  severity: CheckSeverity;
  message: string;
  responseTimeMs?: number;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface HealthReport {
  overall: CheckStatus;
  timestamp: string;
  checks: CheckResult[];
  duration_ms: number;
}
```

### Individual Check Implementations

**Homepage check:**
```typescript
// lib/monitoring/checks/homepage.ts

import { CheckResult } from '../types';

export async function checkHomepage(): Promise<CheckResult> {
  const start = Date.now();
  const url = process.env.SITE_URL || 'https://banorachiropractic.com.au';

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000),
    });
    const responseTime = Date.now() - start;

    if (!response.ok) {
      return {
        name: 'homepage',
        status: 'fail',
        severity: 'critical',
        message: `Homepage returned ${response.status}`,
        responseTimeMs: responseTime,
        timestamp: new Date().toISOString(),
      };
    }

    const html = await response.text();
    const hasContent = html.includes('Banora Chiropractic');

    if (!hasContent) {
      return {
        name: 'homepage',
        status: 'fail',
        severity: 'critical',
        message: 'Homepage loaded but content missing — possible blank page',
        responseTimeMs: responseTime,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      name: 'homepage',
      status: responseTime > 3000 ? 'degraded' : 'pass',
      severity: 'critical',
      message: responseTime > 3000
        ? `Homepage slow: ${responseTime}ms (target: <3000ms)`
        : `Homepage OK: ${responseTime}ms`,
      responseTimeMs: responseTime,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      name: 'homepage',
      status: 'fail',
      severity: 'critical',
      message: `Homepage unreachable: ${error instanceof Error ? error.message : 'Unknown error'}`,
      responseTimeMs: Date.now() - start,
      timestamp: new Date().toISOString(),
    };
  }
}
```

**Chatbot check:**
```typescript
// lib/monitoring/checks/chatbot.ts

import { CheckResult } from '../types';

export async function checkChatbot(): Promise<CheckResult> {
  const start = Date.now();
  const url = `${process.env.SITE_URL || 'https://banorachiropractic.com.au'}/api/chat`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'What are your opening hours?' }],
        isHealthCheck: true,
      }),
      signal: AbortSignal.timeout(15000),
    });

    const responseTime = Date.now() - start;

    if (!response.ok) {
      return {
        name: 'chatbot',
        status: 'fail',
        severity: 'important',
        message: `Chatbot API returned ${response.status}`,
        responseTimeMs: responseTime,
        timestamp: new Date().toISOString(),
      };
    }

    const data = await response.json();
    const hasResponse = data?.response?.length > 0 || data?.content?.length > 0;

    if (!hasResponse) {
      return {
        name: 'chatbot',
        status: 'fail',
        severity: 'important',
        message: 'Chatbot returned empty response',
        responseTimeMs: responseTime,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      name: 'chatbot',
      status: responseTime > 10000 ? 'degraded' : 'pass',
      severity: 'important',
      message: responseTime > 10000
        ? `Chatbot slow: ${responseTime}ms (target: <10000ms)`
        : `Chatbot OK: ${responseTime}ms`,
      responseTimeMs: responseTime,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      name: 'chatbot',
      status: 'fail',
      severity: 'important',
      message: `Chatbot unreachable: ${error instanceof Error ? error.message : 'Unknown error'}`,
      responseTimeMs: Date.now() - start,
      timestamp: new Date().toISOString(),
    };
  }
}
```

**SSL check:**
```typescript
// lib/monitoring/checks/ssl.ts

import { CheckResult } from '../types';
import * as tls from 'tls';

export async function checkSSL(): Promise<CheckResult> {
  const hostname = 'banorachiropractic.com.au';

  return new Promise((resolve) => {
    const socket = tls.connect(443, hostname, { servername: hostname }, () => {
      const cert = socket.getPeerCertificate();
      socket.destroy();

      if (!cert || !cert.valid_to) {
        resolve({
          name: 'ssl',
          status: 'fail',
          severity: 'critical',
          message: 'Could not read SSL certificate',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const expiryDate = new Date(cert.valid_to);
      const daysUntilExpiry = Math.floor(
        (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilExpiry < 0) {
        resolve({
          name: 'ssl',
          status: 'fail',
          severity: 'critical',
          message: `SSL certificate EXPIRED ${Math.abs(daysUntilExpiry)} days ago`,
          timestamp: new Date().toISOString(),
          details: { expiry: cert.valid_to, daysUntilExpiry },
        });
      } else if (daysUntilExpiry < 14) {
        resolve({
          name: 'ssl',
          status: 'degraded',
          severity: 'critical',
          message: `SSL certificate expires in ${daysUntilExpiry} days — renew NOW`,
          timestamp: new Date().toISOString(),
          details: { expiry: cert.valid_to, daysUntilExpiry },
        });
      } else {
        resolve({
          name: 'ssl',
          status: 'pass',
          severity: 'critical',
          message: `SSL valid — expires in ${daysUntilExpiry} days`,
          timestamp: new Date().toISOString(),
          details: { expiry: cert.valid_to, daysUntilExpiry },
        });
      }
    });

    socket.on('error', (error) => {
      resolve({
        name: 'ssl',
        status: 'fail',
        severity: 'critical',
        message: `SSL check failed: ${error.message}`,
        timestamp: new Date().toISOString(),
      });
    });

    socket.setTimeout(10000, () => {
      socket.destroy();
      resolve({
        name: 'ssl',
        status: 'fail',
        severity: 'critical',
        message: 'SSL check timed out',
        timestamp: new Date().toISOString(),
      });
    });
  });
}
```

**Booking system check:**
```typescript
// lib/monitoring/checks/booking.ts

import { CheckResult } from '../types';

export async function checkBooking(): Promise<CheckResult> {
  const start = Date.now();
  const bookingPageUrl = `${process.env.SITE_URL || 'https://banorachiropractic.com.au'}/book`;
  const iconPracticeUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

  // Check 1: Our booking page loads
  try {
    const pageResponse = await fetch(bookingPageUrl, {
      signal: AbortSignal.timeout(10000),
    });

    if (!pageResponse.ok) {
      return {
        name: 'booking',
        status: 'fail',
        severity: 'critical',
        message: `Booking page returned ${pageResponse.status}`,
        responseTimeMs: Date.now() - start,
        timestamp: new Date().toISOString(),
      };
    }
  } catch (error) {
    return {
      name: 'booking',
      status: 'fail',
      severity: 'critical',
      message: `Booking page unreachable: ${error instanceof Error ? error.message : 'Unknown error'}`,
      responseTimeMs: Date.now() - start,
      timestamp: new Date().toISOString(),
    };
  }

  // Check 2: IconPractice booking URL is reachable (if configured)
  if (iconPracticeUrl) {
    try {
      const bookingResponse = await fetch(iconPracticeUrl, {
        signal: AbortSignal.timeout(10000),
      });

      if (!bookingResponse.ok) {
        return {
          name: 'booking',
          status: 'fail',
          severity: 'critical',
          message: `IconPractice booking returned ${bookingResponse.status} — patients cannot book`,
          responseTimeMs: Date.now() - start,
          timestamp: new Date().toISOString(),
        };
      }
    } catch (error) {
      return {
        name: 'booking',
        status: 'fail',
        severity: 'critical',
        message: `IconPractice booking unreachable — patients cannot book: ${error instanceof Error ? error.message : 'Unknown error'}`,
        responseTimeMs: Date.now() - start,
        timestamp: new Date().toISOString(),
      };
    }
  }

  return {
    name: 'booking',
    status: 'pass',
    severity: 'critical',
    message: `Booking system OK: ${Date.now() - start}ms`,
    responseTimeMs: Date.now() - start,
    timestamp: new Date().toISOString(),
  };
}
```

### Check Runner

```typescript
// lib/monitoring/runner.ts

import { CheckResult, HealthReport } from './types';

export async function runChecks(
  checks: (() => Promise<CheckResult>)[]
): Promise<HealthReport> {
  const start = Date.now();
  const results = await Promise.allSettled(checks.map((check) => check()));

  const checkResults: CheckResult[] = results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    return {
      name: `check-${index}`,
      status: 'fail' as const,
      severity: 'critical' as const,
      message: `Check threw an error: ${result.reason}`,
      timestamp: new Date().toISOString(),
    };
  });

  const hasFail = checkResults.some((r) => r.status === 'fail');
  const hasDegraded = checkResults.some((r) => r.status === 'degraded');

  return {
    overall: hasFail ? 'fail' : hasDegraded ? 'degraded' : 'pass',
    timestamp: new Date().toISOString(),
    checks: checkResults,
    duration_ms: Date.now() - start,
  };
}
```

### Cron API Routes

**Critical checks — every 15 minutes:**
```typescript
// app/api/cron/health-check/route.ts

import { NextResponse } from 'next/server';
import { runChecks } from '@/lib/monitoring/runner';
import { sendAlert } from '@/lib/monitoring/alerting';
import { checkHomepage } from '@/lib/monitoring/checks/homepage';
import { checkBooking } from '@/lib/monitoring/checks/booking';
import { checkSSL } from '@/lib/monitoring/checks/ssl';

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron (not a random visitor)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const report = await runChecks([checkHomepage, checkBooking, checkSSL]);

  // Alert on any failure
  if (report.overall === 'fail') {
    const failures = report.checks.filter((c) => c.status === 'fail');
    await sendAlert({
      level: 'critical',
      title: 'Site Health Check FAILED',
      failures,
    });
  }

  return NextResponse.json(report);
}
```

### Vercel Cron Configuration

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/health-check",
      "schedule": "*/15 * * * *"
    },
    {
      "path": "/api/cron/hourly-check",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/daily-check",
      "schedule": "0 6 * * *"
    },
    {
      "path": "/api/cron/weekly-check",
      "schedule": "0 6 * * 1"
    }
  ]
}
```

**Note:** Vercel cron uses UTC. `0 6 * * *` is 6am UTC = 4pm AEST (during daylight saving) or 3pm AEST. Adjust if you want checks to run at a specific local time.

**Vercel Pro plan required** for cron jobs running more frequently than once per day. The free plan supports daily crons only. If on the free plan, consolidate the critical and hourly checks into the daily check and use an external uptime service for frequent monitoring.

### Environment Variables

```env
# Monitoring
CRON_SECRET=           # Secret token to authenticate cron requests
ALERT_EMAIL=           # Email address for alerts
ALERT_WEBHOOK_URL=     # Slack/Discord/Teams webhook URL (optional)
SITE_URL=https://banorachiropractic.com.au

# External services (set these up)
NEXT_PUBLIC_BOOKING_URL=  # IconPractice booking URL
```

## Alerting

### Where to Send Alerts

Set up at least two channels so you don't miss critical failures:

**1. Email (required):**
Use a transactional email service (Resend, SendGrid, or Postmark) to send alert emails. These are more reliable than SMTP for automated emails.

```typescript
// lib/monitoring/alerting.ts

interface AlertPayload {
  level: 'critical' | 'warning' | 'info';
  title: string;
  failures: CheckResult[];
}

export async function sendAlert(alert: AlertPayload) {
  // Email alert
  if (process.env.ALERT_EMAIL) {
    await sendEmailAlert(alert);
  }

  // Webhook alert (Slack, Discord, etc.)
  if (process.env.ALERT_WEBHOOK_URL) {
    await sendWebhookAlert(alert);
  }
}

async function sendEmailAlert(alert: AlertPayload) {
  const failureList = alert.failures
    .map((f) => `• ${f.name}: ${f.message}`)
    .join('\n');

  // Using Resend (recommended for Vercel)
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'monitor@banorachiropractic.com.au',
      to: process.env.ALERT_EMAIL,
      subject: `[${alert.level.toUpperCase()}] ${alert.title}`,
      text: `Banora Chiropractic Site Monitor\n\n${alert.title}\n\nFailed checks:\n${failureList}\n\nTime: ${new Date().toISOString()}\n\nCheck the site: https://banorachiropractic.com.au`,
    }),
  });
}

async function sendWebhookAlert(alert: AlertPayload) {
  const failureList = alert.failures
    .map((f) => `• **${f.name}**: ${f.message}`)
    .join('\n');

  await fetch(process.env.ALERT_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `🚨 **${alert.title}**\n\n${failureList}`,
    }),
  });
}
```

**2. Slack or Discord webhook (recommended):**
Faster than email for real-time alerts. Set up a dedicated #site-alerts channel.

### Alert Rules

Don't alert on every blip. Network hiccups happen. Only alert when it matters:

| Scenario | Action |
|---|---|
| Single critical check fails | Alert immediately |
| Important check fails once | Retry in 5 minutes, alert if still failing |
| Degraded performance (slow but working) | Log it, alert only if persists for 30+ minutes |
| Daily/weekly check finds issue | Alert at info level — not urgent but needs attention |
| All checks pass | Log silently, no notification |

### Avoiding Alert Fatigue

- **Don't alert on recovery.** If the site goes down and comes back, one alert is enough. Don't send "Site is back up!" — if they got the down alert, they'll check.
- **Deduplicate.** If the homepage is down, you'll also fail the booking check and pages check. Send one alert about the homepage, not three about different symptoms of the same problem.
- **Cooldown period.** After sending a critical alert, don't send another for the same check for at least 30 minutes. Spamming alerts makes people ignore them.

## Public Status Page (Optional)

A simple status endpoint that shows current health:

```typescript
// app/api/status/route.ts

import { NextResponse } from 'next/server';
import { runChecks } from '@/lib/monitoring/runner';
import { checkHomepage } from '@/lib/monitoring/checks/homepage';
import { checkBooking } from '@/lib/monitoring/checks/booking';
import { checkChatbot } from '@/lib/monitoring/checks/chatbot';

export async function GET() {
  const report = await runChecks([checkHomepage, checkBooking, checkChatbot]);

  // Don't expose internal details publicly
  const publicReport = {
    status: report.overall,
    timestamp: report.timestamp,
    services: report.checks.map((c) => ({
      name: c.name,
      status: c.status,
    })),
  };

  return NextResponse.json(publicReport, {
    status: report.overall === 'fail' ? 503 : 200,
  });
}
```

Access at: `banorachiropractic.com.au/api/status`

## External Monitoring (Belt and Suspenders)

The cron system monitors FROM Vercel. But if Vercel itself is down, the crons don't run. Use a free external service as a backup:

**Free options:**
- **UptimeRobot** (uptimerobot.com) — 50 free monitors, 5-minute intervals, email/Slack alerts
- **Freshping** (freshping.io) — 50 free monitors, 1-minute intervals
- **Uptime Kuma** (self-hosted) — if you have a VPS

**Set up external monitoring for:**
1. Homepage: `https://banorachiropractic.com.au` — HTTP 200 check
2. Status endpoint: `https://banorachiropractic.com.au/api/status` — HTTP 200 check
3. Booking page: `https://banorachiropractic.com.au/book` — HTTP 200 check

This gives you two independent monitoring systems — if one fails, the other catches it.

## Implementation Checklist

- [ ] Create `lib/monitoring/` directory structure
- [ ] Implement all check functions
- [ ] Set up alerting (email + webhook)
- [ ] Create cron API routes
- [ ] Configure vercel.json with cron schedules
- [ ] Set environment variables (CRON_SECRET, ALERT_EMAIL, etc.)
- [ ] Set up external monitoring (UptimeRobot or similar)
- [ ] Test each check manually via the API routes
- [ ] Verify alerts actually arrive (send a test alert)
- [ ] Document the monitoring setup for the team

## Working With Other Skills

- **Website Builder** — the cron routes and monitoring code live in the Next.js project. Coordinate on project structure.
- **Analytics & Tracking** — monitoring catches when things break, analytics measures when things work. Together they give a complete picture.
- **Chatbot Personality** — the chatbot health check sends a test message. Keep the test message simple ("What are your opening hours?") so it tests the full pipeline without complex logic.

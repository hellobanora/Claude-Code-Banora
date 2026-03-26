// Health check definitions for Banora Chiropractic monitoring system

export interface HealthCheckResult {
  name: string;
  status: "pass" | "fail";
  responseTime: number;
  statusCode?: number;
  error?: string;
  timestamp: string;
}

const TIMEOUT_MS = 10_000;

async function timedFetch(
  url: string,
  options?: RequestInit
): Promise<{ ok: boolean; status: number; elapsed: number }> {
  const start = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return { ok: res.ok, status: res.status, elapsed: Date.now() - start };
  } catch {
    return { ok: false, status: 0, elapsed: Date.now() - start };
  } finally {
    clearTimeout(timeout);
  }
}

export async function checkWebsite(siteUrl: string): Promise<HealthCheckResult> {
  const timestamp = new Date().toISOString();
  const { ok, status, elapsed } = await timedFetch(siteUrl);

  return {
    name: "Website",
    status: ok ? "pass" : "fail",
    responseTime: elapsed,
    statusCode: status,
    error: ok ? undefined : `HTTP ${status || "timeout/unreachable"}`,
    timestamp,
  };
}

export async function checkBookingSystem(): Promise<HealthCheckResult> {
  const timestamp = new Date().toISOString();
  const bookingUrl =
    "https://www.iconpractice.com/ob/7138/banorachiropractic/245386/2";
  const { ok, status, elapsed } = await timedFetch(bookingUrl);

  return {
    name: "Booking System (IconPractice)",
    status: ok ? "pass" : "fail",
    responseTime: elapsed,
    statusCode: status,
    error: ok ? undefined : `HTTP ${status || "timeout/unreachable"}`,
    timestamp,
  };
}

export async function checkChatbot(): Promise<HealthCheckResult> {
  const timestamp = new Date().toISOString();
  const chatbotUrl =
    "https://thriving-conkies-08c1ca.netlify.app/banora-chatbot-widget.js";
  const { ok, status, elapsed } = await timedFetch(chatbotUrl);

  return {
    name: "AI Chatbot",
    status: ok ? "pass" : "fail",
    responseTime: elapsed,
    statusCode: status,
    error: ok ? undefined : `HTTP ${status || "timeout/unreachable"}`,
    timestamp,
  };
}

export async function runAllChecks(siteUrl: string): Promise<HealthCheckResult[]> {
  return Promise.all([
    checkWebsite(siteUrl),
    checkBookingSystem(),
    checkChatbot(),
  ]);
}

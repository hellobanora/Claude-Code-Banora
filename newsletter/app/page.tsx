export default function Home() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Banora Newsletter API</h1>
      <p>This app runs as a set of API routes. There is no public-facing UI.</p>
      <h2>Available endpoints</h2>
      <ul>
        <li><code>POST /api/generate-newsletter</code> — Generate a newsletter draft via Claude AI</li>
        <li><code>GET /api/preview?id=newsletter:YYYY-MM</code> — Preview a stored draft</li>
        <li><code>POST /api/send-newsletter</code> — Send an approved draft via Mailchimp</li>
        <li><code>POST /api/telegram-webhook</code> — Telegram bot webhook (approve/reject/edit)</li>
      </ul>
    </main>
  );
}

const TONES = new Set(["friendly", "direct", "final"]);

function money(amount, currency) {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 2
    }).format(Number(amount) || 0);
  } catch {
    return (currency || "INR") + " " + (Number(amount) || 0).toFixed(2);
  }
}

function clean(value, max = 300) {
  return String(value ?? "").trim().slice(0, max);
}

function buildReminder(invoice, tone) {
  const name = clean(invoice.client, 100).split(/\s+/)[0] || "there";
  const ref = clean(invoice.invoice, 60);
  const amount = money(invoice.amount, clean(invoice.currency, 10) || "INR");
  const dueDate = clean(invoice.dueDate, 20);
  const reference = ref ? ` (${ref})` : "";

  if (tone === "friendly") {
    return `Hi ${name},

Hope you’re doing well. Just a friendly nudge about invoice${reference} for ${amount}, which was due on ${dueDate}. Could you let me know when we might expect the payment?

Thanks,
[Your name]`;
  }

  if (tone === "final") {
    return `Hello ${name},

This is a further follow-up regarding invoice${reference} for ${amount}, due ${dueDate}. The balance remains outstanding. Please confirm the payment status and provide a firm settlement date. If payment has already been made, please share the remittance details so we can reconcile our records.

Regards,
[Your name]`;
  }

  return `Hello ${name},

I’m following up on invoice${reference} for ${amount}, due ${dueDate}. Our records show it is still outstanding. Please share the expected payment date, or let me know if you need anything from my side.

Regards,
[Your name]`;
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    const invoice = body.invoice || {};
    const tone = clean(body.tone, 20) || "friendly";

    if (!TONES.has(tone)) {
      return res.status(400).json({ ok: false, error: "Unsupported reminder tone" });
    }

    const client = clean(invoice.client, 100);
    const dueDate = clean(invoice.dueDate, 20);
    const amount = Number(invoice.amount);

    if (!client || !dueDate || !Number.isFinite(amount) || amount < 0) {
      return res.status(400).json({
        ok: false,
        error: "client, amount, and dueDate are required"
      });
    }

    // Stateless by design: nothing is written to a database, file, cookie, or cache.
    return res.status(200).json({
      ok: true,
      message: buildReminder(invoice, tone),
      persistence: "none"
    });
  } catch {
    return res.status(400).json({ ok: false, error: "Invalid request" });
  }
}

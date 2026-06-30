const sendEmail = async ({ to, subject, html, text }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Royal Pet Clinic <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error("Email is not configured. Set RESEND_API_KEY and EMAIL_FROM.");
  }
  if (!to) throw new Error("Recipient email is required");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: html || `<p>${text || subject}</p>`,
      text,
    }),
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload?.message || payload?.error || "Failed to send email");
  }
  return payload;
};

module.exports = { sendEmail };

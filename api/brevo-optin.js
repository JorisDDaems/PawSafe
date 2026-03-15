export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;
  const apiKey = process.env.BREVO_API_KEY;

  // Contact toevoegen aan lijst
  await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    body: JSON.stringify({
      email,
      updateEnabled: true,
      listIds: [parseInt(process.env.BREVO_LIST_ID)]
    })
  });

  // Welkomstmail sturen
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    body: JSON.stringify({
      templateId: parseInt(process.env.BREVO_WELCOME_TEMPLATE_ID),
      to: [{ email }]
    })
  });

  res.status(200).json({ ok: true });
}

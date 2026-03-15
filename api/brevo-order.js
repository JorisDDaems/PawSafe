export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { voornaam, achternaam, email, adres, product, prijs, betaling } = req.body;
  const apiKey = process.env.BREVO_API_KEY;

  // Klant toevoegen aan lijst
  await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    body: JSON.stringify({
      email,
      updateEnabled: true,
      listIds: [parseInt(process.env.BREVO_CUSTOMERS_LIST_ID)],
      attributes: { FIRSTNAME: voornaam, LASTNAME: achternaam, ADRES: adres, PRODUCT: product, BEDRAG: prijs }
    })
  });

  // Orderbevestigingsmail sturen
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    body: JSON.stringify({
      templateId: parseInt(process.env.BREVO_ORDER_TEMPLATE_ID),
      to: [{ email, name: voornaam + ' ' + achternaam }],
      params: { VOORNAAM: voornaam, PRODUCT: product, BEDRAG: prijs, ADRES: adres, BETALING: betaling }
    })
  });

  res.status(200).json({ ok: true });
}

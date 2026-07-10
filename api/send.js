const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, destination, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'Sales@alantatour.com',
      reply_to: email,
      subject: `New Enquiry from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#1a1510;padding:24px 32px;">
            <h2 style="color:#c8a05a;margin:0;font-size:20px;font-weight:300;letter-spacing:2px;text-transform:uppercase;">
              New Journey Enquiry
            </h2>
            <p style="color:rgba(240,232,216,0.6);margin:6px 0 0;font-size:12px;">culturalturkey.com</p>
          </div>
          <div style="background:#faf8f4;padding:32px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;color:#8a7355;font-size:11px;text-transform:uppercase;width:140px;">Name</td>
                <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;color:#1a1510;font-size:14px;">${name}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;color:#8a7355;font-size:11px;text-transform:uppercase;">Email</td>
                <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;font-size:14px;"><a href="mailto:${email}" style="color:#c8a05a;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;color:#8a7355;font-size:11px;text-transform:uppercase;">Phone</td>
                <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;color:#1a1510;font-size:14px;">${phone || '—'}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;color:#8a7355;font-size:11px;text-transform:uppercase;">Destination</td>
                <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;color:#1a1510;font-size:14px;">${destination || '—'}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#8a7355;font-size:11px;text-transform:uppercase;vertical-align:top;">Message</td>
                <td style="padding:10px 0;color:#1a1510;font-size:14px;line-height:1.7;">${message || '—'}</td>
              </tr>
            </table>
          </div>
          <div style="background:#1a1510;padding:16px 32px;text-align:center;">
            <p style="color:rgba(240,232,216,0.4);font-size:11px;margin:0;">Reply to respond to ${name}</p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: error.message });
  }
};

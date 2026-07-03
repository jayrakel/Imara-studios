import { Resend } from 'resend';
import { logger } from './logger';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = `${process.env.RESEND_FROM_NAME || 'Imara Studios'} <${process.env.RESEND_FROM_EMAIL || 'noreply@imarastudios.com'}>`;

// ─── Auto-responder to client ─────────────────────────────────────
export async function sendClientAutoResponder(params: {
  to: string;
  clientName: string;
  inquiryType: 'STUDIO_SERVICES' | 'CHOIR_BOOKING';
  referenceId: string;
}) {
  const { to, clientName, inquiryType, referenceId } = params;
  const typeLabel = inquiryType === 'STUDIO_SERVICES' ? 'Studio Services' : 'Choir Booking';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #0a0a0a; color: #f0ede8; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); padding: 40px 48px; border-bottom: 2px solid #C9A84C; }
        .logo { color: #C9A84C; font-size: 28px; font-weight: 700; letter-spacing: 3px; }
        .logo span { color: #f0ede8; font-weight: 300; font-size: 14px; display: block; letter-spacing: 8px; margin-top: 4px; }
        .body { background: #141414; padding: 48px; }
        .greeting { font-size: 22px; font-weight: 600; color: #f0ede8; margin-bottom: 24px; }
        p { color: #a8a29e; line-height: 1.7; margin-bottom: 16px; }
        .highlight { color: #C9A84C; font-weight: 600; }
        .ref-box { background: #1a1a1a; border: 1px solid #2a2a2a; border-left: 3px solid #C9A84C; padding: 16px 20px; border-radius: 6px; margin: 24px 0; }
        .ref-box code { color: #C9A84C; font-size: 13px; letter-spacing: 1px; }
        .sla { background: #1a2a1a; border: 1px solid #2a4a2a; border-radius: 6px; padding: 16px 20px; margin: 24px 0; }
        .sla p { color: #6aaa6a; margin: 0; }
        .footer { background: #0d0d0d; padding: 32px 48px; text-align: center; border-top: 1px solid #1a1a1a; }
        .footer p { color: #555; font-size: 12px; margin: 0; }
        .socials { margin: 16px 0; }
        .socials a { color: #C9A84C; text-decoration: none; margin: 0 8px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">IMARA<span>STUDIOS</span></div>
        </div>
        <div class="body">
          <div class="greeting">Thank you, ${clientName}! 🎙️</div>
          <p>We've received your <span class="highlight">${typeLabel}</span> inquiry and it's already in our hands. Our team is excited to learn more about your project.</p>
          <div class="ref-box">
            <p style="color:#888; font-size:12px; margin:0 0 6px 0; text-transform:uppercase; letter-spacing:1px;">Reference ID</p>
            <code>${referenceId}</code>
          </div>
          <div class="sla">
            <p>⏱️ You'll receive a personalised quote and response from us within <strong>12–24 hours</strong>.</p>
          </div>
          <p>In the meantime, feel free to explore our <a href="https://imarastudios.com/portfolio" style="color:#C9A84C;">portfolio</a> or browse our full range of services.</p>
          <p>If your inquiry is urgent, please call us directly at <span class="highlight">+254 700 000 000</span>.</p>
          <p style="color:#f0ede8;">With gratitude,<br/><strong style="color:#C9A84C;">The Imara Studios Team</strong></p>
        </div>
        <div class="footer">
          <div class="socials">
            <a href="#">Instagram</a>
            <a href="#">YouTube</a>
            <a href="#">Facebook</a>
          </div>
          <p>© ${new Date().getFullYear()} Imara Studios. All rights reserved.</p>
          <p>Nakuru, Kenya</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `We received your inquiry — Imara Studios [Ref: ${referenceId.slice(0, 8).toUpperCase()}]`,
      html,
    });
    logger.info(`Auto-responder sent to ${to}`);
  } catch (err) {
    logger.error('Failed to send auto-responder email:', err);
  }
}

// ─── Admin alert on new inquiry ───────────────────────────────────
export async function sendAdminAlert(params: {
  clientName: string;
  clientEmail: string;
  inquiryType: string;
  serviceType?: string;
  referenceId: string;
  message: string;
}) {
  const { clientName, clientEmail, inquiryType, serviceType, referenceId, message } = params;
  const adminEmail = process.env.ADMIN_ALERT_EMAIL || 'admin@imarastudios.com';

  const html = `
    <!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#0d0d0d;color:#f0ede8;padding:32px;">
      <h2 style="color:#C9A84C;">🔔 New Inquiry — Imara Studios</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px;color:#888;width:140px;">Reference</td><td style="padding:8px;color:#C9A84C;font-family:monospace;">${referenceId}</td></tr>
        <tr><td style="padding:8px;color:#888;">Type</td><td style="padding:8px;">${inquiryType}${serviceType ? ` → ${serviceType}` : ''}</td></tr>
        <tr><td style="padding:8px;color:#888;">Client Name</td><td style="padding:8px;font-weight:600;">${clientName}</td></tr>
        <tr><td style="padding:8px;color:#888;">Client Email</td><td style="padding:8px;"><a href="mailto:${clientEmail}" style="color:#C9A84C;">${clientEmail}</a></td></tr>
        <tr><td style="padding:8px;color:#888;vertical-align:top;">Message</td><td style="padding:8px;color:#ccc;">${message}</td></tr>
      </table>
      <a href="${process.env.ADMIN_URL || 'http://localhost:3000'}/admin/inquiries/${referenceId}" style="display:inline-block;margin-top:24px;background:#C9A84C;color:#000;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">Open in Dashboard →</a>
    </body></html>
  `;

  try {
    await resend.emails.send({
      from: FROM,
      to: adminEmail,
      subject: `[NEW INQUIRY] ${clientName} — ${inquiryType}`,
      html,
    });
    logger.info('Admin alert sent');
  } catch (err) {
    logger.error('Failed to send admin alert email:', err);
  }
}

// ─── Reply to client from admin dashboard ─────────────────────────
export async function sendInquiryReply(params: {
  to: string;
  clientName: string;
  subject: string;
  body: string;
}) {
  const { to, clientName, subject, body } = params;
  const html = `
    <!DOCTYPE html><html><body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#0a0a0a;color:#f0ede8;margin:0;padding:0;">
      <div style="max-width:600px;margin:0 auto;">
        <div style="background:#141414;padding:32px 48px;border-bottom:2px solid #C9A84C;">
          <div style="color:#C9A84C;font-size:24px;font-weight:700;letter-spacing:3px;">IMARA <span style="color:#f0ede8;font-weight:300;font-size:12px;letter-spacing:6px;display:inline-block;margin-left:4px;">STUDIOS</span></div>
        </div>
        <div style="background:#141414;padding:48px;">
          <p style="font-size:18px;font-weight:600;margin-bottom:24px;">Hi ${clientName},</p>
          <div style="color:#c0b8b0;line-height:1.8;white-space:pre-wrap;">${body}</div>
          <hr style="border:none;border-top:1px solid #2a2a2a;margin:32px 0;"/>
          <p style="color:#C9A84C;font-weight:600;">Imara Studios Team</p>
        </div>
        <div style="background:#0d0d0d;padding:24px 48px;text-align:center;">
          <p style="color:#555;font-size:12px;">© ${new Date().getFullYear()} Imara Studios — Nakuru, Kenya</p>
        </div>
      </div>
    </body></html>
  `;

  await resend.emails.send({
    from: FROM,
    to,
    subject,
    html,
  });
}

// ─── Welcome email for new choir member accounts ──────────────────
export async function sendMemberWelcome(params: {
  to: string;
  name: string;
  tempPassword: string;
}) {
  const { to, name, tempPassword } = params;
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/choir/member-portal`;

  const html = `
    <!DOCTYPE html><html><body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#0a0a0a;color:#f0ede8;margin:0;padding:0;">
      <div style="max-width:600px;margin:0 auto;">
        <div style="background:#141414;padding:32px 48px;border-bottom:2px solid #C9A84C;">
          <div style="color:#C9A84C;font-size:24px;font-weight:700;letter-spacing:3px;">IMARA <span style="color:#f0ede8;font-weight:300;font-size:12px;letter-spacing:6px;">STUDIOS</span></div>
        </div>
        <div style="background:#141414;padding:48px;">
          <p style="font-size:20px;font-weight:700;margin-bottom:8px;">Welcome to the choir, ${name}! 🎶</p>
          <p style="color:#a8a29e;line-height:1.7;">Your member account for the Imara Studios Choir Hub has been created. You can log in below using your temporary credentials.</p>
          <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-left:3px solid #C9A84C;padding:20px 24px;border-radius:6px;margin:24px 0;">
            <p style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px 0;">Your Login Credentials</p>
            <p style="margin:4px 0;color:#f0ede8;"><strong style="color:#888;min-width:80px;display:inline-block;">Email:</strong> ${to}</p>
            <p style="margin:4px 0;color:#f0ede8;"><strong style="color:#888;min-width:80px;display:inline-block;">Password:</strong> <code style="color:#C9A84C;font-size:14px;">${tempPassword}</code></p>
          </div>
          <div style="background:#1a2a1a;border:1px solid #2a4a2a;border-radius:6px;padding:16px 20px;margin:24px 0;">
            <p style="color:#6aaa6a;margin:0;">⚠️ Please change your password after your first login for security.</p>
          </div>
          <a href="${portalUrl}" style="display:inline-block;background:#C9A84C;color:#000;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;margin-top:8px;">
            Login to Member Portal →
          </a>
          <p style="color:#a8a29e;margin-top:32px;">Through the portal you can access rehearsal songs, submit photos, and stay updated on upcoming events.</p>
          <p style="color:#f0ede8;margin-top:24px;">See you at rehearsal!<br/><strong style="color:#C9A84C;">Imara Studios Choir</strong></p>
        </div>
        <div style="background:#0d0d0d;padding:24px 48px;text-align:center;">
          <p style="color:#555;font-size:12px;">© ${new Date().getFullYear()} Imara Studios — Nakuru, Kenya</p>
        </div>
      </div>
    </body></html>
  `;

  try {
    await resend.emails.send({ from: FROM, to, subject: '🎶 Welcome to Imara Studios Choir — Your Login Details', html });
    logger.info(`Welcome email sent to ${to}`);
  } catch (err) {
    logger.error('Failed to send member welcome email:', err);
    throw err;
  }
}

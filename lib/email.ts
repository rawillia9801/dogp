import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const defaultFrom = process.env.EMAIL_FROM || "MyDogPortal <hello@dogbreederweb.site>";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const resend = new Resend(resendApiKey);

  const { error } = await resend.emails.send({
    from: defaultFrom,
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export function buildAccountVerificationEmail({
  businessName,
  verifyUrl,
}: {
  businessName: string;
  verifyUrl: string;
}) {
  const safeBusinessName = escapeHtml(businessName || "your breeding program");

  return `
    <div style="margin:0;padding:0;background:#F8F7F3;font-family:Arial,sans-serif;color:#1F2933;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F8F7F3;padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #E5DED2;border-radius:28px;overflow:hidden;box-shadow:0 18px 48px rgba(47,79,62,0.12);">
              <tr>
                <td style="padding:32px 32px 12px;">
                  <div style="display:inline-flex;align-items:center;gap:10px;">
                    <div style="width:44px;height:44px;border-radius:16px;background:#2F4F3E;color:#ffffff;text-align:center;line-height:44px;font-size:22px;">🐾</div>
                    <div>
                      <div style="font-size:20px;font-weight:800;color:#1F2933;">MyDogPortal</div>
                      <div style="font-size:13px;color:#5B6B73;">Dog Breeder Web + Docs + Portal</div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 32px 8px;">
                  <h1 style="margin:0;font-size:30px;line-height:1.15;color:#1F2933;">Confirm your breeder workspace</h1>
                  <p style="margin:18px 0 0;font-size:16px;line-height:1.7;color:#5B6B73;">
                    Welcome! Confirm your email to finish setting up <strong style="color:#2F4F3E;">${safeBusinessName}</strong> in MyDogPortal.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 32px 10px;">
                  <a href="${verifyUrl}" style="display:block;background:#2F4F3E;color:#ffffff;text-decoration:none;text-align:center;border-radius:18px;padding:16px 22px;font-size:16px;font-weight:800;">
                    Confirm My Account
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 32px 32px;">
                  <p style="margin:0;font-size:13px;line-height:1.6;color:#7A6A55;">
                    This link expires in 24 hours. If you did not create this account, you can safely ignore this email.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

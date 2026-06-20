import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const SHELTER = {
    name: process.env.SHELTER_NAME || 'Haven Pet Home',
    address: process.env.SHELTER_ADDRESS || 'First Bank Building, Alagbon, Ikoyi, Lagos',
    phone: process.env.SHELTER_PHONE || '+234 810-969-0608',
    email: process.env.SHELTER_EMAIL || 'info@havenpethome.com',
    visitDays: process.env.SHELTER_VISIT_DAYS || 'Every Saturday',
    visitHours: process.env.SHELTER_VISIT_HOURS || '10:00 AM – 2:00 PM',
};

const buildApprovedAdoptionEmail = ({ name, petName }) => {
    const greeting = name ? `Hello ${name}` : 'Hello';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Adoption Approved</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a5f4a 0%, #2d8a6e 100%); padding: 32px 28px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.85);">Haven Dogs</p>
              <h1 style="margin: 0; font-size: 26px; line-height: 1.3; color: #ffffff; font-weight: 700;">Your adoption request is approved!</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 28px; color: #333333; font-size: 16px; line-height: 1.7;">
              <p style="margin: 0 0 16px;">${greeting},</p>
              <p style="margin: 0 0 20px;">
                Thank you for your interest in adopting from <strong>${SHELTER.name}</strong>.
                We are delighted to let you know that your request to adopt <strong>${petName}</strong> has been <span style="color: #1a5f4a; font-weight: 700;">approved</span>.
              </p>

              <!-- Invitation card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 24px; background-color: #f0faf6; border: 1px solid #b8e6d4; border-radius: 10px;">
                <tr>
                  <td style="padding: 22px 20px;">
                    <p style="margin: 0 0 6px; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: #1a5f4a; font-weight: 700;">Shelter visit invitation</p>
                    <h2 style="margin: 0 0 14px; font-size: 20px; color: #1a3d32;">You are invited to meet ${petName}</h2>
                    <p style="margin: 0 0 16px; color: #444444;">
                      You are warmly invited to visit our shelter and meet ${petName} in person. No appointment is needed — simply drop in on any <strong>${SHELTER.visitDays}</strong> during interview hours.
                    </p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 10px 0; border-top: 1px solid #d4ede4; color: #555555; font-size: 15px;">
                          <strong style="color: #1a5f4a;">When:</strong> ${SHELTER.visitDays}, ${SHELTER.visitHours} (interview hours)
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-top: 1px solid #d4ede4; color: #555555; font-size: 15px;">
                          <strong style="color: #1a5f4a;">Where:</strong> ${SHELTER.address}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-top: 1px solid #d4ede4; color: #555555; font-size: 15px;">
                          <strong style="color: #1a5f4a;">Contact:</strong> ${SHELTER.phone} &middot; ${SHELTER.email}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Visit note -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 24px; background-color: #fff8e8; border-left: 4px solid #e6a817; border-radius: 6px;">
                <tr>
                  <td style="padding: 16px 18px;">
                    <p style="margin: 0; font-size: 15px; color: #5c4a1a;">
                      <strong>Please note:</strong> there is no need to pick a specific date or reply to schedule a visit. Just come on any Saturday between ${SHELTER.visitHours} and we will be happy to meet with you.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Outside Lagos / representative -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 24px; background-color: #f7f8fa; border-radius: 10px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 8px; font-size: 15px; font-weight: 700; color: #333333;">Unable to visit in person?</p>
                    <p style="margin: 0; font-size: 15px; color: #555555; line-height: 1.6;">
                      If you are outside Lagos or cannot come to the shelter yourself, you may send a trusted family member or representative on your behalf. Please include their full name and phone number when you reply to this email.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #555555;">
                We truly appreciate your love for giving dogs a second chance at life.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 28px; background-color: #f7f8fa; border-top: 1px solid #e8ecef; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 15px; color: #333333;"><strong>The Haven Dogs Team</strong></p>
              <p style="margin: 0; font-size: 13px; color: #888888;">${SHELTER.name} &middot; Rescue, Rehabilitate, Rehome</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
};

const buildRejectedAdoptionEmail = () => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="padding: 32px 28px; color: #333333; font-size: 16px; line-height: 1.7;">
              <p style="margin: 0 0 16px;">Hello,</p>
              <p style="margin: 0 0 16px;">
                Thank you so much for believing in us and for your interest in adopting from ${SHELTER.name}.
                At this time, we are unable to grant your request. This may be because the dog has already been adopted, because we are currently prioritizing applicants in Lagos, or due to other factors.
              </p>
              <p style="margin: 0 0 24px;">
                We truly appreciate your love for animals. We will keep your details on file and reach out when another wonderful animal becomes available.
              </p>
              <p style="margin: 0;"><strong>The Haven Dogs Team</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

/**
 * Send adoption request status email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - Recipient name
 * @param {string} options.petName - Pet name
 * @param {string} options.status - Status (approved/rejected)
 * @returns {Promise}
 */
export const sendAdoptionStatusEmail = async ({ to, name, petName, status }) => {
    try {
        const isApproved = status === 'approved';
        const subject = isApproved
            ? `You're invited to visit the shelter — ${petName} adoption approved`
            : `Update on your adoption request for ${petName}`;

        const htmlContent = isApproved
            ? buildApprovedAdoptionEmail({ name, petName })
            : buildRejectedAdoptionEmail();

        const replyTo = process.env.SENDGRID_REPLY_TO_EMAIL || SHELTER.email;

        const msg = {
            to,
            from: process.env.SENDGRID_FROM_EMAIL || 'noreply@havendogs.com',
            replyTo,
            subject,
            html: htmlContent,
        };

        await sgMail.send(msg);
        console.log(`✅ Adoption status email sent to ${to} for ${petName} - Status: ${status}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending adoption status email:', error);
        // Don't throw error - we don't want email failures to break the API response
        return { success: false, error: error.message };
    }
};

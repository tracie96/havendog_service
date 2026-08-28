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
  <title>Adoption Interview Invitation</title>
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
              <h1 style="margin: 0; font-size: 26px; line-height: 1.3; color: #ffffff; font-weight: 700;">Your adoption interview — final step</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 28px; color: #333333; font-size: 16px; line-height: 1.7;">
              <p style="margin: 0 0 16px;">${greeting},</p>
              <p style="margin: 0 0 20px;">
                Thank you for your interest in adopting from <strong>${SHELTER.name}</strong>.
                We are delighted to let you know that your request to adopt <strong>${petName}</strong> has been <span style="color: #1a5f4a; font-weight: 700;">approved</span>.
                The next and final step is an in-person <strong>adoption interview</strong> at our shelter, where you will meet ${petName} and complete the process.
              </p>

              <!-- Interview invitation card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 24px; background-color: #f0faf6; border: 1px solid #b8e6d4; border-radius: 10px;">
                <tr>
                  <td style="padding: 22px 20px;">
                    <p style="margin: 0 0 6px; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: #1a5f4a; font-weight: 700;">Adoption interview invitation</p>
                    <h2 style="margin: 0 0 14px; font-size: 20px; color: #1a3d32;">You are invited to interview for ${petName}</h2>
                    <p style="margin: 0 0 16px; color: #444444;">
                      Please visit our shelter for your adoption interview and to meet ${petName} in person. No appointment is needed — simply drop in on any <strong>${SHELTER.visitDays}</strong> during interview hours.
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

              <!-- Interview note -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 24px; background-color: #fff8e8; border-left: 4px solid #e6a817; border-radius: 6px;">
                <tr>
                  <td style="padding: 16px 18px;">
                    <p style="margin: 0; font-size: 15px; color: #5c4a1a;">
                      <strong>Please note:</strong> there is no need to pick a specific date or reply to schedule your interview. Just come on any Saturday between ${SHELTER.visitHours} and we will be happy to meet with you.
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

const STAFF_NOTIFY_EMAILS = (process.env.STAFF_NOTIFY_EMAILS || 'fahida.emetumah@gmail.com,tracyamara07@gmail.com')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);

const formatValue = (value) => {
    if (value === undefined || value === null || value === '') return 'N/A';
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
};

const formatDate = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
};

const staffEmailLayout = (title, bodyHtml) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #1a5f4a 0%, #2d8a6e 100%); padding: 28px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.85);">Haven Pet Home</p>
              <h1 style="margin: 0; font-size: 22px; color: #ffffff;">${title}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px; color: #333333; font-size: 15px; line-height: 1.6;">
              ${bodyHtml}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

const detailRow = (label, value) => `
  <tr>
    <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666; width: 40%;"><strong>${label}</strong></td>
    <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #333;">${formatValue(value)}</td>
  </tr>
`;

const sendStaffEmail = async ({ subject, html }) => {
    try {
        await sgMail.send({
            to: STAFF_NOTIFY_EMAILS,
            from: process.env.SENDGRID_FROM_EMAIL || 'noreply@havendogs.com',
            replyTo: process.env.SENDGRID_REPLY_TO_EMAIL || SHELTER.email,
            subject,
            html,
        });
        console.log(`✅ Staff notification sent: ${subject}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending staff notification email:', error);
        return { success: false, error: error.message };
    }
};

export const sendBoardingRequestStaffEmail = async (submission) => {
    const owner = submission.owner || {};
    const pet = submission.pet || {};
    const boarding = submission.boarding || {};

    const html = staffEmailLayout(
        'New boarding request',
        `
          <p>A new pet boarding request has been submitted.</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            ${detailRow('Owner', owner.name)}
            ${detailRow('Email', owner.email)}
            ${detailRow('Phone', owner.phone)}
            ${detailRow('Pet name', pet.name)}
            ${detailRow('Breed', pet.breed)}
            ${detailRow('Age', pet.age)}
            ${detailRow('Size', pet.dogSize)}
            ${detailRow('Last vaccinated', pet.lastVaccinated)}
            ${detailRow('On tick medicine', pet.onTickMedicine)}
            ${detailRow('Check-in', formatDate(boarding.startDate))}
            ${detailRow('Check-out', formatDate(boarding.endDate))}
          </table>
          <p style="margin: 20px 0 0; color: #666;">Please review this request in the admin dashboard under Boarding Requests.</p>
        `
    );

    return sendStaffEmail({
        subject: `New boarding request — ${pet.name || 'pet'} from ${owner.name || 'an owner'}`,
        html,
    });
};

export const sendSurrenderRequestStaffEmail = async (submission) => {
    const surrenderer = submission.surrenderer || {};
    const pet = submission.pet || {};
    const reason = submission.reason || {};
    const species = pet.species === 'other' ? pet.speciesOther || 'other' : pet.species;
    const reasons = Array.isArray(reason.reasons) && reason.reasons.length
        ? reason.reasons.join(', ')
        : 'N/A';

    const html = staffEmailLayout(
        'New pet surrender request',
        `
          <p>A new pet surrender / relinquishment form has been submitted.</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            ${detailRow('Surrenderer', surrenderer.fullName)}
            ${detailRow('Email', surrenderer.email)}
            ${detailRow('Phone', surrenderer.phone)}
            ${detailRow('WhatsApp', surrenderer.whatsapp)}
            ${detailRow('Pet name', pet.name)}
            ${detailRow('Species', species)}
            ${detailRow('Breed', pet.breed)}
            ${detailRow('Sex', pet.sex)}
            ${detailRow('Age', pet.age)}
            ${detailRow('Reasons', reasons)}
            ${detailRow('Explanation', reason.explanation)}
          </table>
          <p style="margin: 20px 0 0; color: #666;">Please review this request in the admin dashboard under Pet Surrenders.</p>
        `
    );

    return sendStaffEmail({
        subject: `New pet surrender — ${pet.name || 'pet'} from ${surrenderer.fullName || 'a surrenderer'}`,
        html,
    });
};

const buildShelterVisitCard = ({ title, intro, petName, extraRows = '' }) => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 24px; background-color: #f0faf6; border: 1px solid #b8e6d4; border-radius: 10px;">
    <tr>
      <td style="padding: 22px 20px;">
        <p style="margin: 0 0 6px; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: #1a5f4a; font-weight: 700;">${title}</p>
        <p style="margin: 0 0 16px; color: #444444;">${intro}</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 10px 0; border-top: 1px solid #d4ede4; color: #555555; font-size: 15px;">
              <strong style="color: #1a5f4a;">Pet:</strong> ${petName}
            </td>
          </tr>
          ${extraRows}
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
`;

const buildAcceptedBoardingEmail = ({ name, petName, startDate, endDate }) => {
    const greeting = name ? `Hello ${name}` : 'Hello';
    const extraRows = `
      <tr>
        <td style="padding: 10px 0; border-top: 1px solid #d4ede4; color: #555555; font-size: 15px;">
          <strong style="color: #1a5f4a;">Check-in:</strong> ${formatDate(startDate)}
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-top: 1px solid #d4ede4; color: #555555; font-size: 15px;">
          <strong style="color: #1a5f4a;">Check-out:</strong> ${formatDate(endDate)}
        </td>
      </tr>
    `;

    return staffEmailLayout(
        'Your boarding request is approved',
        `
          <p style="margin: 0 0 16px;">${greeting},</p>
          <p style="margin: 0 0 20px;">
            Great news — your boarding request for <strong>${petName}</strong> has been <strong style="color: #1a5f4a;">approved</strong>.
            You may now bring your pet to our shelter for boarding.
          </p>
          ${buildShelterVisitCard({
              title: 'Bring your pet to the shelter',
              intro: 'Please bring your pet to the shelter on your scheduled dates. When you arrive, please have the following ready:',
              petName,
              extraRows,
          })}
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 24px; background-color: #fff8e8; border-left: 4px solid #e6a817; border-radius: 6px;">
            <tr>
              <td style="padding: 16px 18px;">
                <p style="margin: 0 0 10px; font-size: 15px; color: #5c4a1a;"><strong>Please bring:</strong></p>
                <p style="margin: 0 0 8px; font-size: 15px; color: #5c4a1a;">1. An <strong>updated vaccination card</strong> for ${petName}</p>
                <p style="margin: 0; font-size: 15px; color: #5c4a1a;">2. Proof that your pet is on <strong>tick/flea medication</strong> (or bring the medication with you)</p>
              </td>
            </tr>
          </table>
          <p style="margin: 0; color: #555555;">
            If you have any questions before drop-off, please reply to this email or contact us using the details above.
          </p>
        `
    );
};

const buildAcceptedSurrenderEmail = ({ name, petName }) => {
    const greeting = name ? `Hello ${name}` : 'Hello';

    return staffEmailLayout(
        'Your surrender request has been accepted',
        `
          <p style="margin: 0 0 16px;">${greeting},</p>
          <p style="margin: 0 0 20px;">
            We have reviewed your surrender request for <strong>${petName}</strong> and it has been <strong style="color: #1a5f4a;">accepted</strong>.
            You may now bring the animal to our shelter to complete the surrender process.
          </p>
          ${buildShelterVisitCard({
              title: 'Bring your pet to the shelter',
              intro: 'Please bring the animal to our shelter at your earliest convenience. When you arrive, please have the following ready:',
              petName,
          })}
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 24px; background-color: #fff8e8; border-left: 4px solid #e6a817; border-radius: 6px;">
            <tr>
              <td style="padding: 16px 18px;">
                <p style="margin: 0 0 10px; font-size: 15px; color: #5c4a1a;"><strong>Please bring:</strong></p>
                <p style="margin: 0 0 8px; font-size: 15px; color: #5c4a1a;">1. An <strong>updated vaccination card</strong> for ${petName}</p>
                <p style="margin: 0; font-size: 15px; color: #5c4a1a;">2. Proof that the pet is on <strong>tick/flea medication</strong> (or bring the medication with you)</p>
              </td>
            </tr>
          </table>
          <p style="margin: 0; color: #555555;">
            Thank you for reaching out to ${SHELTER.name}. If you need directions or have questions before your visit, please contact us using the details above.
          </p>
        `
    );
};

const sendCustomerEmail = async ({ to, subject, html }) => {
    try {
        await sgMail.send({
            to,
            from: process.env.SENDGRID_FROM_EMAIL || 'noreply@havendogs.com',
            replyTo: process.env.SENDGRID_REPLY_TO_EMAIL || SHELTER.email,
            subject,
            html,
        });
        console.log(`✅ Customer email sent to ${to}: ${subject}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending customer email:', error);
        return { success: false, error: error.message };
    }
};

export const sendBoardingAcceptedEmail = async (submission) => {
    const owner = submission.owner || {};
    const pet = submission.pet || {};
    const boarding = submission.boarding || {};

    if (!owner.email) {
        return { success: false, error: 'Owner email missing' };
    }

    return sendCustomerEmail({
        to: owner.email,
        subject: `Boarding approved — bring ${pet.name || 'your pet'} to the shelter`,
        html: buildAcceptedBoardingEmail({
            name: owner.name,
            petName: pet.name || 'your pet',
            startDate: boarding.startDate,
            endDate: boarding.endDate,
        }),
    });
};

export const sendSurrenderAcceptedEmail = async (submission) => {
    const surrenderer = submission.surrenderer || {};
    const pet = submission.pet || {};

    if (!surrenderer.email) {
        return { success: false, error: 'Surrenderer email missing' };
    }

    return sendCustomerEmail({
        to: surrenderer.email,
        subject: `Surrender accepted — bring ${pet.name || 'your pet'} to the shelter`,
        html: buildAcceptedSurrenderEmail({
            name: surrenderer.fullName,
            petName: pet.name || 'your pet',
        }),
    });
};

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
            ? `Your adoption interview for ${petName} — final step`
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

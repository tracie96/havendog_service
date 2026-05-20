import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
            ? `Your adoption request for ${petName} has been approved`
            : `Update on your adoption request for ${petName}`;

        const htmlContent = isApproved
            ? `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6;">
                    <p>Hello amazing dog lover, 💛</p>
                    <p>Thank you so much for your interest in adopting from Haven Pet Home. We are delighted to let you know that your adoption request has been approved!</p>
                    <p>Please visit us at the shelter on any Saturday to meet ${petName} and complete the next steps. When you plan to come, kindly reply to this email and let us know which Saturday you will be visiting.</p>
                    <p>We truly appreciate your love for giving dogs a second chance at life. 🐾</p>
                    <br>
                    <p>Warm regards,</p>
                    <p><strong>The Haven Dogs Team</strong></p>
                </div>
            `
            : `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6;">
                    <p>Hello amazing Animal lover, 💛</p>
                    <p>Thank you so much for believing in us and for your interest in adopting from Haven Pet Home. At this time, we're unable to grant your request due to Location as we are only prioritizing those in Lagos, or other Factors, but we truly appreciate your love for animals. We'll keep your details on file and reach out when another wonderful animal becomes available.</p>
                    <br>
                    <p>With love,</p>
                    <p><strong>The Haven Dogs Team 🐾</strong></p>
                </div>
            `;

        const msg = {
            to,
            from: process.env.SENDGRID_FROM_EMAIL || 'noreply@havendogs.com',
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


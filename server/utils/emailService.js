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
            ? `Congratulations! Your adoption request for ${petName} has been approved`
            : `Update on your adoption request for ${petName}`;

        const htmlContent = isApproved
            ? `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4CAF50;">Great News, ${name}!</h2>
                    <p>We're excited to inform you that your adoption request for <strong>${petName}</strong> has been <strong>approved</strong>!</p>
                    <p>The pet owner will be in touch with you soon to discuss the next steps in the adoption process.</p>
                    <p>Thank you for choosing to adopt through HavenDogs!</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">This is an automated message from HavenDogs.</p>
                </div>
            `
            : `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #f44336;">Update on Your Adoption Request</h2>
                    <p>Hello ${name},</p>
                    <p>We wanted to inform you that your adoption request for <strong>${petName}</strong> has been <strong>rejected</strong> at this time.</p>
                    <p>We encourage you to continue your search for the perfect pet companion. There are many other wonderful pets available for adoption.</p>
                    <p>Thank you for your interest in adopting through HavenDogs.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">This is an automated message from HavenDogs.</p>
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


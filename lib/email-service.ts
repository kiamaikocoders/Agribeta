/**
 * Email Service
 * 
 * This service handles all email notifications for the application.
 * 
 * To activate:
 * 1. Choose an email provider (Resend, SendGrid, AWS SES, etc.)
 * 2. Add environment variables to .env.local:
 *    - EMAIL_SERVICE=resend (or sendgrid, ses, etc.)
 *    - EMAIL_API_KEY=your_api_key
 *    - EMAIL_FROM=your-sender@yourdomain.com
 * 3. Install the email provider SDK: npm install resend (or appropriate package)
 * 4. Uncomment and configure the appropriate provider below
 */

interface EmailParams {
  to: string
  subject: string
  html: string
  text?: string
}

interface BookingEmailData {
  recipientName: string
  recipientEmail: string
  bookerName: string
  consultationType: string
  scheduledDate: string
  scheduledTime: string
  duration: number
  cost?: number
  message?: string
  bookingId: string
}

export class EmailService {
  private static instance: EmailService
  private enabled: boolean = false

  private constructor() {
    // Check if email service is configured
    this.enabled = !!process.env.EMAIL_API_KEY && !!process.env.EMAIL_FROM
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  /**
   * Send a generic email
   */
  async sendEmail({ to, subject, html, text }: EmailParams): Promise<boolean> {
    if (!this.enabled) {
      console.warn('Email service not configured. Email not sent.')
      console.log('Email details:', { to, subject })
      return false
    }

    try {
      // TODO: Implement your email provider here
      // Example for Resend:
      // const resend = new Resend(process.env.EMAIL_API_KEY)
      // await resend.emails.send({
      //   from: process.env.EMAIL_FROM!,
      //   to,
      //   subject,
      //   html,
      //   text
      // })

      console.log('Email would be sent:', { to, subject })
      return true
    } catch (error) {
      console.error('Error sending email:', error)
      return false
    }
  }

  /**
   * Send booking confirmation email to farmer
   */
  async sendBookingConfirmationToFarmer(data: BookingEmailData): Promise<boolean> {
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':')
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 || 12
      return `${displayHour}:${minutes} ${ampm}`
    }

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .detail-row { margin: 15px 0; padding: 10px; background: white; border-left: 4px solid #4CAF50; }
            .detail-label { font-weight: bold; color: #555; }
            .detail-value { color: #333; margin-left: 10px; }
            .button { background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Consultation Booked!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.recipientName},</p>
              <p>Your consultation with <strong>${data.bookerName}</strong> has been successfully booked.</p>
              
              <div class="detail-row">
                <span class="detail-label">📅 Date:</span>
                <span class="detail-value">${formatDate(data.scheduledDate)}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">⏰ Time:</span>
                <span class="detail-value">${formatTime(data.scheduledTime)}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">📞 Type:</span>
                <span class="detail-value">${data.consultationType === 'video' ? 'Video Call' : data.consultationType === 'phone' ? 'Phone Call' : 'Farm Visit'}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">⏱️ Duration:</span>
                <span class="detail-value">${data.duration} minutes</span>
              </div>
              
              ${data.cost ? `
                <div class="detail-row">
                  <span class="detail-label">💰 Cost:</span>
                  <span class="detail-value">$${data.cost.toFixed(2)}</span>
                </div>
              ` : ''}
              
              ${data.message ? `
                <div class="detail-row">
                  <span class="detail-label">📝 Message:</span>
                  <span class="detail-value">${data.message}</span>
                </div>
              ` : ''}
              
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}/consultations" class="button">
                  View Consultation Details
                </a>
              </div>
              
              <p style="margin-top: 30px;">You will receive a reminder 24 hours before your scheduled consultation.</p>
              
              <p>If you need to reschedule or have any questions, please visit your consultations page.</p>
              
              <p>Best regards,<br><strong>AgriBeta Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} AgriBeta. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: data.recipientEmail,
      subject: `Consultation Confirmed - ${formatDate(data.scheduledDate)}`,
      html,
      text: `Your consultation with ${data.bookerName} has been booked for ${formatDate(data.scheduledDate)} at ${formatTime(data.scheduledTime)}.`
    })
  }

  /**
   * Send new booking notification email to agronomist
   */
  async sendBookingNotificationToAgronomist(data: BookingEmailData): Promise<boolean> {
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':')
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 || 12
      return `${displayHour}:${minutes} ${ampm}`
    }

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .detail-row { margin: 15px 0; padding: 10px; background: white; border-left: 4px solid #2196F3; }
            .detail-label { font-weight: bold; color: #555; }
            .detail-value { color: #333; margin-left: 10px; }
            .button { background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .button-secondary { background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px; }
            .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
            .urgent { background-color: #fff3cd; border-left-color: #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 New Booking Request!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.recipientName},</p>
              <p>You have a new consultation booking from <strong>${data.bookerName}</strong>.</p>
              
              <div class="urgent">
                <strong>⚠️ Action Required:</strong> Please confirm or adjust this booking as soon as possible.
              </div>
              
              <div class="detail-row">
                <span class="detail-label">👤 Client:</span>
                <span class="detail-value">${data.bookerName}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">📅 Date:</span>
                <span class="detail-value">${formatDate(data.scheduledDate)}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">⏰ Time:</span>
                <span class="detail-value">${formatTime(data.scheduledTime)}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">📞 Type:</span>
                <span class="detail-value">${data.consultationType === 'video' ? 'Video Call' : data.consultationType === 'phone' ? 'Phone Call' : 'Farm Visit'}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">⏱️ Duration:</span>
                <span class="detail-value">${data.duration} minutes</span>
              </div>
              
              ${data.cost ? `
                <div class="detail-row">
                  <span class="detail-label">💰 Fee:</span>
                  <span class="detail-value">$${data.cost.toFixed(2)}</span>
                </div>
              ` : ''}
              
              ${data.message ? `
                <div class="detail-row">
                  <span class="detail-label">📝 Client Message:</span>
                  <span class="detail-value">"${data.message}"</span>
                </div>
              ` : ''}
              
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}/consultations" class="button-secondary">
                  Confirm Booking
                </a>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}/consultations" class="button">
                  View Details
                </a>
              </div>
              
              <p style="margin-top: 30px;">Please confirm this booking or contact the client if you need to reschedule.</p>
              
              <p>Best regards,<br><strong>AgriBeta Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} AgriBeta. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: data.recipientEmail,
      subject: `New Consultation Request from ${data.bookerName}`,
      html,
      text: `New consultation request from ${data.bookerName} for ${formatDate(data.scheduledDate)} at ${formatTime(data.scheduledTime)}.`
    })
  }

  /**
   * Send cancellation notification
   */
  async sendCancellationEmail(data: BookingEmailData & { cancelledBy: string }): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <h2>Consultation Cancelled</h2>
          <p>The consultation scheduled for ${data.scheduledDate} at ${data.scheduledTime} has been cancelled.</p>
          <p>Cancelled by: ${data.cancelledBy}</p>
        </body>
      </html>
    `

    return this.sendEmail({
      to: data.recipientEmail,
      subject: 'Consultation Cancelled',
      html
    })
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance()


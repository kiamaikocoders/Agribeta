# Email Notification Setup Guide

This guide explains how to set up email notifications for booking confirmations and updates in AgriBeta.

## Overview

The email service (`/lib/email-service.ts`) is already implemented and ready to use. You just need to configure your email provider.

## Email Providers (Choose One)

### Option 1: Resend (Recommended)

**Pros**: Simple, affordable, great deliverability, designed for developers  
**Pricing**: Free tier includes 100 emails/day, 3,000/month

#### Setup Steps:

1. **Sign up at [resend.com](https://resend.com)**

2. **Verify your domain** (or use their test domain for development)
   - Add DNS records to your domain
   - Wait for verification (usually instant)

3. **Get your API key**
   - Dashboard > API Keys > Create API Key
   - Copy the key (starts with `re_`)

4. **Install Resend SDK**:
   ```bash
   npm install resend
   ```

5. **Add to `.env.local`**:
   ```bash
   EMAIL_SERVICE=resend
   EMAIL_API_KEY=re_your_api_key_here
   EMAIL_FROM=noreply@yourdomain.com
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

6. **Update `/lib/email-service.ts`**:
   ```typescript
   import { Resend } from 'resend'
   
   // In sendEmail method, replace the TODO section with:
   const resend = new Resend(process.env.EMAIL_API_KEY)
   await resend.emails.send({
     from: process.env.EMAIL_FROM!,
     to,
     subject,
     html,
     text
   })
   ```

---

### Option 2: SendGrid

**Pros**: Established provider, good documentation  
**Pricing**: Free tier includes 100 emails/day

#### Setup Steps:

1. **Sign up at [sendgrid.com](https://sendgrid.com)**

2. **Verify sender identity**

3. **Create API key**:
   - Settings > API Keys > Create API Key
   - Full Access

4. **Install SendGrid SDK**:
   ```bash
   npm install @sendgrid/mail
   ```

5. **Add to `.env.local`**:
   ```bash
   EMAIL_SERVICE=sendgrid
   EMAIL_API_KEY=SG.your_api_key_here
   EMAIL_FROM=noreply@yourdomain.com
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

6. **Update `/lib/email-service.ts`**:
   ```typescript
   import sgMail from '@sendgrid/mail'
   
   // In constructor:
   if (process.env.EMAIL_API_KEY) {
     sgMail.setApiKey(process.env.EMAIL_API_KEY)
   }
   
   // In sendEmail method:
   await sgMail.send({
     from: process.env.EMAIL_FROM!,
     to,
     subject,
     html,
     text
   })
   ```

---

### Option 3: AWS SES

**Pros**: Very cheap at scale, reliable  
**Pricing**: $0.10 per 1,000 emails (after free tier)

#### Setup Steps:

1. **AWS Console** > **SES** > **Verify email address**

2. **Request production access** (starts in sandbox mode)

3. **Create IAM user** with SES permissions

4. **Install AWS SDK**:
   ```bash
   npm install @aws-sdk/client-ses
   ```

5. **Add to `.env.local`**:
   ```bash
   EMAIL_SERVICE=ses
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   EMAIL_FROM=noreply@yourdomain.com
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

6. **Update `/lib/email-service.ts`**:
   ```typescript
   import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
   
   const sesClient = new SESClient({ 
     region: process.env.AWS_REGION,
     credentials: {
       accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
     }
   })
   
   // In sendEmail method:
   await sesClient.send(new SendEmailCommand({
     Source: process.env.EMAIL_FROM!,
     Destination: { ToAddresses: [to] },
     Message: {
       Subject: { Data: subject },
       Body: {
         Html: { Data: html },
         Text: { Data: text || subject }
       }
     }
   }))
   ```

---

## Email Templates

The system includes pre-built HTML email templates for:

### 1. Booking Confirmation (to Farmer)
- ✅ Professional design with AgriBeta branding
- 📅 All booking details (date, time, type, duration, cost)
- 🔗 Link to view consultation details
- 📝 Reminder about 24-hour advance notice

### 2. Booking Notification (to Agronomist)
- 🔔 Urgent action required notification
- 👤 Client information
- 📅 Booking details
- 🔗 Quick action buttons (Confirm/View)
- 💰 Fee information

### 3. Cancellation Email
- ❌ Cancellation notification
- 👤 Who cancelled
- 📅 Original booking details

## Customizing Email Templates

### Change Colors

In `/lib/email-service.ts`, find the `<style>` section:

```typescript
// Change primary color (currently green #4CAF50)
.header { background-color: #4CAF50; } // Your brand color
.button { background-color: #4CAF50; } // Your brand color
```

### Add Logo

```html
<div class="header">
  <img src="${process.env.NEXT_PUBLIC_APP_URL}/agribeta-logo.png" 
       alt="AgriBeta" 
       style="max-width: 150px; margin-bottom: 10px;" />
  <h1>✓ Consultation Booked!</h1>
</div>
```

### Change Wording

Edit the text in the HTML templates in `/lib/email-service.ts`:
- `sendBookingConfirmationToFarmer()`
- `sendBookingNotificationToAgronomist()`
- `sendCancellationEmail()`

## Testing Emails

### Development Testing (Without Real Provider)

The system logs email details to console:
```typescript
console.log('Email would be sent:', { to, subject })
```

### Test with Real Provider

1. Set up environment variables
2. Create a test booking
3. Check:
   - Console logs for success/errors
   - Recipient inboxes (check spam folder)
   - Email provider dashboard for delivery status

### Test Email Template Rendering

Use a service like [Litmus](https://litmus.com) or [Email on Acid](https://emailonacid.com) to preview how emails look across different clients.

## Email Triggers

Emails are automatically sent when:

| Event | Recipient | Email Type |
|-------|-----------|------------|
| Booking created | Farmer | Confirmation |
| Booking created | Agronomist | New booking notification |
| Booking confirmed | Farmer | Confirmation update |
| Booking cancelled | Both | Cancellation notice |
| Booking completed | Farmer | Request for review (future) |

## Troubleshooting

### Emails Not Sending

1. **Check environment variables**:
   ```bash
   echo $EMAIL_API_KEY
   echo $EMAIL_FROM
   ```

2. **Check console logs** for error messages

3. **Verify domain/email** is verified with provider

4. **Check spam folder** - emails might be filtered

### Emails Going to Spam

1. **Set up SPF record**:
   ```
   v=spf1 include:_spf.youremailprovider.com ~all
   ```

2. **Set up DKIM** (provider-specific)

3. **Set up DMARC**:
   ```
   v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
   ```

4. **Use verified domain** (not a free email provider)

### Rate Limits

Free tiers have limits:
- **Resend**: 100/day, 3,000/month
- **SendGrid**: 100/day
- **SES**: 200/day (in sandbox)

Track usage and upgrade if needed.

## Production Checklist

- [ ] Email provider configured and tested
- [ ] Domain verified (not using test domain)
- [ ] DNS records set (SPF, DKIM, DMARC)
- [ ] Environment variables set in production
- [ ] Email templates customized with brand
- [ ] Logo added to emails
- [ ] Test emails sent successfully
- [ ] Delivery rates monitored
- [ ] Spam score checked
- [ ] Unsubscribe link added (if required)
- [ ] Privacy policy updated

## Best Practices

1. **Use a dedicated sending domain** (e.g., mail.yourdomain.com)
2. **Warm up your domain** - start with low volume, gradually increase
3. **Monitor bounce rates** - keep below 5%
4. **Monitor spam complaints** - keep below 0.1%
5. **Include unsubscribe link** for marketing emails (not required for transactional)
6. **Log email sends** for debugging
7. **Handle failures gracefully** - don't fail booking if email fails
8. **Implement retry logic** for temporary failures

## Cost Estimates

For 1,000 bookings/month (2,000 emails):

| Provider | Cost |
|----------|------|
| Resend | Free (under 3,000) |
| SendGrid | ~$15/month |
| AWS SES | ~$0.20/month |

## Future Enhancements

Consider adding:
- 📧 Reminder emails (24 hours before consultation)
- ⭐ Review request emails (after completion)
- 📊 Monthly summary emails for agronomists
- 🎉 Welcome emails for new users
- 📱 SMS notifications (via Twilio)

## Support

- **Resend Docs**: https://resend.com/docs
- **SendGrid Docs**: https://docs.sendgrid.com
- **AWS SES Docs**: https://docs.aws.amazon.com/ses

---

**Note**: The booking system works without email notifications. Emails are optional but highly recommended for better user experience.


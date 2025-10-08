# 🚀 Booking System Deployment Checklist

Quick reference guide for deploying the agronomist booking system to production.

## ✅ Pre-Deployment Steps

### 1. Database Migration
```bash
# Apply the consultations table migration
# Connect to your Supabase project and run:
```

In Supabase Dashboard:
1. Go to **SQL Editor**
2. Open `/supabase/migrations/007_create_consultations_table.sql`
3. Copy and paste the content
4. Click **Run**
5. Verify table created: Check **Table Editor** > `consultations`

**✅ Success indicators:**
- Table `consultations` exists
- All columns present
- RLS policies active
- Triggers created

---

### 2. Email Configuration (Optional but Recommended)

#### Quick Setup with Resend (Recommended):

1. **Sign up**: https://resend.com
2. **Get API key**: Dashboard > API Keys > Create
3. **Add to environment**:
   ```bash
   EMAIL_API_KEY=re_your_key_here
   EMAIL_FROM=noreply@yourdomain.com
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```
4. **Install SDK**:
   ```bash
   npm install resend
   ```
5. **Update code** in `/lib/email-service.ts`:
   ```typescript
   import { Resend } from 'resend'
   
   async sendEmail({ to, subject, html, text }: EmailParams): Promise<boolean> {
     if (!this.enabled) {
       console.warn('Email service not configured.')
       return false
     }
     
     try {
       const resend = new Resend(process.env.EMAIL_API_KEY)
       await resend.emails.send({
         from: process.env.EMAIL_FROM!,
         to,
         subject,
         html,
         text
       })
       return true
     } catch (error) {
       console.error('Error sending email:', error)
       return false
     }
   }
   ```

**Test**: Book a consultation and check email delivery

**Skip for now?** System works without email (just no email notifications)

---

### 3. Environment Variables

Ensure these are set in production:

**Required:**
```bash
# Supabase (should already be set)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

**Optional (Email):**
```bash
EMAIL_API_KEY=your_email_api_key
EMAIL_FROM=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Optional (Calendly - future):**
```bash
CALENDLY_API_KEY=your_calendly_key
CALENDLY_WEBHOOK_SECRET=your_webhook_secret
```

---

## 🧪 Testing Checklist

### As a Farmer:
- [ ] Can view agronomists list
- [ ] Can search/filter agronomists
- [ ] Can click "Book" on agronomist card
- [ ] Can select consultation type
- [ ] Can pick date and time
- [ ] Can see cost summary
- [ ] Can confirm booking
- [ ] Redirected to consultations page after booking
- [ ] Can see booking in "Upcoming" tab
- [ ] Can cancel booking
- [ ] Can view booking details
- [ ] Receives in-app notification
- [ ] Receives email (if configured)

### As an Agronomist:
- [ ] Receives notification for new booking
- [ ] Can see pending bookings
- [ ] Can confirm booking
- [ ] Can cancel booking
- [ ] Can mark booking as complete
- [ ] Can view all consultations
- [ ] Can see client details
- [ ] Can view reviews
- [ ] Stats dashboard updates correctly

### Edge Cases:
- [ ] Usage limits enforced (free tier)
- [ ] Can't book if limit reached
- [ ] Error handling works (try with network offline)
- [ ] Loading states show correctly
- [ ] Empty states display properly
- [ ] Timezone saved correctly
- [ ] Payment status tracked
- [ ] Cancellation tracking works

---

## 📊 Post-Deployment Monitoring

### Day 1:
- [ ] Monitor error logs
- [ ] Check booking success rate
- [ ] Verify email delivery (if enabled)
- [ ] Check database inserts
- [ ] Monitor API response times

### Week 1:
- [ ] Track total bookings created
- [ ] Track confirmation rate
- [ ] Track completion rate
- [ ] Track cancellation rate
- [ ] Monitor user feedback

### Month 1:
- [ ] Analyze usage patterns
- [ ] Check email deliverability
- [ ] Review payment status distribution
- [ ] Assess need for Calendly
- [ ] Plan payment integration

---

## 🔍 Quick Troubleshooting

### Bookings Not Saving:
1. Check database migration ran successfully
2. Check RLS policies are active
3. Check API endpoint `/api/bookings` is accessible
4. Check browser console for errors
5. Check server logs

### Emails Not Sending:
1. Check environment variables set
2. Check email provider is configured
3. Check `/lib/email-service.ts` has provider code
4. Check recipient spam folder
5. Check email provider dashboard for errors

### Notifications Not Showing:
1. Check `notifications` table exists
2. Check notification creation in API
3. Check notification component rendering
4. Check browser console for errors

### Usage Limits Not Working:
1. Check `profiles` table has usage fields
2. Check `/api/billing/usage` endpoint
3. Check `useUsage` hook is called
4. Check subscription tier set correctly

---

## 🎯 Success Metrics

Track these KPIs:

| Metric | Target | How to Check |
|--------|--------|--------------|
| Booking Success Rate | >90% | Completed bookings / Attempts |
| Confirmation Rate | >80% | Confirmed / Pending |
| Completion Rate | >95% | Completed / Confirmed |
| Cancellation Rate | <10% | Cancelled / Total |
| Email Delivery | >98% | Provider dashboard |
| Average Rating | >4.0 | Reviews average |

---

## 🔄 Future Enhancements

**Priority 1 (Next 30 days):**
- [ ] Payment integration (Stripe/PayPal/M-Pesa)
- [ ] Email provider setup (if not done)
- [ ] Video call links (Zoom/Google Meet)

**Priority 2 (Next 60 days):**
- [ ] Calendly integration for availability
- [ ] Reminder emails (24h before)
- [ ] Review request emails (after completion)
- [ ] SMS notifications

**Priority 3 (Next 90 days):**
- [ ] Recurring consultations
- [ ] Consultation packages
- [ ] Group consultations
- [ ] Calendar export (.ics)
- [ ] Mobile app notifications

---

## 📞 Support Resources

**Documentation:**
- Implementation Summary: `/BOOKING_SYSTEM_IMPLEMENTATION_SUMMARY.md`
- Email Setup: `/EMAIL_SETUP_GUIDE.md`
- Calendly Integration: `/CALENDLY_INTEGRATION_GUIDE.md`

**Database:**
- Migration: `/supabase/migrations/007_create_consultations_table.sql`
- Supabase Dashboard: https://app.supabase.com

**Code:**
- Booking Page: `/app/agronomists/booking/page.tsx`
- Consultations Page: `/app/consultations/page.tsx`
- API: `/app/api/bookings/route.ts`
- Email Service: `/lib/email-service.ts`

---

## ✨ Quick Start (Minimal Setup)

**Just want it working ASAP?**

1. **Run database migration** (5 minutes)
   - Copy SQL from `/supabase/migrations/007_create_consultations_table.sql`
   - Paste in Supabase SQL Editor
   - Click Run

2. **Deploy code** (if not already)
   - Push to GitHub
   - Vercel/Netlify auto-deploys

3. **Test** (5 minutes)
   - Create test booking
   - Verify in database
   - Check consultations page

**Done!** System is functional.

**Email notifications?** Add later when needed (see `/EMAIL_SETUP_GUIDE.md`)

**Payment processing?** Add when ready to charge users

**Calendly?** Optional enhancement (see `/CALENDLY_INTEGRATION_GUIDE.md`)

---

## 🎉 Launch!

Once checklist complete:
1. ✅ Database migration applied
2. ✅ Testing passed
3. ✅ Environment variables set
4. ✅ Monitoring in place

**You're ready to launch!** 🚀

The booking system is fully functional and production-ready. Email and payment can be added incrementally.

**Need help?** Review the implementation summary document for detailed information.


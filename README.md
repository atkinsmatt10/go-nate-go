# Team Nate the Great 🦈

**2025 Parkway Run & Walk** | **Open Source Fundraiser**

[![Support CHOP](https://img.shields.io/badge/Support-CHOP-blue?style=for-the-badge)](https://chop.donordrive.com/teams/15164)
[![Shop Now](https://img.shields.io/badge/Shop-Now-green?style=for-the-badge)](https://shop.gonatego.com)

## Our Story 💙

Meet Nate :) our sweet, funny, and incredibly strong little man. In just two short months of life, he's already touched more hearts than we can count. Nate is truly the best thing that's ever happened to our family - his smile lights up every room, and his spirit is inspiring.

Nate was diagnosed with a rare brain tumor, and since then, he's shown more bravery than most do in a lifetime. His journey has included surgeries, treatments, and long days in the hospital, but through it all, he's remained the strongest little fighter.

We are endlessly grateful for the incredible care team at Children's Hospital of Philadelphia- from Neurosurgeons and Oncologists to radiologists, nurses, ICU & ED doctors, respiratory therapists, Speech & Occupational Therapists, chaplains, child life specialists, and social workers- every single one has played a role in supporting Nate and helping our family through the unimaginable.

While Nate still has a long road ahead, he is doing well, and we're so proud of him every single day. Any donation, big or small, helps. Thank you for supporting Nate the Great and the incredible work being done at CHOP.

## Why This Matters 🎯

**PATIENTS NEED US:** Parents shouldn't have to hear the words "your child has cancer," but 1 in 285 children in the United States will be diagnosed with cancer by the time they are 20 years old.

**BREAKTHROUGHS ARE UPON US:** Every day, CHOP's Cancer Center team is redefining what a cancer diagnosis means for a child. The center offers the most advanced therapies available anywhere in the world, including cutting-edge clinical trials that reprogram the body's own immune system to fight cancer. CHOP's Center for Childhood Cancer Research is one of the most distinguished research programs in the nation.

## How You Can Help 🤝

**MAKE AN IMMEDIATE IMPACT TODAY:** 100% of every donation to the Parkway Run & Walk, presented by Citadel, will help CHOP make important breakthroughs in understanding the causes of childhood cancer, developing new treatments that will improve outcomes for children, and one day may lead to a cure for childhood cancer.

### Ways to Support

- **💝 [Donate to Team Nate the Great](https://chop.donordrive.com/teams/15164)** - Every donation goes directly to CHOP
- **🛍️ [Shop Now](https://shop.gonatego.com)** - Browse our collection and wear your support with pride
- **📢 Share Our Story** - Help us spread awareness

## Project Information

This is an open source fundraising website built to support Team Nate the Great and the Children's Hospital of Philadelphia. The site is built with modern web technologies and deployed on Vercel.

## Donation Receipt Emails

The donation flow can now send a branded Nate the Great receipt email through Resend after Stripe confirms payment via webhook.

### Required environment variables

Add these to `.env.local` and your Vercel project settings:

```bash
ENABLE_CUSTOM_DONATION_RECEIPTS=true
RESEND_API_KEY=
RESEND_FROM_EMAIL="Nate the Great <donations@gonatego.com>"
STRIPE_WEBHOOK_SECRET=
```

Optional variables:

```bash
RESEND_REPLY_TO_EMAIL=
DONATION_RECEIPT_SUPPORT_PHONE=
NEXT_PUBLIC_SITE_URL=https://gonatego.com
```

### Resend CLI checks

Use the installed Homebrew CLI to confirm auth and sender setup:

```bash
resend whoami --json
resend doctor --json
resend domains list --json
```

`RESEND_FROM_EMAIL` must use a sender on a verified Resend domain. The currently verified sending domain is `gonatego.com`, so a `nicolematt.com` sender will be rejected by Resend.

## Birthday RSVP

The site now includes a birthday RSVP landing page at `/birthday` with a form that emails the organizers through Resend, supports an optional attendee email field, sends a confirmation email after RSVP, and schedules a reminder email for guests who RSVP `yes`.

Recommended environment variable:

```bash
BIRTHDAY_RSVP_TO_EMAIL=
```

If `BIRTHDAY_RSVP_TO_EMAIL` is unset, the app falls back to `support@gonatego.com`, then `RESEND_REPLY_TO_EMAIL`, then the address inside `RESEND_FROM_EMAIL`.

### Local webhook testing

Forward Stripe events to the Next.js route while running `pnpm dev`:

```bash
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

Then use the displayed signing secret as `STRIPE_WEBHOOK_SECRET`.

### Receipt ownership note

Custom receipts are opt-in behind `ENABLE_CUSTOM_DONATION_RECEIPTS=true`. Until that flag is enabled with the required Resend and Stripe webhook env vars in place, Checkout falls back to Stripe receipt delivery.

If you want donors to receive only the custom receipt after enabling the flag, make sure Stripe-native customer receipts are not also enabled for the same payment flow.

## Meet Nate the Great 🦈

![Nate the Great](public/Nate-image.png)

![Nate Shark](public/IMG_9843.png)

## Thank You! 🙏

Thank you for your support! Together, we can help make a difference in the fight against childhood cancer and support the incredible work being done at CHOP.

---

*Built with ❤️ for Nate the Great*

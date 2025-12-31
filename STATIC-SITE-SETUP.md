# Static Site Setup Guide

Your climate website is built as a **static site** that can be deployed to any hosting platform (Netlify, Vercel, GitHub Pages, etc.). All features work client-side except form submissions.

## ✅ Features Working Client-Side (No Backend Required)

- **Search functionality** - Searches through `posts.json` 
- **Carbon calculator** - Pure JavaScript calculations
- **Dark mode** - Uses browser localStorage
- **Animations** - Framer Motion (client-side)
- **Reading progress** - Tracks scroll position
- **All navigation** - React Router handles routing

## 📧 Form Submissions (Requires Configuration)

### Contact Form Setup

The contact form uses **FormSubmit.co** (free service). To activate:

1. **First submission verification:**
   - Deploy your site
   - Fill out the contact form once
   - Check the email inbox for `info@myclimatedefinition.org`
   - Click the verification link from FormSubmit

2. **Alternative options:**

   **Option A: Formspree (Recommended)**
   ```typescript
   // 1. Sign up at formspree.io
   // 2. Create a new form and get your endpoint
   // 3. Update src/components/ContactPage.tsx line 35:
   
   const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
     method: 'POST',
     body: formData,
     headers: { 'Accept': 'application/json' }
   });
   ```

   **Option B: Netlify Forms** (if deploying to Netlify)
   ```typescript
   // 1. Add to the form element in ContactPage.tsx:
   <form onSubmit={handleSubmit} data-netlify="true" name="contact">
   
   // 2. Add hidden input:
   <input type="hidden" name="form-name" value="contact" />
   
   // 3. Deploy to Netlify - forms automatically work!
   ```

### Newsletter Setup

The newsletter form needs an email service. Options:

**Option A: Formspree**
```typescript
// Update src/components/NewsletterSignup.tsx line 45:
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email })
});
```

**Option B: EmailOctopus (Affordable)**
```typescript
// Get API key from emailoctopus.com
const response = await fetch('https://emailoctopus.com/api/1.6/lists/YOUR_LIST_ID/contacts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    api_key: 'YOUR_API_KEY',
    email_address: email
  })
});
```

**Option C: Mailchimp**
```typescript
// Use Mailchimp's API or their embedded form
// See: https://mailchimp.com/help/add-a-signup-form-to-your-website/
```

## 🚀 Build & Deploy

### Build the site:
```bash
npm run build
```

This creates a `dist/` folder with:
- Optimized JavaScript bundles
- All CSS files
- All assets from `/public`
- Static HTML entry point

### Deploy to:

**Netlify:**
```bash
# Connect your GitHub repo
# Build command: npm run build
# Publish directory: dist
```

**Vercel:**
```bash
# Import GitHub repo
# Framework: Vite
# Build command: npm run build
# Output directory: dist
```

**GitHub Pages:**
```bash
# Use GitHub Actions
# See .github/workflows for automation
```

## 📝 Environment Variables (Optional)

If you want to hide API keys:

1. Create `.env` file:
```
VITE_FORMSPREE_ID=your_form_id
VITE_EMAIL_OCTOPUS_KEY=your_api_key
```

2. Access in code:
```typescript
const formId = import.meta.env.VITE_FORMSPREE_ID;
```

3. Add to your hosting platform's environment variables

## 🔧 Maintenance

- **Update blog posts:** Run `npm run sync:posts` to fetch from Medium
- **Build assets:** All assets in `/public` are copied to `dist/`
- **SEO:** Meta tags are in `index.html` and can be updated per route

## 🌐 Current Form Status

- ✅ Contact form → FormSubmit.co (needs first-time verification)
- ⏳ Newsletter → Placeholder (implement one of the options above)

## Need Help?

All form code is clearly commented with setup instructions in:
- `src/components/ContactPage.tsx`
- `src/components/NewsletterSignup.tsx`

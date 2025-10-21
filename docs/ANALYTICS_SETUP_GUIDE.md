# Analytics Setup Guide
## Google Search Console + Google Analytics 4 for marcusgoll.com

**Purpose**: Connect data sources so SEO Manager agent can provide data-driven recommendations

---

## Overview

You already have Google Analytics configured on marcusgoll.com (`G-SE02S59BZW`). This guide will help you:

1. Verify you have full access to Google Analytics
2. Set up Google Search Console
3. Link Search Console to Analytics
4. Configure custom events for tracking
5. Use the data with your SEO Manager agent

---

## Part 1: Google Analytics 4 Access Verification

### Step 1: Confirm Your Access

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Look for your property: **marcusgoll.com** (ID: `G-SE02S59BZW`)
4. Click on it to open

**Verify you have "Editor" or "Administrator" access**:
- Click **Admin** (gear icon, bottom left)
- Under "Property Access Management", check your role
- You need **Editor** or **Administrator** to make changes

✅ If you see your property and have Editor/Admin access, you're good!

❌ If not, you'll need to get access from whoever set it up

---

## Part 2: Google Search Console Setup

### Step 1: Add Your Website to Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Sign in with the same Google account as Analytics
3. Click **Add Property** (top left dropdown)

4. Choose **URL prefix** (not Domain):
   - Enter: `https://marcusgoll.com`
   - Click **Continue**

### Step 2: Verify Ownership

You'll see several verification methods. The easiest for you:

**Option A: HTML Tag Method** (Recommended if you can edit your site's `<head>`):

1. Copy the meta tag they provide:
   ```html
   <meta name="google-site-verification" content="[CODE]" />
   ```

2. Add this to your website's `<head>` section (every page or in a template/header file)

3. Return to Search Console and click **Verify**

**Option B: Google Analytics Method** (If your GA is already set up):

1. Choose "Google Analytics" as verification method
2. Search Console will detect your GA tracking code
3. Click **Verify**

✅ You should see "Ownership verified"

### Step 3: Submit Your Sitemap

1. In Search Console, click **Sitemaps** (left sidebar)
2. Enter your sitemap URL:
   - If you have one: `https://marcusgoll.com/sitemap.xml`
   - If you don't, you'll need to generate one (see below)
3. Click **Submit**

**If you don't have a sitemap yet**:
- Most CMSs auto-generate sitemaps
- Check: `https://marcusgoll.com/sitemap.xml` in your browser
- If it exists, submit that URL
- If not, you'll need to create one (ask Technical Portfolio agent for help)

---

## Part 3: Link Search Console to Google Analytics

### Step 1: Open Analytics Settings

1. In Google Analytics, click **Admin** (gear icon)
2. Under **Property** column, click **Product Links**
3. Click **Search Console Links**

### Step 2: Link the Properties

1. Click **Link**
2. Choose your Search Console property: `https://marcusgoll.com`
3. Click **Next**
4. Select your GA4 web stream
5. Click **Next**
6. Review and click **Submit**

✅ Now Search Console data will flow into Analytics!

---

## Part 4: Set Up Custom Events in Google Analytics

### What Are Custom Events?

Custom events track specific user actions beyond pageviews. For Marcus's site, we want to track:

- Which content track users engage with (Aviation vs. Dev/Startup)
- Newsletter signups
- External link clicks (to CFIPros.com)
- Lead magnet downloads

### Step 1: Install Google Tag Manager (Optional but Recommended)

**Why**: Makes it easier to add and modify events without changing code every time.

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Create account for marcusgoll.com
3. Follow setup instructions to add GTM code to your site
4. Configure GA4 tag in GTM

**OR** if you prefer, add events directly in your site's JavaScript (see Step 2).

### Step 2: Add Custom Event Tracking Code

Add this JavaScript to your site (or configure in GTM):

**Track Content Track Engagement**:
```javascript
// When user clicks on Aviation section
document.querySelectorAll('.aviation-link').forEach(link => {
  link.addEventListener('click', function() {
    gtag('event', 'content_track_click', {
      'track': 'aviation',
      'location': window.location.pathname
    });
  });
});

// When user clicks on Dev/Startup section
document.querySelectorAll('.dev-startup-link').forEach(link => {
  link.addEventListener('click', function() {
    gtag('event', 'content_track_click', {
      'track': 'dev-startup',
      'location': window.location.pathname
    });
  });
});
```

**Track Newsletter Signups**:
```javascript
// On newsletter form submit
document.querySelector('#newsletter-form').addEventListener('submit', function(e) {
  gtag('event', 'newsletter_signup', {
    'location': window.location.pathname,
    'track': 'both' // or 'aviation', 'dev-startup' depending on form
  });
});
```

**Track External Links (CFIPros.com)**:
```javascript
// Track clicks to CFIPros.com
document.querySelectorAll('a[href*="cfipros.com"]').forEach(link => {
  link.addEventListener('click', function() {
    gtag('event', 'external_link_click', {
      'destination': 'cfipros.com',
      'location': window.location.pathname
    });
  });
});
```

**Track Lead Magnet Downloads**:
```javascript
// On download button click
document.querySelectorAll('.lead-magnet-download').forEach(button => {
  button.addEventListener('click', function() {
    const magnetName = this.dataset.magnetName; // e.g., "CFI Lesson Checklist"

    gtag('event', 'lead_magnet_download', {
      'magnet_name': magnetName,
      'track': this.dataset.track // 'aviation' or 'dev-startup'
    });
  });
});
```

### Step 3: Test Your Events

1. Install **Google Tag Assistant** browser extension
2. Visit your site
3. Perform actions (click links, submit form)
4. Check Tag Assistant to see if events fire

**OR**

1. In Google Analytics, go to **Reports** > **Realtime**
2. Click on "Event count by Event name"
3. Perform actions on your site
4. Events should appear in real-time report within ~30 seconds

---

## Part 5: Create Custom Dimensions (Optional but Useful)

Custom dimensions let you segment data by content track, category, etc.

### Step 1: Create Custom Dimensions in GA4

1. In Google Analytics, go to **Admin** > **Custom Definitions**
2. Click **Create custom dimension**
3. Create these dimensions:

**Dimension 1: Content Track**
- Dimension name: `content_track`
- Scope: Event
- Description: "Aviation, dev-startup, or cross-pollination"
- Event parameter: `track`

**Dimension 2: Post Category**
- Dimension name: `post_category`
- Scope: Event
- Description: "Specific category of content"
- Event parameter: `category`

### Step 2: Send Dimension Data with Events

Update your event tracking to include dimension values:

```javascript
gtag('event', 'page_view', {
  'track': 'aviation', // or 'dev-startup', 'cross-pollination'
  'category': 'flight-training' // or 'cfi-resources', 'building-in-public', etc.
});
```

Now you can filter all reports by content track or category!

---

## Part 6: Set Up Conversion Goals

Tell Analytics what actions matter most.

### Step 1: Mark Events as Conversions

1. In GA4, go to **Admin** > **Events**
2. Find your custom events (newsletter_signup, lead_magnet_download, etc.)
3. Toggle **Mark as conversion** for important events:
   - ✅ newsletter_signup
   - ✅ lead_magnet_download
   - ✅ external_link_click (to CFIPros)

Now these show up in **Conversions** reports!

---

## Part 7: Using Data with SEO Manager Agent

### How to Share Data with the Agent

When you want SEO recommendations, gather this data:

**From Google Search Console**:
1. Go to **Performance** report
2. Click **Export** > **Google Sheets** or **Download CSV**
3. Export:
   - Last 3 months of data
   - Include: Queries, Pages, Countries, Devices

**From Google Analytics**:
1. Go to **Reports** > **Acquisition** > **Traffic acquisition**
2. Filter by source: **Organic Search**
3. Export data (last 3 months)

### Example Agent Interaction

```
Load the SEO Manager agent.

I have Search Console and Analytics data for marcusgoll.com.

Here's my top data:

**Search Console (Last 3 Months)**:
- Top query: "flight instructor lesson plans" (500 impressions, position 8)
- Top page: /cfi-lesson-plans/crosswind-landings (1,200 impressions)
- Average position: 15.2

**Analytics (Last 3 Months)**:
- Organic traffic: 2,500 sessions (65% of total)
- Bounce rate: 58%
- Top landing page: /study-guides/private-pilot (800 sessions)
- Avg session duration: 2:30

Based on this data, what should I optimize first?
```

### Agent Will Provide

- **Quick wins**: Posts ranking positions 4-10 (easy to push to top 3)
- **Content gaps**: Keywords getting impressions but no clicks
- **Optimization recommendations**: Which posts to update
- **New content ideas**: Based on trending queries
- **Technical issues**: From Search Console Coverage report

---

## Part 8: Weekly/Monthly Reporting

### Weekly Quick Check (15 minutes)

**Every Monday**:

1. **Search Console**:
   - Go to **Performance** > Last 7 days
   - Check: Any sudden drops in clicks or impressions?
   - Note top 3 queries that week

2. **Analytics**:
   - Go to **Realtime** Overview
   - Check: Any pages getting unusual traffic?
   - Go to **Reports** > **Engagement** > **Pages and screens**
   - Note top 3 pages that week

3. **Document findings** in a simple log:
   ```
   Week of Oct 20, 2025:
   - Top query: "how to become CFI" (position 6, up from 9!)
   - Top page: /career-path/student-to-airline-pilot (500 visits)
   - Newsletter signups: 12 (up from 8 last week)
   ```

### Monthly Deep Dive (1-2 hours)

**First Monday of each month**:

1. **Export Search Console data** (Performance, last month)
2. **Export Analytics data** (Acquisition > Organic, last month)
3. **Load SEO Manager agent** and share data
4. **Get recommendations** for:
   - Content to optimize
   - New content to create
   - Technical issues to fix
   - Keyword opportunities

5. **Create action plan** for the month
6. **Track progress** in a spreadsheet or doc

---

## Part 9: Troubleshooting

### Common Issues

**"I don't see any Search Console data"**:
- Wait 24-48 hours after verification
- Data starts collecting after you verify, not retroactively
- Check that sitemap was submitted successfully

**"My events aren't showing in Analytics"**:
- Check that tracking code is installed correctly (gtag.js)
- Use Tag Assistant to verify events fire
- Wait 24-48 hours for data to process
- Check that you're looking in the right property (not an old UA property)

**"I see data but can't export it"**:
- You need Editor or Administrator access
- If you only have Viewer access, request more permissions

**"Search Console says my site isn't mobile-friendly"**:
- Run Google's Mobile-Friendly Test
- Fix issues (usually responsive design problems)
- Re-test and wait for Search Console to update

---

## Part 10: Quick Reference Cheat Sheet

### Weekly SEO Manager Agent Check-In

```
Load the SEO Manager agent.

Here's this week's data:

**Top queries** (Search Console):
1. [query] - [position], [impressions], [clicks]
2. [query] - [position], [impressions], [clicks]
3. [query] - [position], [impressions], [clicks]

**Top pages** (Analytics):
1. [page] - [sessions], [bounce rate], [avg time]
2. [page] - [sessions], [bounce rate], [avg time]
3. [page] - [sessions], [bounce rate], [avg time]

**This week's actions**:
- Published: [new post title and URL]
- Optimized: [existing post title and URL]

**Questions**:
- What should I focus on this week?
- Any concerning trends?
- What content should I create next?
```

### Monthly SEO Manager Agent Deep Dive

```
Load the SEO Manager agent.

Monthly SEO review for [Month Year]:

**Traffic Overview**:
- Total sessions: [X] ([+/-Y%] vs last month)
- Organic sessions: [X] ([Z%] of total)
- Bounce rate: [X%]
- Avg session duration: [X:XX]

**Top Performing Content**:
1. [Post title] - [sessions], [time on page]
2. [Post title] - [sessions], [time on page]
3. [Post title] - [sessions], [time on page]

**Search Console Highlights**:
- Total impressions: [X] ([+/-Y%] vs last month)
- Total clicks: [X] ([+/-Y%] vs last month)
- Average position: [X] ([+/-Y] vs last month)
- Top queries: [list top 5 with positions]

**Keywords in positions 4-10** (optimization opportunities):
- [keyword] - Position [X]
- [keyword] - Position [X]

**New keywords appearing** (opportunities):
- [keyword] - [impressions], position [X]

**Questions**:
1. Which existing posts should I optimize this month?
2. What new content should I create?
3. Are there any technical SEO issues to fix?
4. What's the priority ranking for these actions?

Please provide:
- Top 3 optimization targets
- Top 3 new content ideas
- Any technical fixes needed
- Expected impact of each action
```

---

## Resources

### Tools

**Google Tools** (Free):
- [Google Analytics](https://analytics.google.com/)
- [Google Search Console](https://search.google.com/search-console)
- [Google Tag Manager](https://tagmanager.google.com/)
- [Google Tag Assistant](https://tagassistant.google.com/)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Rich Results Test](https://search.google.com/test/rich-results)

**SEO Tools** (Freemium):
- [Ubersuggest](https://neilpatel.com/ubersuggest/) - Keyword research
- [AnswerThePublic](https://answerthepublic.com/) - Question-based keywords
- [Screaming Frog](https://www.screamingfrogseodertool.com/) - Site crawler (free up to 500 URLs)

### Learning Resources

**Google's Official Guides**:
- [Search Console Help](https://support.google.com/webmasters)
- [Analytics Help](https://support.google.com/analytics)
- [SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)

**Recommended Reading**:
- [Moz Beginner's Guide to SEO](https://moz.com/beginners-guide-to-seo)
- [Ahrefs Blog](https://ahrefs.com/blog/) - SEO strategies
- [Search Engine Journal](https://www.searchenginejournal.com/) - SEO news

---

## Next Steps

**This Week**:
- [ ] Verify you have Analytics access
- [ ] Set up Google Search Console
- [ ] Link Search Console to Analytics
- [ ] Submit sitemap
- [ ] Test one custom event (newsletter signup)

**Next Week**:
- [ ] Add remaining custom events
- [ ] Create custom dimensions
- [ ] Mark conversion events
- [ ] Run first weekly check-in with SEO Manager agent

**This Month**:
- [ ] Collect 30 days of data
- [ ] Run monthly deep dive with SEO Manager agent
- [ ] Implement top 3 recommendations
- [ ] Create SEO action plan for next month

---

**Once you have data flowing (30+ days), your SEO Manager agent becomes incredibly powerful. It can spot opportunities you'd never find manually and give you a clear action plan based on real user behavior.** 📊🚀

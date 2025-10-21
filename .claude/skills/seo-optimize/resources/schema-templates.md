# Schema Markup Templates

JSON-LD schema templates for marcusgoll.com SEO.

## Person Schema (Site-wide)

Add to homepage and about page:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Marcus Gollahon",
  "url": "https://marcusgoll.com",
  "image": "https://marcusgoll.com/images/marcus-headshot.jpg",
  "jobTitle": "Airline Pilot & Developer",
  "worksFor": {
    "@type": "Organization",
    "name": "PSA Airlines"
  },
  "alumniOf": {
    "@type": "Organization",
    "name": "[Your University]"
  },
  "knowsAbout": [
    "Flight Instruction",
    "Aviation Career Development",
    "Web Development",
    "React",
    "Node.js",
    "Systematic Thinking"
  ],
  "sameAs": [
    "https://linkedin.com/in/marcusgollahon",
    "https://twitter.com/marcusgollahon",
    "https://github.com/marcusgollahon"
  ]
}
```

## BlogPosting Schema (Every Blog Post)

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "[Post Title - 110 chars max]",
  "description": "[Meta Description - 150-160 chars]",
  "image": "[Featured Image URL 1200x630px]",
  "author": {
    "@type": "Person",
    "name": "Marcus Gollahon",
    "url": "https://marcusgoll.com/about"
  },
  "publisher": {
    "@type": "Person",
    "name": "Marcus Gollahon"
  },
  "datePublished": "2025-10-21T08:00:00Z",
  "dateModified": "2025-10-21T08:00:00Z",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "[Full Post URL]"
  },
  "keywords": "[keyword1, keyword2, keyword3]"
}
```

## BreadcrumbList Schema (Navigation)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://marcusgoll.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Aviation",
      "item": "https://marcusgoll.com/aviation"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "[Post Title]",
      "item": "[Full Post URL]"
    }
  ]
}
```

## HowTo Schema (Tutorial Posts)

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "[How to Do Something]",
  "description": "[Brief description]",
  "totalTime": "PT[X]M",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Step 1",
      "text": "[Step description]"
    },
    {
      "@type": "HowToStep",
      "name": "Step 2",
      "text": "[Step description]"
    }
  ]
}
```

**Validate all schema at**: https://search.google.com/test/rich-results

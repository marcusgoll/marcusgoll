# Content Management Guide

This directory contains all blog posts for marcusgoll.com. Posts are written in MDX format (Markdown + JSX).

## Creating a New Post

### Step 1: Create the File

Create a new `.mdx` file in the `posts/` directory:

```bash
# From project root
cd content/posts
touch your-post-slug.mdx
```

**Naming convention**: Use kebab-case (lowercase with dashes)
- ✅ `flight-training-fundamentals.mdx`
- ✅ `systematic-thinking-for-developers.mdx`
- ❌ `My New Post.mdx`

### Step 2: Add Frontmatter

Every post starts with YAML frontmatter (metadata) between `---` markers:

```mdx
---
title: "Your Post Title"
excerpt: "A brief description of your post (appears in cards)"
date: "2024-01-15"
image: "/images/your-image.jpg"
tags:
  - aviation
  - flight-training
featured: false
---

Your content starts here...
```

### Required Fields

| Field | Description | Example |
|-------|-------------|---------|
| `title` | Post title (SEO + display) | "Flight Training Fundamentals" |
| `excerpt` | Short description (150-200 chars) | "Essential principles every student pilot..." |
| `date` | Publication date (YYYY-MM-DD) | "2024-01-15" |
| `tags` | Array of tags (see below) | `['aviation', 'flight-training']` |

### Optional Fields

| Field | Description | Example |
|-------|-------------|---------|
| `image` | Featured image path | "/images/aviation/cockpit.jpg" |
| `featured` | Show in featured section | `true` or `false` (default) |
| `metaTitle` | Custom SEO title | "Flight Training Guide - Marcus Gollahon" |
| `metaDescription` | Custom SEO description | "Complete guide to flight training..." |

### Step 3: Write Content

Use standard Markdown syntax:

```mdx
## Main Heading (H2)

Regular paragraph text.

### Subheading (H3)

- Bullet point 1
- Bullet point 2

1. Numbered item
2. Another item

**Bold text** and *italic text*

[Link text](https://example.com)

\`inline code\`

\`\`\`typescript
// Code block
function example() {
  return "Hello";
}
\`\`\`

> Blockquote for important callouts
```

### Step 4: Use the Correct Tags

**Primary Tags** (choose ONE):
- `aviation` - Aviation content
- `dev-startup` - Development/startup content
- `cross-pollination` - Content bridging both worlds

**Secondary Tags** (optional, choose any):

Aviation:
- `flight-training`
- `cfi-resources`
- `career-path`

Dev/Startup:
- `software-development`
- `systematic-thinking`
- `startup-insights`

**Example tag combinations**:
```yaml
# Aviation post
tags:
  - aviation
  - flight-training
  - career-path

# Dev post
tags:
  - dev-startup
  - systematic-thinking
  - software-development

# Cross-pollination post
tags:
  - cross-pollination
  - systematic-thinking
  - career-path
```

## Example Post Template

```mdx
---
title: "Your Compelling Title Here"
excerpt: "A brief, engaging description that makes people want to read more."
date: "2024-01-25"
image: "/images/your-category/your-image.jpg"
tags:
  - aviation
  - flight-training
featured: false
---

## Introduction

Start with a hook - why should readers care?

## Main Content

Break content into logical sections with H2 and H3 headings.

### Subsection

Use examples, lists, and code blocks to make content scannable.

## Key Takeaways

- Summary point 1
- Summary point 2
- Summary point 3

## Conclusion

End with action items or next steps.

---

*Marcus Gollahon is a CFI and software developer teaching systematic thinking from 30,000 feet.*
```

## Publishing Process

1. **Create post file** in `content/posts/`
2. **Write content** with proper frontmatter
3. **Test locally**: `npm run dev` and visit `http://localhost:3000`
4. **Commit to git**: `git add . && git commit -m "post: add [title]"`
5. **Deploy**: Changes go live on next deployment

**No CMS required** - posts are version-controlled with your code!

## Tips for Great Content

### Writing

- **Start with "why"** - Give readers context
- **Use examples** - Code snippets, scenarios, stories
- **Be specific** - "Reduce API latency by 40%" vs "Improve performance"
- **Stay scannable** - Headings, lists, short paragraphs

### SEO

- **Title**: Include keywords, keep under 60 characters
- **Excerpt**: Use compelling language, 150-200 characters
- **Headings**: Use logical hierarchy (H2 > H3, don't skip levels)
- **Links**: Add relevant internal and external links

### Images

- **Feature image**: 1200x630px (recommended)
- **Store in**: `public/images/[category]/`
- **Categories**: aviation, dev, cross
- **Use descriptive names**: `flight-training-cockpit.jpg`

## File Structure

```
content/
├── README.md (this file)
└── posts/
    ├── flight-training-fundamentals.mdx
    ├── systematic-thinking-for-developers.mdx
    └── from-cockpit-to-code.mdx
```

## Need Help?

- **Markdown guide**: https://www.markdownguide.org/basic-syntax/
- **MDX docs**: https://mdxjs.com/
- **See examples**: Check existing posts in `content/posts/`

---

Happy writing! ✈️💻

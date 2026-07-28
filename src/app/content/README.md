# Content Management

This directory contains all the text content for the Cstle Livn website. Update these files to change website content without modifying component code.

## Files Overview

### `site-info.ts`
Global site information including:
- Company name and tagline
- Contact details (email, phone)
- Service area
- Business hours
- Social media links

**Update this when:** Contact information changes, business hours change, or service area expands.

### `home-content.ts`
Home page content including hero text and mission statement.

### `mission-content.ts`
Mission page content including:
- Main heading and intro text
- "What We Stand For" list
- Quote
- Value propositions

### `gallery-content.ts`
Gallery page content including:
- Gallery items (images, titles, categories)
- Hero section text

**Note:** To add new gallery items, you'll need to import the image and add it to the items array.

### `contact-content.ts`
Contact page content including:
- Form labels and placeholders
- Success messages
- Contact information labels

### `book-service-content.ts`
Book Service page content including:
- Form sections and labels
- Service types list
- Process steps
- Success messages

### `reviews-content.ts`
Reviews page content including:
- Testimonials (name, role, text, rating)
- Stats
- Form text

**Update this when:** Adding new testimonials or updating statistics.

### `faq-content.ts`
FAQ page content including:
- Questions organized by category
- Answers
- Call-to-action text

**Update this when:** Adding new FAQs or updating existing answers.

### `navigation.ts`
Navigation menu items for header and footer.

**Update this when:** Adding new pages or reorganizing navigation.

## How to Update Content

1. Find the relevant file for the page you want to update
2. Edit the text directly in the TypeScript object
3. Save the file
4. The changes will appear on the website automatically

## Best Practices

- Keep text concise and clear
- Maintain consistent tone across all pages
- Update contact information in `site-info.ts` only (it's used across multiple pages)
- When adding new gallery items or testimonials, follow the existing structure
- Test changes on the website after updating

## Need Help?

If you need to add new types of content or restructure existing content, you may need to update the corresponding page components in `/pages/`.

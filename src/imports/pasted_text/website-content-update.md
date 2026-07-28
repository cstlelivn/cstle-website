Optimize the existing Cstle Livn website for lead conversion and easier decision-making.

Important constraints:

- Do not redesign the website.
- Do not change its aesthetic direction.
- Preserve the existing black-and-white palette, typography, logo, spacing, rounded imagery, animations, gradients, page layouts, and premium minimalist character.
- Preserve the existing Supabase integration, gallery system, forms, responsive behavior, and image viewer.
- Cstle Livn continues to operate in Saskatchewan.
- The business is currently focused on growing into British Columbia.
- Do not remove Saskatchewan from the website.
- Do not imply that Cstle Livn has stopped operating in Saskatchewan.
- Do not invent testimonials, project details, years of experience, statistics, certifications, guarantees, or service locations.
- Only make content, navigation, hierarchy, usability, and conversion improvements.

The primary objective is to help prospective customers quickly answer:

1. What does Cstle Livn do?
2. Does the company serve my area?
3. Can I see proof of its work?
4. How do I request an estimate?

## 1. Optimize the homepage and navigation

### Hero section

Keep the existing hero layout, carousel, typography, colors, animation, and overall appearance.

Keep the main brand heading:

Install. Perfect. Finish.

Add a concise supporting statement close to the heading:

Basement finishing, interior renovations, flooring, millwork, painting, and detail-driven installations in Saskatchewan and British Columbia.

If this amount of text does not fit the existing layout cleanly, use:

Professional interior finishing and renovations in Saskatchewan and British Columbia.

The service and location statement must be visible without requiring the visitor to scroll.

Do not use `whitespace-nowrap` on the heading or supporting text. Allow both to wrap naturally on smaller screens without changing the visual style.

### Hero actions

Add or update the hero calls to action:

Primary button:
Request a Free Estimate

Destination:
`/book`

Secondary button:
View Our Work

Destination:
`/gallery`

Keep the existing button design. Do not introduce a new visual button style.

On mobile, ensure both actions are easy to find and tap. Stack them only if necessary to prevent crowding.

### Existing homepage statement

Keep the existing meaning of the homepage paragraph, but make it easier to read and relevant to the complete service offering.

Replace it with:

We complete basements and interior spaces with clear planning, careful installation, and clean finishing. No guesswork, no unnecessary handoffs, and no shortcuts—just dependable execution and attention to the details that bring a space together.

Remove manual `<br>` elements and allow the text to wrap responsively.

Do not change the visual treatment of this section.

### Services overview

Add a concise “What We Do” section using the website’s existing styles and design patterns.

Do not introduce a visually new card system if it changes the existing aesthetic. Use the same typography, spacing, borders, backgrounds, and rounded styling already found elsewhere on the website.

Include:

Basement Finishing & Development  
Planning and completing functional basement spaces through the final finish.

Interior Renovations  
Focused improvements for individual rooms and larger interior transformations.

Flooring & Millwork Installation  
Precise installation of flooring, trim, baseboards, doors, and interior millwork.

Painting & Drywall Finishing  
Surface preparation, drywall finishing, and clean interior painting.

Final Finishing & Detail Work  
The finishing work that brings the completed space together.

Add one existing-style button:

Discuss Your Project

Destination:
`/book`

### Service-area language

Update service-area wording throughout the website to accurately reflect both markets.

Use:

Service Areas  
Serving Saskatchewan and expanding our project availability in British Columbia. Contact us to confirm availability for your community.

Do not list specific cities unless those cities are already confirmed in existing business information.

Do not replace all Saskatchewan references with British Columbia.

### Navigation

Preserve the existing header design and logo position.

Optimize the navigation labels so visitors can make decisions faster.

Use:

Left navigation:

- Request an Estimate — `/book`
- Our Work — `/gallery`

Right navigation:

- Our Approach — `/mission`
- Contact — `/contact`

Use the same order in the mobile navigation.

Keep FAQ available in the footer or mobile menu, but do not allow secondary pages to distract from the main paths:

- View proof
- Understand the company
- Request an estimate
- Contact the company

Change visitor-facing uses of “Book a Service” to “Request an Estimate” or “Request a Free Estimate.” The service is not considered booked when someone submits an inquiry.

### Contact shortcuts

Where the phone number and email address are displayed:

- Make the phone number a clickable `tel:` link.
- Make the email address a clickable `mailto:` link.
- Preserve the existing visual appearance.
- Do not add new icons or styling unless already consistent with the website.

## 2. Optimize the gallery as project proof

The gallery is the main proof section for prospective leads.

Preserve:

- The existing gallery page aesthetic
- Album cards
- Image grid
- Supabase connection
- Gallery modal
- Full-screen image viewer
- Existing hover effects
- Existing responsive layout

Do not redesign the gallery. Improve its information hierarchy and decision-making value.

### Gallery introduction

Replace the current gallery introduction with:

Heading:
Our Work

Supporting text:
Explore completed and in-progress projects from Cstle Livn, including the planning, installation, and finishing details behind each space.

Keep the existing typography, alignment, spacing, and visual treatment.

### Project album information

Extend each gallery album so it can contain editable project information:

- Project title
- Province
- General location or city, when approved
- Project type
- Services completed
- Short project summary
- Optional challenge
- Optional approach or solution
- Optional timeline
- Optional image stage
- Optional client comment
- Cover image

Province should support at least:

- Saskatchewan
- British Columbia

Do not require a precise address.

Do not invent information when a field is empty.

### Project cards

Keep the current card design.

Make the following information visible on every project card:

- Project title
- Province or approved general location
- Project type
- Number of photographs

Essential information must remain visible on mobile and touch devices. It must not depend entirely on hover.

Do not use vague, decorative project names when more specific information is available.

Preferred naming formats include:

- Basement Development — Saskatchewan
- Flooring & Trim Installation
- Interior Finishing Project
- Basement Framing and Drywall
- Completed Basement Living Space

All titles must remain editable.

### Project detail experience

When a visitor selects an album, keep the existing modal and full-screen image experience.

Add project information above the photographs:

1. Project title
2. Province or approved location
3. Project type
4. Short summary
5. Services completed

Where image-stage information exists, organize photographs under:

- Before
- In Progress
- Completed

If no stage has been assigned, place the image under:

Project Gallery

Do not automatically infer or generate construction details from an image. All descriptions must come from editable project information supplied by Cstle Livn.

### Project call to action

At the end of every project album, add an existing-style call-to-action area.

Heading:
Planning something similar?

Body:
Tell us about your space and what you would like to accomplish. We’ll review the project and discuss the next step with you.

Primary button:
Request a Free Estimate

Destination:
`/book`

Secondary text link:
Contact Us

Destination:
`/contact`

Match the existing visual style. Do not create a new design language.

### Gallery reliability

If the Supabase gallery fails to load, do not display only “No albums yet.”

Create separate states for:

- Loading
- Successfully loaded but empty
- Loading error

For an empty gallery or loading error, show:

Heading:
Our project gallery is being updated.

Body:
We’re preparing more examples of our work. Contact us to discuss your project or request photographs relevant to the work you’re planning.

Buttons:

- Request a Free Estimate — `/book`
- Contact Us — `/contact`

If existing local gallery content is available, use it as a fallback when the Supabase request fails.

Do not remove or overwrite Supabase data.

Remove production gallery debugging messages from the browser console.

### Reviews

Cstle Livn does not have public reviews yet.

Do not create, generate, or display placeholder reviews.

Temporarily remove the Reviews link from:

- Desktop navigation
- Mobile navigation
- Footer
- Primary customer journey

Do not display:

- “No reviews yet”
- Zero-review statistics
- Empty testimonial sections
- A public review-submission form

Keep the reviews code available for future use.

Add an internal code comment explaining:

The review section will be connected to the official Google Business Profile once it is available.

### Form optimization

Preserve the existing form design and Supabase submission behavior.

Change the booking page title from:

Book a Service

To:

Request a Free Estimate

Use this supporting text:

Tell us about your project and we’ll contact you to discuss the next step.

To reduce friction, make the following fields required:

- First name
- Last name
- Email or phone
- Service type
- Project details

Make the full project address optional at the initial inquiry stage.

Add a province field with:

- Saskatchewan
- British Columbia
- Other

Ensure the selected consultation time is actually saved with the lead submission.

After a successful submission, clearly confirm:

Thank you—your request has been received. We’ll contact you to discuss your project and the next step.

Keep direct phone and email information visible near the form for visitors who prefer to contact the company directly.

### Content architecture

Place editable homepage wording inside the existing content files instead of hard-coding it into page components.

Keep project information editable through the existing gallery content or Supabase system.

If new database fields are necessary:

- Create a separate SQL migration.
- Do not delete or overwrite existing gallery data.
- Document every new field.
- Make optional project fields nullable.
- Ensure existing albums continue to work without the new fields.

### Completion requirements

Before considering the work complete:

- Verify navigation on mobile, tablet, and desktop.
- Verify that all primary buttons lead to the correct pages.
- Confirm Saskatchewan remains represented.
- Confirm British Columbia is clearly shown as a growth market.
- Confirm essential gallery information is visible without hover.
- Confirm the gallery has a useful fallback state.
- Confirm the booking form saves every displayed field.
- Confirm phone and email links work.
- Confirm no reviews or business claims were invented.
- Confirm the website’s original aesthetic has not been changed.
- Provide a summary of all files and database fields changed.
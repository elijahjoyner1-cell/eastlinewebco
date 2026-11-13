# Decisions the owner still needs to make

The site now describes what each service includes, excludes and needs from the client. No prices were changed. Where a policy was not already on the site, the copy avoids inventing one. These items need your decision (edit the text in `source/build.py`, the `SERVICES` list, then rebuild).

## Pricing to confirm
1. **Additional website pages**: listed at $200 per page, the same as a new-site page. Confirm. Also confirm what an added page costs on a site that was redesigned at $150 per page.
2. **SEO at $75 per page**: Google Business Profile setup and local listings are listed as included, but they are not per-page tasks. Decide if they are one-time items inside the price, or separate.
3. **E-commerce at $600 setup**: the number of products included is not defined (the site says "agreed in your quote"). Decide a number or leave it to each quote. Also decide which store platforms you build on.

## Maintenance policy
4. **Response times**: only the Priority plan promises "same-day replies". Decide a response expectation for Essential and Growth, or leave it unstated.
5. **Included time**: plans include 30 min / 2 hours / 5 hours of changes. Decide whether unused time rolls over, the minimum billing unit for a request, and an hourly rate for extra work (the site only says extra work is quoted before it starts).
6. **Reports**: the monthly performance report is only in Growth and Priority. Essential has none. Confirm.

## Money and accounts
7. **Hosting and domain**: the site says the client pays their domain and any paid hosting directly. Confirm this matches how you host client sites, and whether you ever resell hosting.
8. **Revisions and support after launch**: nothing on the site says how many design revision rounds are included or whether there is a bug-fix period after launch. Decide before you promise anything.
9. **Payment terms, deposits, refunds, ownership of files**: none of these appear on the site. Decide and consider a written agreement.

## Timelines (existing copy, not verified)
10. "A typical five-page site goes live in about five weeks" (Process page), "Standard (4 to 8 weeks)" and "Rush (under 4 weeks)" (quote form), and the 20% rush charge (settings file). Confirm all still hold.

## Quote builder limits
11. The page count entered applies to every page-based service selected, so choosing "New website" and "SEO" with 5 pages prices both at 5 pages. The Maintenance option adds the full $49 to $179 range because there is no plan picker. Decide if you want a plan picker and per-service page counts.

## Advertising
12. Ad campaign management was removed everywhere (services, quote builder, pricing, FAQ, process, copy). To bring it back later, restore the `ads` entry in `SERVICES`, the quote option and the `ads` price in `source/src/assets/config.js`.

## Policy and pricing update: items needing owner approval
- Maintenance prices: briefs conflicted ($49/$55/$59, $49/$59/$69, $49/$99/$139). Site uses $49 / $99 / $179 per your earlier answer. Change in config.js (care.plans) and the services/process page text.
- Included time kept as existing: Essential 30 min, Growth 2 hrs, Priority 5 hrs per month. No rollover. Extra work $50/hr.
- Growth lists "speed and basic SEO checkups" and Priority a quarterly strategy call (existing extras). Confirm these do not conflict with "no ongoing SEO management".
- Rush 20% applies to website, redesign, additional pages and SEO one-time costs; not applied to Google Business Profile or maintenance.
- SEO included list narrowed to your list (dropped image/code optimization, Core Web Vitals, competitor research).
- Additional pages: calculator asks new ($200) vs redesign ($150).
- Refund/cancellation and ownership wording depends on a written agreement; make sure one exists.
- Timelines 2-3 / 4-6 / 6-8+ weeks replace earlier 4-8 weeks and five-week claims.
- Portfolio sample "Fern & Thread" is a design sample, relabelled "Retail website". Remove if you prefer.

## Homepage redesign notes
- Homepage only was restructured (new sections, motion, mobile layout). Other pages keep their layouts; they share the improved header and mobile menu.
- The "Visitors this month" card in the hero is a labelled illustration, not real data. Remove it if you prefer.
- No testimonials, client names, statistics or awards were added. All figures shown come from your published prices and timelines.
- The marquee, rail arrows and scroll timeline are lightweight CSS/JS. No new libraries were added.

## Case studies and local SEO
- Added two client case studies (Swift White Glove Moving, NO ETA), labeled pre-launch. Placeholders marked [CONFIRM] need your input; no results or testimonials are invented.
- Homepage now has ProfessionalService JSON-LD (Fredericksburg base, serving the United States). Check the email and add a phone number if you want one in the schema.
- Added canonical tags, sitemap.xml and robots.txt. Canonical assumes https://eastlinewebco.com. /samples/ is disallowed in robots.txt so client site copies are not indexed.

## Guides, Fredericksburg page and technical SEO
- New Guides section (blog.html plus five guides) and web-design-fredericksburg-va.html. Guides are about 320-450 words; expand them over time with your own real examples.
- New page titles with keywords, Open Graph and Twitter tags (assets/og.png), Article schema on guides, and FAQPage schema on the Process page (built from its visible questions).
- Guides use general advice and your published prices only; no statistics or client results are claimed.

## Concept case studies
- Five concept pages (Harbor & Pine, Voltline, Lumen Dental, Northwind, Fern & Thread) are labeled as fictional concept projects with no client claims. They are linked from the Works page.

## About page redesign and nationwide service area
- About page rewritten in Elijah's voice using only the story provided. No invented history, credentials, client counts or results.
- The 150-mile wording was removed everywhere, including footer, homepage, contact, guides, case studies and structured data (now: Fredericksburg base, areaServed United States). Update your Google Business Profile service area to match.
- Founder photo: the mirror selfie was not used (phone covers the face, full-body framing, hallway background). No placeholder is shown; add a photo later.
- Maintenance pricing: kept $49 / $99 / $179 per the earlier decision. Your latest brief listed Priority at $139, so the About page only says "from $49 a month".
- "Online stores" is on the About page but not on the Services page yet.

## Nationwide cleanup (second pass)
- Removed the Fredericksburg landing page and its footer link, and "local" wording from the homepage, About, Contact, Guides and case studies. Fredericksburg remains as the "based in" location only.
- "Local SEO Basics" guide became "SEO Basics for Small Business Websites" (URL is now blog-seo-basics.html). Titles and tags updated.
- The Google Business Profile guide still describes a Google product that is local by nature.

## Swift White Glove Moving update (freight focus)
- Homepage now leads with white glove freight and delivery, adds a process section, replaces the soft stat tiles with factual ones, and adds item type and piece count to the quote form.
- Retailer names were left exactly as the client supplied them.
- No licensing, insurance, equipment or lane claims were added. Add them once the client confirms.
- Phone number hooks are in the header and contact page; they appear automatically once a phone number is set in assets/js/config.js.

## Swift site design pass (light and dark mode)
- The brief named "Swift Transportation", a separate real company. It was applied to the client's Swift White Glove Moving site instead; nothing from the real Swift Transportation was used.
- Light and dark mode with a toggle in the navigation on every page, remembered between visits, defaulting to the visitor's device setting. The embedded preview on the Works page always starts in dark.
- The logo is unchanged. The header, hero, quote band and footer stay black in both modes so the white logo is never altered.
- Corners are squarer for a more corporate look, plus new "Who We Serve" and "Care & Reliability" sections built only from the client's existing text.
- Not added because no information or photos exist: fleet photography, technology, careers, certifications, statistics.

## Swift route graphic, icons and logo concept
- Added an animated gold route-line graphic to the Swift hero and line icons to the "Who We Serve" and "Care & Reliability" sections. Motion is off for reduced-motion users and in the Works preview.
- A redesigned Swift logo concept was made as separate files (swift-logo-concepts.zip). It is used on the site as of the latest build. The original logo, which the client made, stays until the client approves a change.


## Swift logo update
The Swift site and the Works-page preview now use the redesigned logo: the original's realistic movers (cleaned from the client's artwork), a gold freight crate on a pallet, outlined SWIFT wordmark, WHITE GLOVE MOVING, and gold FREIGHT & DELIVERY. The original logo was client-made, so get client approval before launch. Original files are in git history.


Update: the Swift logo was reverted to the first concept (simple figures, gold crate, outlined wordmark). The realistic-movers attempt was dropped. Get client approval before launch.

Update: Swift logo is now a clean emblem (gold crate on pallet with motion lines) with a refined wordmark; the people figures were removed. Needs client approval before launch.

Update: Swift logo is back to the three-movers-with-crate concept, with redrawn, better-proportioned figures. Needs client approval.

Update: the Swift logo is the client's original again; all redesign attempts were reverted.

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
- Homepage now has ProfessionalService JSON-LD (Fredericksburg, 150-mile service area). Check the email and add a phone number if you want one in the schema.
- Added canonical tags, sitemap.xml and robots.txt. Canonical assumes https://eastlinewebco.com. /samples/ is disallowed in robots.txt so client site copies are not indexed.

## Guides, Fredericksburg page and technical SEO
- New Guides section (blog.html plus five guides) and web-design-fredericksburg-va.html. Guides are about 320-450 words; expand them over time with your own real examples.
- New page titles with keywords, Open Graph and Twitter tags (assets/og.png), Article schema on guides, and FAQPage schema on the Process page (built from its visible questions).
- Guides use general advice and your published prices only; no statistics or client results are claimed.

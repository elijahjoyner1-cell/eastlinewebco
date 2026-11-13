/* ===== EDIT ME: business settings ===== */
window.ELW_CONFIG = {
  // Public addresses shown on the site. Support is for general questions; quotes is for price requests.
  // These mailboxes must exist (see README: Cloudflare Email Routing) or mail sent to them is lost.
  emails: { support: "support@eastlinewebco.com", quotes: "quotes@eastlinewebco.com" },
  // Social profile links (footer and Contact page). Change a link here, save, redeploy. Leave "" to hide one.
  social: {
    instagram: "https://www.instagram.com/eastlinewebco",
    tiktok: "https://www.tiktok.com/@eastline.web.co",
    facebook: "https://www.facebook.com/profile.php?id=61596209691230"
  },
  // Paste a form endpoint (Formspree, Getform, Netlify function, etc.) to receive quote
  // requests directly. Leave empty to let visitors copy or email their request instead.
  formEndpoint: "https://formspree.io/f/mppqnbea",
  // Extra fields sent with every request. Examples:
  //   Web3Forms: { access_key: "YOUR-KEY", subject: "New EastLineWebCo request" }
  //   Formspree: { _subject: "New EastLineWebCo request" }
  formExtra: { _subject: "New EastLineWebCo request" },
  // ---- Prices in USD. The Services page and Policies page text must match these. ----
  // perPage: true means the visitor enters a page quantity for that service.
  // rush: true means the rush charge applies to that service (website project work).
  services: {
    web:     { label: "Custom website design and development", price: 200, perPage: true,  rush: true },
    remodel: { label: "Website redesign",                      price: 150, perPage: true,  rush: true },
    pages:   { label: "Additional website pages",              perPage: true, rush: true,
               prices: { new: 200, redesign: 150 },
               typeLabels: { new: "added to a new website", redesign: "added to a redesign" } },
    seo:     { label: "SEO and website performance optimization", price: 75, perPage: true, rush: true },
    gbp:     { label: "Google Business Profile setup",         price: 149, perPage: false, rush: false }
  },
  // Monthly maintenance: the visitor picks exactly one plan. Only that plan is added to the monthly total.
  care: {
    label: "Website maintenance",
    plans: {
      essential: { label: "Essential", price: 49,  time: "30 minutes of changes", response: "3 to 4 business days" },
      growth:    { label: "Growth",    price: 99,  time: "2 hours of changes",    response: "2 to 3 business days" },
      priority:  { label: "Priority",  price: 179, time: "5 hours of changes",    response: "1 to 2 business days" }
    }
  },
  rushRate: 0.2,      // 20% rush charge on approved rush projects (one-time costs only)
  depositRate: 0.5,   // 50% deposit on the one-time project total
  maxQty: 100
};
/* ======================================= */


/* ===== EDIT ME: business settings ===== */
window.ELW_CONFIG = {
  email: "elijah.joyner@eastlinewebco.com",
  // Paste a form endpoint (Formspree, Getform, Netlify function, etc.) to receive quote
  // requests directly. Leave empty to let visitors copy or email their request instead.
  formEndpoint: "https://formspree.io/f/mppqnbea",
  // Extra fields sent with every request. Examples:
  //   Web3Forms: { access_key: "YOUR-KEY", subject: "New EastLineWebCo request" }
  //   Formspree: { _subject: "New EastLineWebCo request" }
  formExtra: { _subject: "New EastLineWebCo request" },
  // Prices in USD. page = per-page price. flat = one-time setup fee. monthly = [low, high] per month.
  services: {
    web:     { label: "New website pages",       page: 200, flat: 0,   monthly: [0, 0] },
    remodel: { label: "Website redesign pages",  page: 150, flat: 0,   monthly: [0, 0] },
    care:    { label: "Maintenance and updates", page: 0,   flat: 0,   monthly: [49, 179] },
    ads:     { label: "Ad campaigns",            page: 0,   flat: 300, monthly: [300, 1000] },
    seo:     { label: "SEO and speed",           page: 75,  flat: 0,   monthly: [0, 0] },
    shop:    { label: "Online store",            page: 200, flat: 600, monthly: [0, 0] }
  },
  rushMultiplier: 1.2
};
/* ======================================= */


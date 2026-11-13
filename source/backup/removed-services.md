# Removed services (kept for reuse)

E-commerce and advertising management were removed from the active site on 2026-11-09. To bring one back,
add its entry to `SERVICES` in `source/build.py`, add a quote option in `source/src/pages/quote.html`, and add its
price to `source/src/assets/config.js`.

## E-commerce website development (was in SERVICES)
```python
dict(id='shop',name='E-commerce website development',short='Online store',tag='Sell products with simple checkout',price='$600 setup + $200 per page',
 lead='A store set up to the products and features we agree in writing: add products, take payments and manage orders without a developer.',
 inc=['Store setup','Product catalog setup for the products agreed in your quote','Payment integration with the provider you choose','Shipping and tax settings','Order emails','Inventory tools','Training for your team','Store pages at $200 each'],
 addons=['Products beyond the agreed number, quoted by scope','Additional pages','A maintenance plan','SEO and performance work'],
 out=['Third-party subscription fees','Payment processing fees on your sales','Guaranteed sales, traffic or leads'],
 quote=['Product photography, descriptions or large data entry','Integrations with accounting, inventory or shipping software','Subscriptions, memberships or marketplace selling','Custom checkout or pricing rules'],
 you=['Your product list: names, descriptions, prices, photos and stock','An account with your chosen payment provider, opened in your name','Your shipping and tax details','Your returns, shipping and privacy policy text'],
 ongoing=['Store platform or hosting subscription, if your platform charges one, paid to the provider','Payment processing fees, charged by your payment provider on each sale','Paid apps, plugins or themes you choose','Domain registration, paid yearly'],
 note='Subscription, payment-processing and platform fees are charged by those providers directly to you. They are not part of EastLine\'s price.'),

```
Old calculator price: `{ label: "E-commerce website development", page: 200, flat: 600 }`

## Ad campaigns (was in SERVICES)
```python
('ads','Ad campaigns','Google and social ads tuned to your budget','$300 setup + from $300 / month','Google Search, Google Maps and social ads sent to pages built to convert. Ad spend goes straight to the platforms from your own account.',['Campaign strategy and setup','Ad copy and creative','Conversion tracking','Landing page recommendations','Ongoing budget tuning','Plain-language monthly report']),

```
Old calculator price: `{ label: "Ad campaigns", page: 0, flat: 300, monthly: [300, 1000] }`

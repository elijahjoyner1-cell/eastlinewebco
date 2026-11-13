import json
import re, os, shutil, glob, sys, base64, hashlib
sys.path.insert(0,'tools')
import logo as L
SRC='src'; FONTS='https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Hanken+Grotesk:wght@400;500;600;700&display=swap'
ARROW=''
NAV=[('services','Services','services.html'),('work','Work','work.html'),('blog','Guides','blog.html'),('process','Process','process.html'),('about','About','about.html'),('contact','Contact','contact.html')]
LOGO='<svg width="30" height="30" viewBox="0 0 28 28" aria-hidden="true"><path d="M2 20h24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M7.5 20a6.5 6.5 0 0 1 13 0z" fill="var(--warm)"/></svg>'
# Company social profiles. These are the defaults; the live links come from `social` in assets/config.js
SOCIAL=[
 ('Instagram','@eastlinewebco','https://www.instagram.com/eastlinewebco','<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>'),
 ('TikTok','@eastline.web.co','https://www.tiktok.com/@eastline.web.co','<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M16.6 2h-3.2v13.1a2.9 2.9 0 1 1-2-2.8V9a6.2 6.2 0 1 0 5.2 6.1V8.8a7.4 7.4 0 0 0 4.3 1.4V7a4.3 4.3 0 0 1-4.3-4.3z"/></svg>'),
 ('Facebook','EastLine Web','https://www.facebook.com/profile.php?id=61596209691230','<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M14 8.2V6.6c0-.8.2-1.2 1.3-1.2H17V2.1h-2.7C11.5 2.1 10.4 3.7 10.4 6v2.2H8v3.3h2.4V22h3.6V11.5h2.7l.4-3.3z"/></svg>'),
]
def social(cls='social'):
    return f'<ul class="{cls}">'+''.join(f'<li><a data-social="{n.lower()}" href="{u}" target="_blank" rel="noopener noreferrer" aria-label="EastLineWebCo on {n}">{ic}<span>{n}</span></a></li>' for n,h,u,ic in SOCIAL)+'</ul>'
def header(active):
    links=''.join(f'<a href="{h}"{" aria-current=\"page\"" if k==active else ""}>{t}</a>' for k,t,h in NAV)
    return f'''<header class="site-header"><div class="wrap bar">
<a class="logo" href="index.html" aria-label="EastLineWebCo home">{L.header_svg()}</a>
<button class="icon-btn menu-btn" id="menu-btn" aria-label="Menu" aria-expanded="false" aria-controls="nav"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
<nav class="nav" id="nav" aria-label="Main">{links}
<button class="icon-btn" id="theme-btn" aria-label="Switch light or dark theme"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button>
<a class="btn primary sm" href="quote.html">Get a quote</a></nav><div class="progress" id="progress" aria-hidden="true"></div></div></header>'''
FOOTER=f'''<footer class="site-footer"><div class="wrap"><div class="foot">
<div><a class="logo" href="index.html" aria-label="EastLineWebCo home">{L.header_svg()}</a><p class="muted" style="margin-top:14px;max-width:32ch">Websites, redesigns, maintenance and SEO for growing businesses.</p><p class="muted" style="margin-top:10px;max-width:32ch">Based in Fredericksburg, VA. Serving businesses within 150 miles.</p></div>
<div><h4>Services</h4><ul><li><a href="services.html#web">New websites</a></li><li><a href="services.html#remodel">Redesigns</a></li><li><a href="services.html#care">Maintenance</a></li><li><a href="services.html#pages">Additional pages</a></li><li><a href="services.html#seo">SEO and performance</a></li><li><a href="services.html#gbp">Google Business Profile</a></li></ul></div>
<div><h4>Company</h4><ul><li><a href="work.html">Our work</a></li><li><a href="work-swift-white-glove-moving.html">Case studies</a></li><li><a href="blog.html">Guides</a></li><li><a href="web-design-fredericksburg-va.html">Web design in Fredericksburg</a></li><li><a href="about.html">About</a></li><li><a href="process.html">Process</a></li><li><a href="policies.html">Project policies</a></li><li><a href="contact.html">Contact</a></li><li><a href="quote.html">Get a quote</a></li></ul></div>
<div><h4>Email</h4><ul><li><a data-email="support" href="mailto:support@eastlinewebco.com">support@eastlinewebco.com</a></li><li><a data-email="quotes" href="mailto:quotes@eastlinewebco.com">quotes@eastlinewebco.com</a></li></ul><h4 style="margin-top:22px">Follow us</h4>{social()}</div>
</div><div class="legal"><span>&copy; <span data-year>2026</span> EastLineWebCo. All rights reserved.</span></div></div></footer>'''
EARLY=r'''<script>(function(){var R=document.documentElement,RE=/(^|\|)elw:(light|dark)$/;function rd(){var t=null;try{t=localStorage.getItem("elw-theme")}catch(e){}if(!t){try{t=sessionStorage.getItem("elw-theme")}catch(e){}}if(!t){var m=RE.exec(window.name||"");t=m&&m[2]}return t==="light"||t==="dark"?t:null}window.elwTheme={get:rd,set:function(v){try{localStorage.setItem("elw-theme",v)}catch(e){}try{sessionStorage.setItem("elw-theme",v)}catch(e){}try{var b=(window.name||"").replace(RE,"");window.name=(b?b+"|":"")+"elw:"+v}catch(e){}}};var t=rd();if(t)R.setAttribute("data-theme",t)})();</script>'''
# Service scope content. Prices come from the owner's published list; the quote builder (config.js) uses the same numbers.
SERVICES=[
dict(id='web',name='Custom website design and development',short='Custom website',tag='Custom pages, built around your business',price='$200 per page',
 lead='A custom, mobile-friendly website built to the page count we agree in writing. UI/UX design is part of the project, not an extra charge.',
 inc=['UI/UX design, included in the project','Custom design, no templates','Layouts for phone, tablet and desktop','The agreed number of pages and site navigation','Contact and booking request forms where specified','Basic on-page SEO setup: page titles, descriptions and headings','Analytics setup','Testing before launch','Launch help, including domain and hosting setup','Two design revision rounds','14 days of post-launch defect fixes'],
 addons=['Rush delivery, subject to availability (20% charge)','Additional pages after launch','SEO and performance optimization','Google Business Profile setup','A website maintenance plan'],
 out=['Unlimited revisions or a completely new design direction','Ongoing edits after launch (see Website maintenance)','Guaranteed search rankings, traffic or leads'],
 quote=['Writing copy from scratch','Photography, logo or custom graphics','Complex functionality, such as booking systems, member areas or logins','Custom integrations with other software','Extra design revisions, or $50 per hour'],
 you=['Your text and photos, or tell us what you need created','Your logo and brand colors, if you have them','Examples of sites you like','Your own domain and hosting accounts, which we help you set up','Feedback and approvals when we ask for them'],
 ongoing=['Domain registration, bought and paid for by you','Website hosting, bought and paid for by you','Any third-party subscriptions or payment processing accounts you choose'],
 note=None),
dict(id='remodel',name='Website redesign',short='Website redesign',tag='Keep what works, replace what does not',price='$150 per page',
 lead='We review your current site, then update the design and the pages we agree on. The scope is the page list and features agreed up front, not an open-ended rebuild. UI/UX design is part of the project, not an extra charge.',
 inc=['UI/UX design, included in the project','Review of your current site, with recommendations','Updated design and layout for the agreed pages','Layouts for phone, tablet and desktop','Navigation improvements','Cleanup of your existing text and images','Redirects from old page addresses where addresses change','Speed and accessibility fixes on the agreed pages','Agreed existing functionality carried over','Two design revision rounds','14 days of post-launch defect fixes'],
 addons=['Additional pages at $150 each','New features or forms, quoted by scope','SEO and performance optimization','Google Business Profile setup','A website maintenance plan','Help moving to new hosting (hosting fees are yours)','Rush delivery, subject to availability (20% charge)'],
 out=['Unlimited new features or functionality','Pages that are not on the agreed page list','Guaranteed to keep or improve your search rankings','Unlimited revisions or a completely new design direction'],
 quote=['New features, tools or integrations','Writing new copy','New photography or custom graphics','Moving large amounts of content or data','Extra design revisions, or $50 per hour'],
 you=['Admin access to your current site, domain and hosting','Your existing content, photos and logo files','A list of what you want kept, changed or removed','Feedback and approvals when we ask for them'],
 ongoing=['Domain registration and hosting, bought and paid for by you','Subscriptions for any plugins or tools your site uses'],
 note=None),
dict(id='care',name='Website maintenance',short='Maintenance',tag='Send us changes, we handle them',price='From $49 / month',
 lead='A monthly plan that keeps your site updated, backed up and monitored, with a set amount of change time included. It is not unlimited editing, redesign or development.',
 inc=['Security and software updates','Daily backups','Uptime monitoring','Change time included in your plan: 30 minutes (Essential), 2 hours (Growth) or 5 hours (Priority)','Support by email, with a response target for your plan','Monthly report (Growth and Priority plans)'],
 addons=['Additional work beyond your plan time, at $50 per hour','Additional pages','SEO and performance optimization'],
 out=['Unlimited edits, redesigns or development','Unused monthly time rolling over to the next month','A guaranteed fix time or a guarantee that your site will never go down'],
 quote=['Emergency work, estimated separately','Larger development tasks','New pages, new functionality, major layout changes, new integrations or custom development'],
 you=['Send change requests by email, with the text and images ready','Keep your domain and hosting accounts active and paid','Give us admin access if we did not build the site'],
 ongoing=['The monthly plan fee, billed separately from any one-time project cost','Domain and hosting, paid by you to your providers','Licenses for any paid plugins or tools on your site'],
 note='Response times are targets, not guaranteed resolution times: Essential within 3 to 4 business days, Growth within 2 to 3, Priority within 1 to 2.'),
dict(id='pages',name='Additional website pages',short='Additional pages',tag='Grow your site one page at a time',price='$200 per page (new sites) / $150 (redesigns)',
 lead='Add standard content pages to a site we built. Pages added to a new website are $200 each. Pages added to a redesign are $150 each. A standard page is one page in your site\'s existing look, built from text and images you provide.',
 inc=['Design and build in your current style','Layouts for phone, tablet and desktop','Added to your navigation and footer links','Your text and photos placed and formatted','Basic on-page SEO setup: title, description and headings','Testing before it goes live'],
 addons=['Copywriting for the page, quoted separately','Photography or custom graphics, quoted separately','SEO and performance optimization, priced per page'],
 out=['Ongoing edits to the page after launch (see Website maintenance)','Guaranteed search rankings or traffic for the page'],
 quote=['Complex functionality such as booking systems, calculators, member areas or logins','Custom integrations with other software','Extensive content creation, writing or photography'],
 you=['The text and images for each page','Where the page should sit in your menu','Feedback and approvals when we ask for them'],
 ongoing=['Domain and hosting, paid by you to your providers','A maintenance plan if you want ongoing updates'],
 note=None),
dict(id='seo',name='SEO and website performance optimization',short='SEO and performance',tag='Easier for search engines to read, quicker to load',price='$75 per page',
 lead='Basic on-page optimization intended to improve search engine accessibility, relevance and website performance. It does not guarantee any result.',
 inc=['Page titles and meta descriptions','Heading structure','Image alt text','Relevant keyword placement','Internal linking recommendations','Basic content structure optimization','Indexability checks'],
 addons=['Google Business Profile setup, a separate $149 one-time service','Additional pages optimized, at $75 per page','A website maintenance plan'],
 out=['Guaranteed first-page rankings or any particular Google position','Guaranteed organic traffic, leads, sales or search results','Ongoing SEO management','Backlink campaigns','Local directory listing management','Ongoing Google Business Profile management'],
 quote=['Content writing or large-scale content creation','Large technical fixes outside the agreed pages'],
 you=['Access to your site and, if you have them, your Analytics and Search Console accounts','A list of the pages and services you want to be found for','Your business details, such as name, address, phone and hours'],
 ongoing=['Fees for any paid tools or directories you choose','Domain and hosting, paid by you to your providers','Further SEO work after this project, which is quoted separately'],
 note='Search performance depends on factors outside EastLine\'s control, including competition, search engine updates, your site\'s history and the quality of your content. Paying for SEO does not guarantee a particular business result. We do not promise first-page rankings, a specific Google position, traffic, leads or sales.'),
dict(id='gbp',name='Google Business Profile setup',short='Google Business Profile',tag='Get your business listed with accurate details',price='$149 one-time',
 lead='We set up and configure your Google Business Profile so your business details are accurate and consistent. Google Business Profile is a free Google service. You pay EastLine for the setup and configuration work, not for Google\'s platform.',
 inc=['Profile creation or setup assistance for eligible businesses','Business information configuration','Business category selection','Business description','Business hours','Address or service area configuration, where applicable','Contact information','Website link','Services and service descriptions','Guidance on adding business photographs','Initial profile review and consistency checks'],
 addons=['SEO and website performance optimization for your site pages, priced per page','A website maintenance plan'],
 out=['Ongoing profile management','Review management','Ongoing Google Posts','Guaranteed Google Maps placement or search rankings','Suspension reinstatement or complicated ownership disputes','A promised verification or approval timeframe'],
 quote=['Any work beyond the setup listed here'],
 you=['Your business name, address or service area, phone number and hours','The services you offer, with a short description of each','Photos of your business, or time to take them using our guidance','Your Google account, or help creating one, as the profile owner','Completing Google\'s verification steps'],
 ongoing=['None for Google\'s platform, which is free','Any paid third-party tools you choose','Keeping your profile up to date after setup'],
 note='Google decides whether and when a profile is verified or approved. We cannot promise a timeframe, a Google Maps position or any search ranking.'),
]
ICON=''
# Full multi-page sites that live in their own folder under src/samples/<id>/ (they run scripts, so the preview iframe allows them)
EXT={'swift-moving':{'url':'samples/swift-moving/index.html','host':'swiftwhiteglovemoving.com','src':'samples/swift-moving/index.html?static=1'},
     'no-eta':{'url':'samples/no-eta/index.html','host':'no-eta.example','src':'samples/no-eta/index.html?static=1'}}
SAMPLES=[
('swift-moving','Swift White Glove Moving','Multi-page site, moving and delivery','A nine-page marketing site for a boutique white glove moving company: dark, editorial and discreet, with animated sections, a service accordion, a quote form that works without a backend, and a Cloudflare-ready setup.','Dark, editorial, animated',[],'','Home, About, Services, Service Areas, Testimonials, FAQ, Contact'),
('no-eta','NO ETA','Streetwear brand site','A one-page React site for a streetwear label that never promises a delivery date: a giant wordmark, a live-style shipping timeline, an inventory log with claim bars, a manifesto and a receipt-style signup, all animated on load and on scroll.','Raw, industrial, monospace',[('Stone','#E5E5E1'),('Ink','#121212'),('Amber','#F59E0B')],'Inter Tight + Inter + JetBrains Mono','Hero, shipping timeline, inventory, manifesto, lookbook, signup'),
('harbor-pine','Harbor & Pine Coffee Roasters','Local retail and cafe','A neighborhood roaster with a warm, friendly brand: weekly roast cards, a subscription club, a printed-style menu and a visit section.','Warm, rounded, friendly',[('Spruce','#123C34'),('Oat','#F4EBD8'),('Butter','#F2C14E'),('Tomato','#D2553C')],'Fraunces + Karla','Roast cards, subscription club, menu, hours'),
('voltline','Voltline Electric','Trades and contractors','A bold electrician site built to get the phone ringing: an emergency call bar, angled shapes, a clear service grid and a three-step process.','Bold, angular, high contrast',[('Coal','#14161A'),('Volt','#FFD60A'),('White','#F6F6F4')],'Barlow Condensed + Barlow','Call bar, service grid, process, service area'),
('lumen-dental','Lumen Family Dental','Healthcare','A calm, trustworthy dental office with soft shapes, an appointment request card, plain-language services and an FAQ.','Clean, calm, trustworthy',[('Navy','#0B2545'),('Teal','#12A5A0'),('Sky','#E7F4FA'),('Mint','#D8F3EC')],'Manrope','Booking card, services, what to expect, FAQ'),
('northwind','Northwind Architects','Studio portfolio','An editorial studio site: oversized type, an outlined headline, a line drawing, a project index and a studio statement.','Editorial, monochrome, oversized type',[('Black','#0A0A0A'),('White','#FFFFFF'),('Signal','#FF4D00')],'Syne + Work Sans','Project index, line drawing, studio statement'),
('fern-thread','Fern & Thread','Online store','A soft, product-first boutique store with collection circles, a product grid with color options, a brand story and a newsletter signup.','Soft, elegant, product-first',[('Plum','#3A1D31'),('Blush','#F6DDD3'),('Sage','#A9B99E'),('Clay','#C8785E')],'Cormorant Garamond + Jost','Collections, product grid, story, newsletter'),
]
def esc(x): return x.replace('&','&amp;')
def pv(src,w=1280,h=800,label='',extra=''):
    if src in EXT: return f'<div class="pv" data-src="{EXT[src]["src"]}" data-ext="1" data-w="{w}" data-h="{h}" data-label="{esc(label)}"{extra}></div>'
    return f'<div class="pv" data-src="samples/{src}.html" data-w="{w}" data-h="{h}" data-label="{esc(label)}"{extra}></div>'
def hero_bg():
    cols=[['harbor-pine','voltline'],['northwind','lumen-dental'],['fern-thread','harbor-pine']]
    return '<div class="hero-bg" aria-hidden="true">'+''.join('<div class="bg-col">'+''.join(pv(i,extra=' data-bg="1"') for i in c)+'</div>' for c in cols)+'</div>'
def showcase():
    return ''.join(f'<a class="rcard" href="work.html#{i}"><div class="chrome sm"><div class="chrome-bar"><i></i><i></i><i></i></div>{pv(i,label=n)}</div><h3>{esc(n)}</h3><p>{k} &middot; {st}</p></a>' for i,n,k,bl,st,pal,fo,inc in SAMPLES)
def work_cards():
    out=[]
    for i,n,k,bl,st,pal,fo,inc in SAMPLES:
        ext=EXT.get(i)
        href=ext['url'] if ext else f'samples/{i}.html'
        host=ext['host'] if ext else f'{i}.example'
        sw=''.join(f'<span class="sw" style="background:{h}" title="{c} {h}"></span>' for c,h in pal)
        out.append(f'''<article class="work" id="{i}"><div class="work-info"><span class="kind">{k}</span><h2>{esc(n)}</h2><p>{bl}</p>
<dl><dt>Style</dt><dd>{st}</dd>{('' if not fo else f'<dt>Type</dt><dd>{fo}</dd>')}{('' if not pal else f'<dt>Colors</dt><dd class="sws">{sw}</dd>')}<dt>{'Pages' if i=='swift-moving' else 'Includes'}</dt><dd>{inc}</dd></dl>
<div class="btns"><a class="btn primary sm" href="{href}" target="_blank" rel="noopener">{'Open full site' if ext else 'Open full sample'}</a><a class="btn ghost sm" href="quote.html">Build something like this</a></div></div>
<div class="work-view"><div class="seg" role="group" aria-label="Preview size for {esc(n)}"><button type="button" data-mode="desktop" aria-pressed="true">Desktop</button><button type="button" data-mode="phone" aria-pressed="false">Phone</button></div>
<div class="chrome"><div class="chrome-bar"><i></i><i></i><i></i><span>{host}</span></div>{pv(i,label=n)}</div></div></article>''')
    return ''.join(out)
def acc_html():
    out=['<div class="acc">']
    for i,s in enumerate(SERVICES):
        sid,t=s['id'],s['name']
        lis=''.join(f'<li>{x}</li>' for x in s['inc'][:6])
        out.append(f'''<div class="acc-item{" open" if i==0 else ""}" id="s-{sid}"><button class="acc-btn" type="button" aria-expanded="{"true" if i==0 else "false"}" aria-controls="p-{sid}"><h3>{t}</h3><span class="tag">{s['tag']}</span><span class="acc-ico" aria-hidden="true"></span></button>
<div class="acc-panel" id="p-{sid}" role="region" aria-label="{t}"><div class="acc-inner"><div class="acc-body"><div class="acc-main"><p class="lead">{s['lead']}</p><ul class="checks">{lis}</ul><div class="acc-foot"><span class="price">{s['price']}</span><a class="btn primary sm" href="quote.html#{sid}">Quote this</a><a class="btn ghost sm" href="services.html#{sid}">What is and is not included</a></div></div></div></div></div></div>''')
    out.append('</div>'); return ''.join(out)
def _ul(items,cls=''):
    return f'<ul class="checks one {cls}">'+''.join(f'<li>{x}</li>' for x in items)+'</ul>'
def _plain(items):
    return '<ul>'+''.join(f'<li>{x}</li>' for x in items)+'</ul>'
def svc_html():
    out=[]
    for s in SERVICES:
        sid,t=s['id'],s['name']
        note=f'<p class="callout">{s["note"]}</p>' if s['note'] else ''
        out.append(f'''<article class="svc" id="{sid}"><div class="svc-side"><h2>{t}</h2><p class="price">{s['price']}</p><p class="muted">Starting price. Your written quote confirms the final scope.</p><div class="btns"><a class="btn primary sm" href="quote.html#{sid}">Quote this</a></div></div><div class="svc-main"><p class="lead">{s['lead']}</p>
<div class="scope"><div class="scope-col"><h3>What&rsquo;s included</h3><p class="muted sm-t">In the listed starting price</p>{_ul(s['inc'])}</div>
<div class="scope-col"><h3>What&rsquo;s not included</h3><p class="muted sm-t">Not part of this service</p>{_ul(s['out'],'no')}<p class="muted sm-t" style="margin-top:6px">Needs a separate quote</p>{_ul(s['quote'],'no')}</div></div>
<div class="trio"><div><h4>Optional add-ons</h4>{_plain(s['addons'])}</div><div><h4>What you provide</h4>{_plain(s['you'])}</div><div><h4>Ongoing costs</h4>{_plain(s['ongoing'])}</div></div>{note}</div></article>''')
    return ''.join(out)
def about_mark():
    return '<svg viewBox="0 0 48 50" role="img" aria-label="EastLineWebCo mark">'+L.MARK+'</svg>'
def load():
    pages={}
    for f in sorted(glob.glob(f'{SRC}/pages/*.html')):
        raw=open(f).read(); first,body=raw.split('\n',1); t,nav,desc=first.split('|')
        pages[os.path.basename(f)]=(t,nav,desc,body)
    return pages
SCHEMA='<script type="application/ld+json">'+json.dumps({'@context': 'https://schema.org', '@type': 'ProfessionalService', 'name': 'EastLineWebCo', 'url': 'https://eastlinewebco.com/', 'logo': 'https://eastlinewebco.com/assets/icon-512.png', 'image': 'https://eastlinewebco.com/assets/icon-512.png', 'description': 'Web design studio in Fredericksburg, VA building new websites, redesigns, maintenance, SEO and Google Business Profile setup for small businesses.', 'email': 'quotes@eastlinewebco.com', 'address': {'@type': 'PostalAddress', 'addressLocality': 'Fredericksburg', 'addressRegion': 'VA', 'addressCountry': 'US'}, 'geo': {'@type': 'GeoCoordinates', 'latitude': 38.3032, 'longitude': -77.4605}, 'areaServed': {'@type': 'GeoCircle', 'geoMidpoint': {'@type': 'GeoCoordinates', 'latitude': 38.3032, 'longitude': -77.4605}, 'geoRadius': 241402}, 'sameAs': ['https://www.instagram.com/eastlinewebco', 'https://www.tiktok.com/@eastline.web.co', 'https://www.facebook.com/profile.php?id=61596209691230'], 'hasOfferCatalog': {'@type': 'OfferCatalog', 'name': 'Web design services', 'itemListElement': [{'@type': 'Offer', 'name': 'New website page', 'price': '200', 'priceCurrency': 'USD', 'description': 'Starting price per page'}, {'@type': 'Offer', 'name': 'Redesign page', 'price': '150', 'priceCurrency': 'USD', 'description': 'Starting price per page'}, {'@type': 'Offer', 'name': 'SEO per page', 'price': '75', 'priceCurrency': 'USD', 'description': 'Starting price per page'}, {'@type': 'Offer', 'name': 'Google Business Profile setup', 'price': '149', 'priceCurrency': 'USD'}, {'@type': 'Offer', 'name': 'Essential maintenance plan', 'price': '49', 'priceCurrency': 'USD', 'description': 'Per month'}]}},separators=(',',':'))+'</script>'
DOMAIN='https://eastlinewebco.com'
TITLES={'index.html':'Affordable Web Design for Small Businesses | EastLineWebCo','services.html':'Web Design from $200/Page, Redesigns $150 | EastLineWebCo','work.html':'Web Design Portfolio and Case Studies | EastLineWebCo','process.html':'Our Web Design Process and FAQ | EastLineWebCo','about.html':'About EastLineWebCo | Fredericksburg, VA Web Design','contact.html':'Contact EastLineWebCo | Web Design in Fredericksburg, VA','quote.html':'Website Quote Builder | EastLineWebCo','work-swift-white-glove-moving.html':'Swift White Glove Moving Website Case Study | EastLineWebCo','work-no-eta-streetwear-brand.html':'NO ETA Streetwear Website Case Study | EastLineWebCo','web-design-fredericksburg-va.html':'Web Design in Fredericksburg, VA | EastLineWebCo','blog.html':'Web Design and Local SEO Guides | EastLineWebCo'}
def doc(name,t,nav,desc,body,inline,artifact_index):
    body=body.replace('<!--SOCIAL-->',social('social'))
    title=TITLES.get(name) or (f'{t} | EastLineWebCo')
    css=open(f'{SRC}/assets/styles.css').read(); js=open(f'{SRC}/assets/config.js').read()+'\n'+open(f'{SRC}/assets/app.js').read()
    ARTIFACT_CFG=1
    V=hashlib.md5((css+js+open(f'{SRC}/assets/config.js').read()).encode()).hexdigest()[:8]
    if inline: js=re.sub(r'formEndpoint: "[^"]*"','formEndpoint: ""',js)
    cssTag=f'<style>\n{css}\n</style>' if inline else f'<link rel="stylesheet" href="assets/styles.css?v={V}">'
    jsTag=f'<script>\n{js}\n</script>' if inline else f'<script src="assets/config.js?v={V}"></script><script src="assets/app.js?v={V}"></script>'
    fonts=f'<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="{FONTS}">'
    fav=base64.b64encode(open(f'{SRC}/assets/favicon.svg','rb').read()).decode()
    tc='<meta name="theme-color" content="#0A1020" media="(prefers-color-scheme: dark)"><meta name="theme-color" content="#F5F7FC" media="(prefers-color-scheme: light)"><meta name="format-detection" content="telephone=no">'
    meta=tc+f'<meta name="description" content="{desc}"><link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,{fav}">'
    if not inline:
        meta+=f'<link rel="canonical" href="{DOMAIN}/'+('' if name=='index.html' else name)+'">'
        if name=='index.html': meta+=SCHEMA
        url=f'{DOMAIN}/'+('' if name=='index.html' else name); isart=name.startswith('blog-')
        d2=desc.replace('"','&quot;')
        meta+=f'<meta property="og:site_name" content="EastLineWebCo"><meta property="og:type" content="{"article" if isart else "website"}"><meta property="og:title" content="{title}"><meta property="og:description" content="{d2}"><meta property="og:url" content="{url}"><meta property="og:image" content="{DOMAIN}/assets/og.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{title}"><meta name="twitter:description" content="{d2}"><meta name="twitter:image" content="{DOMAIN}/assets/og.png">'
        if isart: meta+='<script type="application/ld+json">'+json.dumps({"@context":"https://schema.org","@type":"Article","headline":t,"description":desc,"datePublished":"2026-11-13","dateModified":"2026-11-13","author":{"@type":"Organization","name":"EastLineWebCo","url":DOMAIN+'/'},"publisher":{"@type":"Organization","name":"EastLineWebCo","logo":{"@type":"ImageObject","url":DOMAIN+'/assets/icon-512.png'}},"mainEntityOfPage":url},separators=(',',':'))+'</script>'
        if name=='process.html':
            qa=re.findall(r'<details><summary>(.*?)</summary><p>(.*?)</p>',body,re.S)
            strip=lambda x: re.sub(r'\s+',' ',re.sub(r'<[^>]+>','',x)).replace('&rsquo;',"'").replace('&amp;','&').strip()
            if qa: meta+='<script type="application/ld+json">'+json.dumps({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":strip(q),"acceptedAnswer":{"@type":"Answer","text":strip(a)}} for q,a in qa]},separators=(',',':'))+'</script>'
        meta+='<link rel="apple-touch-icon" href="assets/apple-touch-icon.png"><link rel="manifest" href="manifest.webmanifest">'
    body=body.replace('{{SERVICES_ACC}}',acc_html()).replace('{{SERVICE_ARTICLES}}',svc_html()).replace('{{ABOUT_MARK}}',about_mark()).replace('{{WORK_CARDS}}',work_cards()).replace('{{SHOWCASE}}',showcase()).replace('{{HERO_BG}}',hero_bg())
    main=f'<main>{body}</main>'
    if artifact_index:
        return f'<meta name="claude:viewport-fit-sides" content="cover">\n<title>{title}</title>\n{meta}\n{fonts}\n{cssTag}\n{EARLY}\n{header(nav)}\n{main}\n{FOOTER}\n{jsTag}\n'
    return f'<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="claude:viewport-fit-sides" content="cover">\n<title>{title}</title>\n{meta}\n{fonts}\n{cssTag}\n{EARLY}\n</head><body>\n{header(nav)}\n{main}\n{FOOTER}\n{jsTag}\n</body></html>\n'
pages=load()
for out,inline in (('dist/site',False),('dist/artifact',True)):
    shutil.rmtree(out,ignore_errors=True); os.makedirs(out+'/assets' if not inline else out)
    for n,(t,nav,desc,body) in pages.items():
        open(f'{out}/{n}','w').write(doc(n,t,nav,desc,body,inline,inline and n=='index.html'))
    if not inline:
        for a in ('og.png','styles.css','app.js','config.js','favicon.svg','apple-touch-icon.png','icon-192.png','icon-512.png'): shutil.copy(f'{SRC}/assets/{a}',f'{out}/assets/{a}')
        shutil.copytree('dist/logo',f'{out}/assets/logo',dirs_exist_ok=True)
        open(f'{out}/manifest.webmanifest','w').write('{"name":"EastLineWebCo","short_name":"EastLineWebCo","start_url":"/index.html","display":"browser","background_color":"#0A1020","theme_color":"#0A1020","icons":[{"src":"assets/icon-192.png","sizes":"192x192","type":"image/png"},{"src":"assets/icon-512.png","sizes":"512x512","type":"image/png"}]}')
        open(f'{out}/robots.txt','w').write('User-agent: *\nAllow: /\nDisallow: /samples/\n\nSitemap: '+DOMAIN+'/sitemap.xml\n')
        open(f'{out}/sitemap.xml','w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join(f'<url><loc>{DOMAIN}/'+('' if n=="index.html" else n)+'</loc></url>' for n in pages if n!='404.html')+'</urlset>')
for out in ('dist/site','dist/artifact'):
    shutil.copytree(f'{SRC}/samples',f'{out}/samples',dirs_exist_ok=True)
print('built')

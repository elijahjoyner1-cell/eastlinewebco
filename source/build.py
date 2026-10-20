import re, os, shutil, glob, sys, base64, hashlib
sys.path.insert(0,'tools')
import logo as L
SRC='src'; FONTS='https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Hanken+Grotesk:wght@400;500;600;700&display=swap'
ARROW=''
NAV=[('services','Services','services.html'),('work','Work','work.html'),('process','Process','process.html'),('about','About','about.html'),('contact','Contact','contact.html')]
LOGO='<svg width="30" height="30" viewBox="0 0 28 28" aria-hidden="true"><path d="M2 20h24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M7.5 20a6.5 6.5 0 0 1 13 0z" fill="var(--warm)"/></svg>'
def header(active):
    links=''.join(f'<a href="{h}"{" aria-current=\"page\"" if k==active else ""}>{t}</a>' for k,t,h in NAV)
    return f'''<header class="site-header"><div class="wrap bar">
<a class="logo" href="index.html" aria-label="EastLineWebCo home">{L.header_svg()}</a>
<button class="icon-btn menu-btn" id="menu-btn" aria-label="Menu" aria-expanded="false" aria-controls="nav"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
<nav class="nav" id="nav" aria-label="Main">{links}
<button class="icon-btn" id="theme-btn" aria-label="Switch light or dark theme"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button>
<a class="btn primary sm" href="quote.html">Get a quote</a></nav><div class="progress" id="progress" aria-hidden="true"></div></div></header>'''
FOOTER=f'''<footer class="site-footer"><div class="wrap"><div class="foot">
<div><a class="logo" href="index.html" aria-label="EastLineWebCo home">{L.header_svg()}</a><p class="muted" style="margin-top:14px;max-width:32ch">Websites, redesigns, maintenance and ads for growing businesses.</p></div>
<div><h4>Services</h4><ul><li><a href="services.html#web">New websites</a></li><li><a href="services.html#remodel">Redesigns</a></li><li><a href="services.html#care">Maintenance</a></li><li><a href="services.html#ads">Ad campaigns</a></li></ul></div>
<div><h4>Company</h4><ul><li><a href="work.html">Our work</a></li><li><a href="about.html">About</a></li><li><a href="process.html">Process</a></li><li><a href="contact.html">Contact</a></li><li><a href="quote.html">Get a quote</a></li></ul></div>
<div><h4>Email</h4><ul><li data-email>elijah.joyner@eastlinewebco.com</li></ul></div>
</div><div class="legal"><span>&copy; <span data-year>2026</span> EastLineWebCo. All rights reserved.</span></div></div></footer>'''
EARLY=r'''<script>(function(){var R=document.documentElement,RE=/(^|\|)elw:(light|dark)$/;function rd(){var t=null;try{t=localStorage.getItem("elw-theme")}catch(e){}if(!t){try{t=sessionStorage.getItem("elw-theme")}catch(e){}}if(!t){var m=RE.exec(window.name||"");t=m&&m[2]}return t==="light"||t==="dark"?t:null}window.elwTheme={get:rd,set:function(v){try{localStorage.setItem("elw-theme",v)}catch(e){}try{sessionStorage.setItem("elw-theme",v)}catch(e){}try{var b=(window.name||"").replace(RE,"");window.name=(b?b+"|":"")+"elw:"+v}catch(e){}}};var t=rd();if(t)R.setAttribute("data-theme",t)})();</script>'''
SERVICES=[
('web','New websites','Custom pages, built to bring in customers','$200 per page','A custom site designed around what your customers need to find and do, built to load fast and rank well. Every page is priced the same, so you can count your total.',['Custom design, no templates','Mobile-first layouts','Contact and booking forms','Basic on-page SEO','Analytics setup','Domain and hosting setup']),
('remodel','Website redesigns','Keep what works, replace what does not','$150 per page','We audit your current site, then rebuild its design, content and speed without losing your search rankings.',['Site audit and recommendations','Fresh design and layout','Content cleanup','Redirects to protect rankings','Speed and accessibility fixes','Move to better hosting']),
('care','Maintenance and updates','Send us changes, we handle them','From $49 / month','We make your content changes and keep software patched, backed up and monitored so small problems never become outages.',['Text, photo and page updates','Security and software updates','Daily backups','Uptime monitoring','Monthly performance check','Support by email']),
('ads','Ad campaigns','Google and social ads tuned to your budget','$300 setup + from $300 / month','Google Search, Google Maps and social ads sent to pages built to convert. Ad spend goes straight to the platforms from your own account.',['Campaign strategy and setup','Ad copy and creative','Conversion tracking','Landing page recommendations','Ongoing budget tuning','Plain-language monthly report']),
('seo','SEO and speed','Be found locally, load fast on phones','$75 per page','Help local customers find you and keep them from leaving a slow page.',['Keyword and competitor research','Google Business Profile setup','Page titles and descriptions','Image and code optimization','Core Web Vitals fixes','Local search listings']),
('shop','Online stores','Sell products with simple checkout','$600 setup + $200 per page','A store that is simple to run: add products, take payments and ship orders without a developer.',['Product catalog setup','Secure checkout and payments','Shipping and tax settings','Order emails','Inventory tools','Training for your team']),
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
    for i,(sid,t,tag,price,lead,items) in enumerate(SERVICES):
        lis=''.join(f'<li>{x}</li>' for x in items)
        out.append(f'''<div class="acc-item{" open" if i==0 else ""}" id="s-{sid}"><button class="acc-btn" type="button" aria-expanded="{"true" if i==0 else "false"}" aria-controls="p-{sid}"><h3>{t}</h3><span class="tag">{tag}</span><span class="acc-ico" aria-hidden="true"></span></button>
<div class="acc-panel" id="p-{sid}" role="region" aria-label="{t}"><div class="acc-inner"><div class="acc-body"><div class="acc-main"><p class="lead">{lead}</p><ul class="checks">{lis}</ul><div class="acc-foot"><span class="price">{price}</span><a class="btn primary sm" href="quote.html#{sid}">Quote this</a><a class="btn ghost sm" href="services.html#{sid}">Full details</a></div></div></div></div></div></div>''')
    out.append('</div>'); return ''.join(out)
def svc_html():
    out=[]
    for sid,t,tag,price,lead,items in SERVICES:
        lis=''.join(f'<li>{x}</li>' for x in items)
        out.append(f'''<article class="svc" id="{sid}"><div class="svc-side"><h2>{t}</h2><p class="price">{price}</p><div class="btns"><a class="btn primary sm" href="quote.html#{sid}">Quote this</a></div></div><div class="svc-main"><p class="lead">{lead}</p><ul class="checks">{lis}</ul></div></article>''')
    return ''.join(out)
def about_mark():
    return '<svg viewBox="0 0 48 50" role="img" aria-label="EastLineWebCo mark">'+L.MARK+'</svg>'
def load():
    pages={}
    for f in sorted(glob.glob(f'{SRC}/pages/*.html')):
        raw=open(f).read(); first,body=raw.split('\n',1); t,nav,desc=first.split('|')
        pages[os.path.basename(f)]=(t,nav,desc,body)
    return pages
def doc(name,t,nav,desc,body,inline,artifact_index):
    title='EastLineWebCo' if nav=='home' else f'{t} | EastLineWebCo'
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
        for a in ('styles.css','app.js','config.js','favicon.svg','apple-touch-icon.png','icon-192.png','icon-512.png'): shutil.copy(f'{SRC}/assets/{a}',f'{out}/assets/{a}')
        shutil.copytree('dist/logo',f'{out}/assets/logo',dirs_exist_ok=True)
        open(f'{out}/manifest.webmanifest','w').write('{"name":"EastLineWebCo","short_name":"EastLineWebCo","start_url":"/index.html","display":"browser","background_color":"#0A1020","theme_color":"#0A1020","icons":[{"src":"assets/icon-192.png","sizes":"192x192","type":"image/png"},{"src":"assets/icon-512.png","sizes":"512x512","type":"image/png"}]}')
        open(f'{out}/robots.txt','w').write('User-agent: *\nAllow: /\n')
for out in ('dist/site','dist/artifact'):
    shutil.copytree(f'{SRC}/samples',f'{out}/samples',dirs_exist_ok=True)
print('built')

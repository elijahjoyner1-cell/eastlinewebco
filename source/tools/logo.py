# Generates logo SVG pieces with text converted to outlines (no font dependency).
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
D='/usr/share/fonts/opentype/inter/InterDisplay-%s.otf'
def text_path(txt, weight, size, x, y, track=0.0):
    f=TTFont(D%weight); gs=f.getGlyphSet(); cmap=f.getBestCmap(); upm=f['head'].unitsPerEm; s=size/upm
    pen=SVGPathPen(gs, ntos=lambda v: ('%.2f'%v).rstrip('0').rstrip('.')); cx=x
    for ch in txt:
        g=cmap[ord(ch)]; tp=TransformPen(pen,(s,0,0,-s,cx,y)); gs[g].draw(tp); cx+=f['hmtx'][g][0]*s+track*size
    return pen.getCommands(), cx
MARK='<path d="M11 24a13 13 0 0 1 26 0z" fill="var(--warm,#FFB547)"/><rect x="4" y="27" width="40" height="4" rx="2" fill="currentColor"/><rect x="10" y="34" width="28" height="4" rx="2" fill="currentColor" opacity=".7"/><rect x="17" y="41" width="14" height="4" rx="2" fill="currentColor" opacity=".45"/>'
def lockup_parts():
    a,x1=text_path('EastLine','Bold',27,58,35,-0.01)
    b,x2=text_path('WebCo','Light',27,x1+1,35,-0.005)
    w=round(x2+2)
    return MARK,a,b,w
def header_svg():
    m,a,b,w=lockup_parts()
    return f'<svg class="logo-svg" viewBox="0 0 {w} 50" height="34" role="img" aria-label="EastLineWebCo">{m}<path d="{a}" fill="currentColor"/><path d="{b}" fill="currentColor" opacity=".72"/></svg>'
def file_svg(fg, sun, bg=None, mark_only=False):
    m,a,b,w=lockup_parts()
    m=m.replace('var(--warm,#FFB547)',sun).replace('currentColor',fg)
    if mark_only:
        inner=m; vb='0 0 48 50'; ww=48
    else:
        inner=m+f'<path d="{a}" fill="{fg}"/><path d="{b}" fill="{fg}" opacity=".72"/>'; vb=f'0 0 {w} 50'; ww=w
    pad=''
    if bg: pad=f'<rect x="-8" y="-8" width="{ww+16}" height="66" fill="{bg}"/>'; vb=f'-8 -8 {ww+16} 66'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">{pad}{inner}</svg>'
def favicon_svg():
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0A1020"/><g transform="translate(8 8) scale(.96)">'+MARK.replace('currentColor','#EAF0FB').replace('var(--warm,#FFB547)','#FFB547')+'</g></svg>'

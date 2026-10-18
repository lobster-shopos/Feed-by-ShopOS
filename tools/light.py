import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import math, random
W,H=900,1140
PAL=[(0.0,(20,60,255)),(0.25,(70,140,255)),(0.45,(190,215,255)),(0.55,(255,244,220)),(0.7,(255,170,70)),(0.85,(255,90,30)),(1.0,(200,30,40))]
def pal(t):
    t=max(0,min(1,t))
    for (a,ca),(b,cb) in zip(PAL,PAL[1:]):
        if t<=b:
            k=(t-a)/(b-a); return tuple(ca[i]+(cb[i]-ca[i])*k for i in range(3))
    return PAL[-1][1]
def base():
    y=np.linspace(0,1,H)[:,None]; x=np.linspace(0,1,W)[None,:]
    img=np.zeros((H,W,3))
    top=np.array([4,8,26]); bot=np.array([2,3,10])
    img+= top*(1-y)[...,None]+bot*y[...,None]
    return img
def streaks(seed, kind):
    rnd=random.Random(seed)
    img=base()
    acc=np.zeros((H,W,3))
    n=70
    for s in range(n):
        t=s/(n-1)
        col=pal((t+rnd.uniform(-.06,.06)))
        layer=Image.new('L',(W,H),0); d=ImageDraw.Draw(layer)
        pts=[]
        if kind=='fan':        # from a focal point fanning out to the lower left
            fx,fy=W*0.86,H*0.24
            ang=math.radians(135+t*95+rnd.uniform(-2,2)); L=1600
            for k in range(60):
                u=k/59; r=u*L; bend=math.sin(u*math.pi*.5)*rnd.uniform(-30,30)
                pts.append((fx+math.cos(ang)*r+bend, fy+math.sin(ang)*r))
        elif kind=='wave':     # vertical curtains bending
            x0=W*(0.05+t*0.9)
            for k in range(60):
                u=k/59; pts.append((x0+math.sin(u*math.pi*1.2+seed)*60*(1-abs(t-.5)), H*u*1.05-20))
        elif kind=='horizon':  # a horizon line that bends up on the right
            y0=H*0.50+ (t-.5)*120
            for k in range(80):
                u=k/79; xx=W*u; lift= (max(0,u-0.55)/0.45)**2.4*H*(0.45+t*0.5)
                pts.append((xx, y0-lift))
        elif kind=='burst':    # converging to a bright centre
            cx,cy=W*0.5,H*0.46
            ang=math.radians(t*360+rnd.uniform(-3,3)); 
            for k in range(50):
                u=k/49; r=6+u*900; tw=u*u*0.35*(1 if s%2 else -1)
                pts.append((cx+math.cos(ang+tw)*r, cy+math.sin(ang+tw)*r*1.15))
        elif kind=='sweep':    # one long sweep from bottom-left to top-right
            for k in range(70):
                u=k/69; xx=-60+u*(W+120); yy=H*(0.95-u*0.75)+ (t-.5)*520*(1-u*0.6)+math.sin(u*3+t*2)*18
                pts.append((xx,yy))
        w=rnd.choice([2,3,3,5,8,12])
        d.line(pts,fill=255,width=w,joint='curve')
        a=np.asarray(layer.filter(ImageFilter.GaussianBlur(1.2)),dtype=float)/255
        g1=np.asarray(layer.filter(ImageFilter.GaussianBlur(10)),dtype=float)/255
        g2=np.asarray(layer.filter(ImageFilter.GaussianBlur(36)),dtype=float)/255
        g3=np.asarray(layer.filter(ImageFilter.GaussianBlur(110)),dtype=float)/255
        inten=rnd.uniform(.25,.8)*({'horizon':.5,'wave':.75}.get(kind,1))
        m=(a*0.7+g1*1.2+g2*2.0+g3*5.0)*inten
        acc+=m[...,None]*np.array(col)[None,None,:]
    out=img+acc*0.42
    out=255*(1-np.exp(-out/255*1.15))   # soft tone map so whites bloom instead of clipping
    noise=np.random.default_rng(seed).normal(0,2.2,(H,W,1))
    out=np.clip(out+noise,0,255).astype(np.uint8)
    return Image.fromarray(out)
kinds=['fan','horizon','burst','sweep','wave']
for i,k in enumerate(kinds,1):
    streaks(7+i,k).save(f'light-{i}.jpg',quality=86,optimize=True); print(k)

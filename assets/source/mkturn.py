import sys
from PIL import Image
import numpy as np
from scipy import ndimage as ndi
def build(base_path, turn_path, out_path):
    base=np.asarray(Image.open(base_path).convert('RGB')).astype(float)
    turn=np.asarray(Image.open(turn_path).convert('RGB')).astype(float)
    h,w,_=turn.shape
    d=np.abs(turn-base).sum(2)
    lim=np.zeros((h,w),bool); lim[200:1024,440:1060]=True
    m=(d>30)&lim
    m=ndi.binary_opening(m,iterations=2)
    m=ndi.binary_closing(m,structure=np.ones((3,3)),iterations=12)
    m=ndi.binary_fill_holes(m)
    lab,n=ndi.label(m); sizes=ndi.sum(m,lab,range(1,n+1)); m=lab==(1+int(np.argmax(sizes)))
    m=ndi.binary_fill_holes(m)
    lum=turn.mean(2)
    bgsame=ndi.binary_opening((d<30)&(lum>85),iterations=2)
    m&=~bgsame
    # cover the back-view silhouette fully below the sky line; pull in slightly where it meets the sky
    dl=ndi.binary_dilation(m,iterations=4); er=ndi.binary_erosion(m,iterations=2)
    m=np.where(np.arange(m.shape[0])[:,None]<335, er, dl)
    # --- tone correction: measure base-vs-turn difference just outside the mask, spread it inward
    green=np.zeros((h,w),bool); green[322:560,352:1180]=True
    ring=ndi.binary_dilation(m,iterations=30)&~ndi.binary_dilation(m,iterations=2)&~green&(d<90)
    v=ring.astype(float)
    C=np.zeros_like(turn)
    for c in range(3):
        diff=(base[...,c]-turn[...,c])*v
        s1=ndi.gaussian_filter(diff,18); w1=ndi.gaussian_filter(v,18)
        s2=ndi.gaussian_filter(diff,80); w2=ndi.gaussian_filter(v,80)
        loc=s1/(w1+1e-6); glob=s2/(w2+1e-6)
        t=np.clip(w1/0.15,0,1)
        C[...,c]=t*loc+(1-t)*glob
    C=np.clip(C,-40,40)
    rgb=np.clip(turn+C,0,255)
    alpha=ndi.gaussian_filter(m.astype(float),1.6)
    r,g,b=rgb[...,0],rgb[...,1],rgb[...,2]
    tr,tg,tb=turn[...,0],turn[...,1],turn[...,2]
    reg=np.zeros((h,w),bool); reg[328:556,358:1174]=True
    dd=tg-np.maximum(tr,tb); key=np.ones((h,w)); key[reg]=1-np.clip((dd[reg]-50)/120,0,1)
    mx=np.maximum(r,b); g2=np.where(reg&(g>mx),mx,g)
    out=np.dstack([r,g2,b,alpha*key*255]).clip(0,255).astype(np.uint8)
    oi=Image.fromarray(out,'RGBA'); oi.save(out_path,quality=90,method=6)
    # seam metric on the boundary band
    comp=base*(1-alpha[...,None]*key[...,None])+rgb*(alpha[...,None]*key[...,None])
    band=ndi.binary_dilation(m,iterations=4)&~ndi.binary_erosion(m,iterations=4)&~green
    old=base*(1-alpha[...,None])+turn*alpha[...,None]
    print(out_path,'mean |C|',np.abs(C[m]).mean().round(2))
    return oi
build('src/day.png','src/turn.png','out/turn.webp')
build('src/morning.png','src/turn_morning.png','out/turn_morning.webp')

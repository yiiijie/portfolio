from PIL import Image
import numpy as np
from scipy import ndimage as ndi
def keyed(path):
    a=np.asarray(Image.open(path).convert('RGB')).astype(float)
    r,g,b=a[...,0],a[...,1],a[...,2]; h,w=g.shape
    reg=np.zeros((h,w),bool); reg[328:556,358:1174]=True
    dd=g-np.maximum(r,b); key=np.ones((h,w)); key[reg]=1-np.clip((dd[reg]-50)/120,0,1)
    mx=np.maximum(r,b); g2=np.where(reg&(g>mx),mx,g)
    return np.dstack([r,g2,b,key*255])
day=keyed('src/day.png'); mor=keyed('src/morning.png')
td=keyed('src/turn_cc.png'); tm=keyed('src/turn_morning_cc.png')
save=lambda arr,p,q=88: Image.fromarray(arr.clip(0,255).astype(np.uint8),'RGBA').save(p,quality=q,method=6)
save(td,'out/turn.webp'); save(tm,'out/turn_morning.webp')
h,w=day.shape[:2]
reg=np.zeros((h,w),bool); reg[320:562,350:1180]=True
hd=(td[...,3]<128)&(day[...,3]>128)&reg
hm=(tm[...,3]<128)&(mor[...,3]>128)&reg
H=ndi.gaussian_filter((ndi.binary_dilation(hd|hm,iterations=3)&reg).astype(float),1.0)
for name,arr in [('day',day),('morning',mor)]:
    a=arr[...,3]/255
    save(np.dstack([arr[...,:3],a*(1-H)*255]),f'out/{name}.webp',86)
    save(np.dstack([arr[...,:3],a*H*255]),f'out/hole_{name}.webp',90)
print('hole px',int((H>.5).sum()))

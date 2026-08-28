# -*- coding: utf-8 -*-
"""形象定制 v3：alpha 遮罩版
- 所有擦除/重绘都限制在身体轮廓(alpha)内部，杜绝白块越界
- 窗户图眼镜按实测坐标擦除（左镜(652,414) 右镜(741,380) r≈35-37，擦除半径48）
- 拉链缩短到衣摆以上
"""
from PIL import Image, ImageDraw, ImageChops

BLACK = (30, 30, 30, 255)
LINE = 5


def masked(img, fn):
    """在独立图层上绘制，再用原图 alpha 遮罩后合成（只影响轮廓内部）"""
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    fn(ImageDraw.Draw(layer))
    layer.putalpha(ImageChops.darker(layer.getchannel('A'), img.getchannel('A')))
    img.alpha_composite(layer)


def qbez(p0, p1, p2, n=24):
    return [((1-t)**2*p0[0] + 2*(1-t)*t*p1[0] + t**2*p2[0],
             (1-t)**2*p0[1] + 2*(1-t)*t*p1[1] + t**2*p2[1])
            for t in [i/n for i in range(n+1)]]


def draw_smooth(d, pts, outline=BLACK, width=LINE, fill=None):
    if fill:
        d.polygon(pts, fill=fill)
    d.line(pts + [pts[0]], fill=outline, width=width, joint='curve')


# ================= 帧（全身 1024x1024）=================
def edit_frame(src, dst, debug=None):
    img = Image.open(src).convert('RGBA')
    fill = (253, 253, 253, 255)

    # ---- 1. 擦除：眼镜 + 项链（遮罩内）----
    def erase(d):
        d.ellipse((474-38, 127-38, 474+38, 127+38), fill=fill)
        d.ellipse((542-38, 124-38, 542+38, 124+38), fill=fill)
        d.rectangle((497, 105, 519, 148), fill=fill)
        d.line((450, 126, 408, 118), fill=fill, width=14)
        d.line((568, 122, 608, 113), fill=fill, width=14)
        d.polygon([(497, 222), (523, 222), (556, 228), (572, 248), (574, 300),
                   (566, 322), (418, 322), (410, 290), (435, 266), (462, 246)], fill=fill)
    masked(img, erase)

    # ---- 2. 重绘（遮罩内）：眼睛/脖子/肩线/卫衣/拉链 ----
    def redraw(d):
        for cx, cy in [(474, 127), (542, 124)]:
            d.ellipse((cx-13, cy-13, cx+13, cy+13), outline=BLACK, width=4)
            d.ellipse((cx-6, cy-6, cx+6, cy+6), fill=BLACK)
        d.line((494, 208, 492, 240), fill=BLACK, width=4)
        d.line((524, 206, 526, 238), fill=BLACK, width=4)
        d.line([(497, 220), (478, 234), (462, 249), (435, 268), (405, 288), (391, 303)],
               fill=BLACK, width=LINE, joint='curve')
        d.line([(523, 218), (551, 237), (570, 252)], fill=BLACK, width=LINE, joint='curve')
        band = qbez((447, 256), (511, 272), (575, 254)) + qbez((447, 272), (511, 290), (575, 268))[::-1]
        draw_smooth(d, band, fill=fill)
        d.line((474, 276, 469, 302), fill=BLACK, width=3)
        d.ellipse((463, 300, 475, 312), outline=BLACK, width=3)
        d.line((548, 274, 553, 300), fill=BLACK, width=3)
        d.ellipse((547, 298, 559, 310), outline=BLACK, width=3)
        d.line((508, 292, 507, 540), fill=BLACK, width=3)
        d.line((515, 292, 516, 540), fill=BLACK, width=3)
        d.rounded_rectangle((503, 284, 520, 300), radius=3, outline=BLACK, width=3)
    masked(img, redraw)

    if debug:
        img.crop((350, 20, 680, 360)).resize((660, 680)).save(debug + '_head.png')
        img.crop((350, 180, 680, 620)).resize((660, 880)).save(debug + '_torso.png')
    img.save(dst)


# ================= 窗户图（半身 1024x1024，头倾斜）=================
def edit_window(src, dst, debug=None):
    img = Image.open(src).convert('RGBA')
    fill = (252, 252, 252, 255)

    # ---- 1. 擦除：眼镜（实测左镜(652,414) 右镜(741,380) r≈37）+ 项链 ----
    # 多边形上边界绕开下巴轮廓(y498-508)和右侧发梢，覆盖前胸项链区(y502-654)
    def erase(d):
        d.ellipse((652-48, 414-48, 652+48, 414+48), fill=fill)
        d.ellipse((741-48, 380-48, 741+48, 380+48), fill=fill)
        d.rectangle((680, 390, 716, 420), fill=fill)          # 鼻梁
        d.line((608, 415, 592, 420), fill=fill, width=12)     # 左镜腿
        d.line((778, 379, 798, 377), fill=fill, width=12)     # 右镜腿（不到发际）
        d.polygon([(645, 502), (718, 502), (718, 510), (752, 514), (770, 512),
                   (800, 502), (838, 508), (842, 568), (838, 654), (648, 654)],
                  fill=fill)
    masked(img, erase)

    # ---- 2. 重绘（遮罩内）----
    def redraw(d):
        for cx, cy in [(652, 414), (741, 380)]:
            d.ellipse((cx-13, cy-13, cx+13, cy+13), outline=BLACK, width=4)
            d.ellipse((cx-6, cy-6, cx+6, cy+6), fill=BLACK)
        # 脖子
        d.line((728, 505, 726, 540), fill=BLACK, width=4)
        d.line((767, 492, 768, 513), fill=BLACK, width=4)
        # 左肩线（上接脖子，下端接回原衣袖轮廓）
        d.line([(729, 510), (700, 548), (675, 568), (658, 590), (650, 610),
                (658, 635), (666, 656)],
               fill=BLACK, width=LINE, joint='curve')
        # 连帽卫衣：厚帽领（充弧内缘/外缘 + 中缝线）
        inner = qbez((690, 552), (768, 568), (845, 502))
        outer = qbez((658, 625), (755, 645), (852, 562))
        draw_smooth(d, inner + outer[::-1], fill=fill)
        d.line(qbez((674, 588), (762, 606), (848, 532)), fill=BLACK, width=3, joint='curve')
        # 帽绳（从领内缘垂下，穿过帽领）
        d.line((722, 565, 716, 640), fill=BLACK, width=3)
        d.ellipse((709, 638, 723, 652), outline=BLACK, width=3)
        d.line((795, 545, 801, 600), fill=BLACK, width=3)
        d.ellipse((794, 598, 808, 612), outline=BLACK, width=3)
        # 拉链（从帽领外缘中央露出，向下至衣摆上方）
        d.rounded_rectangle((742, 628, 760, 646), radius=3, outline=BLACK, width=3)
        d.line((748, 640, 757, 948), fill=BLACK, width=3)
        d.line((755, 640, 764, 948), fill=BLACK, width=3)
    masked(img, redraw)

    if debug:
        img.crop((550, 330, 900, 660)).resize((700, 660)).save(debug + '_whead.png')
        img.crop((620, 460, 1024, 1024)).resize((606, 846)).save(debug + '_wtorso.png')
    img.save(dst)


import os
os.makedirs('Material/frames_new', exist_ok=True)

edit_window('textures/entrance/avatar_window.webp', 'Material/debug/window_v3.webp', 'Material/debug/win3')

for i in range(1, 10):
    edit_frame(f'textures/corridor/avatar_anim/{i}.webp', f'Material/frames_new/{i}.webp')
edit_frame('textures/corridor/avatar_anim/1.webp', 'Material/debug/frame1_v3.webp', 'Material/debug/v3')

grid = Image.new('RGBA', (330 * 3, 360), (40, 40, 40, 255))
for col, idx in enumerate([1, 5, 9]):
    im = Image.open(f'Material/frames_new/{idx}.webp').convert('RGBA')
    grid.paste(im.crop((350, 0, 680, 360)), (col * 330, 0))
grid.save('Material/debug/grid_verify.png')
print('done')

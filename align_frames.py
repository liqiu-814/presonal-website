# -*- coding: utf-8 -*-
"""纯PIL计算每帧相对帧1的偏移量"""
from PIL import Image, ImageChops
import sys

f1 = Image.open('textures/corridor/avatar_anim/1.webp').convert('L')
tpl = f1.crop((480, 150, 550, 210))  # 鼻子+嘴区域

offsets = {}
for i in range(1, 10):
    fn = Image.open(f'textures/corridor/avatar_anim/{i}.webp').convert('L')
    best = (1e18, 0, 0)
    for dy in range(-14, 15):
        for dx in range(-14, 15):
            region = fn.crop((480+dx, 150+dy, 550+dx, 210+dy))
            diff = ImageChops.difference(region, tpl)
            score = sum(diff.histogram()[1:])  # 非零差异总量
            if score < best[0]:
                best = (score, dx, dy)
    offsets[i] = (best[1], best[2])
    print(f'frame {i}: dx={best[1]}, dy={best[2]} (score={best[0]})')

print(offsets)

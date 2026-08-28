# -*- coding: utf-8 -*-
"""对比9帧差异区域 + 输出第5帧肩部裁剪"""
from PIL import Image, ImageChops

f1 = Image.open('textures/corridor/avatar_anim/1.webp').convert('RGBA')
for i in range(2, 10):
    fx = Image.open(f'textures/corridor/avatar_anim/{i}.webp').convert('RGBA')
    diff = ImageChops.difference(f1, fx)
    bbox = diff.getbbox()
    print(f'frame {i} vs 1 diff bbox: {bbox}')

# 第5帧肩部
f5 = Image.open('textures/corridor/avatar_anim/5.webp').convert('RGBA')
f5.crop((520, 180, 700, 360)).resize((540, 540)).save('Material/debug/f5_shoulder.png')
f9 = Image.open('textures/corridor/avatar_anim/9.webp').convert('RGBA')
f9.crop((520, 180, 700, 360)).resize((540, 540)).save('Material/debug/f9_shoulder.png')
print('done')

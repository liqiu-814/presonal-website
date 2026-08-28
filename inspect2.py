# -*- coding: utf-8 -*-
"""检查原图肩膀轮廓 + 采样身体填充色"""
from PIL import Image

img = Image.open('textures/corridor/avatar_anim/1.webp').convert('RGBA')
# 肩膀区域放大
img.crop((390, 210, 520, 340)).resize((520, 520)).save('Material/debug/orig_lshoulder.png')
img.crop((530, 200, 660, 330)).resize((520, 520)).save('Material/debug/orig_rshoulder.png')

# 采样身体内部填充色（多处）
for pt in [(500, 400), (480, 300), (540, 350), (460, 450), (700, 700), (510, 150)]:
    print(pt, img.getpixel(pt))

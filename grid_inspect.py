# -*- coding: utf-8 -*-
"""在原图上叠加50px网格，精确测量窗户图坐标"""
from PIL import Image, ImageDraw

img = Image.open('textures/entrance/avatar_window.webp').convert('RGBA')
# 黑底衬托
bg = Image.new('RGBA', img.size, (40, 40, 40, 255))
bg.alpha_composite(img)
d = ImageDraw.Draw(bg)
for x in range(0, 1024, 50):
    d.line((x, 0, x, 1024), fill=(255, 0, 0, 120), width=1)
    d.text((x + 2, 2), str(x), fill=(255, 80, 80, 255))
for y in range(0, 1024, 50):
    d.line((0, y, 1024, y), fill=(255, 0, 0, 120), width=1)
    d.text((2, y + 2), str(y), fill=(255, 80, 80, 255))
# 关键区域裁剪输出
bg.crop((550, 330, 900, 660)).resize((700, 660)).save('Material/debug/grid_face_neck.png')
bg.crop((620, 480, 1024, 760)).resize((808, 560)).save('Material/debug/grid_shoulder.png')
print('done')

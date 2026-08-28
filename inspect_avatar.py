from PIL import Image
import os

os.makedirs('Material/debug', exist_ok=True)

# 帧1 (全身) 和窗户图
img1 = Image.open('textures/corridor/avatar_anim/1.webp').convert('RGBA')
imgw = Image.open('textures/entrance/avatar_window.webp').convert('RGBA')
print('frame size:', img1.size, 'window size:', imgw.size)

# 帧1: 头部区域放大
img1.crop((350, 20, 680, 320)).resize((660, 600)).save('Material/debug/f1_head.png')
# 帧1: 领口/上身区域
img1.crop((350, 180, 680, 560)).resize((660, 760)).save('Material/debug/f1_torso.png')

# 窗户图: 头部区域
imgw.crop((520, 220, 900, 560)).resize((760, 680)).save('Material/debug/w_head.png')
# 窗户图: 上身
imgw.crop((520, 450, 1024, 1024)).resize((756, 858)).save('Material/debug/w_torso.png')
print('done')

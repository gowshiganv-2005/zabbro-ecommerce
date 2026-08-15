import os
from PIL import Image, ImageDraw

def draw_logo_glyph_z(draw, stroke, color, x0, y0, w, h):
    draw.line([(x0, y0), (x0 + w, y0)], fill=color, width=stroke)
    draw.line([(x0 + w, y0), (x0, y0 + h)], fill=color, width=stroke)
    draw.line([(x0, y0 + h), (x0 + w, y0 + h)], fill=color, width=stroke)

def draw_logo_glyph_a(draw, stroke, color, x0, y0, w, h):
    draw.line([(x0, y0 + h), (x0 + w/2.0, y0)], fill=color, width=stroke)
    draw.line([(x0 + w/2.0, y0), (x0 + w, y0 + h)], fill=color, width=stroke)

def draw_logo_glyph_b(draw, stroke, color, x0, y0, w, h):
    r = h / 4.0
    draw.line([(x0, y0), (x0 + w - r, y0)], fill=color, width=stroke)
    draw.arc([x0 + w - 2*r, y0, x0 + w, y0 + 2*r], start=270, end=90, fill=color, width=stroke)
    draw.line([(x0, y0 + 2*r), (x0 + w - r, y0 + 2*r)], fill=color, width=stroke)
    draw.arc([x0 + w - 2*r, y0 + 2*r, x0 + w, y0 + 4*r], start=270, end=90, fill=color, width=stroke)
    draw.line([(x0, y0 + 4*r), (x0 + w - r, y0 + 4*r)], fill=color, width=stroke)

def draw_logo_glyph_r(draw, stroke, color, x0, y0, w, h):
    r = h / 4.0
    draw.line([(x0, y0), (x0, y0 + h)], fill=color, width=stroke)
    draw.line([(x0, y0), (x0 + w - r, y0)], fill=color, width=stroke)
    draw.arc([x0 + w - 2*r, y0, x0 + w, y0 + 2*r], start=270, end=90, fill=color, width=stroke)
    draw.line([(x0, y0 + 2*r), (x0 + w - r, y0 + 2*r)], fill=color, width=color and stroke)
    draw.line([(x0, y0 + 2*r), (x0 + w*0.5, y0 + 2*r)], fill=color, width=stroke)
    draw.line([(x0 + w*0.5, y0 + 2*r), (x0 + w, y0 + h)], fill=color, width=stroke)

def draw_logo_glyph_o(draw, stroke, color, x0, y0, w, h):
    draw.ellipse([x0, y0, x0 + w, y0 + h], outline=color, width=stroke)

def draw_exact_zabbro_full_logo(draw, stroke, color, x_center, y_center, canvas_w, scale=1.0):
    w_z = 55 * scale
    w_a = 55 * scale
    w_b = 40 * scale
    w_r = 40 * scale
    w_o = 55 * scale
    gap = 22 * scale
    h = 70 * scale
    
    total_w = w_z + gap + w_a + gap + w_b + gap + w_b + gap + w_r + gap + w_o
    x0 = x_center - total_w / 2.0
    y0 = y_center - h / 2.0
    
    draw_logo_glyph_z(draw, int(stroke), color, x0, y0, w_z, h)
    x0 += w_z + gap
    draw_logo_glyph_a(draw, int(stroke), color, x0, y0, w_a, h)
    x0 += w_a + gap
    draw_logo_glyph_b(draw, int(stroke), color, x0, y0, w_b, h)
    x0 += w_b + gap
    draw_logo_glyph_b(draw, int(stroke), color, x0, y0, w_b, h)
    x0 += w_b + gap
    draw_logo_glyph_r(draw, int(stroke), color, x0, y0, w_r, h)
    x0 += w_r + gap
    draw_logo_glyph_o(draw, int(stroke), color, x0, y0, w_o, h)

def generate_exact_favicons(out_dir):
    os.makedirs(out_dir, exist_ok=True)
    
    # Render high-res image of full ZABBRO logo
    base_w, base_h = 1024, 512
    img = Image.new("RGBA", (base_w, base_h), (0, 0, 0, 0)) # transparent background
    draw = ImageDraw.Draw(img)
    draw_exact_zabbro_full_logo(draw, stroke=16, color=(15, 23, 42, 255), x_center=base_w/2.0, y_center=base_h/2.0, canvas_w=base_w, scale=1.7)
    
    # Save standard favicons containing the exact full ZABBRO logo
    # Square cropped container with dark background for favicon tabs
    sq_size = 512
    img_sq = Image.new("RGBA", (sq_size, sq_size), (15, 23, 42, 255)) # sleek dark
    draw_sq = ImageDraw.Draw(img_sq)
    draw_exact_zabbro_full_logo(draw_sq, stroke=14, color=(255, 255, 255, 255), x_center=sq_size/2.0, y_center=sq_size/2.0, canvas_w=sq_size, scale=0.85)
    
    img_sq.save(os.path.join(out_dir, "android-chrome-512x512.png"))
    
    img_192 = img_sq.resize((192, 192), Image.Resampling.LANCZOS)
    img_192.save(os.path.join(out_dir, "android-chrome-192x192.png"))
    
    img_180 = img_sq.resize((180, 180), Image.Resampling.LANCZOS)
    img_180.save(os.path.join(out_dir, "apple-touch-icon.png"))
    
    img_32 = img_sq.resize((32, 32), Image.Resampling.LANCZOS)
    img_32.save(os.path.join(out_dir, "favicon-32x32.png"))
    
    img_16 = img_sq.resize((16, 16), Image.Resampling.LANCZOS)
    img_16.save(os.path.join(out_dir, "favicon-16x16.png"))
    
    img_sq.save(os.path.join(out_dir, "favicon.ico"), format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    
    print("Exact ZABBRO full logo favicons generated successfully!")

if __name__ == "__main__":
    generate_exact_favicons("public")

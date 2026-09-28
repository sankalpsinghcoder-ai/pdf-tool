import os
from PIL import Image, ImageDraw, ImageFont

def get_font(size, bold=False):
    font_names = ["arialbd.ttf" if bold else "arial.ttf", "segoeuib.ttf" if bold else "segoeui.ttf", "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"]
    for fn in font_names:
        try:
            return ImageFont.truetype(fn, size)
        except Exception:
            continue
    return ImageFont.load_default()

def draw_rounded_rect(draw, bbox, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

def generate_app_icon(size):
    # Create high-res master then resize with LANCZOS for crystal clear rendering
    scale = 2 if size < 256 else 1
    canvas_size = size * scale
    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background rounded rect
    margin = int(canvas_size * 0.06)
    radius = int(canvas_size * 0.22)
    # FixMyPDF Brand Red Gradient simulated with rounded rect and border
    bg_color = (229, 50, 45, 255) # #E5322D
    border_color = (204, 44, 40, 255)
    draw_rounded_rect(draw, [margin, margin, canvas_size - margin, canvas_size - margin], radius, fill=bg_color, outline=border_color, width=max(1, int(canvas_size * 0.02)))
    
    # White document sheet
    doc_left = int(canvas_size * 0.26)
    doc_top = int(canvas_size * 0.20)
    doc_right = int(canvas_size * 0.74)
    doc_bottom = int(canvas_size * 0.80)
    doc_corner_r = int(canvas_size * 0.06)
    
    draw_rounded_rect(draw, [doc_left, doc_top, doc_right, doc_bottom], doc_corner_r, fill=(255, 255, 255, 255))
    
    # Folded corner at top right of doc
    fold_size = int(canvas_size * 0.14)
    # Fold triangle background (simulate corner fold)
    draw.polygon([
        (doc_right - fold_size, doc_top),
        (doc_right, doc_top + fold_size),
        (doc_right - fold_size, doc_top + fold_size)
    ], fill=(226, 232, 240, 255))
    
    # Red badge inside document
    badge_top = int(canvas_size * 0.44)
    badge_bottom = int(canvas_size * 0.62)
    draw_rounded_rect(draw, [doc_left + int(canvas_size * 0.04), badge_top, doc_right - int(canvas_size * 0.04), badge_bottom], int(canvas_size * 0.03), fill=(229, 50, 45, 255))
    
    # Text "PDF" inside badge
    pdf_font_size = int(canvas_size * 0.13)
    font = get_font(pdf_font_size, bold=True)
    text = "PDF"
    bbox = draw.textbbox((0, 0), text, font=font)
    t_w = bbox[2] - bbox[0]
    t_h = bbox[3] - bbox[1]
    t_x = (canvas_size - t_w) // 2
    t_y = badge_top + (badge_bottom - badge_top - t_h) // 2 - int(canvas_size * 0.015)
    draw.text((t_x, t_y), text, font=font, fill=(255, 255, 255, 255))
    
    # Subtle document lines
    line_color = (203, 213, 225, 255)
    line_w = max(1, int(canvas_size * 0.025))
    draw.rounded_rectangle([doc_left + int(canvas_size * 0.08), int(canvas_size * 0.32), doc_right - int(canvas_size * 0.18), int(canvas_size * 0.32) + line_w], radius=2, fill=line_color)
    draw.rounded_rectangle([doc_left + int(canvas_size * 0.08), int(canvas_size * 0.69), doc_right - int(canvas_size * 0.08), int(canvas_size * 0.69) + line_w], radius=2, fill=line_color)
    draw.rounded_rectangle([doc_left + int(canvas_size * 0.08), int(canvas_size * 0.74), doc_right - int(canvas_size * 0.14), int(canvas_size * 0.74) + line_w], radius=2, fill=line_color)
    
    if scale != 1:
        img = img.resize((size, size), Image.Resampling.LANCZOS)
    return img

def generate_og_image(width, height):
    # Sleek modern dark-mode banner with FixMyPDF brand styling
    img = Image.new("RGBA", (width, height), (15, 23, 42, 255)) # #0F172A slate-900
    draw = ImageDraw.Draw(img)
    
    # Subtle glowing radial or linear gradient effect in top-right and bottom-left
    # Draw decorative soft glow circles
    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse([width - 350, -100, width + 250, 450], fill=(229, 50, 45, 35)) # Red glow
    glow_draw.ellipse([-150, height - 350, 400, height + 200], fill=(59, 130, 246, 30)) # Blue glow
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)
    
    # Top badge: "100% PRIVATE • CLIENT-SIDE • NO SERVER UPLOADS"
    badge_text = "SECURE & CLIENT-SIDE • 100% PRIVATE • NO SERVER UPLOADS"
    badge_font = get_font(int(height * 0.038), bold=True)
    b_bbox = draw.textbbox((0, 0), badge_text, font=badge_font)
    b_w = b_bbox[2] - b_bbox[0]
    b_h = b_bbox[3] - b_bbox[1]
    b_pad_x = 24
    b_pad_y = 10
    b_x = 80
    b_y = int(height * 0.12)
    draw_rounded_rect(draw, [b_x, b_y, b_x + b_w + b_pad_x * 2, b_y + b_h + b_pad_y * 2], radius=14, fill=(30, 41, 59, 230), outline=(229, 50, 45, 180), width=2)
    draw.text((b_x + b_pad_x, b_y + b_pad_y - 2), badge_text, font=badge_font, fill=(255, 107, 107, 255))
    
    # Main Brand Header: FixMyPDF
    title_font = get_font(int(height * 0.13), bold=True)
    t1 = "FixMy"
    t2 = "PDF"
    t1_bbox = draw.textbbox((0, 0), t1, font=title_font)
    t2_bbox = draw.textbbox((0, 0), t2, font=title_font)
    
    t_y = int(height * 0.28)
    draw.text((80, t_y), t1, font=title_font, fill=(255, 255, 255, 255))
    draw.text((80 + (t1_bbox[2] - t1_bbox[0]), t_y), t2, font=title_font, fill=(229, 50, 45, 255))
    
    # Main Subtitle / Value Proposition
    sub_font = get_font(int(height * 0.06), bold=True)
    sub_text = "Every Tool You Need to Fix, Convert & Edit PDFs."
    draw.text((80, int(height * 0.47)), sub_text, font=sub_font, fill=(241, 245, 249, 255))
    
    desc_font = get_font(int(height * 0.042), bold=False)
    desc_text = "Merge • Split • Compress • PDF to Word • JPG/PNG • Rotate • OCR • Watermark"
    draw.text((80, int(height * 0.58)), desc_text, font=desc_font, fill=(148, 163, 184, 255))
    
    # Feature Pills / Trust Badges at bottom
    pills = ["⚡ Lightning Fast", "🔒 Zero Data Logging", "🌐 10+ Languages", "💯 100% Free Forever"]
    pill_font = get_font(int(height * 0.034), bold=True)
    pill_x = 80
    pill_y = int(height * 0.74)
    for p in pills:
        p_bbox = draw.textbbox((0, 0), p, font=pill_font)
        pw = p_bbox[2] - p_bbox[0]
        ph = p_bbox[3] - p_bbox[1]
        draw_rounded_rect(draw, [pill_x, pill_y, pill_x + pw + 28, pill_y + ph + 18], radius=10, fill=(30, 41, 59, 200), outline=(51, 65, 85, 255), width=1)
        draw.text((pill_x + 14, pill_y + 8), p, font=pill_font, fill=(226, 232, 240, 255))
        pill_x += pw + 44
        if pill_x > width - 150:
            break
            
    # Right-hand side illustration icon (512 app icon stamped onto the canvas)
    icon_dim = int(height * 0.52)
    icon_img = generate_app_icon(icon_dim)
    icon_x = width - icon_dim - int(width * 0.07)
    icon_y = int(height * 0.24)
    img.paste(icon_img, (icon_x, icon_y), icon_img)
    
    # Subtle border around entire image
    border_draw = ImageDraw.Draw(img)
    border_draw.rectangle([0, 0, width - 1, height - 1], outline=(51, 65, 85, 120), width=1)
    
    return img

def main():
    assets_dir = os.path.dirname(os.path.abspath(__file__))
    os.makedirs(assets_dir, exist_ok=True)
    print(f"Generating assets in {assets_dir}...")
    
    # 1. og-image-1200x630.png
    og_1200 = generate_og_image(1200, 630)
    og_1200.save(os.path.join(assets_dir, "og-image-1200x630.png"), "PNG", optimize=True)
    print("[OK] og-image-1200x630.png")
    
    # 2. og-image-600x315.png
    og_600 = og_1200.resize((600, 315), Image.Resampling.LANCZOS)
    og_600.save(os.path.join(assets_dir, "og-image-600x315.png"), "PNG", optimize=True)
    print("[OK] og-image-600x315.png")
    
    # 3. icon-512x512.png
    icon_512 = generate_app_icon(512)
    icon_512.save(os.path.join(assets_dir, "icon-512x512.png"), "PNG", optimize=True)
    print("[OK] icon-512x512.png")
    
    # 4. icon-192x192.png
    icon_192 = icon_512.resize((192, 192), Image.Resampling.LANCZOS)
    icon_192.save(os.path.join(assets_dir, "icon-192x192.png"), "PNG", optimize=True)
    print("[OK] icon-192x192.png")
    
    # 5. apple-touch-icon.png (180x180)
    apple_icon = icon_512.resize((180, 180), Image.Resampling.LANCZOS)
    apple_icon.save(os.path.join(assets_dir, "apple-touch-icon.png"), "PNG", optimize=True)
    print("[OK] apple-touch-icon.png")
    
    # 6. favicon-32x32.png
    fav_32 = icon_512.resize((32, 32), Image.Resampling.LANCZOS)
    fav_32.save(os.path.join(assets_dir, "favicon-32x32.png"), "PNG", optimize=True)
    print("[OK] favicon-32x32.png")
    
    # 7. favicon-16x16.png
    fav_16 = icon_512.resize((16, 16), Image.Resampling.LANCZOS)
    fav_16.save(os.path.join(assets_dir, "favicon-16x16.png"), "PNG", optimize=True)
    print("[OK] favicon-16x16.png")
    
    # 8. favicon.ico
    fav_48 = icon_512.resize((48, 48), Image.Resampling.LANCZOS)
    icon_512.save(
        os.path.join(assets_dir, "favicon.ico"),
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)]
    )
    # Also save favicon.ico in root for root path browser requests
    root_dir = os.path.dirname(assets_dir)
    icon_512.save(
        os.path.join(root_dir, "favicon.ico"),
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)]
    )
    print("[OK] favicon.ico (assets and root)")
    
    print("All assets successfully generated!")

if __name__ == "__main__":
    main()

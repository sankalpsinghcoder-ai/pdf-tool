import os

BASE_URL = "https://sankalpsinghcoder-ai.github.io/pdf-tool/"

PAGES = [
    {
        "path": "",
        "priority": "1.0",
        "title": "FixMyPDF - 100% Free, Private & Offline PDF Tools",
        "caption": "Every tool you need to fix, merge, split, compress, and convert PDFs offline with zero file uploads."
    },
    {
        "path": "merge-pdf.html",
        "priority": "0.95",
        "title": "Merge PDF Online Free - Combine PDF Files Offline",
        "caption": "Combine multiple PDF files into one unified document securely."
    },
    {
        "path": "split-pdf.html",
        "priority": "0.90",
        "title": "Split PDF Online Free - Extract Pages Offline",
        "caption": "Extract pages or divide one PDF into multiple files."
    },
    {
        "path": "compress-pdf.html",
        "priority": "0.95",
        "title": "Compress PDF Online Free - Reduce PDF File Size",
        "caption": "Reduce file size while maintaining good quality."
    },
    {
        "path": "pdf-to-word.html",
        "priority": "0.95",
        "title": "Convert PDF to Word Free - Editable DOCX Offline",
        "caption": "Convert PDF documents to editable Word files."
    },
    {
        "path": "word-to-pdf.html",
        "priority": "0.90",
        "title": "Convert Word to PDF Free - DOC & DOCX to PDF",
        "caption": "Convert DOC, DOCX files to PDF with preserved formatting."
    },
    {
        "path": "pdf-to-jpg.html",
        "priority": "0.90",
        "title": "Convert PDF to JPG Free - High Resolution Images",
        "caption": "Convert each PDF page into a high-quality JPG image."
    },
    {
        "path": "jpg-to-pdf.html",
        "priority": "0.90",
        "title": "Convert JPG to PDF Free - Combine Images into PDF",
        "caption": "Convert images to PDF. Combine multiple images into one document."
    },
    {
        "path": "pdf-to-png.html",
        "priority": "0.85",
        "title": "Convert PDF to PNG Free - Transparent HD Images",
        "caption": "Convert PDF pages to high-quality PNG images with transparent background support."
    },
    {
        "path": "png-to-pdf.html",
        "priority": "0.85",
        "title": "Convert PNG to PDF Free - High Quality PDF from PNG",
        "caption": "Convert PNG images to PDF. Preserves transparency and quality."
    },
    {
        "path": "excel-to-pdf.html",
        "priority": "0.85",
        "title": "Convert Excel to PDF Free - XLS & XLSX to PDF",
        "caption": "Convert Excel spreadsheets to clean PDF document tables instantly."
    },
    {
        "path": "rotate-pdf.html",
        "priority": "0.85",
        "title": "Rotate PDF Pages Free - Permanent PDF Rotation",
        "caption": "Rotate single pages, precise ranges, or entire files seamlessly."
    },
    {
        "path": "delete-pdf.html",
        "priority": "0.85",
        "title": "Delete PDF Pages Free - Remove Pages from PDF",
        "caption": "Selectively strip out unwanted layouts, individual segments, or ranges easily."
    },
    {
        "path": "reorder-pdf.html",
        "priority": "0.85",
        "title": "Reorder PDF Pages Free - Rearrange & Sort Pages",
        "caption": "Rearrange, move, or sort your document layout structure with drag actions or click markers."
    },
    {
        "path": "add-page-numbers.html",
        "priority": "0.80",
        "title": "Add Page Numbers to PDF Free - Number PDF Pages",
        "caption": "Automatically insert page numbers with custom position and format."
    },
    {
        "path": "add-watermark.html",
        "priority": "0.80",
        "title": "Add Watermark to PDF Free - Stamp Text or Image",
        "caption": "Stamp a text or image watermark onto your PDF."
    },
    {
        "path": "crop-pdf.html",
        "priority": "0.80",
        "title": "Crop PDF Margins Free - Trim PDF Pages Online",
        "caption": "Crop margins or specific areas of PDF pages visually."
    }
]

LOCALES = [
    ("x-default", ""),
    ("en", "?lang=en"),
    ("pt-BR", "?lang=pt-BR"),
    ("id-ID", "?lang=id"),
    ("de-DE", "?lang=de"),
    ("es-MX", "?lang=es-MX"),
    ("fr-FR", "?lang=fr"),
    ("fil-PH", "?lang=fil"),
    ("ja-JP", "?lang=ja"),
    ("ru-RU", "?lang=ru"),
    ("es-ES", "?lang=es-ES"),
    ("vi-VN", "?lang=vi")
]

def generate_sitemap(output_path):
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml"',
        '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'
    ]

    for p in PAGES:
        canonical_url = f"{BASE_URL}{p['path']}"
        lines.append("  <url>")
        lines.append(f"    <loc>{canonical_url}</loc>")
        lines.append("    <lastmod>2026-09-28</lastmod>")
        lines.append("    <changefreq>weekly</changefreq>")
        lines.append(f"    <priority>{p['priority']}</priority>")

        # Multilingual hreflangs
        for lang_code, param in LOCALES:
            target_url = f"{canonical_url}{param}"
            lines.append(f'    <xhtml:link rel="alternate" hreflang="{lang_code}" href="{target_url}"/>')

        # Google Image tag
        clean_title = p['title'].replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        clean_caption = p['caption'].replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        lines.append("    <image:image>")
        lines.append(f"      <image:loc>{BASE_URL}assets/og-image-1200x630.png</image:loc>")
        lines.append(f"      <image:title>{clean_title}</image:title>")
        lines.append(f"      <image:caption>{clean_caption}</image:caption>")
        lines.append("    </image:image>")

        lines.append("  </url>")

    lines.append("</urlset>")

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print(f"[OK] sitemap.xml generated ({len(PAGES)} URLs)")

def generate_robots(output_path):
    robots_content = f"""User-agent: *
Allow: /

# Canonical Sitemaps
Sitemap: {BASE_URL}sitemap.xml
"""
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(robots_content)
    print("[OK] robots.txt generated")

def main():
    base_dir = r"c:\Users\ASUS\.gemini\antigravity\scratch\pdf-tool"
    generate_sitemap(os.path.join(base_dir, "sitemap.xml"))
    generate_robots(os.path.join(base_dir, "robots.txt"))

if __name__ == "__main__":
    main()

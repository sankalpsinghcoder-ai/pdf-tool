import os
import re

TOOLS_CONFIG = {
    "merge-pdf.html": {
        "tool_id": "merge",
        "title": "Merge PDF Online Free - Combine PDF Files Offline & Securely | FixMyPDF",
        "desc": "Combine multiple PDF files into a single unified document in seconds. 100% free, private, and client-side processing with zero file uploads.",
        "keywords": "merge pdf, combine pdf, join pdf, merge pdf online free, juntar pdf, unir pdf, fusionner pdf, gabungkan pdf, offline pdf merge",
        "howto_name": "How to Merge PDF Files Online for Free",
        "step1": "Select or drag and drop multiple PDF files into the merge tool.",
        "step2": "Reorder or arrange the files in your desired document sequence.",
        "step3": "Click 'Merge PDFs' to combine the files and download your single merged PDF instantly.",
        "faq1_q": "How does FixMyPDF merge PDF files without uploading them?",
        "faq1_a": "FixMyPDF utilizes WebAssembly and client-side JavaScript to read and assemble PDF binary streams directly in your browser memory. Your files never get uploaded to any cloud server.",
        "faq2_q": "Is there any limit to how many PDF files I can merge?",
        "faq2_a": "No. You can merge as many PDF files as your local computer or phone memory can handle, completely free and without watermarks."
    },
    "split-pdf.html": {
        "tool_id": "split",
        "title": "Split PDF Online Free - Extract Pages & Divide PDFs Offline | FixMyPDF",
        "desc": "Extract individual pages or split PDF documents into multiple separate files instantly. Free, secure, private, and 100% offline.",
        "keywords": "split pdf, extract pdf pages, divide pdf, cut pdf, separate pdf pages, dividir pdf, pisah pdf, offline pdf split",
        "howto_name": "How to Split a PDF File and Extract Pages",
        "step1": "Choose or drag and drop your PDF document into the split tool.",
        "step2": "Specify the page numbers or page ranges you want to extract (e.g. 1, 3, 5-10).",
        "step3": "Click 'Split PDF' to generate and download your extracted pages immediately.",
        "faq1_q": "Can I extract specific page ranges from my PDF?",
        "faq1_a": "Yes, you can extract single pages (e.g., 1, 4), custom ranges (e.g., 5-12), or any combination separated by commas.",
        "faq2_q": "Are my extracted PDF pages kept private?",
        "faq2_a": "Yes, 100%. All page extraction happens locally on your computer or mobile device without external transmission."
    },
    "compress-pdf.html": {
        "tool_id": "compress",
        "title": "Compress PDF Online Free - Reduce PDF File Size Offline | FixMyPDF",
        "desc": "Reduce PDF file size without losing quality. Compress PDF to 200KB, 100KB, or smaller directly in your browser. 100% free and private.",
        "keywords": "compress pdf, reduce pdf size, shrink pdf, compress pdf 200kb, comprimir pdf, kompres pdf, pdf verkleinern, offline compress",
        "howto_name": "How to Compress and Reduce PDF File Size",
        "step1": "Upload or drop your PDF document into the compressor.",
        "step2": "Choose your preferred compression level (Low, Balanced, or High).",
        "step3": "Click 'Compress PDF' and download your lightweight PDF file.",
        "faq1_q": "Will compressing my PDF reduce text or image quality?",
        "faq1_a": "FixMyPDF optimizes font descriptors, removes redundant metadata, and recompresses embedded images to ensure maximum visual clarity with minimal byte size.",
        "faq2_q": "Can I compress PDFs down to 200KB or 100KB?",
        "faq2_a": "Yes, FixMyPDF effectively compacts documents for email attachments, government portals, and university uploads."
    },
    "pdf-to-word.html": {
        "tool_id": "pdf_to_word",
        "title": "Convert PDF to Word Free - Editable DOCX Offline & Secure | FixMyPDF",
        "desc": "Convert PDF documents into editable Microsoft Word (.docx) files accurately. 100% free, offline, private, and no registration required.",
        "keywords": "pdf to word, convert pdf to word, pdf to docx, editable docx, converter pdf para word, ubah pdf ke word, pdf in word umwandeln",
        "howto_name": "How to Convert PDF to Editable Word Document",
        "step1": "Drag and drop your PDF file into the PDF to Word converter.",
        "step2": "Let FixMyPDF parse the document text, paragraphs, and formatting.",
        "step3": "Click 'Convert to Word' and download your editable .docx file.",
        "faq1_q": "Can I edit the converted Word document in Microsoft Word or Google Docs?",
        "faq1_a": "Yes, the converted file is standard DOCX format compatible with Microsoft Word, LibreOffice, Google Docs, and WPS Office.",
        "faq2_q": "Does PDF to Word keep the original formatting?",
        "faq2_a": "Yes, text blocks, paragraphs, and structure are preserved as accurately as possible."
    },
    "word-to-pdf.html": {
        "tool_id": "word_to_pdf",
        "title": "Convert Word to PDF Free - DOC & DOCX to PDF Offline | FixMyPDF",
        "desc": "Convert Word documents (DOC, DOCX) to professional PDF files with intact formatting and fonts. 100% free, private, and client-side.",
        "keywords": "word to pdf, convert word to pdf, doc to pdf, docx to pdf, word para pdf, word in pdf umwandeln",
        "howto_name": "How to Convert Word Documents to PDF",
        "step1": "Select your Word (.docx) document.",
        "step2": "Verify the preview and layout settings.",
        "step3": "Click 'Convert to PDF' and download your publication-ready PDF document.",
        "faq1_q": "Does Word to PDF change my document styling or fonts?",
        "faq1_a": "FixMyPDF preserves headings, typography, margins, and layout cleanly.",
        "faq2_q": "Is there any limit to the number of pages I can convert?",
        "faq2_a": "No, you can convert documents of any size completely free."
    },
    "pdf-to-jpg.html": {
        "tool_id": "pdf_to_jpg",
        "title": "Convert PDF to JPG Free - High Resolution Images Offline | FixMyPDF",
        "desc": "Convert each PDF page into high-resolution JPG images. Extract pictures and pages quickly with 100% offline privacy.",
        "keywords": "pdf to jpg, convert pdf to jpg, extract images from pdf, pdf a jpg, pdf umwandeln in jpg, pdf ke jpg",
        "howto_name": "How to Convert PDF Pages to JPG Images",
        "step1": "Upload or drop your PDF document.",
        "step2": "Choose the target image resolution or select specific pages.",
        "step3": "Download your crisp JPG photos individually or as a single zip archive.",
        "faq1_q": "What resolution are the extracted JPG images?",
        "faq1_a": "Pages are rendered at high DPI to ensure sharp text and vibrant graphics.",
        "faq2_q": "Are my images stored anywhere?",
        "faq2_a": "Never. The rendering happens on an HTML5 canvas directly in your browser."
    },
    "jpg-to-pdf.html": {
        "tool_id": "jpg_to_pdf",
        "title": "Convert JPG to PDF Free - Combine Images into PDF Offline | FixMyPDF",
        "desc": "Convert JPG images into a single clean PDF document. Reorder photos, adjust orientation, and compile PDFs offline with zero uploads.",
        "keywords": "jpg to pdf, convert jpg to pdf, photos to pdf, images to pdf, converter foto em pdf, fotos en pdf, bilder in pdf",
        "howto_name": "How to Convert JPG Images to a PDF Document",
        "step1": "Select or drop one or multiple JPG photos into the converter.",
        "step2": "Arrange the images into your desired page order.",
        "step3": "Click 'Convert to PDF' to generate and download your consolidated PDF file.",
        "faq1_q": "Can I combine multiple JPG files into a single PDF?",
        "faq1_a": "Yes, you can upload dozens of photos and merge them into one organized document.",
        "faq2_q": "Does it compress or degrade photo quality?",
        "faq2_a": "FixMyPDF preserves the original image resolution without unwanted recompression."
    },
    "pdf-to-png.html": {
        "tool_id": "pdf_to_png",
        "title": "Convert PDF to PNG Free - Transparent HD Images Offline | FixMyPDF",
        "desc": "Convert PDF pages to lossless PNG images with transparent background support. 100% private, free, and client-side processing.",
        "keywords": "pdf to png, convert pdf to png, transparent png, lossless pdf image, pdf en png, converter pdf para png",
        "howto_name": "How to Convert PDF Pages to Transparent PNG Images",
        "step1": "Choose your PDF file to convert.",
        "step2": "Select pages and configure transparent or white background preferences.",
        "step3": "Download your pixel-perfect PNG images.",
        "faq1_q": "Why choose PNG over JPG for PDF conversion?",
        "faq1_a": "PNG uses lossless compression and supports transparent backgrounds, making it ideal for diagrams, blueprints, and presentations.",
        "faq2_q": "Is conversion fast on large documents?",
        "faq2_a": "Yes, rendering uses your local GPU acceleration directly in the browser."
    },
    "png-to-pdf.html": {
        "tool_id": "png_to_pdf",
        "title": "Convert PNG to PDF Free - High Quality PDF from PNG Offline | FixMyPDF",
        "desc": "Convert PNG images and graphics into professional PDF documents. Preserves transparency, colors, and quality with 100% offline privacy.",
        "keywords": "png to pdf, convert png to pdf, png images to pdf, transparent png to pdf, png para pdf, png in pdf umwandeln",
        "howto_name": "How to Convert PNG Graphics to PDF",
        "step1": "Select your PNG image files.",
        "step2": "Order your pages and adjust page orientation.",
        "step3": "Click 'Convert to PDF' to download your finished document.",
        "faq1_q": "Will PNG transparency be preserved in the PDF?",
        "faq1_a": "Yes, transparent regions render cleanly on the PDF canvas.",
        "faq2_q": "Can I combine multiple PNG files into one PDF?",
        "faq2_a": "Yes, upload all your PNG files and compile them into a single PDF."
    },
    "excel-to-pdf.html": {
        "tool_id": "excel_to_pdf",
        "title": "Convert Excel to PDF Free - XLS & XLSX to PDF Offline | FixMyPDF",
        "desc": "Convert Excel spreadsheets (XLS, XLSX) into beautifully formatted PDF tables. Free, private, client-side, and no installation required.",
        "keywords": "excel to pdf, convert excel to pdf, xlsx to pdf, xls to pdf, pdf para excel, excel in pdf umwandeln",
        "howto_name": "How to Convert Excel Spreadsheets to PDF",
        "step1": "Choose your XLS or XLSX spreadsheet file.",
        "step2": "Preview the generated table layout and sheet contents.",
        "step3": "Click 'Convert to PDF' to download your clean, printable PDF report.",
        "faq1_q": "Does Excel to PDF work with multi-sheet workbooks?",
        "faq1_a": "Yes, workbooks and sheets are processed and formatted into standard PDF pages.",
        "faq2_q": "Are financial or sensitive spreadsheets safe?",
        "faq2_a": "100% safe. Processing happens locally in your browser memory without cloud transmission."
    },
    "rotate-pdf.html": {
        "tool_id": "rotate",
        "title": "Rotate PDF Pages Free - Permanent PDF Rotation Offline | FixMyPDF",
        "desc": "Rotate PDF pages clockwise or counter-clockwise permanently. Rotate single pages or entire files with real-time preview. 100% offline & free.",
        "keywords": "rotate pdf, rotate pdf pages, turn pdf, permanent pdf rotation, girar pdf, pdf drehen, putar pdf, pivoter pdf",
        "howto_name": "How to Rotate PDF Pages Permanently",
        "step1": "Drop or select your PDF file into the rotate tool.",
        "step2": "Click rotation buttons to turn individual pages or all pages 90°, 180°, or 270°.",
        "step3": "Click 'Rotate PDF' to save and download your properly oriented document.",
        "faq1_q": "Is the rotation permanent when opening in other viewers?",
        "faq1_a": "Yes, FixMyPDF updates the PDF internal rotation flag permanently.",
        "faq2_q": "Can I rotate only upside-down pages while leaving others untouched?",
        "faq2_a": "Yes! You can rotate individual pages selectively."
    },
    "delete-pdf.html": {
        "tool_id": "delete",
        "title": "Delete PDF Pages Free - Remove Pages from PDF Offline | FixMyPDF",
        "desc": "Remove unwanted, blank, or sensitive pages from your PDF file. 100% private, free, and secure client-side editing.",
        "keywords": "delete pdf pages, remove pages from pdf, strip pdf pages, seiten aus pdf löschen, excluir paginas pdf, hapus halaman pdf",
        "howto_name": "How to Delete Unwanted Pages from a PDF",
        "step1": "Upload your PDF document to view interactive page thumbnails.",
        "step2": "Click on the pages you want to delete or specify page numbers.",
        "step3": "Click 'Remove Pages' and download your streamlined PDF.",
        "faq1_q": "Does deleting pages alter the remaining content?",
        "faq1_a": "No, the remaining pages preserve their original fonts, vector graphics, and forms.",
        "faq2_q": "Can I undo page deletions before downloading?",
        "faq2_a": "Yes, you can toggle pages back and forth before finalizing."
    },
    "reorder-pdf.html": {
        "tool_id": "reorder",
        "title": "Reorder PDF Pages Free - Rearrange & Sort Pages Offline | FixMyPDF",
        "desc": "Rearrange and sort PDF pages with intuitive drag-and-drop thumbnails. Organize your document sequence offline with 100% privacy.",
        "keywords": "reorder pdf pages, rearrange pdf, sort pdf pages, change pdf page order, reordenar pdf, pdf seiten sortieren, susun ulang halaman pdf",
        "howto_name": "How to Rearrange and Reorder PDF Pages",
        "step1": "Upload your PDF document to load visual page thumbnails.",
        "step2": "Drag and drop thumbnails into your desired page sequence.",
        "step3": "Click 'Save New Order' to download your newly ordered PDF.",
        "faq1_q": "Can I move multiple pages at once?",
        "faq1_a": "Yes, you can drag individual pages or select blocks to relocate them anywhere.",
        "faq2_q": "Does reordering affect bookmarks or links?",
        "faq2_a": "Page content is cleanly rebuilt according to the new sequence."
    },
    "add-page-numbers.html": {
        "tool_id": "add_page_numbers",
        "title": "Add Page Numbers to PDF Free - Number PDF Pages Offline | FixMyPDF",
        "desc": "Insert clean, customizable page numbers into your PDF header or footer. Choose position, font, and format with 100% offline privacy.",
        "keywords": "add page numbers to pdf, number pdf, paginate pdf, seitenzahlen hinzufügen, adicionar numeros de pagina, magdagdag ng page number sa pdf",
        "howto_name": "How to Add Page Numbers to a PDF Document",
        "step1": "Upload your PDF document.",
        "step2": "Select position (top/bottom, left/center/right) and numbering format (e.g. Page 1 of N).",
        "step3": "Click 'Add Numbers' to download your paginated PDF.",
        "faq1_q": "Can I choose where the page numbers appear?",
        "faq1_a": "Yes, you can position numbers in top-left, top-center, top-right, bottom-left, bottom-center, or bottom-right.",
        "faq2_q": "Can I start numbering from a specific page?",
        "faq2_a": "Yes, you can skip the cover page or set custom starting offsets."
    },
    "add-watermark.html": {
        "tool_id": "add_watermark",
        "title": "Add Watermark to PDF Free - Stamp Text or Image Offline | FixMyPDF",
        "desc": "Stamp text or image watermarks onto PDF pages with custom opacity, rotation, and font. Protect documents offline with zero uploads.",
        "keywords": "add watermark to pdf, stamp pdf, protect pdf document, watermark pdf, wasserzeichen hinzufügen, adicionar marca dagua, filigrane pdf",
        "howto_name": "How to Add a Watermark to a PDF Document",
        "step1": "Upload your PDF document.",
        "step2": "Enter custom watermark text (e.g. CONFIDENTIAL) or upload a logo image, then adjust angle and transparency.",
        "step3": "Click 'Apply Watermark' to download your secured PDF.",
        "faq1_q": "Can I customize the opacity and rotation of the watermark?",
        "faq1_a": "Yes, adjust transparency, font size, color, angle, and repeat patterns in real time.",
        "faq2_q": "Can the watermark be easily removed by viewers?",
        "faq2_a": "The watermark is embedded directly into the PDF content stream for robust document protection."
    },
    "crop-pdf.html": {
        "tool_id": "crop",
        "title": "Crop PDF Margins Free - Trim PDF Pages Online & Offline | FixMyPDF",
        "desc": "Trim PDF page borders, remove white margins, or crop specific regions visually. 100% free, private, and offline in your browser.",
        "keywords": "crop pdf, trim pdf margins, cut pdf borders, pdf zuschneiden, recortar pdf, rogner pdf, potong pdf",
        "howto_name": "How to Crop and Trim PDF Margins",
        "step1": "Upload your PDF document into the visual cropping tool.",
        "step2": "Adjust the crop box boundaries around your desired page content.",
        "step3": "Click 'Crop PDF' to trim margins and download your perfectly framed document.",
        "faq1_q": "Does cropping reduce the resolution of the text or images?",
        "faq1_a": "No, cropping adjusts the visible bounding box (MediaBox / CropBox) while keeping internal vectors and high-res imagery intact.",
        "faq2_q": "Can I apply the same crop to all pages simultaneously?",
        "faq2_a": "Yes, you can apply your crop box to the current page or across the entire document."
    }
}

NAVBAR_LANG_DROPDOWN = """        <div class="lang-selector-wrapper">
            <i class="ph-bold ph-globe"></i>
            <select id="lang-select" aria-label="Select Language">
                <option value="en">English</option>
                <option value="pt-BR">Português (Brasil)</option>
                <option value="es-ES">Español (España)</option>
                <option value="es-MX">Español (México)</option>
                <option value="de-DE">Deutsch</option>
                <option value="fr-FR">Français</option>
                <option value="id-ID">Bahasa Indonesia</option>
                <option value="fil-PH">Filipino (Tagalog)</option>
                <option value="ja-JP">日本語</option>
                <option value="ru-RU">Русский</option>
                <option value="vi-VN">Tiếng Việt</option>
            </select>
        </div>"""

def generate_tool_faq_html(cfg):
    return f"""    <!-- AEO & FAQ Section -->
    <section class="faq-section" id="faq">
        <div class="faq-header">
            <span class="faq-badge" data-i18n="faq_badge">FREQUENTLY ASKED QUESTIONS</span>
            <h2 data-i18n="faq_title">Got Questions? We Have Answers.</h2>
            <p data-i18n="faq_subtitle">Everything you need to know about FixMyPDF privacy, offline processing, and free PDF tools.</p>
        </div>
        <div class="faq-list">
            <details class="faq-item" open>
                <summary class="faq-question">
                    <span>{cfg['faq1_q']}</span>
                    <span class="faq-icon-arrow"><i class="ph-bold ph-caret-down"></i></span>
                </summary>
                <div class="faq-answer">
                    <p>{cfg['faq1_a']}</p>
                </div>
            </details>
            <details class="faq-item">
                <summary class="faq-question">
                    <span>{cfg['faq2_q']}</span>
                    <span class="faq-icon-arrow"><i class="ph-bold ph-caret-down"></i></span>
                </summary>
                <div class="faq-answer">
                    <p>{cfg['faq2_a']}</p>
                </div>
            </details>
            <details class="faq-item">
                <summary class="faq-question">
                    <span data-i18n="faq_q1">Is FixMyPDF really safe and private?</span>
                    <span class="faq-icon-arrow"><i class="ph-bold ph-caret-down"></i></span>
                </summary>
                <div class="faq-answer">
                    <p data-i18n="faq_a1">Yes, 100%. All processing runs entirely client-side inside your browser using WebAssembly and pure JavaScript. Your documents never leave your device and are never transmitted to any external server or cloud storage.</p>
                </div>
            </details>
            <details class="faq-item">
                <summary class="faq-question">
                    <span data-i18n="faq_q2">Are there any file size limits, subscriptions, or hidden fees?</span>
                    <span class="faq-icon-arrow"><i class="ph-bold ph-caret-down"></i></span>
                </summary>
                <div class="faq-answer">
                    <p data-i18n="faq_a2">FixMyPDF is completely free forever. There are no subscriptions, no credit card requirements, no daily usage limits, and no watermarks added to your documents. File size capacity is limited only by your computer or phone memory.</p>
                </div>
            </details>
        </div>
    </section>"""

def generate_tool_schema_json(filename, cfg):
    url = f"https://sankalpsinghcoder-ai.github.io/pdf-tool/{filename}"
    return f"""    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@graph": [
        {{
          "@type": "WebApplication",
          "@id": "{url}#webapp",
          "name": "{cfg['title'].split(' - ')[0]}",
          "url": "{url}",
          "description": "{cfg['desc']}",
          "applicationCategory": "UtilitiesApplication",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript and modern web browser",
          "offers": {{
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }},
          "featureList": [
            "100% Client-Side Processing",
            "Zero Server File Uploads",
            "Offline Document Processing",
            "No Subscriptions or Watermarks"
          ],
          "screenshot": "https://sankalpsinghcoder-ai.github.io/pdf-tool/assets/og-image-1200x630.png"
        }},
        {{
          "@type": "BreadcrumbList",
          "@id": "{url}#breadcrumbs",
          "itemListElement": [
            {{
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://sankalpsinghcoder-ai.github.io/pdf-tool/"
            }},
            {{
              "@type": "ListItem",
              "position": 2,
              "name": "{cfg['title'].split(' - ')[0]}",
              "item": "{url}"
            }}
          ]
        }},
        {{
          "@type": "HowTo",
          "@id": "{url}#howto",
          "name": "{cfg['howto_name']}",
          "description": "{cfg['desc']}",
          "step": [
            {{
              "@type": "HowToStep",
              "position": 1,
              "name": "Upload Document",
              "text": "{cfg['step1']}"
            }},
            {{
              "@type": "HowToStep",
              "position": 2,
              "name": "Configure Settings",
              "text": "{cfg['step2']}"
            }},
            {{
              "@type": "HowToStep",
              "position": 3,
              "name": "Process and Download",
              "text": "{cfg['step3']}"
            }}
          ]
        }},
        {{
          "@type": "FAQPage",
          "@id": "{url}#faq",
          "mainEntity": [
            {{
              "@type": "Question",
              "name": "{cfg['faq1_q']}",
              "acceptedAnswer": {{
                "@type": "Answer",
                "text": "{cfg['faq1_a']}"
              }}
            }},
            {{
              "@type": "Question",
              "name": "{cfg['faq2_q']}",
              "acceptedAnswer": {{
                "@type": "Answer",
                "text": "{cfg['faq2_a']}"
              }}
            }},
            {{
              "@type": "Question",
              "name": "Is FixMyPDF really safe and private?",
              "acceptedAnswer": {{
                "@type": "Answer",
                "text": "Yes, 100%. All processing runs entirely client-side inside your browser using WebAssembly and pure JavaScript. Your documents never leave your device."
              }}
            }},
            {{
              "@type": "Question",
              "name": "Are there any file size limits, subscriptions, or hidden fees?",
              "acceptedAnswer": {{
                "@type": "Answer",
                "text": "FixMyPDF is completely free forever. There are no subscriptions, no daily limits, and no watermarks added to your documents."
              }}
            }}
          ]
        }}
      ]
    }}
    </script>"""

def process_file(base_dir, filename, cfg):
    filepath = os.path.join(base_dir, filename)
    if not os.path.exists(filepath):
        print(f"File not found: {filename}")
        return

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Extract existing <style>...</style> blocks
    style_blocks = re.findall(r"(<style[\s\S]*?</style>)", content, re.IGNORECASE)
    preserved_styles = "\n    ".join(style_blocks) if style_blocks else ""

    # 2. Extract existing library <script src="..."> tags from head (excluding phosphor and fonts)
    head_match = re.search(r"<head>([\s\S]*?)</head>", content, re.IGNORECASE)
    preserved_head_scripts = []
    if head_match:
        raw_head = head_match.group(1)
        for s in re.findall(r"(<script[\s\S]*?</script>)", raw_head, re.IGNORECASE):
            # Ignore phosphor, style.css, font links, and any old ld+json
            if "ld+json" in s or "phosphor-icons" in s:
                continue
            preserved_head_scripts.append(s.strip())
    preserved_head_scripts_str = "\n    ".join(preserved_head_scripts)

    # 3. Build new CTR & SEO Head
    url = f"https://sankalpsinghcoder-ai.github.io/pdf-tool/{filename}"
    new_head = f"""<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{cfg['title']}</title>
    <meta name="description" content="{cfg['desc']}">
    <meta name="keywords" content="{cfg['keywords']}">
    <meta name="author" content="FixMyPDF">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">

    <!-- Canonical URL -->
    <link rel="canonical" href="{url}">

    <!-- Geographic SEO (GEO) Meta Tags -->
    <meta name="geo.region" content="US">
    <meta name="geo.placename" content="Global">
    <meta name="geo.position" content="37.7749;-122.4194">
    <meta name="ICBM" content="37.7749, -122.4194">

    <!-- Multilingual Hreflang Alternates -->
    <link rel="alternate" hreflang="x-default" href="{url}">
    <link rel="alternate" hreflang="en" href="{url}?lang=en">
    <link rel="alternate" hreflang="pt-BR" href="{url}?lang=pt-BR">
    <link rel="alternate" hreflang="id-ID" href="{url}?lang=id">
    <link rel="alternate" hreflang="de-DE" href="{url}?lang=de">
    <link rel="alternate" hreflang="es-MX" href="{url}?lang=es-MX">
    <link rel="alternate" hreflang="fr-FR" href="{url}?lang=fr">
    <link rel="alternate" hreflang="fil-PH" href="{url}?lang=fil">
    <link rel="alternate" hreflang="ja-JP" href="{url}?lang=ja">
    <link rel="alternate" hreflang="ru-RU" href="{url}?lang=ru">
    <link rel="alternate" hreflang="es-ES" href="{url}?lang=es-ES">
    <link rel="alternate" hreflang="vi-VN" href="{url}?lang=vi">

    <!-- Open Graph (OG) / Social Media Meta Tags -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="FixMyPDF">
    <meta property="og:title" content="{cfg['title']}">
    <meta property="og:description" content="{cfg['desc']}">
    <meta property="og:url" content="{url}">
    <meta property="og:image" content="https://sankalpsinghcoder-ai.github.io/pdf-tool/assets/og-image-1200x630.png">
    <meta property="og:image:secure_url" content="https://sankalpsinghcoder-ai.github.io/pdf-tool/assets/og-image-1200x630.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="{cfg['title']}">

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{cfg['title']}">
    <meta name="twitter:description" content="{cfg['desc']}">
    <meta name="twitter:image" content="https://sankalpsinghcoder-ai.github.io/pdf-tool/assets/og-image-1200x630.png">

    <!-- Multi-Size Favicons & App Icons -->
    <link rel="icon" type="image/x-icon" href="assets/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="assets/apple-touch-icon.png">

    <!-- Premium Fonts and Icons -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/@phosphor-icons/web"></script>

    <!-- Tool Engines & Libraries -->
    {preserved_head_scripts_str}

    <!-- Stylesheets -->
    <link rel="stylesheet" href="style.css">
    {preserved_styles}

    <!-- JSON-LD Structured Data: WebApplication, BreadcrumbList, HowTo, FAQPage -->
{generate_tool_schema_json(filename, cfg)}
</head>"""

    # Replace head
    content = re.sub(r"<head>[\s\S]*?</head>", new_head, content, flags=re.IGNORECASE)

    # 4. Update body tag with data-tool-page
    content = re.sub(r"<body([^>]*)>", f'<body\\1 data-tool-page="{cfg["tool_id"]}">', content, count=1, flags=re.IGNORECASE)
    # clean up accidental duplicate data-tool-page if already present
    content = re.sub(r'data-tool-page="[^"]*"\s+data-tool-page="([^"]*)"', r'data-tool-page="\1"', content)

    # 5. Update Navbar with language dropdown
    new_navbar = f"""    <nav class="navbar">
        <a href="index.html" class="logo">
            <i class="ph-fill ph-wrench"></i>
            FixMy<span>PDF</span>
        </a>
{NAVBAR_LANG_DROPDOWN}
    </nav>"""
    content = re.sub(r"<nav class=\"navbar\">[\s\S]*?</nav>", new_navbar, content, flags=re.IGNORECASE)

    # 6. Add FAQ Section right after </main>
    # First remove any existing faq-section if present
    content = re.sub(r"\s*<!-- AEO & FAQ Section -->[\s\S]*?</section>", "", content)
    content = re.sub(r"\s*<section class=\"faq-section\"[\s\S]*?</section>", "", content)

    faq_html = generate_tool_faq_html(cfg)
    content = re.sub(r"</main>", f"</main>\n\n{faq_html}", content, count=1, flags=re.IGNORECASE)

    # 7. Ensure i18n.js is loaded right before closing </body>
    if "i18n.js" not in content:
        content = re.sub(r"(<script[^>]+></script>\s*</body>)", r'<script src="i18n.js"></script>\n    \1', content, count=1, flags=re.IGNORECASE)
        # fallback if regex didn't match
        if "i18n.js" not in content:
            content = content.replace("</body>", '    <script src="i18n.js"></script>\n</body>')

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"[OK] Processed {filename}")

def main():
    base_dir = r"c:\Users\ASUS\.gemini\antigravity\scratch\pdf-tool"
    for filename, cfg in TOOLS_CONFIG.items():
        process_file(base_dir, filename, cfg)
    print("All tool pages successfully processed!")

if __name__ == "__main__":
    main()

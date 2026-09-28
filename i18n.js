/**
 * FixMyPDF - Internationalization (i18n) Engine
 * Full localization support for 11 locales:
 * en (English), pt-BR (Brazil), id-ID (Indonesia), de-DE (Germany),
 * es-MX (Mexico), fr-FR (France), fil-PH (Philippines),
 * ja-JP (Japan), ru-RU (Russia), es-ES (Spain), vi-VN (Vietnam).
 */

const I18N_TRANSLATIONS = {
    "en": {
        "brand_name": "FixMyPDF",
        "tagline": "100% Free, Private & Offline PDF Tools",
        "hero_title": "Every tool you need to fix your PDFs.",
        "hero_subtitle": "<b>100% Secure & Free.</b> All processing happens directly on your device. Your files are never uploaded to any server.",
        "search_placeholder": "Search for a tool (e.g., 'Merge', 'Word', 'Compress')...",
        "no_results": "No tools found matching your search.",
        "drop_title": "Choose files",
        "drop_subtitle": "or drop files here",
        "apply_continue": "Apply Changes & Continue Editing",
        "close_preview": "Close Preview",
        "doc_preview": "Document Preview",
        
        "faq_badge": "FREQUENTLY ASKED QUESTIONS",
        "faq_title": "Got Questions? We Have Answers.",
        "faq_subtitle": "Everything you need to know about FixMyPDF privacy, offline processing, and free PDF tools.",
        
        "faq_q1": "Is FixMyPDF really safe and private?",
        "faq_a1": "Yes, 100%. All processing runs entirely client-side inside your browser using WebAssembly and pure JavaScript. Your documents never leave your device and are never transmitted to any external server or cloud storage.",
        
        "faq_q2": "Are there any file size limits, subscriptions, or hidden fees?",
        "faq_a2": "FixMyPDF is completely free forever. There are no subscriptions, no credit card requirements, no daily usage limits, and no watermarks added to your documents. File size capacity is limited only by your computer or phone memory.",
        
        "faq_q3": "Can I use FixMyPDF without an internet connection?",
        "faq_a3": "Yes. Once the web application is loaded in your browser tab, all PDF merging, splitting, compression, conversion, and editing functions execute locally on your device hardware without requiring an active internet connection.",
        
        "faq_q4": "Which PDF and document tools are available?",
        "faq_a4": "FixMyPDF includes 16 specialized tools: Merge PDF, Split PDF, Compress PDF, PDF to Word, Word to PDF, PDF to JPG, JPG to PDF, PDF to PNG, PNG to PDF, Excel to PDF, Rotate PDF, Delete Pages, Reorder Pages, Add Page Numbers, Add Watermark, and Crop PDF.",

        "tools": {
            "merge": {
                "title": "Merge PDF",
                "desc": "Combine multiple PDFs into one unified document.",
                "page_desc": "Combine multiple PDFs into one unified document securely.",
                "btn": "Merge PDFs",
                "keywords": "merge pdf combine pdf join pdf combine files juntar pdf unir pdf"
            },
            "split": {
                "title": "Split PDF",
                "desc": "Extract pages or cut one PDF into multiple files.",
                "page_desc": "Extract specific pages or separate a document into multiple files.",
                "btn": "Split PDF",
                "keywords": "split pdf extract pages divide pdf cut pdf separar hojas dividir pdf"
            },
            "compress": {
                "title": "Compress PDF",
                "desc": "Reduce file size while maintaining good quality.",
                "page_desc": "Reduce file size while maintaining optimal visual clarity.",
                "btn": "Compress PDF",
                "keywords": "compress pdf reduce pdf size optimize pdf shrink pdf comprimir pdf"
            },
            "pdf_to_word": {
                "title": "PDF to Word",
                "desc": "Convert PDF documents to editable Word files.",
                "page_desc": "Convert PDF documents into editable Word (.docx) files.",
                "btn": "Convert to Word",
                "keywords": "pdf to word convert pdf docx editable doc converter pdf para word"
            },
            "word_to_pdf": {
                "title": "Word to PDF",
                "desc": "Convert DOC, DOCX files to PDF with preserved formatting.",
                "page_desc": "Convert DOC and DOCX files into high-quality PDF documents.",
                "btn": "Convert to PDF",
                "keywords": "word to pdf doc to pdf docx to pdf convert document"
            },
            "pdf_to_jpg": {
                "title": "PDF to JPG",
                "desc": "Convert each PDF page into a high-quality JPG image.",
                "page_desc": "Extract and convert every PDF page into crisp JPG photos.",
                "btn": "Convert to JPG",
                "keywords": "pdf to jpg convert pdf to image extract pictures pdf a jpg"
            },
            "jpg_to_pdf": {
                "title": "JPG to PDF",
                "desc": "Convert images to PDF. Combine multiple images into one document.",
                "page_desc": "Turn your JPG images into clean, formatted PDF documents.",
                "btn": "Convert to PDF",
                "keywords": "jpg to pdf photos to pdf images to document convert pictures"
            },
            "pdf_to_png": {
                "title": "PDF to PNG",
                "desc": "Convert PDF pages to high-quality PNG images with transparent background support.",
                "page_desc": "Convert PDF pages to transparent, lossless PNG images.",
                "btn": "Convert to PNG",
                "keywords": "pdf to png extract png lossless image convert pdf"
            },
            "png_to_pdf": {
                "title": "PNG to PDF",
                "desc": "Convert PNG images to PDF. Preserves transparency and quality.",
                "page_desc": "Transform PNG photos and graphics into a multi-page PDF.",
                "btn": "Convert to PDF",
                "keywords": "png to pdf transparent images picture to pdf convert png"
            },
            "excel_to_pdf": {
                "title": "Excel to PDF",
                "desc": "Convert Excel spreadsheets to clean PDF document tables instantly.",
                "page_desc": "Turn XLS and XLSX workbooks into professional PDF reports.",
                "btn": "Convert to PDF",
                "keywords": "excel to pdf xlsx to pdf spreadsheet to document table"
            },
            "rotate": {
                "title": "Rotate PDF",
                "desc": "Rotate single pages, precise ranges, or entire files seamlessly.",
                "page_desc": "Rotate clockwise or counter-clockwise with live visual preview.",
                "btn": "Rotate PDF",
                "keywords": "rotate pdf turn pages orient pdf girar pdf drehen"
            },
            "delete": {
                "title": "Delete PDF Pages",
                "desc": "Selectively strip out unwanted layouts, individual segments, or ranges easily.",
                "page_desc": "Strip out unwanted pages from your PDF and save the clean file.",
                "btn": "Remove Pages",
                "keywords": "delete pdf pages remove pages strip pages seiten löschen"
            },
            "reorder": {
                "title": "Reorder PDF Pages",
                "desc": "Rearrange, move, or sort your document layout structure with drag actions or click markers.",
                "page_desc": "Organize and sort pages by dragging thumbnails to your desired order.",
                "btn": "Save New Order",
                "keywords": "reorder pdf rearrange pages sort pages move pages"
            },
            "add_page_numbers": {
                "title": "Add Page Numbers",
                "desc": "Automatically insert page numbers with custom position and format.",
                "page_desc": "Number your document pages with custom header or footer positioning.",
                "btn": "Add Numbers",
                "keywords": "add page numbers number pdf paginate document footer numbers"
            },
            "add_watermark": {
                "title": "Add Watermark",
                "desc": "Stamp a text or image watermark onto your PDF.",
                "page_desc": "Stamp custom copyright text or logos across your document.",
                "btn": "Apply Watermark",
                "keywords": "add watermark stamp pdf protect document copyright watermark"
            },
            "crop": {
                "title": "Crop PDF",
                "desc": "Crop margins or specific areas of PDF pages visually.",
                "page_desc": "Trim page borders and white margins with precision.",
                "btn": "Crop PDF",
                "keywords": "crop pdf trim borders cut margin recortar pdf"
            }
        }
    },

    "pt-BR": {
        "brand_name": "FixMyPDF",
        "tagline": "Ferramentas de PDF 100% Gratuitas, Privadas e Offline",
        "hero_title": "Todas as ferramentas para consertar seus PDFs.",
        "hero_subtitle": "<b>100% Seguro e Gratuito.</b> Todo processamento ocorre diretamente no seu dispositivo. Seus arquivos nunca são enviados a nenhum servidor.",
        "search_placeholder": "Pesquisar ferramenta (ex: 'juntar pdf', 'comprimir', 'word')...",
        "no_results": "Nenhuma ferramenta encontrada para sua pesquisa.",
        "drop_title": "Escolher arquivos",
        "drop_subtitle": "ou solte os arquivos aqui",
        "apply_continue": "Aplicar Alterações e Continuar Editando",
        "close_preview": "Fechar Visualização",
        "doc_preview": "Visualização do Documento",
        
        "faq_badge": "PERGUNTAS FREQUENTES",
        "faq_title": "Dúvidas Frequentes sobre o FixMyPDF",
        "faq_subtitle": "Tudo o que você precisa saber sobre segurança, ferramentas gratuitas e privacidade.",
        
        "faq_q1": "O FixMyPDF é realmente seguro e confidencial?",
        "faq_a1": "Sim, 100%. Todo o processamento funciona diretamente no seu navegador via WebAssembly e JavaScript. Seus arquivos nunca saem do seu computador ou celular e nunca são salvos em nuvem.",
        
        "faq_q2": "Existe limite de tamanho ou custo escondido?",
        "faq_a2": "O FixMyPDF é totalmente gratuito para sempre. Não há assinaturas, marcas d'água ou limites diários de conversão.",
        
        "faq_q3": "Posso usar as ferramentas sem internet?",
        "faq_a3": "Sim! Após abrir o site, todas as operações de juntar, comprimir, converter e editar funcionam de forma 100% offline.",
        
        "faq_q4": "Quais ferramentas de PDF estão disponíveis?",
        "faq_a4": "O FixMyPDF oferece juntar pdf, comprimir pdf, converter pdf para word, dividir pdf, girar pdf, excel para pdf, pdf para jpg/png e muito mais.",

        "tools": {
            "merge": {
                "title": "Juntar PDF",
                "desc": "Juntar arquivos PDF em um único documento.",
                "page_desc": "Juntar arquivos PDF em um único documento com segurança e rapidez.",
                "btn": "Juntar PDFs",
                "keywords": "juntar pdf juntar arquivos pdf unir pdf mesclar pdf combinar pdf"
            },
            "split": {
                "title": "Dividir PDF",
                "desc": "Separar folhas de PDF ou extrair páginas específicas.",
                "page_desc": "Dividir PDF e extrair páginas com facilidade e privacidade.",
                "btn": "Dividir PDF",
                "keywords": "dividir pdf separar folhas de pdf extrair paginas cortar pdf"
            },
            "compress": {
                "title": "Comprimir PDF",
                "desc": "Reduzir tamanho e diminuir peso do PDF mantendo qualidade.",
                "page_desc": "Comprimir PDF online grátis sem perder qualidade visual.",
                "btn": "Comprimir PDF",
                "keywords": "comprimir pdf reduzir tamanho pdf otimizar pdf diminuir peso pdf"
            },
            "pdf_to_word": {
                "title": "Converter PDF para Word",
                "desc": "Converter documentos PDF para arquivos Word editáveis.",
                "page_desc": "Converter PDF para DOCX editável preservando formatação.",
                "btn": "Converter para Word",
                "keywords": "converter pdf para word pdf para docx transformar pdf em word"
            },
            "word_to_pdf": {
                "title": "Word para PDF",
                "desc": "Converter arquivos DOC e DOCX para PDF com precisão.",
                "page_desc": "Converter DOCX em documento PDF de alta resolução.",
                "btn": "Converter para PDF",
                "keywords": "word para pdf converter doc em pdf docx para pdf"
            },
            "pdf_to_jpg": {
                "title": "PDF para JPG",
                "desc": "Converter páginas de PDF em imagens JPG de alta resolução.",
                "page_desc": "Extrair imagens JPG nítidas de cada página do seu documento.",
                "btn": "Converter para JPG",
                "keywords": "pdf para jpg transformar pdf em imagem extrair fotos pdf"
            },
            "jpg_to_pdf": {
                "title": "JPG para PDF",
                "desc": "Converter imagens JPG em arquivo PDF unificado.",
                "page_desc": "Junte várias fotos JPG em um único documento PDF formatado.",
                "btn": "Converter para PDF",
                "keywords": "jpg para pdf converter foto em pdf imagens para documento"
            },
            "pdf_to_png": {
                "title": "PDF para PNG",
                "desc": "Converter páginas de PDF em imagens PNG de alta fidelidade.",
                "page_desc": "Exportar páginas do PDF para PNG transparente sem perdas.",
                "btn": "Converter para PNG",
                "keywords": "pdf para png converter jpg em png extrair png imagem"
            },
            "png_to_pdf": {
                "title": "PNG para PDF",
                "desc": "Converter imagens PNG em documento PDF com transparência.",
                "page_desc": "Transforme seus gráficos e imagens PNG em um arquivo PDF.",
                "btn": "Converter para PDF",
                "keywords": "png para pdf imagens png em pdf converter fotos"
            },
            "excel_to_pdf": {
                "title": "PDF para Excel / Excel para PDF",
                "desc": "Converter planilhas Excel em tabelas PDF perfeitas.",
                "page_desc": "Transforme planilhas XLS e XLSX em arquivos PDF limpos.",
                "btn": "Converter para PDF",
                "keywords": "pdf para excel excel para pdf xlsx para pdf planilha tabela"
            },
            "rotate": {
                "title": "Girar PDF",
                "desc": "Girar páginas ou arquivo PDF inteiro para o ângulo correto.",
                "page_desc": "Girar páginas de PDF no sentido horário ou anti-horário.",
                "btn": "Girar PDF",
                "keywords": "girar pdf rotacionar paginas orientar pdf desvirar pdf"
            },
            "delete": {
                "title": "Excluir Páginas do PDF",
                "desc": "Remover páginas indesejadas do arquivo PDF de forma simples.",
                "page_desc": "Exclua páginas específicas do seu documento instantaneamente.",
                "btn": "Remover Páginas",
                "keywords": "excluir paginas pdf remover folhas deletar paginas pdf"
            },
            "reorder": {
                "title": "Reordenar Páginas do PDF",
                "desc": "Organizar, mover e mudar a ordem das páginas do documento.",
                "page_desc": "Arraste e solte para organizar as páginas do seu PDF.",
                "btn": "Salvar Nova Ordem",
                "keywords": "reordenar pdf organizar paginas mudar ordem pdf mover paginas"
            },
            "add_page_numbers": {
                "title": "Adicionar Números de Página",
                "desc": "Inserir numeração de páginas personalizada no cabeçalho ou rodapé.",
                "page_desc": "Numere as páginas do seu PDF com posições personalizadas.",
                "btn": "Adicionar Numeração",
                "keywords": "adicionar numeros de pagina numerar pdf paginacao rodape"
            },
            "add_watermark": {
                "title": "Adicionar Marca d'Água",
                "desc": "Estampar marca d'água de texto ou imagem no seu PDF.",
                "page_desc": "Proteja seus documentos com marca d'água personalizada.",
                "btn": "Aplicar Marca d'Água",
                "keywords": "adicionar marca dagua estampar pdf proteger documento copyright"
            },
            "crop": {
                "title": "Recortar PDF",
                "desc": "Recortar margens ou áreas específicas das páginas do PDF.",
                "page_desc": "Ajuste o enquadramento e corte margens brancas com precisão.",
                "btn": "Recortar PDF",
                "keywords": "recortar foto online recortar pdf aparar margens cortar pdf"
            }
        }
    },

    "id-ID": {
        "brand_name": "FixMyPDF",
        "tagline": "Alat PDF 100% Gratis, Privasi Aman & Offline",
        "hero_title": "Semua alat untuk mengolah PDF Anda.",
        "hero_subtitle": "<b>100% Aman & Gratis.</b> Seluruh pemrosesan berjalan langsung di perangkat Anda. Dokumen tidak pernah diunggah ke server manapun.",
        "search_placeholder": "Cari alat (contoh: 'gabungkan pdf', 'kompres', 'word')...",
        "no_results": "Alat tidak ditemukan.",
        "drop_title": "Pilih file",
        "drop_subtitle": "atau seret file ke sini",
        "apply_continue": "Terapkan & Lanjutkan Mengedit",
        "close_preview": "Tutup Pratinjau",
        "doc_preview": "Pratinjau Dokumen",
        
        "faq_badge": "PERTANYAAN UMUM",
        "faq_title": "Pertanyaan yang Sering Diajukan",
        "faq_subtitle": "Semua informasi tentang privasi, pemrosesan offline, dan fitur FixMyPDF.",
        
        "faq_q1": "Apakah FixMyPDF benar-benar aman dan terjamin?",
        "faq_a1": "Ya, 100%. Semua pemrosesan bekerja di browser Anda secara lokal menggunakan WebAssembly. Dokumen Anda tidak pernah diunggah ke internet atau server pihak ketiga.",
        
        "faq_q2": "Apakah ada batasan ukuran file atau biaya berlangganan?",
        "faq_a2": "FixMyPDF gratis selamanya tanpa batasan penggunaan harian, tanpa watermark, dan tanpa kartu kredit.",
        
        "faq_q3": "Dapatkah saya menggunakan FixMyPDF saat offline?",
        "faq_a3": "Bisa! Setelah halaman dimuat di browser, Anda dapat memproses dokumen tanpa koneksi internet sama sekali.",
        
        "faq_q4": "Alat apa saja yang tersedia di FixMyPDF?",
        "faq_a4": "Tersedia gabungkan pdf, kompres pdf, ubah pdf ke word, pisah pdf, putar pdf, excel ke pdf, pdf ke jpg/png, dan lainnya.",

        "tools": {
            "merge": {
                "title": "Gabungkan PDF",
                "desc": "Gabungkan beberapa file PDF menjadi satu dokumen utuh.",
                "page_desc": "Gabungkan file PDF dengan aman dan cepat tanpa batasan.",
                "btn": "Gabungkan PDF",
                "keywords": "gabungkan pdf satukan pdf gabung file pdf sambung dokumen"
            },
            "split": {
                "title": "Pisah PDF",
                "desc": "Pisahkan halaman atau potong PDF menjadi beberapa dokumen.",
                "page_desc": "Ekstrak halaman tertentu dari dokumen PDF Anda dengan mudah.",
                "btn": "Pisah PDF",
                "keywords": "pisah pdf potong pdf ekstrak halaman bagi dokumen pdf"
            },
            "compress": {
                "title": "Kompres PDF",
                "desc": "Kecilkan ukuran file PDF tanpa mengurangi kualitas teks.",
                "page_desc": "Kompres PDF 200kb, 100kb dengan tetap mempertahankan kejernihan.",
                "btn": "Kompres PDF",
                "keywords": "kompres pdf kompres pdf 200kb kecilkan file pdf perkecil ukuran"
            },
            "pdf_to_word": {
                "title": "Ubah PDF ke Word",
                "desc": "Konversi dokumen PDF menjadi file Word DOCX yang bisa diedit.",
                "page_desc": "Ubah PDF ke Word secara instan dengan tata letak rapi.",
                "btn": "Ubah ke Word",
                "keywords": "ubah pdf ke word konversi pdf docx edit pdf gratis"
            },
            "word_to_pdf": {
                "title": "Word ke PDF",
                "desc": "Ubah file DOC dan DOCX menjadi format PDF berkualitas tinggi.",
                "page_desc": "Konversikan berkas Word Anda menjadi PDF yang aman.",
                "btn": "Ubah ke PDF",
                "keywords": "word ke pdf doc ke pdf docx ke pdf konversi dokumen"
            },
            "pdf_to_jpg": {
                "title": "PDF ke JPG",
                "desc": "Ubah setiap halaman PDF menjadi gambar foto JPG beresolusi tinggi.",
                "page_desc": "Ekstrak halaman PDF menjadi gambar JPG yang jernih.",
                "btn": "Ubah ke JPG",
                "keywords": "pdf ke jpg ubah pdf jadi gambar konversi gambar foto"
            },
            "jpg_to_pdf": {
                "title": "JPG ke PDF",
                "desc": "Ubah gambar JPG foto menjadi dokumen PDF terstruktur.",
                "page_desc": "Gabungkan banyak foto JPG menjadi satu file PDF rapi.",
                "btn": "Ubah ke PDF",
                "keywords": "jpg ke pdf konversi foto ke pdf jadikan pdf gambar"
            },
            "pdf_to_png": {
                "title": "PDF ke PNG",
                "desc": "Ubah halaman PDF menjadi gambar PNG berkualitas tinggi tanpa pecah.",
                "page_desc": "Simpan halaman PDF sebagai gambar PNG berkualitas tinggi.",
                "btn": "Ubah ke PNG",
                "keywords": "pdf ke png konversi jpg ke png gambar jernih"
            },
            "png_to_pdf": {
                "title": "PNG ke PDF",
                "desc": "Ubah gambar grafik PNG menjadi file dokumen PDF.",
                "page_desc": "Jadikan gambar PNG sebagai berkas dokumen PDF.",
                "btn": "Ubah ke PDF",
                "keywords": "png ke pdf konversi gambar png berkas dokumen"
            },
            "excel_to_pdf": {
                "title": "Excel ke PDF",
                "desc": "Ubah spreadsheet Excel XLS/XLSX menjadi tabel PDF rapi.",
                "page_desc": "Konversi laporan Excel menjadi format PDF siap cetak.",
                "btn": "Ubah ke PDF",
                "keywords": "excel ke pdf spreadsheet tabel xlsx ke pdf"
            },
            "rotate": {
                "title": "Putar PDF",
                "desc": "Putar halaman atau orientasi dokumen secara fleksibel.",
                "page_desc": "Putar halaman searah atau berlawanan jarum jam.",
                "btn": "Putar PDF",
                "keywords": "putar pdf ubah orientasi balikkan halaman rotasi pdf"
            },
            "delete": {
                "title": "Hapus Halaman PDF",
                "desc": "Hapus halaman yang tidak diperlukan dari dokumen PDF.",
                "page_desc": "Pilih dan buang halaman yang tidak diinginkan secara instan.",
                "btn": "Hapus Halaman",
                "keywords": "hapus halaman pdf buang halaman hapus lembar pdf"
            },
            "reorder": {
                "title": "Susun Ulang Halaman PDF",
                "desc": "Atur dan susun ulang posisi urutan halaman dokumen.",
                "page_desc": "Seret dan letakkan halaman sesuai urutan yang Anda inginkan.",
                "btn": "Simpan Urutan",
                "keywords": "susun ulang halaman pdf atur urutan halaman tata lembar"
            },
            "add_page_numbers": {
                "title": "Tambah Nomor Halaman",
                "desc": "Tambahkan penomoran halaman otomatis dengan format rapi.",
                "page_desc": "Beri nomor pada lembar dokumen PDF Anda di posisi yang pas.",
                "btn": "Tambah Nomor",
                "keywords": "tambah nomor halaman nomori pdf penomoran dokumen"
            },
            "add_watermark": {
                "title": "Tambah Watermark",
                "desc": "Beri cap air teks atau logo gambar untuk melindungi PDF.",
                "page_desc": "Lindungi hak cipta file Anda dengan cap watermark aman.",
                "btn": "Terapkan Watermark",
                "keywords": "tambah watermark cap air pdf tanda air amankan dokumen"
            },
            "crop": {
                "title": "Potong PDF",
                "desc": "Potong margin atau tepi putih dokumen PDF Anda.",
                "page_desc": "Sesuaikan ukuran dan potong pinggiran halaman dokumen.",
                "btn": "Potong PDF",
                "keywords": "potong foto online potong pdf pangkas margin pangkas halaman"
            }
        }
    },

    "de-DE": {
        "brand_name": "FixMyPDF",
        "tagline": "100% Kostenlose, Private & Offline PDF-Werkzeuge",
        "hero_title": "Alle Werkzeuge für Ihre PDF-Dokumente.",
        "hero_subtitle": "<b>100% Sicher & Kostenlos.</b> Die gesamte Verarbeitung erfolgt direkt auf Ihrem Gerät. Ihre Dateien werden niemals auf einen Server hochgeladen.",
        "search_placeholder": "Werkzeug suchen (z.B. 'pdf zusammenfügen', 'verkleinern')...",
        "no_results": "Keine passenden Werkzeuge gefunden.",
        "drop_title": "Dateien auswählen",
        "drop_subtitle": "oder Dateien hierher ziehen",
        "apply_continue": "Änderungen anwenden & weiter bearbeiten",
        "close_preview": "Vorschau schließen",
        "doc_preview": "Dokumentenvorschau",
        
        "faq_badge": "HÄUFIG GESTELLTE FRAGEN",
        "faq_title": "Fragen & Antworten zu FixMyPDF",
        "faq_subtitle": "Alles über Datenschutz, lokale Offline-Verarbeitung und Funktionsumfang.",
        
        "faq_q1": "Ist FixMyPDF wirklich sicher und datenschutzkonform?",
        "faq_a1": "Ja, zu 100%. Die gesamte Verarbeitung findet im Browser über WebAssembly und JavaScript statt. Keine Dokumente verlassen Ihren PC oder Ihr Smartphone.",
        
        "faq_q2": "Gibt es Dateigrößenbeschränkungen oder versteckte Gebühren?",
        "faq_a2": "FixMyPDF ist dauerhaft kostenlos. Keine Abonnements, keine Limits und keine Wasserzeichen.",
        
        "faq_q3": "Funktioniert FixMyPDF auch ohne Internet?",
        "faq_a3": "Ja! Nach dem Laden der Website können alle PDF-Funktionen komplett offline ohne Internetverbindung genutzt werden.",
        
        "faq_q4": "Welche Werkzeuge sind enthalten?",
        "faq_a4": "PDF zusammenfügen, PDF verkleinern, PDF in Word umwandeln, PDF teilen, PDF drehen, Seiten löschen und viele mehr.",

        "tools": {
            "merge": {
                "title": "PDF zusammenfügen",
                "desc": "Mehrere PDFs schnell zu einem einzigen Dokument verbinden.",
                "page_desc": "Mehrere PDF-Dateien sicher und lokal zusammenführen.",
                "btn": "PDFs zusammenfügen",
                "keywords": "pdf zusammenfügen pdf verbinden dokumente kombinieren"
            },
            "split": {
                "title": "PDF teilen",
                "desc": "Seiten extrahieren oder ein PDF in mehrere Dokumente aufteilen.",
                "page_desc": "PDF-Seiten gezielt trennen und separat abspeichern.",
                "btn": "PDF teilen",
                "keywords": "pdf teilen seiten extrahieren trennen pdf aufteilen"
            },
            "compress": {
                "title": "PDF verkleinern",
                "desc": "Dateigröße bei gleichbleibender Qualität reduzieren.",
                "page_desc": "PDF-Dateigröße online verringern ohne Qualitätsverlust.",
                "btn": "PDF verkleinern",
                "keywords": "pdf verkleinern pdf komprimieren dateigröße reduzieren"
            },
            "pdf_to_word": {
                "title": "PDF in Word umwandeln",
                "desc": "PDFs in bearbeitbare Word-Dokumente (.docx) konvertieren.",
                "page_desc": "Wandeln Sie PDF-Dateien in editierbare Word-Dokumente um.",
                "btn": "In Word umwandeln",
                "keywords": "pdf in word umwandeln pdf bearbeiten kostenlos pdf zu word"
            },
            "word_to_pdf": {
                "title": "Word in PDF umwandeln",
                "desc": "DOC und DOCX-Dateien in hochwertige PDFs umwandeln.",
                "page_desc": "Konvertieren Sie Word-Dokumente in Standard-PDFs.",
                "btn": "In PDF umwandeln",
                "keywords": "word in pdf umwandeln docx in pdf doc zu pdf"
            },
            "pdf_to_jpg": {
                "title": "PDF umwandeln in JPG",
                "desc": "Jede PDF-Seite in ein hochauflösendes JPG-Bild konvertieren.",
                "page_desc": "PDF-Seiten als brillante JPG-Bilder exportieren.",
                "btn": "In JPG umwandeln",
                "keywords": "pdf umwandeln in jpg pdf zu bild fotos extrahieren"
            },
            "jpg_to_pdf": {
                "title": "JPG in PDF umwandeln",
                "desc": "Bilder und Fotos in ein sauberes PDF umwandeln.",
                "page_desc": "Verbinden Sie JPG-Bilder zu einem kompakten PDF-Dokument.",
                "btn": "In PDF umwandeln",
                "keywords": "jpg in pdf umwandeln fotos in pdf bilder zu dokument"
            },
            "pdf_to_png": {
                "title": "PDF in PNG umwandeln",
                "desc": "PDF-Seiten in verlustfreie PNG-Grafiken konvertieren.",
                "page_desc": "Exportieren Sie PDF-Seiten als transparente PNGs.",
                "btn": "In PNG umwandeln",
                "keywords": "pdf in png umwandeln jpg in png umwandeln transparent"
            },
            "png_to_pdf": {
                "title": "PNG in PDF umwandeln",
                "desc": "PNG-Dateien in ein PDF-Dokument umwandeln.",
                "page_desc": "Grafiken und PNG-Bilder zu einem PDF vereinen.",
                "btn": "In PDF umwandeln",
                "keywords": "png in pdf umwandeln png bilder konvertieren"
            },
            "excel_to_pdf": {
                "title": "Excel in PDF umwandeln",
                "desc": "Excel-Tabellenkalkulationen in saubere PDFs übertragen.",
                "page_desc": "XLS und XLSX-Tabellen professionell in PDF exportieren.",
                "btn": "In PDF umwandeln",
                "keywords": "excel in pdf tabellenkalkulation xlsx in pdf tabelle"
            },
            "rotate": {
                "title": "PDF drehen",
                "desc": "Einzelne Seiten oder das gesamte Dokument drehen.",
                "page_desc": "PDFs im Uhrzeigersinn oder gegen den Uhrzeigersinn rotieren.",
                "btn": "PDF drehen",
                "keywords": "pdf drehen seiten drehen orientierung ausrichten"
            },
            "delete": {
                "title": "Seiten aus PDF löschen",
                "desc": "Unerwünschte Seiten aus dem Dokument dauerhaft entfernen.",
                "page_desc": "Wählen Sie Seiten aus und entfernen Sie diese sofort.",
                "btn": "Seiten löschen",
                "keywords": "seiten aus pdf löschen seiten entfernen blätter löschen"
            },
            "reorder": {
                "title": "PDF-Seiten sortieren",
                "desc": "Seiten per Drag & Drop in die gewünschte Reihenfolge bringen.",
                "page_desc": "Sortieren Sie Ihre PDF-Seiten flexibel neu.",
                "btn": "Reihenfolge speichern",
                "keywords": "pdf seiten sortieren reihenfolge ändern seiten anordnen"
            },
            "add_page_numbers": {
                "title": "Seitenzahlen hinzufügen",
                "desc": "Automatische Seitennummerierung in Kopf- oder Fußzeile einfügen.",
                "page_desc": "Fügen Sie Seitennummern mit individuellem Format hinzu.",
                "btn": "Seitenzahlen einfügen",
                "keywords": "seitenzahlen hinzufügen seitennummerierung paginieren"
            },
            "add_watermark": {
                "title": "Wasserzeichen hinzufügen",
                "desc": "Text- oder Bild-Wasserzeichen auf dem PDF anbringen.",
                "page_desc": "Schützen Sie Ihre Dokumente mit einem Wasserzeichen.",
                "btn": "Wasserzeichen anwenden",
                "keywords": "wasserzeichen hinzufügen copyright stempel pdf schützen"
            },
            "crop": {
                "title": "PDF zuschneiden",
                "desc": "Seitenränder oder Bereiche visuell präzise zuschneiden.",
                "page_desc": "Entfernen Sie weiße Ränder und passen Sie Seitenformate an.",
                "btn": "PDF zuschneiden",
                "keywords": "foto zuschneiden online pdf zuschneiden ränder schneiden"
            }
        }
    },

    "es-MX": {
        "brand_name": "FixMyPDF",
        "tagline": "Herramientas PDF 100% Gratuitas, Privadas y Offline",
        "hero_title": "Todas las herramientas para arreglar tus PDFs.",
        "hero_subtitle": "<b>100% Seguro y Gratis.</b> Todo el procesamiento se ejecuta en tu dispositivo. Tus archivos nunca se suben a ningún servidor.",
        "search_placeholder": "Buscar herramienta (ej: 'unir pdf', 'comprimir', 'word')...",
        "no_results": "No se encontraron herramientas.",
        "drop_title": "Seleccionar archivos",
        "drop_subtitle": "o arrastra tus archivos aquí",
        "apply_continue": "Aplicar Cambios y Continuar Editando",
        "close_preview": "Cerrar Vista Previa",
        "doc_preview": "Vista Previa del Documento",
        
        "faq_badge": "PREGUNTAS FRECUENTES",
        "faq_title": "Preguntas Frecuentes sobre FixMyPDF",
        "faq_subtitle": "Resuelve tus dudas sobre privacidad, procesamiento local y herramientas gratuitas.",
        
        "faq_q1": "¿Es seguro utilizar FixMyPDF?",
        "faq_a1": "Sí, 100%. Todos los procesos se realizan en tu navegador con WebAssembly. Tus documentos jamás salen de tu computadora o teléfono.",
        
        "faq_q2": "¿Tiene costo o límites de tamaño de archivo?",
        "faq_a2": "FixMyPDF es completamente gratis y sin límites de uso ni marcas de agua.",
        
        "faq_q3": "¿Puedo usar FixMyPDF sin internet?",
        "faq_a3": "Sí, una vez que abres el sitio, funciona de manera totalmente offline.",
        
        "faq_q4": "¿Qué herramientas incluye?",
        "faq_a4": "Unir PDF, comprimir PDF, convertir PDF a Word, separar hojas de PDF, rotar PDF, Excel a PDF, PDF a JPG y muchas más.",

        "tools": {
            "merge": {
                "title": "Unir PDF",
                "desc": "Combinar archivos PDF en un solo documento organizado.",
                "page_desc": "Une múltiples archivos PDF en uno solo al instante.",
                "btn": "Unir PDFs",
                "keywords": "unir pdf combinar archivos pdf juntar pdf mezclar documentos"
            },
            "split": {
                "title": "Separar Hojas de PDF",
                "desc": "Dividir PDF o extraer páginas específicas con facilidad.",
                "page_desc": "Extrae o divide páginas de tu documento PDF de forma segura.",
                "btn": "Separar PDF",
                "keywords": "separar hojas de pdf dividir pdf cortar pdf extraer paginas"
            },
            "compress": {
                "title": "Comprimir PDF",
                "desc": "Reducir peso de PDF manteniendo la mejor calidad posible.",
                "page_desc": "Reduce el tamaño de tu archivo PDF sin perder nitidez.",
                "btn": "Comprimir PDF",
                "keywords": "comprimir pdf reducir peso de imagen reducir peso pdf bajar kb"
            },
            "pdf_to_word": {
                "title": "Convertir PDF a Word",
                "desc": "Convierte documentos PDF en archivos Word editables.",
                "page_desc": "Pasa tu PDF a formato DOCX editable con diseño conservado.",
                "btn": "Convertir a Word",
                "keywords": "convertir pdf a word editar pdf gratis pasar pdf a docx"
            },
            "word_to_pdf": {
                "title": "Word a PDF",
                "desc": "Convierte archivos DOC y DOCX a formato PDF nítido.",
                "page_desc": "Transforma documentos de Word en archivos PDF estándar.",
                "btn": "Convertir a PDF",
                "keywords": "word a pdf doc a pdf docx a pdf convertir documento"
            },
            "pdf_to_jpg": {
                "title": "PDF a JPG",
                "desc": "Convierte cada página del PDF en una imagen JPG de alta calidad.",
                "page_desc": "Extrae páginas de tu PDF como fotos JPG nítidas.",
                "btn": "Convertir a JPG",
                "keywords": "pdf a jpg convertir pdf a foto exportar imagenes"
            },
            "jpg_to_pdf": {
                "title": "JPG a PDF",
                "desc": "Convierte imágenes JPG en un archivo PDF estructurado.",
                "page_desc": "Junta múltiples fotografías JPG en un solo documento PDF.",
                "btn": "Convertir a PDF",
                "keywords": "jpg a pdf fotos a pdf imagenes a documento convertir fotos"
            },
            "pdf_to_png": {
                "title": "PDF a PNG",
                "desc": "Convierte páginas PDF en imágenes PNG nítidas sin pérdidas.",
                "page_desc": "Exporta páginas completas a gráficos PNG transparentes.",
                "btn": "Convertir a PNG",
                "keywords": "pdf a png convertir jpg a png imagen png transparente"
            },
            "png_to_pdf": {
                "title": "PNG a PDF",
                "desc": "Convierte gráficos PNG en un documento PDF uniforme.",
                "page_desc": "Transforma fotos PNG en un documento PDF de alta resolución.",
                "btn": "Convertir a PDF",
                "keywords": "png a pdf imagenes png fotos a pdf documento"
            },
            "excel_to_pdf": {
                "title": "Excel a PDF",
                "desc": "Convierte hojas de cálculo Excel en tablas PDF limpias.",
                "page_desc": "Pasa tus hojas XLS y XLSX a reportes PDF listos para imprimir.",
                "btn": "Convertir a PDF",
                "keywords": "excel a pdf xlsx a pdf hojas de calculo tablas pdf"
            },
            "rotate": {
                "title": "Girar Hojas de PDF",
                "desc": "Gira páginas o el documento entero al ángulo adecuado.",
                "page_desc": "Rota hojas en sentido horario o antihorario fácilmente.",
                "btn": "Girar PDF",
                "keywords": "girar hojas de pdf rotar paginas orientar pdf voltear"
            },
            "delete": {
                "title": "Eliminar Páginas de PDF",
                "desc": "Quita las hojas que no necesitas de tu archivo PDF.",
                "page_desc": "Elimina páginas innecesarias y descarga el documento limpio.",
                "btn": "Eliminar Páginas",
                "keywords": "eliminar paginas pdf borrar hojas quitar paginas"
            },
            "reorder": {
                "title": "Reordenar Páginas de PDF",
                "desc": "Organiza, mueve o cambia el orden de las páginas de tu archivo.",
                "page_desc": "Arrastra y organiza tus hojas en el orden que prefieras.",
                "btn": "Guardar Nuevo Orden",
                "keywords": "reordenar paginas pdf mover hojas cambiar orden"
            },
            "add_page_numbers": {
                "title": "Agregar Números de Página",
                "desc": "Inserta numeración de página con posición y formato a tu gusto.",
                "page_desc": "Numera tu documento en el encabezado o pie de página.",
                "btn": "Agregar Números",
                "keywords": "agregar numeros de pagina numerar pdf paginar documento"
            },
            "add_watermark": {
                "title": "Agregar Marca de Agua",
                "desc": "Estampa un texto o logo de marca de agua en tu PDF.",
                "page_desc": "Protege tus archivos agregando marcas de agua personalizadas.",
                "btn": "Aplicar Marca",
                "keywords": "agregar marca de agua estampar pdf proteger documento"
            },
            "crop": {
                "title": "Cortar PDF",
                "desc": "Recorta márgenes o secciones de las hojas visualmente.",
                "page_desc": "Ajusta las medidas y corta los bordes blancos de las páginas.",
                "btn": "Cortar PDF",
                "keywords": "cortar foto online cortar pdf recortar margenes recortar hojas"
            }
        }
    },

    "fr-FR": {
        "brand_name": "FixMyPDF",
        "tagline": "Outils PDF 100% Gratuits, Privés et Hors Ligne",
        "hero_title": "Tous les outils indispensables pour vos PDF.",
        "hero_subtitle": "<b>100% Sécurisé & Gratuit.</b> Tous les traitements s'effectuent directement sur votre appareil. Vos fichiers ne sont jamais envoyés sur un serveur.",
        "search_placeholder": "Rechercher un outil (ex: 'fusionner pdf', 'compresser', 'word')...",
        "no_results": "Aucun outil trouvé pour votre recherche.",
        "drop_title": "Choisir des fichiers",
        "drop_subtitle": "ou déposez vos fichiers ici",
        "apply_continue": "Appliquer et continuer à modifier",
        "close_preview": "Fermer l'aperçu",
        "doc_preview": "Aperçu du document",
        
        "faq_badge": "FOIRE AUX QUESTIONS",
        "faq_title": "Questions fréquentes sur FixMyPDF",
        "faq_subtitle": "Tout ce que vous devez savoir sur la sécurité, le traitement local et la gratuité.",
        
        "faq_q1": "FixMyPDF est-il vraiment sécurisé et confidentiel ?",
        "faq_a1": "Oui, à 100%. Tout le traitement est exécuté directement dans votre navigateur grâce à WebAssembly. Aucun fichier ne quitte votre appareil.",
        
        "faq_q2": "Y a-t-il des limites de taille ou des frais cachés ?",
        "faq_a2": "FixMyPDF est totalement gratuit, sans inscription, sans filigrane imposé et sans limite quotidienne.",
        
        "faq_q3": "Puis-je utiliser FixMyPDF hors connexion internet ?",
        "faq_a3": "Oui ! Dès que la page est chargée, vous pouvez fusionner, compresser et convertir vos PDF en mode hors ligne.",
        
        "faq_q4": "Quels outils sont proposés ?",
        "faq_a4": "Fusionner PDF, compresser PDF, convertir PDF en Word, diviser PDF, pivoter PDF, Excel en PDF, PDF en JPG/PNG et plus.",

        "tools": {
            "merge": {
                "title": "Fusionner PDF",
                "desc": "Combiner plusieurs fichiers PDF en un seul document ordonné.",
                "page_desc": "Rassemblez plusieurs fichiers PDF en un seul document instantanément.",
                "btn": "Fusionner les PDF",
                "keywords": "fusionner pdf assembler pdf combiner fichiers rassembler pdf"
            },
            "split": {
                "title": "Diviser PDF",
                "desc": "Extraire des pages ou séparer un PDF en plusieurs fichiers.",
                "page_desc": "Extrayez des pages spécifiques de votre document en un clic.",
                "btn": "Diviser le PDF",
                "keywords": "diviser pdf extraire page pdf separer pdf couper pdf"
            },
            "compress": {
                "title": "Compresser PDF",
                "desc": "Réduire le poids de vos PDF tout en conservant une bonne qualité.",
                "page_desc": "Réduisez la taille de vos fichiers PDF sans perte visible de netteté.",
                "btn": "Compresser le PDF",
                "keywords": "compresser pdf reduire poids image optimiser pdf diminuer taille"
            },
            "pdf_to_word": {
                "title": "Convertir PDF en Word",
                "desc": "Convertir des documents PDF en fichiers Word éditables (.docx).",
                "page_desc": "Passez vos documents PDF au format Word modifiable en quelques secondes.",
                "btn": "Convertir en Word",
                "keywords": "convertir pdf en word modifier pdf gratuit pdf en docx"
            },
            "word_to_pdf": {
                "title": "Word en PDF",
                "desc": "Convertir des fichiers DOC et DOCX en documents PDF de haute qualité.",
                "page_desc": "Transformez vos documents Word en fichiers PDF professionnels.",
                "btn": "Convertir en PDF",
                "keywords": "word en pdf docx en pdf doc en pdf convertir texte"
            },
            "pdf_to_jpg": {
                "title": "PDF en JPG",
                "desc": "Convertir chaque page du PDF en image JPG haute résolution.",
                "page_desc": "Exportez les pages de vos PDF en images JPG précises.",
                "btn": "Convertir en JPG",
                "keywords": "pdf en jpg gratuit extraire photo convertir pdf image"
            },
            "jpg_to_pdf": {
                "title": "JPG en PDF",
                "desc": "Convertir des images JPG en un document PDF unique.",
                "page_desc": "Regroupez vos photos JPG en un seul fichier PDF soigné.",
                "btn": "Convertir en PDF",
                "keywords": "jpg en pdf photos en pdf images vers document"
            },
            "pdf_to_png": {
                "title": "PDF en PNG",
                "desc": "Convertir des pages PDF en images PNG nettes avec transparence.",
                "page_desc": "Enregistrez vos pages de PDF sous format PNG haute définition.",
                "btn": "Convertir en PNG",
                "keywords": "pdf en png convertir jpg en png image transparente"
            },
            "png_to_pdf": {
                "title": "PNG en PDF",
                "desc": "Convertir des images PNG en document PDF sécurisé.",
                "page_desc": "Transformez vos visuels PNG en un fichier PDF haute qualité.",
                "btn": "Convertir en PDF",
                "keywords": "png en pdf convertir images png photos vers pdf"
            },
            "excel_to_pdf": {
                "title": "Excel en PDF",
                "desc": "Convertir des feuilles de calcul Excel en tableaux PDF lisibles.",
                "page_desc": "Transformez vos classeurs XLS et XLSX en rapports PDF nets.",
                "btn": "Convertir en PDF",
                "keywords": "excel en pdf tableur xlsx en pdf convertir tableau"
            },
            "rotate": {
                "title": "Pivoter PDF",
                "desc": "Faire pivoter des pages individuelles ou le document entier.",
                "page_desc": "Tournez vos pages dans le sens souhaité avec prévisualisation.",
                "btn": "Pivoter le PDF",
                "keywords": "pivoter pdf tourner page orientation pdf redresser"
            },
            "delete": {
                "title": "Supprimer des pages PDF",
                "desc": "Retirer les pages superflues ou indésirables de votre fichier.",
                "page_desc": "Sélectionnez et éliminez les pages dont vous n'avez pas besoin.",
                "btn": "Supprimer les pages",
                "keywords": "supprimer pages pdf effacer pages extraire page pdf"
            },
            "reorder": {
                "title": "Réorganiser les pages PDF",
                "desc": "Changer l'ordre des pages par glisser-déposer intuitif.",
                "page_desc": "Glissez et déposez les vignettes pour réagencer votre document.",
                "btn": "Enregistrer l'ordre",
                "keywords": "reorganiser pages pdf changer ordre classer pages"
            },
            "add_page_numbers": {
                "title": "Ajouter des numéros de page",
                "desc": "Numéroter les pages automatiquement avec position personnalisée.",
                "page_desc": "Insérez des numéros de page clairs dans l'en-tête ou le pied de page.",
                "btn": "Ajouter la numérotation",
                "keywords": "ajouter numeros de page numeroter pdf pagination"
            },
            "add_watermark": {
                "title": "Ajouter un filigrane",
                "desc": "Apposer un filigrane texte ou image pour protéger vos droits.",
                "page_desc": "Marquez vos documents avec un filigrane sur mesure.",
                "btn": "Appliquer le filigrane",
                "keywords": "ajouter filigrane proteger document copyright tampon pdf"
            },
            "crop": {
                "title": "Rogner PDF",
                "desc": "Rogner les marges blanches et ajuster le cadrage des pages.",
                "page_desc": "Découpez les bordures de vos pages avec précision.",
                "btn": "Rogner le PDF",
                "keywords": "rogner photo en ligne rogner pdf decouper marges cadrer pdf"
            }
        }
    },

    "fil-PH": {
        "brand_name": "FixMyPDF",
        "tagline": "100% Libre, Pribado at Offline na PDF Tools",
        "hero_title": "Lahat ng gamit para ayusin ang iyong mga PDF.",
        "hero_subtitle": "<b>100% Ligtas at Libre.</b> Ang lahat ng proseso ay ginagawa sa mismong device mo. Hindi kailanman ia-upload ang iyong mga file sa kahit anong server.",
        "search_placeholder": "Maghanap ng tool (hal: 'pagsamahin ang pdf', 'bawasan ang size')...",
        "no_results": "Walang nahanap na tool.",
        "drop_title": "Pumili ng mga file",
        "drop_subtitle": "o i-drag ang mga file dito",
        "apply_continue": "I-save at Magpatuloy sa Pag-edit",
        "close_preview": "Isara ang Preview",
        "doc_preview": "Silipin ang Dokumento",
        
        "faq_badge": "MGA KARANIWANG TANONG",
        "faq_title": "Mga Madalas Itanong Tungkol sa FixMyPDF",
        "faq_subtitle": "Lahat ng impormasyon tungkol sa seguridad, offline na paggamit, at mga libreng feature.",
        
        "faq_q1": "Ligtas ba talaga at pribado ang FixMyPDF?",
        "faq_a1": "Oo, 100%. Lahat ay pinoproseso sa iyong browser gamit ang WebAssembly at JavaScript. Hindi umaalis ang iyong mga file sa iyong telepono o computer.",
        
        "faq_q2": "May bayad ba o limitasyon sa laki ng file?",
        "faq_a2": "Libre ito magpakailanman. Walang subscription, walang watermark, at walang limitasyon kada araw.",
        
        "faq_q3": "Puwede ko ba itong gamitin kahit walang internet?",
        "faq_a3": "Oo! Kapag nabuksan na ang page, puwede kang mag-edit at mag-convert kahit walang koneksyon sa internet.",
        
        "faq_q4": "Anu-anong mga PDF tool ang puwede kong gamitin?",
        "faq_a4": "Pagsamahin ang PDF, bawasan ang size ng PDF, gawing Word ang PDF, hatiin ang PDF, ayusin ang mga pahina, at marami pang iba.",

        "tools": {
            "merge": {
                "title": "Pagsamahin ang PDF",
                "desc": "Pagsamahin ang ilang PDF sa isang buong dokumento.",
                "page_desc": "Pagsamahin ang maramihang mga PDF file nang mabilis at ligtas.",
                "btn": "Pagsamahin ang mga PDF",
                "keywords": "pagsamahin ang pdf combine pdf pagsamahin mga dokumento"
            },
            "split": {
                "title": "Hatiin ang PDF",
                "desc": "Kumuha ng pahina o hatiin ang PDF sa ilang file.",
                "page_desc": "Hatiin ang dokumento o kumuha ng partikular na mga pahina.",
                "btn": "Hatiin ang PDF",
                "keywords": "hatiin ang pdf cut pdf split dokumento extract pahina"
            },
            "compress": {
                "title": "Bawasan ang Size ng PDF",
                "desc": "Paliitin ang file size ng PDF nang malinaw pa rin.",
                "page_desc": "Paliitin ang laki ng PDF nang hindi nasisira ang kalidad.",
                "btn": "Paliitin ang PDF",
                "keywords": "bawasan ang size ng pdf paliitin ang size kompres pdf magbawas ng kb"
            },
            "pdf_to_word": {
                "title": "Gawing Word ang PDF",
                "desc": "I-convert ang PDF para maging Word document na puwedeng i-type.",
                "page_desc": "Gawing Word file na puwedeng baguhin ang iyong PDF.",
                "btn": "Gawing Word",
                "keywords": "gawing word ang pdf paano mag edit ng pdf convert sa docx"
            },
            "word_to_pdf": {
                "title": "Word to PDF",
                "desc": "Gawing PDF ang iyong DOC at DOCX na dokumento.",
                "page_desc": "I-convert ang iyong Word files sa matibay at maayos na PDF.",
                "btn": "Gawing PDF",
                "keywords": "word to pdf doc sa pdf docx gawing pdf"
            },
            "pdf_to_jpg": {
                "title": "Gawing Picture ang PDF (JPG)",
                "desc": "Gawing malinaw na JPG image ang bawat pahina ng PDF.",
                "page_desc": "I-save ang mga pahina ng PDF bilang mga larawang JPG.",
                "btn": "Gawing JPG",
                "keywords": "gawing picture ang pdf pdf sa jpg imahe larawan"
            },
            "jpg_to_pdf": {
                "title": "JPG to PDF",
                "desc": "Pagsamahin ang mga larawang JPG sa isang PDF file.",
                "page_desc": "Gawing isang PDF file ang iyong mga litrato at imahe.",
                "btn": "Gawing PDF",
                "keywords": "jpg to pdf larawan sa pdf gawing dokumento mga picture"
            },
            "pdf_to_png": {
                "title": "PDF to PNG",
                "desc": "Gawing malilinaw na PNG na litrato ang mga pahina ng PDF.",
                "page_desc": "I-convert ang bawat pahina sa de-kalidad na PNG litrato.",
                "btn": "Gawing PNG",
                "keywords": "pdf to png gawing png ang jpg malinaw na litrato"
            },
            "png_to_pdf": {
                "title": "PNG to PDF",
                "desc": "Gawing PDF dokumento ang iyong mga litratong PNG.",
                "page_desc": "Pagsamahin ang mga PNG imahe sa isang maayos na PDF.",
                "btn": "Gawing PDF",
                "keywords": "png to pdf litrato sa pdf convert png"
            },
            "excel_to_pdf": {
                "title": "Excel to PDF",
                "desc": "I-convert ang Excel spreadsheets sa malinis na PDF.",
                "page_desc": "Gawing PDF report ang iyong mga XLS at XLSX na spreadsheet.",
                "btn": "Gawing PDF",
                "keywords": "excel to pdf spreadsheet sa pdf table"
            },
            "rotate": {
                "title": "Iikot ang PDF",
                "desc": "Iikot ang mga pahina o buong dokumento nang maayos.",
                "page_desc": "Iikot pakanan o pakaliwa ang mga pahina ng PDF.",
                "btn": "Iikot ang PDF",
                "keywords": "iikot ang pdf rotate pahina ayusin ang orientation"
            },
            "delete": {
                "title": "Magtanggal ng Pahina sa PDF",
                "desc": "Tanggalin ang mga hindi kailangang pahina sa PDF.",
                "page_desc": "Piliin at alisin ang mga pahinang ayaw mo sa iyong file.",
                "btn": "Alisin ang mga Pahina",
                "keywords": "tanggalin ang pahina alisin ang pahina magbawas ng pahina"
            },
            "reorder": {
                "title": "Ayusin ang mga Pahina ng PDF",
                "desc": "Iayos at baguhin ang sunod-sunod na pahina ng dokumento.",
                "page_desc": "I-drag at ilipat ang mga pahina sa tamang pagkakasunod.",
                "btn": "I-save ang Ayos",
                "keywords": "ayusin ang mga pahina ng pdf pagsunud-sunurin ilipat pahina"
            },
            "add_page_numbers": {
                "title": "Magdagdag ng Page Number sa PDF",
                "desc": "Lagyan ng numero ang bawat pahina sa header o footer.",
                "page_desc": "Awtomatikong lagyan ng numero ang mga pahina ng dokumento.",
                "btn": "Lagyan ng Numero",
                "keywords": "magdagdag ng page number sa pdf numerohan ang pdf pahina"
            },
            "add_watermark": {
                "title": "Maglagay ng Watermark",
                "desc": "Lagyan ng text o logo watermark para protektahan ang PDF.",
                "page_desc": "Protektahan ang iyong gawa sa pamamagitan ng watermark.",
                "btn": "Ilagay ang Watermark",
                "keywords": "maglagay ng watermark tatak sa pdf protektahan dokumento"
            },
            "crop": {
                "title": "Putulin ang PDF",
                "desc": "Gupitin ang mga margin o gilid ng pahina ng PDF.",
                "page_desc": "I-crop ang mga puting gilid para maging sakto ang sukat.",
                "btn": "Putulin ang PDF",
                "keywords": "putulin ang litrato online putulin ang pdf crop margin"
            }
        }
    },

    "ja-JP": {
        "brand_name": "FixMyPDF",
        "tagline": "完全無料・安全・オフライン対応のPDFツール",
        "hero_title": "PDFの編集・変換に必要なすべての機能を。",
        "hero_subtitle": "<b>100%安全＆完全無料。</b> すべての処理はお使いの端末内で直接行われます。ファイルが外部サーバーに送信されることは一切ありません。",
        "search_placeholder": "ツールを検索 (例: 'pdf 結合', 'pdf 圧縮', 'word')...",
        "no_results": "一致するツールが見つかりませんでした。",
        "drop_title": "ファイルを選択",
        "drop_subtitle": "またはここにファイルをドロップ",
        "apply_continue": "変更を適用して編集を続ける",
        "close_preview": "プレビューを閉じる",
        "doc_preview": "ドキュメントプレビュー",
        
        "faq_badge": "よくあるご質問",
        "faq_title": "FixMyPDFに関するよくある質問",
        "faq_subtitle": "セキュリティ、オフライン処理、無料ツールに関する詳細情報。",
        
        "faq_q1": "FixMyPDFは本当に安全ですか？プライバシーは守られますか？",
        "faq_a1": "はい、100%安全です。すべての変換・編集はお使いのブラウザ内部（WebAssemblyとJavaScript）でローカルに実行されます。ファイルが外部サーバーにアップロードされることは絶対にありません。",
        
        "faq_q2": "ファイルサイズの制限や隠れた料金はありますか？",
        "faq_a2": "完全無料でご利用いただけます。課金、利用回数制限、透かしの強制挿入などは一切ありません。",
        
        "faq_q3": "オフラインでも利用できますか？",
        "faq_a3": "はい！ページを一度読み込めば、インターネット接続がない環境でもオフラインでPDFの結合・圧縮・変換が動作します。",
        
        "faq_q4": "どんな機能が使えますか？",
        "faq_a4": "PDF結合、PDF圧縮、PDF Word変換、PDF分割、PDF回転、ページ削除、並び替え、Excel変換、JPG/PNG変換など全16種類が揃っています。",

        "tools": {
            "merge": {
                "title": "PDF 結合",
                "desc": "複数のPDFファイルを1つの文書に瞬時に結合します。",
                "page_desc": "複数ファイルを安全に結合して1つのPDFにまとめます。",
                "btn": "PDFを結合",
                "keywords": "pdf 結合 pdf まとめる pdf つなげる pdf 連結"
            },
            "split": {
                "title": "PDF 分割",
                "desc": "特定ページの抽出や、複数ファイルへの切り分けを行います。",
                "page_desc": "不要なページを切り離したり、別ファイルとして抽出します。",
                "btn": "PDFを分割",
                "keywords": "pdf 分割 ページ抽出 pdf 切り分け ページ分離"
            },
            "compress": {
                "title": "PDF 圧縮",
                "desc": "画質を維持しながらファイル容量を大幅に削減します。",
                "page_desc": "画質を保ったままPDFのファイルサイズを軽量化します。",
                "btn": "PDFを圧縮",
                "keywords": "pdf 圧縮 画像 圧縮 ファイルサイズ 縮小 軽量化"
            },
            "pdf_to_word": {
                "title": "PDF Word 変換",
                "desc": "PDFファイルを編集可能なWord文書（DOCX）に変換します。",
                "page_desc": "レイアウトを維持したまま編集可能なWordファイルに変換します。",
                "btn": "Wordに変換",
                "keywords": "pdf word 変換 pdf 編集 無料 pdf docx 変換"
            },
            "word_to_pdf": {
                "title": "Word PDF 変換",
                "desc": "DOCやDOCXファイルを高品質なPDFドキュメントに変換。",
                "page_desc": "Word文書を標準のPDF形式に綺麗に変換します。",
                "btn": "PDFに変換",
                "keywords": "word pdf 変換 docx pdf 変換 文書 変換"
            },
            "pdf_to_jpg": {
                "title": "PDF JPG 変換",
                "desc": "各ページを高画質なJPG画像ファイルとして書き出します。",
                "page_desc": "PDFの各ページを鮮明なJPG写真画像に変換します。",
                "btn": "JPGに変換",
                "keywords": "pdf jpg 変換 pdf 画像化 写真 変換"
            },
            "jpg_to_pdf": {
                "title": "JPG PDF 変換",
                "desc": "複数のJPG写真を1つの綺麗なPDFドキュメントにまとめます。",
                "page_desc": "デジカメやスマートフォンの写真を1つのPDFに変換します。",
                "btn": "PDFに変換",
                "keywords": "jpg pdf 変換 写真 pdf 画像 ドキュメント"
            },
            "pdf_to_png": {
                "title": "PDF PNG 変換",
                "desc": "透明度と高画質を保持したままPDFをPNG画像に変換。",
                "page_desc": "PDFのページを劣化のない透過PNG画像として保存します。",
                "btn": "PNGに変換",
                "keywords": "pdf png 変換 jpg png 変換 背景 透過 画像"
            },
            "png_to_pdf": {
                "title": "PNG PDF 変換",
                "desc": "PNG画像をまとめて高品質なPDFファイルを作成します。",
                "page_desc": "イラストやスクショ画像をPDFに素早く変換します。",
                "btn": "PDFに変換",
                "keywords": "png pdf 変換 画像 pdf 作成"
            },
            "excel_to_pdf": {
                "title": "Excel PDF 変換",
                "desc": "Excelスプレッドシートを表組みの崩れなくPDFに変換。",
                "page_desc": "XLS・XLSX形式の表計算シートを見やすいPDFに変換します。",
                "btn": "PDFに変換",
                "keywords": "excel pdf 変換 表計算 スプレッドシート xlsx"
            },
            "rotate": {
                "title": "PDF 回転",
                "desc": "指定したページや文書全体の向きを90度・180度回転。",
                "page_desc": "プレビューを見ながら右回転・左回転を自在に行えます。",
                "btn": "PDFを回転",
                "keywords": "pdf 回転 向き 変更 ページ 回転 横向き 縦向き"
            },
            "delete": {
                "title": "PDF ページ 削除",
                "desc": "不要なページや空白ページを選んで簡単に取り除きます。",
                "page_desc": "削除したいページをクリックして取り除いたPDFを保存。",
                "btn": "ページを削除",
                "keywords": "pdf ページ 削除 不要ページ 削除 ページ 抜く"
            },
            "reorder": {
                "title": "PDF ページ 並び替え",
                "desc": "ドラッグ＆ドロップでページの順番を直感的に並び替え。",
                "page_desc": "サムネイルをドラッグしてお好みのページ順に整理します。",
                "btn": "順序を保存",
                "keywords": "pdf ページ 並び替え 順序 変更 ページ 移動"
            },
            "add_page_numbers": {
                "title": "ページ番号 追加",
                "desc": "ヘッダーやフッターに自動で綺麗なページ番号を挿入。",
                "page_desc": "位置やフォーマットを自由に選んでノンブルを付与します。",
                "btn": "ページ番号を追加",
                "keywords": "ページ番号 追加 ページ 番号 pdf ノンブル"
            },
            "add_watermark": {
                "title": "透かし 追加",
                "desc": "任意の文字やロゴマークを透かし（ウォーターマーク）として配置。",
                "page_desc": "社外秘や複製防止の透かし文字を簡単に追加できます。",
                "btn": "透かしを適用",
                "keywords": "透かし 追加 ウォーターマーク コピー防止"
            },
            "crop": {
                "title": "PDF トリミング",
                "desc": "余白のカットや特定エリアの切り出しを正確に行えます。",
                "page_desc": "余分なマージンをトリミングしてページを見やすく整えます。",
                "btn": "PDFをトリミング",
                "keywords": "画像 トリミング pdf 余白 カット 切り抜き"
            }
        }
    },

    "ru-RU": {
        "brand_name": "FixMyPDF",
        "tagline": "100% Бесплатные, Конфиденциальные и Офлайн Инструменты PDF",
        "hero_title": "Все инструменты для работы с вашими PDF.",
        "hero_subtitle": "<b>100% Безопасно и Бесплатно.</b> Вся обработка происходит прямо на вашем устройстве. Ваши файлы никогда не отправляются на серверы.",
        "search_placeholder": "Поиск инструмента (напр. 'объединить пдф', 'сжать пдф')...",
        "no_results": "Инструменты не найдены.",
        "drop_title": "Выберите файлы",
        "drop_subtitle": "или перетащите файлы сюда",
        "apply_continue": "Применить и продолжить редактирование",
        "close_preview": "Закрыть просмотр",
        "doc_preview": "Предпросмотр документа",
        
        "faq_badge": "ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ",
        "faq_title": "Ответы на популярные вопросы о FixMyPDF",
        "faq_subtitle": "Все о конфиденциальности, работе без интернета и бесплатных функциях.",
        
        "faq_q1": "Насколько безопасен сервис FixMyPDF?",
        "faq_a1": "На 100%. Обработка документов выполняется прямо в вашем браузере с помощью WebAssembly и JavaScript. Файлы не загружаются в облако или на сервер.",
        
        "faq_q2": "Есть ли ограничения на размер файлов или скрытая оплата?",
        "faq_a2": "FixMyPDF полностью бесплатен. Нет платных подписок, лимитов на количество операций или водяных знаков.",
        
        "faq_q3": "Работает ли сервис без подключения к интернету?",
        "faq_a3": "Да! После открытия страницы все операции объединения, сжатия и конвертации выполняются автономно в офлайн-режиме.",
        
        "faq_q4": "Какие инструменты входят в набор?",
        "faq_a4": "Объединить пдф, сжать пдф, конвертировать пдф в ворд, разделить пдф, повернуть пдф, удалить страницы, Excel в PDF и другие.",

        "tools": {
            "merge": {
                "title": "Объединить ПДФ",
                "desc": "Объединить несколько файлов PDF в один общий документ.",
                "page_desc": "Безопасно и быстро объединяйте файлы PDF без ограничений.",
                "btn": "Объединить PDF",
                "keywords": "объединить пдф склеить пдф соединить файлы пдф"
            },
            "split": {
                "title": "Разделить ПДФ",
                "desc": "Извлечь страницы или разрезать документ на части.",
                "page_desc": "Выделите нужные страницы или разделите PDF на несколько файлов.",
                "btn": "Разделить PDF",
                "keywords": "разделить пдф извлечь страницы разрезать пдф"
            },
            "compress": {
                "title": "Сжать ПДФ",
                "desc": "Уменьшить размер файла PDF с сохранением высокого качества.",
                "page_desc": "Уменьшите вес документа без потери четкости текста.",
                "btn": "Сжать PDF",
                "keywords": "сжать пдф уменьшить вес изображения оптимизировать пдф"
            },
            "pdf_to_word": {
                "title": "Конвертировать ПДФ в Ворд",
                "desc": "Преобразовать документы PDF в редактируемые файлы Word.",
                "page_desc": "Конвертируйте PDF в формат DOCX с сохранением оформления.",
                "btn": "Конвертировать в Word",
                "keywords": "конвертировать пдф в ворд редактировать пдф онлайн пдф в docx"
            },
            "word_to_pdf": {
                "title": "Word в PDF",
                "desc": "Преобразовать документы DOC и DOCX в аккуратный PDF.",
                "page_desc": "Переведите файлы Word в стандартный PDF документ.",
                "btn": "Конвертировать в PDF",
                "keywords": "ворд в пдф doc в pdf docx в pdf документ"
            },
            "pdf_to_jpg": {
                "title": "ПДФ в JPG",
                "desc": "Сохранить каждую страницу PDF как качественное изображение JPG.",
                "page_desc": "Извлеките все страницы документа в виде четких картинок JPG.",
                "btn": "Конвертировать в JPG",
                "keywords": "пдф в jpg перевести пдф в картинки фото из пдф"
            },
            "jpg_to_pdf": {
                "title": "JPG в PDF",
                "desc": "Объединить фотографии и картинки JPG в один файл PDF.",
                "page_desc": "Соберите изображения JPG в структурированный PDF документ.",
                "btn": "Конвертировать в PDF",
                "keywords": "jpg в pdf фото в пдф картинки в документ"
            },
            "pdf_to_png": {
                "title": "Перевести ПДФ в ПНГ",
                "desc": "Экспортировать страницы PDF в качественные изображения PNG.",
                "page_desc": "Конвертируйте страницы в графику PNG с поддержкой прозрачности.",
                "btn": "Конвертировать в PNG",
                "keywords": "перевести пдф в пнг конвертер jpg в png прозрачный фон"
            },
            "png_to_pdf": {
                "title": "PNG в PDF",
                "desc": "Преобразовать рисунки и графику PNG в единый PDF.",
                "page_desc": "Создайте PDF файл из набора изображений PNG.",
                "btn": "Конвертировать в PDF",
                "keywords": "png в pdf конвертер картинок png в документ"
            },
            "excel_to_pdf": {
                "title": "Excel в PDF",
                "desc": "Преобразовать таблицы Excel XLS/XLSX в аккуратные PDF.",
                "page_desc": "Экспортируйте таблицы Excel в удобный для печати формат PDF.",
                "btn": "Конвертировать в PDF",
                "keywords": "excel в pdf таблицы xlsx в pdf отчет таблица"
            },
            "rotate": {
                "title": "Повернуть ПДФ",
                "desc": "Повернуть отдельные страницы или весь документ целиком.",
                "page_desc": "Поворачивайте страницы по часовой стрелке или против нее.",
                "btn": "Повернуть PDF",
                "keywords": "повернуть пдф ориентация страниц развернуть пдф"
            },
            "delete": {
                "title": "Удалить страницы из ПДФ",
                "desc": "Удалить ненужные листы из файла PDF в пару кликов.",
                "page_desc": "Уберите лишние страницы и сохраните готовый документ.",
                "btn": "Удалить страницы",
                "keywords": "удалить страницы из пдф убрать листы стереть страницы"
            },
            "reorder": {
                "title": "Изменить порядок страниц",
                "desc": "Переставить страницы документа простым перетаскиванием.",
                "page_desc": "Упорядочивайте страницы перетягиванием миниатюр мышью.",
                "btn": "Сохранить порядок",
                "keywords": "изменить порядок страниц переставить листы сортировка пдф"
            },
            "add_page_numbers": {
                "title": "Добавить номера страниц",
                "desc": "Вставить автоматическую нумерацию страниц в колонтитулы.",
                "page_desc": "Пронумеруйте страницы документа с выбором расположения.",
                "btn": "Добавить номера",
                "keywords": "добавить номера страниц нумерация пдф колонтитулы"
            },
            "add_watermark": {
                "title": "Добавить водяной знак",
                "desc": "Поставить штамп с текстом или логотипом для защиты файла.",
                "page_desc": "Защитите авторские права с помощью фирменного водяного знака.",
                "btn": "Применить знак",
                "keywords": "добавить водяной знак штамп пдф защита авторских прав"
            },
            "crop": {
                "title": "Обрезать ПДФ",
                "desc": "Обрезать белые поля или выделить нужную область страниц.",
                "page_desc": "Точно настройте границы и обрежьте лишние поля страниц.",
                "btn": "Обрезать PDF",
                "keywords": "обрезать фото онлайн обрезать пдф убрать поля кадрирование"
            }
        }
    },

    "es-ES": {
        "brand_name": "FixMyPDF",
        "tagline": "Herramientas PDF 100% Gratuitas, Privadas y Sin Conexión",
        "hero_title": "Todas las herramientas para gestionar tus PDF.",
        "hero_subtitle": "<b>100% Seguro y Gratuito.</b> Todo el procesamiento se realiza en tu navegador. Tus archivos nunca se suben a ningún servidor externo.",
        "search_placeholder": "Buscar herramienta (ej: 'unir pdf', 'reducir tamaño pdf', 'word')...",
        "no_results": "No se encontraron herramientas que coincidan.",
        "drop_title": "Seleccionar archivos",
        "drop_subtitle": "o arrastra los archivos aquí",
        "apply_continue": "Aplicar cambios y continuar editando",
        "close_preview": "Cerrar vista previa",
        "doc_preview": "Vista previa del documento",
        
        "faq_badge": "PREGUNTAS FRECUENTES",
        "faq_title": "Preguntas y Respuestas sobre FixMyPDF",
        "faq_subtitle": "Privacidad garantizada, funcionamiento offline y herramientas sin suscripciones.",
        
        "faq_q1": "¿Es seguro utilizar FixMyPDF?",
        "faq_a1": "Sí, totalmente. Todo el procesamiento se ejecuta en el navegador con WebAssembly. Tus documentos no se transmiten a internet ni se almacenan en servidores.",
        
        "faq_q2": "¿Hay límites de tamaño o planes de pago?",
        "faq_a2": "FixMyPDF es gratuito para siempre. Sin suscripciones, sin límites diarios y sin marcas de agua añadidas.",
        
        "faq_q3": "¿Funciona sin conexión a internet?",
        "faq_a3": "Sí. Una vez cargada la página, puedes procesar tus archivos de forma totalmente offline en tu ordenador o móvil.",
        
        "faq_q4": "¿Qué herramientas incluye?",
        "faq_a4": "Unir PDF, reducir tamaño PDF, pasar PDF a Word, dividir PDF, girar páginas PDF, Excel a PDF, PDF a JPG/PNG y mucho más.",

        "tools": {
            "merge": {
                "title": "Unir PDF",
                "desc": "Combinar PDF gratis y unir varios documentos en uno solo.",
                "page_desc": "Une múltiples archivos PDF de forma rápida y confidencial.",
                "btn": "Unir PDFs",
                "keywords": "unir pdf combinar pdf gratis juntar pdf fusionar archivos"
            },
            "split": {
                "title": "Dividir PDF",
                "desc": "Separar páginas o extraer capítulos de un archivo PDF.",
                "page_desc": "Extrae páginas individuales o divide tu PDF en varios archivos.",
                "btn": "Dividir PDF",
                "keywords": "dividir pdf separar pdf cortar pdf extraer hojas"
            },
            "compress": {
                "title": "Reducir Tamaño PDF",
                "desc": "Comprimir PDF y reducir peso manteniendo la máxima claridad.",
                "page_desc": "Reduce el tamaño de tu archivo PDF sin perder calidad gráfica.",
                "btn": "Reducir tamaño",
                "keywords": "reducir tamaño pdf comprimir pdf optimizar pdf bajar peso"
            },
            "pdf_to_word": {
                "title": "Pasar PDF a Word",
                "desc": "Convertir documentos PDF a formato Word (.docx) editable.",
                "page_desc": "Transforma tus archivos PDF en documentos de Word totalmente editables.",
                "btn": "Convertir a Word",
                "keywords": "pasar pdf a word editar pdf online convertir a docx"
            },
            "word_to_pdf": {
                "title": "Word a PDF",
                "desc": "Convertir documentos DOC y DOCX a formato PDF profesional.",
                "page_desc": "Pasa tus archivos Word a un PDF con tipografía y formato intactos.",
                "btn": "Convertir a PDF",
                "keywords": "word a pdf doc a pdf docx a pdf convertir documento"
            },
            "pdf_to_jpg": {
                "title": "Convertir PDF a JPG",
                "desc": "Extraer cada página del PDF como una imagen JPG nítida.",
                "page_desc": "Convierte todas las páginas de tu PDF en imágenes JPG listas para compartir.",
                "btn": "Convertir a JPG",
                "keywords": "convertir pdf a jpg pdf a imagenes fotos de pdf"
            },
            "jpg_to_pdf": {
                "title": "JPG a PDF",
                "desc": "Unir varias fotos JPG en un único documento PDF.",
                "page_desc": "Transforma imágenes y fotos JPG en un documento PDF limpio.",
                "btn": "Convertir a PDF",
                "keywords": "jpg a pdf fotos a pdf imagenes a documento"
            },
            "pdf_to_png": {
                "title": "PDF a PNG",
                "desc": "Convertir páginas PDF a imágenes PNG de calidad sin pérdidas.",
                "page_desc": "Exporta tus páginas en gráficos PNG con fondo transparente.",
                "btn": "Convertir a PNG",
                "keywords": "pdf a png convertir formato imagen hacer fondo transparente"
            },
            "png_to_pdf": {
                "title": "PNG a PDF",
                "desc": "Convertir gráficos e imágenes PNG en archivo PDF.",
                "page_desc": "Crea un documento PDF con tus archivos de imagen PNG.",
                "btn": "Convertir a PDF",
                "keywords": "png a pdf imagenes png a documento"
            },
            "excel_to_pdf": {
                "title": "Excel a PDF",
                "desc": "Convertir hojas de cálculo Excel XLS/XLSX en tablas PDF.",
                "page_desc": "Pasa tus tablas de cálculo a un documento PDF formal.",
                "btn": "Convertir a PDF",
                "keywords": "excel a pdf xlsx a pdf tablas de calculo"
            },
            "rotate": {
                "title": "Girar Páginas PDF",
                "desc": "Rotar páginas específicas o todo el documento fácilmente.",
                "page_desc": "Corrige la orientación de tus páginas con vista previa interactiva.",
                "btn": "Girar PDF",
                "keywords": "girar paginas pdf rotar pdf orientacion paginas"
            },
            "delete": {
                "title": "Eliminar Páginas de PDF",
                "desc": "Borrar hojas sobrantes o páginas innecesarias del documento.",
                "page_desc": "Selecciona las hojas a desechar y descarga el PDF limpio.",
                "btn": "Eliminar Páginas",
                "keywords": "eliminar paginas pdf borrar hojas quitar paginas"
            },
            "reorder": {
                "title": "Reordenar Páginas PDF",
                "desc": "Cambiar el orden de las páginas arrastrando miniaturas.",
                "page_desc": "Organiza tus páginas arrastrándolas a la posición deseada.",
                "btn": "Guardar Orden",
                "keywords": "reordenar paginas pdf mover hojas cambiar orden"
            },
            "add_page_numbers": {
                "title": "Añadir Números de Página",
                "desc": "Insertar paginación personalizada en cabecera o pie de página.",
                "page_desc": "Añade números de página con el formato y posición que elijas.",
                "btn": "Añadir Números",
                "keywords": "añadir numeros de pagina numerar pdf paginar"
            },
            "add_watermark": {
                "title": "Añadir Marca de Agua",
                "desc": "Estampar marca de agua de texto o imagen para protección.",
                "page_desc": "Protege tus documentos añadiendo un sello de agua legal.",
                "btn": "Aplicar Marca de Agua",
                "keywords": "añadir marca de agua estampar pdf proteger copyright"
            },
            "crop": {
                "title": "Recortar PDF",
                "desc": "Ajustar márgenes y recortar bordes de páginas con precisión.",
                "page_desc": "Elimina los márgenes blancos y encuadra tus páginas al milímetro.",
                "btn": "Recortar PDF",
                "keywords": "recortar foto online recortar pdf ajustar margenes"
            }
        }
    },

    "vi-VN": {
        "brand_name": "FixMyPDF",
        "tagline": "Công Cụ PDF 100% Miễn Phí, Bảo Mật & Offline",
        "hero_title": "Mọi công cụ bạn cần để xử lý file PDF.",
        "hero_subtitle": "<b>100% An toàn & Miễn phí.</b> Mọi xử lý diễn ra trực tiếp trên thiết bị của bạn. Tệp của bạn không bao giờ bị tải lên bất kỳ máy chủ nào.",
        "search_placeholder": "Tìm kiếm công cụ (ví dụ: 'gộp file pdf', 'nén file pdf')...",
        "no_results": "Không tìm thấy công cụ phù hợp.",
        "drop_title": "Chọn tệp",
        "drop_subtitle": "hoặc kéo thả tệp vào đây",
        "apply_continue": "Áp dụng & Tiếp tục Chỉnh sửa",
        "close_preview": "Đóng xem trước",
        "doc_preview": "Xem trước tài liệu",
        
        "faq_badge": "CÂU HỎI THƯỜNG GẶP",
        "faq_title": "Các Câu Hỏi Thường Gặp Về FixMyPDF",
        "faq_subtitle": "Thông tin chi tiết về bảo mật, xử lý ngoại tuyến và công cụ miễn phí.",
        
        "faq_q1": "FixMyPDF có thực sự an toàn và bảo mật không?",
        "faq_a1": "Có, 100%. Tất cả quá trình chuyển đổi và chỉnh sửa chạy hoàn toàn trên trình duyệt của bạn thông qua WebAssembly. Tài liệu không bao giờ rời khỏi máy tính hoặc điện thoại của bạn.",
        
        "faq_q2": "Có giới hạn dung lượng tệp hoặc phí ẩn không?",
        "faq_a2": "FixMyPDF hoàn toàn miễn phí mãi mãi. Không yêu cầu đăng ký, không giới hạn số lần sử dụng hàng ngày và không chèn hình mờ.",
        
        "faq_q3": "Tôi có thể sử dụng khi không có mạng internet không?",
        "faq_a3": "Có! Sau khi tải trang xong, bạn hoàn toàn có thể gộp, nén, chuyển đổi PDF ngay cả khi ngắt kết nối mạng.",
        
        "faq_q4": "FixMyPDF hỗ trợ những công cụ nào?",
        "faq_a4": "Bao gồm gộp file pdf, nén file pdf, chuyển pdf sang word, tách trang pdf, xoay file pdf, xóa trang trong pdf, chuyển ảnh sang pdf và nhiều công cụ khác.",

        "tools": {
            "merge": {
                "title": "Gộp File PDF",
                "desc": "Kết hợp nhiều file PDF thành một tài liệu thống nhất.",
                "page_desc": "Gộp nhiều tệp PDF lại với nhau nhanh chóng và an toàn tuyệt đối.",
                "btn": "Gộp các file PDF",
                "keywords": "gộp file pdf nối pdf kết hợp tài liệu ghép pdf"
            },
            "split": {
                "title": "Tách Trang PDF",
                "desc": "Trích xuất trang hoặc chia nhỏ PDF thành nhiều tệp riêng biệt.",
                "page_desc": "Tách các trang cụ thể ra khỏi tài liệu một cách thuận tiện.",
                "btn": "Tách PDF",
                "keywords": "tách trang pdf chia nhỏ pdf trích xuất trang cắt pdf"
            },
            "compress": {
                "title": "Nén File PDF",
                "desc": "Giảm dung lượng tệp PDF mà vẫn giữ chất lượng sắc nét.",
                "page_desc": "Giảm dung lượng tài liệu nhanh chóng mà không làm mờ nội dung.",
                "btn": "Nén PDF",
                "keywords": "nén file pdf giảm dung lượng ảnh giảm kb tài liệu"
            },
            "pdf_to_word": {
                "title": "Chuyển PDF sang Word",
                "desc": "Chuyển đổi tài liệu PDF thành file Word DOCX có thể chỉnh sửa.",
                "page_desc": "Chuyển đổi PDF sang văn bản Word mà vẫn giữ nguyên định dạng.",
                "btn": "Chuyển sang Word",
                "keywords": "chuyển pdf sang word chỉnh sửa pdf miễn phí pdf sang docx"
            },
            "word_to_pdf": {
                "title": "Word sang PDF",
                "desc": "Chuyển đổi file DOC và DOCX thành tài liệu PDF chuẩn.",
                "page_desc": "Đổi tệp văn bản Word thành định dạng PDF chất lượng cao.",
                "btn": "Chuyển sang PDF",
                "keywords": "word sang pdf doc sang pdf docx thành pdf"
            },
            "pdf_to_jpg": {
                "title": "PDF sang JPG",
                "desc": "Chuyển đổi từng trang PDF thành hình ảnh JPG độ phân giải cao.",
                "page_desc": "Xuất các trang PDF thành ảnh JPG rõ nét để dễ chia sẻ.",
                "btn": "Chuyển sang JPG",
                "keywords": "pdf sang jpg xuất ảnh pdf chuyển tài liệu thành ảnh"
            },
            "jpg_to_pdf": {
                "title": "Chuyển File Ảnh Sang PDF (JPG)",
                "desc": "Chuyển đổi nhiều hình ảnh JPG thành một tệp PDF hoàn chỉnh.",
                "page_desc": "Gộp các bức ảnh JPG thành một tài liệu PDF gọn gàng.",
                "btn": "Chuyển sang PDF",
                "keywords": "chuyển file ảnh sang pdf jpg sang pdf ghép ảnh thành pdf"
            },
            "pdf_to_png": {
                "title": "Chuyển Ảnh Sang PNG (từ PDF)",
                "desc": "Chuyển đổi trang PDF thành hình ảnh PNG chất lượng cao trong suốt.",
                "page_desc": "Lưu các trang PDF thành ảnh PNG sắc nét không bị vỡ hạt.",
                "btn": "Chuyển sang PNG",
                "keywords": "chuyển ảnh sang png pdf sang png ảnh không nền"
            },
            "png_to_pdf": {
                "title": "PNG sang PDF",
                "desc": "Chuyển đổi ảnh đồ họa PNG thành tài liệu PDF chuẩn.",
                "page_desc": "Đổi các hình ảnh PNG thành tài liệu PDF thuận tiện.",
                "btn": "Chuyển sang PDF",
                "keywords": "png sang pdf ảnh sang tài liệu chuyển file png"
            },
            "excel_to_pdf": {
                "title": "Excel sang PDF",
                "desc": "Chuyển đổi bảng tính Excel XLS/XLSX thành file PDF dễ đọc.",
                "page_desc": "Xuất bảng biểu Excel sang tài liệu PDF chuẩn bị in ấn.",
                "btn": "Chuyển sang PDF",
                "keywords": "excel sang pdf bảng tính sang pdf xlsx thành pdf"
            },
            "rotate": {
                "title": "Xoay File PDF",
                "desc": "Xoay trang cụ thể hoặc toàn bộ tài liệu theo đúng chiều mong muốn.",
                "page_desc": "Xoay trang theo chiều kim đồng hồ hoặc ngược lại có xem trước.",
                "btn": "Xoay PDF",
                "keywords": "xoay file pdf chỉnh chiều trang lật trang pdf"
            },
            "delete": {
                "title": "Xóa Trang Trong PDF",
                "desc": "Bỏ bớt các trang thừa hoặc không cần thiết khỏi tệp PDF.",
                "page_desc": "Chọn và xóa các trang không mong muốn một cách dễ dàng.",
                "btn": "Xóa trang đã chọn",
                "keywords": "xóa trang trong pdf loại bỏ trang bớt trang thừa"
            },
            "reorder": {
                "title": "Sắp Xếp Lại Trang PDF",
                "desc": "Kéo thả để sắp xếp lại thứ tự các trang trong tài liệu.",
                "page_desc": "Sắp xếp trang theo đúng thứ tự bạn muốn bằng thao tác kéo thả.",
                "btn": "Lưu thứ tự mới",
                "keywords": "sắp xếp lại trang sắp xếp thứ tự đổi chỗ trang pdf"
            },
            "add_page_numbers": {
                "title": "Thêm Số Trang",
                "desc": "Chèn đánh số trang tự động vào đầu trang hoặc chân trang.",
                "page_desc": "Đánh số thứ tự các trang theo vị trí tùy chọn một cách chuyên nghiệp.",
                "btn": "Thêm số trang",
                "keywords": "thêm số trang đánh số trang phân trang pdf"
            },
            "add_watermark": {
                "title": "Chèn Hình Mờ (Watermark)",
                "desc": "Đóng dấu bản quyền chữ hoặc logo vào tệp PDF của bạn.",
                "page_desc": "Bảo vệ tài liệu bằng cách chèn hình mờ tùy chỉnh an toàn.",
                "btn": "Áp dụng Watermark",
                "keywords": "chèn hình mờ đóng dấu pdf watermark bảo vệ bản quyền"
            },
            "crop": {
                "title": "Cắt Trang PDF",
                "desc": "Cắt bớt viền trắng thừa hoặc vùng cụ thể trên trang.",
                "page_desc": "Cắt lề trang chính xác và cân đối kích thước hiển thị.",
                "btn": "Cắt PDF",
                "keywords": "cắt ảnh online cắt trang pdf xén lề trắng crop pdf"
            }
        }
    }
};

// Aliases for locale codes
const LOCALE_ALIASES = {
    "pt": "pt-BR",
    "id": "id-ID",
    "de": "de-DE",
    "es": "es-ES",
    "fr": "fr-FR",
    "fil": "fil-PH",
    "tl": "fil-PH",
    "ja": "ja-JP",
    "ru": "ru-RU",
    "vi": "vi-VN",
    "en-US": "en",
    "en-GB": "en"
};

class I18nManager {
    constructor() {
        this.currentLang = this.detectLanguage();
        this.init();
    }

    detectLanguage() {
        // 1. URL search param ?lang=
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang) {
            const normalized = this.normalizeLocale(urlLang);
            if (I18N_TRANSLATIONS[normalized]) return normalized;
        }

        // 2. Local storage
        const savedLang = localStorage.getItem('fixmypdf_lang');
        if (savedLang) {
            const normalized = this.normalizeLocale(savedLang);
            if (I18N_TRANSLATIONS[normalized]) return normalized;
        }

        // 3. Browser navigator language
        if (navigator.language) {
            const normalized = this.normalizeLocale(navigator.language);
            if (I18N_TRANSLATIONS[normalized]) return normalized;
            
            // Check base 2-letter language code
            const baseCode = navigator.language.split('-')[0].toLowerCase();
            const mapped = LOCALE_ALIASES[baseCode];
            if (mapped && I18N_TRANSLATIONS[mapped]) return mapped;
        }

        return 'en';
    }

    normalizeLocale(code) {
        if (!code) return 'en';
        if (I18N_TRANSLATIONS[code]) return code;
        if (LOCALE_ALIASES[code]) return LOCALE_ALIASES[code];
        const lower = code.toLowerCase();
        for (const key of Object.keys(I18N_TRANSLATIONS)) {
            if (key.toLowerCase() === lower) return key;
        }
        for (const [alias, target] of Object.entries(LOCALE_ALIASES)) {
            if (alias.toLowerCase() === lower) return target;
        }
        return 'en';
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.applyLanguage(this.currentLang));
        } else {
            this.applyLanguage(this.currentLang);
        }
    }

    applyLanguage(lang) {
        lang = this.normalizeLocale(lang);
        this.currentLang = lang;
        const dict = I18N_TRANSLATIONS[lang] || I18N_TRANSLATIONS['en'];
        const fallback = I18N_TRANSLATIONS['en'];

        // Update html tag lang
        document.documentElement.lang = lang;

        // Save preference
        try {
            localStorage.setItem('fixmypdf_lang', lang);
        } catch (e) {
            console.warn('localStorage not accessible', e);
        }

        // Sync URL param without page reload
        try {
            const url = new URL(window.location.href);
            if (lang === 'en') {
                url.searchParams.delete('lang');
            } else {
                url.searchParams.set('lang', lang);
            }
            window.history.replaceState({}, '', url.toString());
        } catch (e) {
            console.warn('Could not update history state', e);
        }

        // Update dropdown selector if present
        const select = document.getElementById('lang-select');
        if (select) {
            select.value = lang;
            if (!select.dataset.listenerAttached) {
                select.addEventListener('change', (e) => {
                    this.applyLanguage(e.target.value);
                });
                select.dataset.listenerAttached = 'true';
            }
        }

        // 1. Translate general data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const val = dict[key] !== undefined ? dict[key] : fallback[key];
            if (val !== undefined) {
                if (typeof val === 'string' && (val.includes('<') || val.includes('&'))) {
                    el.innerHTML = val;
                } else {
                    el.textContent = val;
                }
            }
        });

        // 2. Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const val = dict[key] !== undefined ? dict[key] : fallback[key];
            if (val !== undefined) {
                el.placeholder = val;
            }
        });

        // 3. Translate tool cards on homepage
        document.querySelectorAll('[data-i18n-tool]').forEach(el => {
            const toolKey = el.getAttribute('data-i18n-tool');
            const toolData = (dict.tools && dict.tools[toolKey]) || (fallback.tools && fallback.tools[toolKey]);
            if (toolData) {
                const titleEl = el.querySelector('h3, .tool-title');
                const descEl = el.querySelector('p, .tool-desc');
                if (titleEl && toolData.title) titleEl.textContent = toolData.title;
                if (descEl && toolData.desc) descEl.textContent = toolData.desc;
                if (toolData.keywords) el.setAttribute('data-keywords', toolData.keywords);
            }
        });

        // 4. Translate specific tool page elements
        const toolPageId = document.body.getAttribute('data-tool-page');
        if (toolPageId) {
            const toolData = (dict.tools && dict.tools[toolPageId]) || (fallback.tools && fallback.tools[toolPageId]);
            if (toolData) {
                const titleEl = document.querySelector('.tool-header h1');
                const descEl = document.querySelector('.tool-header p');
                const btnEl = document.getElementById(toolPageId + '-btn') || document.querySelector('.action-btn:not(#apply-and-continue-btn)');
                
                if (titleEl && toolData.title) titleEl.textContent = toolData.title;
                if (descEl && toolData.page_desc) descEl.textContent = toolData.page_desc;
                if (btnEl && toolData.btn) {
                    // Preserving icon if present
                    const icon = btnEl.querySelector('i');
                    btnEl.textContent = toolData.btn + ' ';
                    if (icon) btnEl.appendChild(icon);
                }
            }
        }

        // Dispatch global event for external scripts (e.g. app.js search)
        window.dispatchEvent(new CustomEvent('fixmypdf:languageChanged', { detail: { lang, dict } }));
    }

    t(key) {
        const dict = I18N_TRANSLATIONS[this.currentLang] || I18N_TRANSLATIONS['en'];
        return dict[key] || I18N_TRANSLATIONS['en'][key] || key;
    }
}

// Global instance
window.i18nManager = new I18nManager();

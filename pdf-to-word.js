// --- FIXMYPDF: PDF TO WORD WITH PRESERVED DESIGN --- //

document.addEventListener('DOMContentLoaded', () => {

    // UI Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const optionsPanel = document.getElementById('options-panel');
    
    const fileNameDisplay = document.getElementById('file-name-display').querySelector('span');
    const pageCountDisplay = document.getElementById('page-count-display');
    
    const previewCanvas = document.getElementById('preview-canvas');
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    const pageIndicator = document.getElementById('page-indicator');
    
    const convertToWordBtn = document.getElementById('convert-to-word-btn');
    const removeFileBtn = document.getElementById('remove-file-btn');
    const statusMessage = document.getElementById('status-message');

    let currentFile = null;
    let fileBinaryBytes = null;
    let totalPages = 0;
    let pdfDocument = null;
    let currentPage = 1;
    let pageImages = []; // Store page images as data URLs
    let pageTextData = []; // Store text data for each page

    // Initialize PDF.js
    const pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

    // Page navigation
    prevPageBtn.addEventListener('click', async () => {
        if (currentPage > 1) {
            currentPage--;
            await renderPreview(currentPage);
            updatePageIndicator();
        }
    });

    nextPageBtn.addEventListener('click', async () => {
        if (currentPage < totalPages) {
            currentPage++;
            await renderPreview(currentPage);
            updatePageIndicator();
        }
    });

    function updatePageIndicator() {
        pageIndicator.textContent = `Page ${currentPage} / ${totalPages}`;
    }

    // Render preview
    async function renderPreview(pageNum) {
        if (!pdfDocument) return;
        
        try {
            const page = await pdfDocument.getPage(pageNum);
            const viewport = page.getViewport({ scale: 0.8 });
            
            previewCanvas.width = viewport.width;
            previewCanvas.height = viewport.height;
            
            const renderContext = {
                canvasContext: previewCanvas.getContext('2d'),
                viewport: viewport
            };
            
            await page.render(renderContext).promise;
            
        } catch (error) {
            console.error('Error rendering preview:', error);
        }
    }

    // Convert page to high-quality image
    async function pageToImage(pageNum, scale = 2) {
        const page = await pdfDocument.getPage(pageNum);
        const viewport = page.getViewport({ scale: scale });
        
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        const renderContext = {
            canvasContext: canvas.getContext('2d'),
            viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        return canvas.toDataURL('image/png');
    }

    // Extract text with exact positions
    async function extractTextWithPositions(pageNum, pageWidth, pageHeight) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const textItems = [];
        
        for (const item of textContent.items) {
            if (item.str && item.str.trim()) {
                const transform = item.transform;
                const x = transform[4];
                const y = pageHeight - transform[5]; // Convert Y coordinate (PDF origin is bottom-left)
                const fontSize = Math.abs(transform[3]) || 12;
                const fontName = item.fontName || '';
                
                textItems.push({
                    text: item.str,
                    x: x,
                    y: y,
                    width: item.width || (item.str.length * fontSize * 0.6),
                    height: fontSize,
                    fontSize: fontSize,
                    isBold: fontName.toLowerCase().includes('bold'),
                    isItalic: fontName.toLowerCase().includes('italic')
                });
            }
        }
        
        // Group nearby text into lines/paragraphs
        const grouped = [];
        const used = new Set();
        
        for (let i = 0; i < textItems.length; i++) {
            if (used.has(i)) continue;
            
            const group = [textItems[i]];
            used.add(i);
            
            for (let j = i + 1; j < textItems.length; j++) {
                if (used.has(j)) continue;
                
                // Check if same line (Y difference less than font size)
                if (Math.abs(textItems[i].y - textItems[j].y) < textItems[i].height) {
                    group.push(textItems[j]);
                    used.add(j);
                }
            }
            
            // Sort by X position
            group.sort((a, b) => a.x - b.x);
            
            grouped.push({
                text: group.map(g => g.text).join(' '),
                x: group[0].x,
                y: group[0].y,
                width: group[group.length - 1].x + group[group.length - 1].width - group[0].x,
                height: group[0].height,
                fontSize: group[0].fontSize,
                isBold: group[0].isBold,
                isItalic: group[0].isItalic
            });
        }
        
        return grouped;
    }

    // Generate Word XML with background images and text boxes
    async function generateWordDocx() {
        statusMessage.innerHTML = 'Converting pages to images... <i class="ph-bold ph-spinner ph-spin"></i>';
        
        // Convert all pages to high-quality images
        const pageImages_ = [];
        for (let i = 1; i <= totalPages; i++) {
            statusMessage.innerHTML = `Converting page ${i}/${totalPages} to image... <i class="ph-bold ph-spinner ph-spin"></i>`;
            const imgData = await pageToImage(i, 2); // 2x resolution for quality
            pageImages_.push(imgData);
            
            // Extract text for this page
            const page = await pdfDocument.getPage(i);
            const viewport = page.getViewport({ scale: 1 });
            const textData = await extractTextWithPositions(i, viewport.width, viewport.height);
            pageTextData.push(textData);
        }
        
        statusMessage.innerHTML = 'Building Word document... <i class="ph-bold ph-spinner ph-spin"></i>';
        
        // Build HTML/Word document
        let documentHtml = `<!DOCTYPE html>
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset="UTF-8">
            <title>${currentFile.name.replace('.pdf', '')}</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background: #E2E8F0;
                }
                @page {
                    size: A4;
                    margin: 0;
                }
                .page {
                    position: relative;
                    width: 100%;
                    max-width: 1200px;
                    margin: 20px auto;
                    background: white;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    page-break-after: always;
                }
                .page-background {
                    width: 100%;
                    height: auto;
                    display: block;
                }
                .text-layer {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }
                .editable-text {
                    position: absolute;
                    font-family: 'Calibri', 'Arial', sans-serif;
                    white-space: pre-wrap;
                    word-break: break-word;
                    background: transparent;
                    pointer-events: auto;
                    cursor: text;
                    padding: 2px;
                    margin: 0;
                    border: none;
                }
                .editable-text:hover {
                    background: rgba(229, 50, 45, 0.05);
                }
                .editable-text:focus-visible {
                    outline: 1px solid #E5322D;
                    background: rgba(229, 50, 45, 0.08);
                }
            </style>
        </head>
        <body>`;
        
        // Add each page
        for (let i = 0; i < totalPages; i++) {
            const imgData = pageImages_[i];
            const texts = pageTextData[i];
            
            // Get image dimensions
            const img = new Image();
            await new Promise((resolve) => {
                img.onload = resolve;
                img.src = imgData;
            });
            
            const imgWidth = img.width;
            const imgHeight = img.height;
            
            documentHtml += `
            <div class="page" style="width: ${imgWidth}px; position: relative;">
                <img class="page-background" src="${imgData}" style="width: ${imgWidth}px; height: ${imgHeight}px;">
                <div class="text-layer" style="width: ${imgWidth}px; height: ${imgHeight}px;">`;
            
            // Add text boxes
            for (const text of texts) {
                const left = (text.x / imgWidth) * 100;
                const top = (text.y / imgHeight) * 100;
                const width = (text.width / imgWidth) * 100;
                const fontSize = (text.fontSize / imgHeight) * 100;
                
                let fontWeight = text.isBold ? 'bold' : 'normal';
                let fontStyle = text.isItalic ? 'italic' : 'normal';
                
                documentHtml += `
                    <div class="editable-text" 
                         contenteditable="true"
                         style="left: ${left}%; 
                                top: ${top}%; 
                                width: ${width}%; 
                                font-size: ${fontSize}%; 
                                font-weight: ${fontWeight}; 
                                font-style: ${fontStyle};
                                line-height: 1.3;">
                        ${escapeHtml(text.text)}
                    </div>`;
            }
            
            documentHtml += `
                </div>
            </div>`;
        }
        
        documentHtml += `
        </body>
        </html>`;
        
        // Create .docx file (Word can open HTML as .docx)
        const blob = new Blob([documentHtml], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = currentFile.name.replace('.pdf', '_Editable.docx');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return true;
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Convert button click
    convertToWordBtn.addEventListener('click', async () => {
        if (!currentFile) {
            alert('Please upload a PDF file first.');
            return;
        }
        
        convertToWordBtn.disabled = true;
        convertToWordBtn.innerHTML = '<i class="ph-bold ph-spinner ph-spin"></i> Converting...';
        
        try {
            await generateWordDocx();
            statusMessage.innerHTML = '<i class="ph-fill ph-check-circle" style="color:#10B981;"></i> Success! Download complete. Open the file in Microsoft Word to edit text.';
            statusMessage.style.color = '#10B981';
        } catch (error) {
            console.error(error);
            statusMessage.innerHTML = '<i class="ph-fill ph-warning-circle"></i> Error converting document.';
            statusMessage.style.color = 'var(--brand-color)';
        } finally {
            convertToWordBtn.disabled = false;
            convertToWordBtn.innerHTML = '<i class="ph-bold ph-file-doc"></i> Convert to Word (.docx)';
        }
    });

    // File upload handling
    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) processUpload(e.target.files[0]);
        });
        
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            if (e.dataTransfer.files.length > 0) processUpload(e.dataTransfer.files[0]);
        });
    }

    async function processUpload(file) {
        if (file.type !== 'application/pdf') {
            alert('Please select a valid PDF file.');
            return;
        }

        currentFile = file;
        fileNameDisplay.textContent = file.name;
        dropZone.classList.add('hidden');

        try {
            fileBinaryBytes = await file.arrayBuffer();
            
            pdfDocument = await pdfjsLib.getDocument({ data: fileBinaryBytes.slice(0) }).promise;
            totalPages = pdfDocument.numPages;
            pageCountDisplay.textContent = `Pages: ${totalPages}`;

            optionsPanel.classList.remove('hidden-panel');
            
            currentPage = 1;
            await renderPreview(currentPage);
            updatePageIndicator();
            
            statusMessage.innerHTML = '';
            
        } catch (error) {
            console.error(error);
            alert('Error loading PDF file.');
            dropZone.classList.remove('hidden');
        }
    }

    // Reset state
    const resetState = () => {
        currentFile = null;
        fileBinaryBytes = null;
        totalPages = 0;
        pdfDocument = null;
        pageImages = [];
        pageTextData = [];
        fileInput.value = '';
        optionsPanel.classList.add('hidden-panel');
        dropZone.classList.remove('hidden');
        statusMessage.innerHTML = '';
    };

    removeFileBtn.addEventListener('click', resetState);
});
// --- FIXMYPDF: PDF TO JPG CONVERTER --- //

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
    
    const imageQuality = document.getElementById('image-quality');
    const qualityValue = document.getElementById('quality-value');
    const resolutionScale = document.getElementById('resolution-scale');
    const pageScope = document.getElementById('page-scope');
    const rangeInputWrapper = document.getElementById('range-input-wrapper');
    const pageRangeInput = document.getElementById('page-range-input');
    const rangeBadge = document.getElementById('range-badge');
    
    const downloadCurrentBtn = document.getElementById('download-current-btn');
    const downloadAllBtn = document.getElementById('download-all-btn');
    const removeFileBtn = document.getElementById('remove-file-btn');
    const statusMessage = document.getElementById('status-message');

    let currentFile = null;
    let pdfDocument = null;
    let totalPages = 0;
    let currentPage = 1;

    // Initialize PDF.js
    const pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

    // Quality slider
    imageQuality.addEventListener('input', () => {
        qualityValue.textContent = Math.round(imageQuality.value * 100);
    });

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

    // Page scope handling
    pageScope.addEventListener('change', () => {
        if (pageScope.value === 'range') {
            rangeInputWrapper.classList.remove('hidden-panel');
        } else {
            rangeInputWrapper.classList.add('hidden-panel');
        }
    });

    // Parse page range
    function parsePageRange(rangeStr, maxPages) {
        const pages = new Set();
        if (!rangeStr.trim()) return pages;
        
        const cleanStr = rangeStr.replace(/\s/g, '');
        const parts = cleanStr.split(',');
        
        for (let part of parts) {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(Number);
                if (!isNaN(start) && !isNaN(end)) {
                    const low = Math.min(start, end);
                    const high = Math.min(Math.max(start, end), maxPages);
                    for (let i = low; i <= high; i++) {
                        if (i >= 1 && i <= maxPages) pages.add(i);
                    }
                }
            } else {
                const num = Number(part);
                if (!isNaN(num) && num >= 1 && num <= maxPages) pages.add(num);
            }
        }
        return Array.from(pages).sort((a, b) => a - b);
    }

    function getPagesToConvert() {
        if (pageScope.value === 'current') {
            return [currentPage];
        } else if (pageScope.value === 'all') {
            const pages = [];
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        } else {
            return parsePageRange(pageRangeInput.value, totalPages);
        }
    }

    // Update range badge
    pageRangeInput.addEventListener('input', () => {
        const pages = parsePageRange(pageRangeInput.value, totalPages);
        if (pages.length > 0) {
            const display = pages.length > 15 ? `${pages.slice(0, 15).join(', ')}... (${pages.length} pages)` : pages.join(', ');
            rangeBadge.textContent = `📄 ${pages.length} page(s): ${display}`;
        } else {
            rangeBadge.textContent = '';
        }
    });

    // Render preview
    async function renderPreview(pageNum) {
        if (!pdfDocument) return;
        
        try {
            const page = await pdfDocument.getPage(pageNum);
            const scale = parseFloat(resolutionScale.value);
            const viewport = page.getViewport({ scale: Math.min(scale, 1.5) });
            
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

    // Convert a single page to JPG
    async function convertPageToJpg(pageNum) {
        const page = await pdfDocument.getPage(pageNum);
        const scale = parseFloat(resolutionScale.value);
        const viewport = page.getViewport({ scale: scale });
        
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        const renderContext = {
            canvasContext: canvas.getContext('2d'),
            viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        const quality = parseFloat(imageQuality.value);
        const imageData = canvas.toDataURL('image/jpeg', quality);
        
        return {
            dataUrl: imageData,
            pageNum: pageNum,
            width: canvas.width,
            height: canvas.height
        };
    }

    // ==================================================
    // Generate Complete PDF from pages (for continue feature)
    // ==================================================

    async function generatePdfFromPages() {
        if (!pdfDocument) return null;
        
        const pagesToConvert = getPagesToConvert();
        if (pagesToConvert.length === 0) return null;
        
        const pdfDoc = await PDFLib.PDFDocument.create();
        
        for (let i = 0; i < pagesToConvert.length; i++) {
            const pageNum = pagesToConvert[i];
            const result = await convertPageToJpg(pageNum);
            
            // Convert dataURL to image and embed
            const imageBytes = await fetch(result.dataUrl).then(res => res.arrayBuffer());
            const image = await pdfDoc.embedJpg(imageBytes);
            
            const page = pdfDoc.addPage([result.width, result.height]);
            page.drawImage(image, {
                x: 0,
                y: 0,
                width: result.width,
                height: result.height
            });
        }
        
        return await pdfDoc.save();
    }

    // Download single page
    async function downloadCurrentPage() {
        if (!pdfDocument) {
            alert('Please upload a PDF file first.');
            return;
        }
        
        statusMessage.innerHTML = 'Converting page... <i class="ph-bold ph-spinner ph-spin"></i>';
        downloadCurrentBtn.disabled = true;
        
        try {
            const result = await convertPageToJpg(currentPage);
            
            const link = document.createElement('a');
            link.download = `${currentFile.name.replace('.pdf', '')}_page_${currentPage}.jpg`;
            link.href = result.dataUrl;
            link.click();
            
            statusMessage.innerHTML = '<i class="ph-fill ph-check-circle" style="color:#10B981;"></i> Page downloaded successfully!';
            statusMessage.style.color = '#10B981';
            
            setTimeout(() => {
                if (statusMessage.innerHTML.includes('downloaded successfully')) {
                    statusMessage.innerHTML = '';
                }
            }, 3000);
            
        } catch (error) {
            console.error(error);
            statusMessage.innerHTML = '<i class="ph-fill ph-warning-circle"></i> Error converting page.';
            statusMessage.style.color = 'var(--brand-color)';
        } finally {
            downloadCurrentBtn.disabled = false;
        }
    }

    // Download all pages as ZIP
    async function downloadAllAsZip() {
        if (!pdfDocument) {
            alert('Please upload a PDF file first.');
            return;
        }
        
        const pagesToConvert = getPagesToConvert();
        
        if (pagesToConvert.length === 0) {
            alert('No pages selected to convert.');
            return;
        }
        
        statusMessage.innerHTML = `Converting ${pagesToConvert.length} pages... <i class="ph-bold ph-spinner ph-spin"></i>`;
        downloadAllBtn.disabled = true;
        downloadCurrentBtn.disabled = true;
        
        try {
            const zip = new JSZip();
            const folder = zip.folder(`${currentFile.name.replace('.pdf', '')}_images`);
            
            for (let i = 0; i < pagesToConvert.length; i++) {
                const pageNum = pagesToConvert[i];
                statusMessage.innerHTML = `Converting page ${i + 1}/${pagesToConvert.length}... <i class="ph-bold ph-spinner ph-spin"></i>`;
                
                const result = await convertPageToJpg(pageNum);
                const base64Data = result.dataUrl.split(',')[1];
                folder.file(`page_${pageNum}.jpg`, base64Data, { base64: true });
            }
            
            statusMessage.innerHTML = 'Creating ZIP file... <i class="ph-bold ph-spinner ph-spin"></i>';
            
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);
            const link = document.createElement('a');
            link.download = `${currentFile.name.replace('.pdf', '')}_images.zip`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            
            statusMessage.innerHTML = `<i class="ph-fill ph-check-circle" style="color:#10B981;"></i> Downloaded ${pagesToConvert.length} pages as ZIP!`;
            statusMessage.style.color = '#10B981';
            
        } catch (error) {
            console.error(error);
            statusMessage.innerHTML = '<i class="ph-fill ph-warning-circle"></i> Error creating ZIP file.';
            statusMessage.style.color = 'var(--brand-color)';
        } finally {
            downloadAllBtn.disabled = false;
            downloadCurrentBtn.disabled = false;
        }
    }

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
            const arrayBuffer = await file.arrayBuffer();
            pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer.slice(0) }).promise;
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

    // ==================================================
    // APPLY CHANGES & CONTINUE EDITING
    // ==================================================
    
    const applyAndContinueBtn = document.getElementById('apply-and-continue-btn');
    
    if (applyAndContinueBtn) {
        applyAndContinueBtn.addEventListener('click', async () => {
            if (!pdfDocument) {
                statusMessage.innerHTML = 'Please upload a PDF file first.';
                statusMessage.style.color = 'var(--brand-color)';
                return;
            }
            
            const pagesToConvert = getPagesToConvert();
            if (pagesToConvert.length === 0) {
                statusMessage.innerHTML = 'No pages selected to convert.';
                statusMessage.style.color = 'var(--brand-color)';
                return;
            }
            
            showToolSelectionModal();
        });
    }
    
    // Get current PDF bytes for continue (convert selected pages back to PDF)
    async function getCurrentPdfBytesForContinue() {
        return await generatePdfFromPages();
    }
    
    // Tool selection modal
    function showToolSelectionModal() {
        const modalOverlay = document.createElement('div');
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 24px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        `;
        
        modalContent.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <i class="ph-fill ph-share-network" style="font-size: 2rem; color: var(--brand-color);"></i>
                <h3 style="margin: 10px 0 5px;">Pages Converted Successfully!</h3>
                <p style="color: var(--text-muted);">Where would you like to continue editing?</p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                <button class="tool-choice-btn" data-tool="rotate-pdf.html">
                    <i class="ph-bold ph-arrow-clockwise"></i> Rotate PDF
                </button>
                <button class="tool-choice-btn" data-tool="delete-pdf.html">
                    <i class="ph-bold ph-trash"></i> Delete Pages
                </button>
                <button class="tool-choice-btn" data-tool="crop-pdf.html">
                    <i class="ph-bold ph-crop"></i> Crop PDF
                </button>
                <button class="tool-choice-btn" data-tool="reorder-pdf.html">
                    <i class="ph-bold ph-list-numbers"></i> Reorder Pages
                </button>
                <button class="tool-choice-btn" data-tool="compress-pdf.html">
                    <i class="ph-bold ph-arrows-in"></i> Compress PDF
                </button>
                <button class="tool-choice-btn" data-tool="add-page-numbers.html">
                    <i class="ph-bold ph-list-numbers"></i> Add Page Numbers
                </button>
                <button class="tool-choice-btn" data-tool="add-watermark.html">
                    <i class="ph-bold ph-stamp"></i> Add Watermark
                </button>
                <button class="tool-choice-btn" data-tool="split-pdf.html">
                    <i class="ph-bold ph-scissors"></i> Split PDF
                </button>
                <button class="tool-choice-btn" data-tool="merge-pdf.html">
                    <i class="ph-bold ph-plugs"></i> Merge PDF
                </button>
                <button class="tool-choice-btn" data-tool="pdf-to-png.html">
                    <i class="ph-bold ph-images"></i> PDF to PNG
                </button>
            </div>
            <button id="cancel-tool-choice" style="
                width: 100%;
                margin-top: 20px;
                padding: 12px;
                background: #F1F5F9;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
            ">Cancel</button>
        `;
        
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        
        const style = document.createElement('style');
        style.textContent = `
            .tool-choice-btn {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 16px;
                background: #F8FAFC;
                border: 1px solid var(--border-color);
                border-radius: 12px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s;
                width: 100%;
            }
            .tool-choice-btn:hover {
                background: var(--brand-color);
                color: white;
                border-color: var(--brand-color);
                transform: translateY(-2px);
            }
            .tool-choice-btn i {
                font-size: 1.2rem;
            }
        `;
        document.head.appendChild(style);
        
        document.querySelectorAll('.tool-choice-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const targetTool = btn.getAttribute('data-tool');
                
                btn.innerHTML = '<i class="ph-bold ph-spinner ph-spin"></i> Saving...';
                btn.disabled = true;
                
                try {
                    statusMessage.innerHTML = 'Creating PDF from selected pages...';
                    const modifiedBytes = await getCurrentPdfBytesForContinue();
                    
                    if (modifiedBytes && typeof PDFState !== 'undefined') {
                        PDFState.savePdf(modifiedBytes, currentFile.name.replace('.pdf', '_selected_pages.pdf'), modifiedBytes.byteLength);
                    }
                    
                    modalOverlay.remove();
                    window.location.href = targetTool;
                    
                } catch (error) {
                    console.error('Error saving PDF:', error);
                    alert('Error creating PDF. Please try again.');
                    btn.innerHTML = btn.getAttribute('data-icon') + ' ' + btn.innerText;
                    btn.disabled = false;
                }
            });
        });
        
        document.getElementById('cancel-tool-choice').addEventListener('click', () => {
            modalOverlay.remove();
        });
    }

    // Button event listeners
    downloadCurrentBtn.addEventListener('click', downloadCurrentPage);
    downloadAllBtn.addEventListener('click', downloadAllAsZip);

    // Reset state
    const resetState = () => {
        currentFile = null;
        pdfDocument = null;
        totalPages = 0;
        currentPage = 1;
        fileInput.value = '';
        pageRangeInput.value = '';
        rangeBadge.textContent = '';
        optionsPanel.classList.add('hidden-panel');
        dropZone.classList.remove('hidden');
        statusMessage.innerHTML = '';
    };

    removeFileBtn.addEventListener('click', resetState);
});
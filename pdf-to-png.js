// --- FIXMYPDF: PDF TO PNG CONVERTER (LOSSLESS) --- //

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
    
    const resolutionScale = document.getElementById('resolution-scale');
    const bgColor = document.getElementById('bg-color');
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
    let isProcessing = false;

    // Initialize PDF.js
    const pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

    function showStatus(message, isError = false) {
        statusMessage.innerHTML = message;
        statusMessage.style.color = isError ? 'var(--brand-color)' : 'var(--text-muted)';
    }

    function clearStatus() {
        statusMessage.innerHTML = '';
    }

    function showSuccess(message) {
        statusMessage.innerHTML = `<i class="ph-fill ph-check-circle" style="color:#10B981;"></i> ${message}`;
        statusMessage.style.color = '#10B981';
        setTimeout(() => {
            if (statusMessage.innerHTML.includes(message)) {
                clearStatus();
            }
        }, 3000);
    }

    function showError(message) {
        statusMessage.innerHTML = `<i class="ph-fill ph-warning-circle"></i> ${message}`;
        statusMessage.style.color = 'var(--brand-color)';
        setTimeout(() => {
            if (statusMessage.innerHTML.includes(message)) {
                clearStatus();
            }
        }, 3000);
    }

    // Page navigation
    prevPageBtn.addEventListener('click', async () => {
        if (currentPage > 1 && !isProcessing) {
            currentPage--;
            await renderPreview(currentPage);
            updatePageIndicator();
        }
    });

    nextPageBtn.addEventListener('click', async () => {
        if (currentPage < totalPages && !isProcessing) {
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
        if (!pdfDocument || isProcessing) return;
        
        try {
            const page = await pdfDocument.getPage(pageNum);
            const scale = Math.min(parseFloat(resolutionScale.value), 1.2);
            const viewport = page.getViewport({ scale: scale });
            
            previewCanvas.width = viewport.width;
            previewCanvas.height = viewport.height;
            
            const ctx = previewCanvas.getContext('2d');
            
            if (bgColor.value === 'white') {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
            }
            
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            
            await page.render(renderContext).promise;
            
        } catch (error) {
            console.error('Error rendering preview:', error);
        }
    }

    // Convert a single page to PNG
    async function convertPageToPng(pageNum) {
        const page = await pdfDocument.getPage(pageNum);
        const scale = parseFloat(resolutionScale.value);
        const viewport = page.getViewport({ scale: scale });
        
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        
        // Handle background color
        if (bgColor.value === 'white') {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (bgColor.value === 'black') {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        // Transparent: no background fill
        
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        // PNG is lossless - no quality setting needed
        const imageData = canvas.toDataURL('image/png');
        
        return {
            dataUrl: imageData,
            pageNum: pageNum,
            width: canvas.width,
            height: canvas.height
        };
    }

    // Download single page
    async function downloadCurrentPage() {
        if (!pdfDocument) {
            alert('Please upload a PDF file first.');
            return;
        }
        
        if (isProcessing) {
            showError('Please wait, processing in progress...');
            return;
        }
        
        isProcessing = true;
        showStatus('Converting page to PNG...');
        downloadCurrentBtn.disabled = true;
        
        try {
            const result = await convertPageToPng(currentPage);
            
            const link = document.createElement('a');
            link.download = `${currentFile.name.replace('.pdf', '')}_page_${currentPage}.png`;
            link.href = result.dataUrl;
            link.click();
            
            showSuccess(`Page ${currentPage} downloaded as PNG!`);
            
        } catch (error) {
            console.error(error);
            showError('Error converting page.');
        } finally {
            isProcessing = false;
            downloadCurrentBtn.disabled = false;
        }
    }

    // Download all pages as ZIP
    async function downloadAllAsZip() {
        if (!pdfDocument) {
            alert('Please upload a PDF file first.');
            return;
        }
        
        if (isProcessing) {
            showError('Please wait, processing in progress...');
            return;
        }
        
        const pagesToConvert = getPagesToConvert();
        
        if (pagesToConvert.length === 0) {
            showError('No pages selected to convert.');
            return;
        }
        
        isProcessing = true;
        downloadAllBtn.disabled = true;
        downloadCurrentBtn.disabled = true;
        
        showStatus(`Preparing ${pagesToConvert.length} page(s)...`);
        
        try {
            const zip = new JSZip();
            const folderName = `${currentFile.name.replace('.pdf', '')}_png_images`;
            const folder = zip.folder(folderName);
            
            for (let i = 0; i < pagesToConvert.length; i++) {
                const pageNum = pagesToConvert[i];
                showStatus(`Converting page ${i + 1}/${pagesToConvert.length}...`);
                
                const result = await convertPageToPng(pageNum);
                const base64Data = result.dataUrl.split(',')[1];
                folder.file(`page_${pageNum}.png`, base64Data, { base64: true });
            }
            
            showStatus('Creating ZIP file...');
            
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);
            const link = document.createElement('a');
            link.download = `${currentFile.name.replace('.pdf', '')}_png_images.zip`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            
            showSuccess(`Downloaded ${pagesToConvert.length} PNG image${pagesToConvert.length > 1 ? 's' : ''} as ZIP!`);
            
        } catch (error) {
            console.error(error);
            showError('Error creating ZIP file.');
        } finally {
            isProcessing = false;
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

        if (isProcessing) {
            showError('Please wait, current operation in progress...');
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
            
            clearStatus();
            
        } catch (error) {
            console.error(error);
            alert('Error loading PDF file.');
            dropZone.classList.remove('hidden');
        }
    }

    // Settings change handlers - re-render preview
    resolutionScale.addEventListener('change', async () => {
        if (pdfDocument && !isProcessing) {
            await renderPreview(currentPage);
        }
    });
    
    bgColor.addEventListener('change', async () => {
        if (pdfDocument && !isProcessing) {
            await renderPreview(currentPage);
        }
    });

    // Button event listeners
    downloadCurrentBtn.addEventListener('click', downloadCurrentPage);
    downloadAllBtn.addEventListener('click', downloadAllAsZip);

    // Reset state
    const resetState = () => {
        if (isProcessing) {
            showError('Please wait for current operation to finish.');
            return;
        }
        
        currentFile = null;
        pdfDocument = null;
        totalPages = 0;
        currentPage = 1;
        fileInput.value = '';
        pageRangeInput.value = '';
        rangeBadge.textContent = '';
        optionsPanel.classList.add('hidden-panel');
        dropZone.classList.remove('hidden');
        clearStatus();
        
        // Clear canvas
        previewCanvas.width = 0;
        previewCanvas.height = 0;
        const ctx = previewCanvas.getContext('2d');
        ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    };

    removeFileBtn.addEventListener('click', resetState);
});
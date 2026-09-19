// --- FIXMYPDF: ADD PAGE NUMBERS ENGINE --- //

document.addEventListener('DOMContentLoaded', () => {

    // UI Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const optionsPanel = document.getElementById('options-panel');
    
    const fileNameDisplay = document.getElementById('file-name-display').querySelector('span');
    const pageCountDisplay = document.getElementById('page-count-display');
    const numberPosition = document.getElementById('number-position');
    const numberFormat = document.getElementById('number-format');
    const startNumber = document.getElementById('start-number');
    const fontSize = document.getElementById('font-size');
    const textColor = document.getElementById('text-color');
    const colorValue = document.getElementById('color-value');
    const pageScope = document.getElementById('page-scope');
    const rangeInputWrapper = document.getElementById('range-input-wrapper');
    const pageRangeInput = document.getElementById('page-range-input');
    const rangeBadge = document.getElementById('range-badge');
    const skipFirstPage = document.getElementById('skip-first-page');
    
    const convertBtn = document.getElementById('convert-btn');
    const removeFileBtn = document.getElementById('remove-file-btn');
    const viewPdfBtn = document.getElementById('view-pdf-btn');
    const statusMessage = document.getElementById('status-message');

    const pdfModal = document.getElementById('pdf-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const pdfPreviewFrame = document.getElementById('pdf-preview-frame');

    const previewNumberDemo = document.getElementById('preview-number-demo');
    const previewSimulator = document.getElementById('preview-simulator');

    let currentFile = null;
    let fileBinaryBytes = null;
    let totalDocumentPages = 0;
    let sourceUploadedBlobUrl = null;

    // Update live preview when settings change
    function updateLivePreview() {
        const position = numberPosition.value;
        const format = numberFormat.value;
        const fontSizeVal = fontSize.value;
        const colorVal = textColor.value;

        const positionClasses = ['bottom-right', 'bottom-center', 'bottom-left', 'top-right', 'top-center', 'top-left'];
        positionClasses.forEach(cls => {
            previewNumberDemo.classList.remove(cls);
        });
        previewNumberDemo.classList.add(position);

        let previewText = 'Page 1';
        if (format === 'simple') previewText = '1';
        else if (format === 'page') previewText = 'Page 1';
        else if (format === 'of') previewText = 'Page 1 of 10';
        else if (format === 'dash') previewText = '1 / 10';
        else if (format === 'roman') previewText = 'i';
        else if (format === 'roman-upper') previewText = 'I';
        
        previewNumberDemo.textContent = previewText;
        previewNumberDemo.style.fontSize = `${fontSizeVal}px`;
        previewNumberDemo.style.color = colorVal;
        previewNumberDemo.style.backgroundColor = `${colorVal}10`;
    }

    numberPosition.addEventListener('change', updateLivePreview);
    numberFormat.addEventListener('change', updateLivePreview);
    fontSize.addEventListener('input', updateLivePreview);
    textColor.addEventListener('input', (e) => {
        colorValue.textContent = e.target.value;
        updateLivePreview();
    });

    updateLivePreview();

    pageScope.addEventListener('change', () => {
        if (pageScope.value === 'range') {
            rangeInputWrapper.classList.remove('hidden-panel');
        } else {
            rangeInputWrapper.classList.add('hidden-panel');
        }
    });

    pageRangeInput.addEventListener('input', () => {
        const rangeStr = pageRangeInput.value;
        const pagesSet = parsePageRangeToSet(rangeStr, totalDocumentPages);
        if (pagesSet.size > 0) {
            const sorted = Array.from(pagesSet).sort((a, b) => a - b);
            const display = sorted.length > 10 ? `${sorted.slice(0, 10).join(', ')}... (${sorted.length} pages)` : sorted.join(', ');
            rangeBadge.textContent = `📄 ${sorted.length} page(s): ${display}`;
        } else {
            rangeBadge.textContent = '';
        }
    });

    function parsePageRangeToSet(rangeStr, maxPages) {
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
        return pages;
    }

    function getPagesToNumber() {
        if (pageScope.value === 'all') {
            const pages = [];
            const startOffset = skipFirstPage.checked ? 2 : 1;
            for (let i = startOffset; i <= totalDocumentPages; i++) {
                pages.push(i);
            }
            return pages;
        } else {
            const selectedSet = parsePageRangeToSet(pageRangeInput.value, totalDocumentPages);
            if (skipFirstPage.checked) {
                selectedSet.delete(1);
            }
            return Array.from(selectedSet).sort((a, b) => a - b);
        }
    }

    function formatPageNumber(pageNum, totalPages, format, startOffset) {
        const displayNumber = pageNum - startOffset + 1;
        
        if (displayNumber < 1) return '';
        
        switch (format) {
            case 'simple':
                return `${displayNumber}`;
            case 'page':
                return `Page ${displayNumber}`;
            case 'of':
                const totalToShow = totalPages - startOffset + 1;
                return `Page ${displayNumber} of ${totalToShow}`;
            case 'dash':
                const totalDash = totalPages - startOffset + 1;
                return `${displayNumber} / ${totalDash}`;
            case 'roman':
                return toRoman(displayNumber);
            case 'roman-upper':
                return toRoman(displayNumber).toUpperCase();
            default:
                return `${displayNumber}`;
        }
    }

    function toRoman(num) {
        const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
        const symbols = ['m', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i'];
        let result = '';
        for (let i = 0; i < values.length; i++) {
            while (num >= values[i]) {
                result += symbols[i];
                num -= values[i];
            }
        }
        return result;
    }

    // File upload handling
    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) processUploadDocument(e.target.files[0]);
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });
        
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            if (e.dataTransfer.files.length > 0) processUploadDocument(e.dataTransfer.files[0]);
        });
    }

    async function processUploadDocument(file) {
        if (file.type !== 'application/pdf') {
            alert('Please select a valid PDF file.');
            return;
        }

        currentFile = file;
        fileNameDisplay.textContent = file.name;
        dropZone.classList.add('hidden');

        try {
            fileBinaryBytes = await file.arrayBuffer();
            
            const originalBlobSource = new Blob([fileBinaryBytes], { type: 'application/pdf' });
            if (sourceUploadedBlobUrl) URL.revokeObjectURL(sourceUploadedBlobUrl);
            sourceUploadedBlobUrl = URL.createObjectURL(originalBlobSource);

            const pdfDoc = await PDFLib.PDFDocument.load(fileBinaryBytes);
            totalDocumentPages = pdfDoc.getPageCount();
            pageCountDisplay.textContent = `Contains ${totalDocumentPages} page${totalDocumentPages > 1 ? 's' : ''}`;

            optionsPanel.classList.remove('hidden-panel');
            logStatus('', '');

        } catch (error) {
            console.error(error);
            alert('Error loading PDF file.');
            dropZone.classList.remove('hidden');
        }
    }

    // Function to generate numbered PDF (reusable for both download and continue)
    async function generateNumberedPdf() {
        const pagesToNumber = getPagesToNumber();
        
        if (pagesToNumber.length === 0) {
            return null;
        }

        const pdfDoc = await PDFLib.PDFDocument.load(fileBinaryBytes);
        const pages = pdfDoc.getPages();
        
        const position = numberPosition.value;
        const format = numberFormat.value;
        const fontSizeVal = parseInt(fontSize.value, 10);
        const colorHex = textColor.value;
        const rgb = PDFLib.rgb(
            parseInt(colorHex.slice(1, 3), 16) / 255,
            parseInt(colorHex.slice(3, 5), 16) / 255,
            parseInt(colorHex.slice(5, 7), 16) / 255
        );
        
        const startOffset = skipFirstPage.checked ? 2 : 1;
        const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

        for (let i = 0; i < pagesToNumber.length; i++) {
            const pageNum = pagesToNumber[i];
            const pageIndex = pageNum - 1;
            const page = pages[pageIndex];
            
            const { width, height } = page.getSize();
            
            const pageText = formatPageNumber(pageNum, totalDocumentPages, format, startOffset);
            if (!pageText) continue;
            
            const textWidth = font.widthOfTextAtSize(pageText, fontSizeVal);
            
            let x, y;
            const margin = 30;
            
            switch (position) {
                case 'bottom-right':
                    x = width - textWidth - margin;
                    y = margin;
                    break;
                case 'bottom-center':
                    x = (width - textWidth) / 2;
                    y = margin;
                    break;
                case 'bottom-left':
                    x = margin;
                    y = margin;
                    break;
                case 'top-right':
                    x = width - textWidth - margin;
                    y = height - margin;
                    break;
                case 'top-center':
                    x = (width - textWidth) / 2;
                    y = height - margin;
                    break;
                case 'top-left':
                    x = margin;
                    y = height - margin;
                    break;
                default:
                    x = width - textWidth - margin;
                    y = margin;
            }
            
            page.drawText(pageText, {
                x: x,
                y: y,
                size: fontSizeVal,
                font: font,
                color: rgb
            });
        }

        return await pdfDoc.save();
    }

    // Main conversion logic (Download)
    if (convertBtn) {
        convertBtn.addEventListener('click', async () => {
            const pagesToNumber = getPagesToNumber();
            
            if (pagesToNumber.length === 0) {
                logStatus('No pages selected to number. Please check your settings.', 'var(--brand-color)');
                return;
            }

            logStatus('Adding page numbers... <i class="ph-bold ph-spinner ph-spin"></i>', 'var(--text-muted)');
            convertBtn.disabled = true;

            try {
                const modifiedBytes = await generateNumberedPdf();
                if (!modifiedBytes) throw new Error('Failed to generate PDF');
                
                const outputBlob = new Blob([modifiedBytes], { type: 'application/pdf' });
                const downloadUrl = URL.createObjectURL(outputBlob);

                const anchor = document.createElement('a');
                anchor.href = downloadUrl;
                anchor.download = currentFile.name.replace(/\.[^/.]+$/, "") + "_numbered.pdf";
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
                
                setTimeout(() => URL.revokeObjectURL(downloadUrl), 60000);

                logStatus(`<i class="ph-fill ph-check-circle" style="color:#10B981;"></i> Success! Added numbers to ${pagesToNumber.length} page(s).`, '#10B981');

            } catch (err) {
                console.error(err);
                logStatus('Error adding page numbers to document.', 'var(--brand-color)');
            } finally {
                convertBtn.disabled = false;
            }
        });
    }

    // ==================================================
    // APPLY CHANGES & CONTINUE EDITING
    // ==================================================
    
    const applyAndContinueBtn = document.getElementById('apply-and-continue-btn');
    
    if (applyAndContinueBtn) {
        applyAndContinueBtn.addEventListener('click', async () => {
            if (!currentFile) {
                logStatus('Please upload a PDF file first.', 'var(--brand-color)');
                return;
            }
            
            const pagesToNumber = getPagesToNumber();
            if (pagesToNumber.length === 0) {
                logStatus('No pages selected to number. Please check your settings.', 'var(--brand-color)');
                return;
            }
            
            showToolSelectionModal();
        });
    }
    
    // Get current PDF bytes for continue
    async function getCurrentPdfBytesForContinue() {
        return await generateNumberedPdf();
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
                <h3 style="margin: 10px 0 5px;">Changes Applied Successfully!</h3>
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
                <button class="tool-choice-btn" data-tool="add-watermark.html">
                    <i class="ph-bold ph-stamp"></i> Add Watermark
                </button>
                <button class="tool-choice-btn" data-tool="split-pdf.html">
                    <i class="ph-bold ph-scissors"></i> Split PDF
                </button>
                <button class="tool-choice-btn" data-tool="pdf-to-jpg.html">
                    <i class="ph-bold ph-image"></i> PDF to JPG
                </button>
                <button class="tool-choice-btn" data-tool="pdf-to-png.html">
                    <i class="ph-bold ph-images"></i> PDF to PNG
                </button>
                <button class="tool-choice-btn" data-tool="merge-pdf.html">
                    <i class="ph-bold ph-plugs"></i> Merge PDF
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
        
        // Add styles
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
        
        // Handle tool selection
        document.querySelectorAll('.tool-choice-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const targetTool = btn.getAttribute('data-tool');
                
                btn.innerHTML = '<i class="ph-bold ph-spinner ph-spin"></i> Saving...';
                btn.disabled = true;
                
                try {
                    const modifiedBytes = await getCurrentPdfBytesForContinue();
                    
                    if (typeof PDFState !== 'undefined') {
                        PDFState.savePdf(modifiedBytes, currentFile.name, modifiedBytes.byteLength);
                    }
                    
                    modalOverlay.remove();
                    window.location.href = targetTool;
                    
                } catch (error) {
                    console.error('Error saving PDF:', error);
                    alert('Error applying changes. Please try again.');
                    btn.innerHTML = btn.getAttribute('data-icon') + ' ' + btn.innerText;
                    btn.disabled = false;
                }
            });
        });
        
        document.getElementById('cancel-tool-choice').addEventListener('click', () => {
            modalOverlay.remove();
        });
    }

    // View PDF button
    if (viewPdfBtn) {
        viewPdfBtn.addEventListener('click', () => {
            if (!sourceUploadedBlobUrl) return;
            pdfPreviewFrame.src = sourceUploadedBlobUrl;
            pdfModal.classList.add('active');
        });
    }

    // Reset state
    const resetApplicationState = () => {
        currentFile = null;
        fileBinaryBytes = null;
        totalDocumentPages = 0;
        fileInput.value = '';
        pageRangeInput.value = '';
        rangeBadge.textContent = '';

        if (sourceUploadedBlobUrl) URL.revokeObjectURL(sourceUploadedBlobUrl);
        sourceUploadedBlobUrl = null;

        optionsPanel.classList.add('hidden-panel');
        dropZone.classList.remove('hidden');
        logStatus('', '');
    };

    if (removeFileBtn) removeFileBtn.addEventListener('click', resetApplicationState);
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            pdfModal.classList.remove('active');
            setTimeout(() => { pdfPreviewFrame.src = ''; }, 300);
        });
    }

    function logStatus(msg, hexColor) {
        if (statusMessage) {
            statusMessage.innerHTML = msg;
            statusMessage.style.color = hexColor;
        }
    }
});
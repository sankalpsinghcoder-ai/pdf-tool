// --- FIXMYPDF: ADD WATERMARK ENGINE WITH STABLE PREVIEW --- //

document.addEventListener('DOMContentLoaded', () => {

    // UI Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const optionsPanel = document.getElementById('options-panel');
    
    const fileNameDisplay = document.getElementById('file-name-display').querySelector('span');
    const pageCountDisplay = document.getElementById('page-count-display');
    
    const textWatermarkBtn = document.getElementById('text-watermark-btn');
    const imageWatermarkBtn = document.getElementById('image-watermark-btn');
    const textSettings = document.getElementById('text-settings');
    const imageSettings = document.getElementById('image-settings');
    
    const watermarkText = document.getElementById('watermark-text');
    const watermarkFontSize = document.getElementById('watermark-font-size');
    const watermarkColor = document.getElementById('watermark-color');
    const colorValue = document.getElementById('color-value');
    const watermarkWeight = document.getElementById('watermark-weight');
    
    const watermarkImageInput = document.getElementById('watermark-image-input');
    const imagePreviewArea = document.getElementById('image-preview-area');
    const watermarkImagePreview = document.getElementById('watermark-image-preview');
    const imageWidth = document.getElementById('image-width');
    
    const watermarkOpacity = document.getElementById('watermark-opacity');
    const opacityValue = document.getElementById('opacity-value');
    const watermarkRotation = document.getElementById('watermark-rotation');
    const rotationValue = document.getElementById('rotation-value');
    const pageScope = document.getElementById('page-scope');
    const tileMode = document.getElementById('tile-mode');
    const rangeInputWrapper = document.getElementById('range-input-wrapper');
    const pageRangeInput = document.getElementById('page-range-input');
    const rangeBadge = document.getElementById('range-badge');
    
    const convertBtn = document.getElementById('convert-btn');
    const removeFileBtn = document.getElementById('remove-file-btn');
    const viewOriginalBtn = document.getElementById('view-original-btn');
    const previewFullBtn = document.getElementById('preview-full-btn');
    const refreshPreviewBtn = document.getElementById('refresh-preview-btn');
    const statusMessage = document.getElementById('status-message');

    const pdfModal = document.getElementById('pdf-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const pdfPreviewFrame = document.getElementById('pdf-preview-frame');
    
    const previewCanvas = document.getElementById('preview-canvas');
    const previewLoading = document.getElementById('preview-loading');
    const previewContainer = document.getElementById('preview-container');

    let currentFile = null;
    let fileBinaryBytes = null;
    let totalDocumentPages = 0;
    let sourceUploadedBlobUrl = null;
    let previewBlobUrl = null;
    let watermarkType = 'text';
    let uploadedImageData = null;
    let currentPosition = 'center';
    let previewTimeout = null;
    let isPreviewUpdating = false;

    // Position buttons
    const posButtons = document.querySelectorAll('.pos-btn');
    posButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            posButtons.forEach(b => b.classList.remove('active-position'));
            btn.classList.add('active-position');
            currentPosition = btn.getAttribute('data-pos');
            debouncedPreview();
        });
    });

    // Watermark type toggle
    textWatermarkBtn.addEventListener('click', () => {
        watermarkType = 'text';
        textWatermarkBtn.classList.add('active-watermark-type');
        imageWatermarkBtn.classList.remove('active-watermark-type');
        textSettings.classList.remove('hidden-panel');
        imageSettings.classList.add('hidden-panel');
        
        if (currentFile) {
            debouncedPreview();
        }
    });

    imageWatermarkBtn.addEventListener('click', () => {
        watermarkType = 'image';
        imageWatermarkBtn.classList.add('active-watermark-type');
        textWatermarkBtn.classList.remove('active-watermark-type');
        textSettings.classList.add('hidden-panel');
        imageSettings.classList.remove('hidden-panel');
        
        if (uploadedImageData) {
            debouncedPreview();
        } else {
            if (previewLoading) {
                previewLoading.style.display = 'block';
                previewLoading.innerHTML = '<i class="ph-bold ph-image"></i> Upload an image to see watermark preview';
                previewLoading.style.color = 'var(--text-muted)';
            }
            if (previewCanvas) previewCanvas.style.display = 'none';
        }
    });

    // Image upload handling
    watermarkImageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                uploadedImageData = event.target.result;
                watermarkImagePreview.src = uploadedImageData;
                imagePreviewArea.classList.remove('hidden-panel');
                if (watermarkType === 'image') debouncedPreview();
            };
            reader.readAsDataURL(file);
        }
    });

    // Debounced preview to prevent glitching
    function debouncedPreview() {
        if (previewTimeout) clearTimeout(previewTimeout);
        previewTimeout = setTimeout(() => {
            if (currentFile && !isPreviewUpdating) {
                renderStablePreview();
            }
        }, 300);
    }

    // Generate watermarked PDF (reusable)
    async function generateWatermarkedPdf() {
        if (!fileBinaryBytes) return null;
        
        const pdfDoc = await PDFLib.PDFDocument.load(fileBinaryBytes);
        const pages = pdfDoc.getPages();
        
        const opacity = watermarkOpacity.value / 100;
        const rotation = parseInt(watermarkRotation.value, 10);
        const tile = tileMode.value === 'tile';
        
        let pagesToWatermark = [];
        if (pageScope.value === 'all') {
            for (let i = 1; i <= totalDocumentPages; i++) pagesToWatermark.push(i);
        } else if (pageScope.value === 'first') {
            pagesToWatermark = [1];
        } else if (pageScope.value === 'last') {
            pagesToWatermark = [totalDocumentPages];
        } else {
            pagesToWatermark = Array.from(parsePageRangeToSet(pageRangeInput.value, totalDocumentPages)).sort((a, b) => a - b);
        }
        
        if (watermarkType === 'text') {
            const text = watermarkText.value || 'CONFIDENTIAL';
            const fontSize = parseInt(watermarkFontSize.value, 10);
            const colorHex = watermarkColor.value;
            const rgb = PDFLib.rgb(
                parseInt(colorHex.slice(1, 3), 16) / 255,
                parseInt(colorHex.slice(3, 5), 16) / 255,
                parseInt(colorHex.slice(5, 7), 16) / 255
            );
            const font = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);
            
            for (const pageNum of pagesToWatermark) {
                const page = pages[pageNum - 1];
                const { width, height } = page.getSize();
                const textWidth = font.widthOfTextAtSize(text, fontSize);
                const textHeight = fontSize;
                
                if (tile) {
                    const stepX = 280;
                    const stepY = 180;
                    for (let x = -100; x < width + 100; x += stepX) {
                        for (let y = -100; y < height + 100; y += stepY) {
                            page.drawText(text, {
                                x: x, y: y, size: fontSize, font: font,
                                color: rgb, opacity: opacity, rotate: PDFLib.degrees(rotation)
                            });
                        }
                    }
                } else {
                    const { x, y } = getPositionCoordinates(width, height, textWidth, textHeight);
                    page.drawText(text, {
                        x: x, y: y, size: fontSize, font: font,
                        color: rgb, opacity: opacity, rotate: PDFLib.degrees(rotation)
                    });
                }
            }
        } else if (watermarkType === 'image' && uploadedImageData) {
            const imageBytes = await fetch(uploadedImageData).then(res => res.arrayBuffer());
            let image;
            if (uploadedImageData.includes('png')) {
                image = await pdfDoc.embedPng(imageBytes);
            } else {
                image = await pdfDoc.embedJpg(imageBytes);
            }
            
            const imgWidth = parseInt(imageWidth.value, 10);
            const imgHeight = (image.height / image.width) * imgWidth;
            
            for (const pageNum of pagesToWatermark) {
                const page = pages[pageNum - 1];
                const { width, height } = page.getSize();
                
                if (tile) {
                    const stepX = imgWidth + 60;
                    const stepY = imgHeight + 60;
                    for (let x = -100; x < width + 100; x += stepX) {
                        for (let y = -100; y < height + 100; y += stepY) {
                            page.drawImage(image, {
                                x: x, y: y, width: imgWidth, height: imgHeight,
                                opacity: opacity, rotate: PDFLib.degrees(rotation)
                            });
                        }
                    }
                } else {
                    const { x, y } = getPositionCoordinates(width, height, imgWidth, imgHeight);
                    page.drawImage(image, {
                        x: x, y: y - imgHeight, width: imgWidth, height: imgHeight,
                        opacity: opacity, rotate: PDFLib.degrees(rotation)
                    });
                }
            }
        }
        
        return await pdfDoc.save();
    }

    function getPositionCoordinates(pageWidth, pageHeight, elementWidth, elementHeight) {
        const margin = 50;
        
        switch (currentPosition) {
            case 'top-left': return { x: margin, y: pageHeight - margin };
            case 'top-center': return { x: (pageWidth - elementWidth) / 2, y: pageHeight - margin };
            case 'top-right': return { x: pageWidth - elementWidth - margin, y: pageHeight - margin };
            case 'center-left': return { x: margin, y: (pageHeight - elementHeight) / 2 };
            case 'center': return { x: (pageWidth - elementWidth) / 2, y: (pageHeight - elementHeight) / 2 };
            case 'center-right': return { x: pageWidth - elementWidth - margin, y: (pageHeight - elementHeight) / 2 };
            case 'bottom-left': return { x: margin, y: margin + elementHeight };
            case 'bottom-center': return { x: (pageWidth - elementWidth) / 2, y: margin + elementHeight };
            case 'bottom-right': return { x: pageWidth - elementWidth - margin, y: margin + elementHeight };
            default: return { x: (pageWidth - elementWidth) / 2, y: (pageHeight - elementHeight) / 2 };
        }
    }

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
                    for (let i = low; i <= high; i++) pages.add(i);
                }
            } else {
                const num = Number(part);
                if (!isNaN(num) && num >= 1 && num <= maxPages) pages.add(num);
            }
        }
        return pages;
    }

    // STABLE PREVIEW
    async function renderStablePreview() {
        if (!fileBinaryBytes) return;
        if (watermarkType === 'image' && !uploadedImageData) {
            if (previewCanvas) previewCanvas.style.display = 'none';
            if (previewLoading) {
                previewLoading.style.display = 'block';
                previewLoading.innerHTML = '<i class="ph-bold ph-image"></i> Upload an image to see preview';
                previewLoading.style.color = 'var(--text-muted)';
            }
            return;
        }
        
        isPreviewUpdating = true;
        
        if (previewLoading) {
            previewLoading.style.display = 'block';
            previewLoading.innerHTML = '<i class="ph-bold ph-spinner ph-spin"></i> Rendering watermark...';
        }
        if (previewCanvas) previewCanvas.style.display = 'none';
        
        try {
            const pdfEngine = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
            pdfEngine.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
            
            const modifiedBytes = await generateWatermarkedPdf();
            if (!modifiedBytes) return;
            
            const loadingTask = pdfEngine.getDocument({ data: modifiedBytes.slice(0) });
            const pdfDoc = await loadingTask.promise;
            const firstPage = await pdfDoc.getPage(1);
            
            const FIXED_SCALE = 0.7;
            const viewport = firstPage.getViewport({ scale: FIXED_SCALE });
            
            previewCanvas.width = viewport.width;
            previewCanvas.height = viewport.height;
            
            const renderContext = {
                canvasContext: previewCanvas.getContext('2d'),
                viewport: viewport
            };
            
            await firstPage.render(renderContext).promise;
            
            previewCanvas.style.display = 'block';
            if (previewLoading) previewLoading.style.display = 'none';
            
            await pdfDoc.destroy();
            
        } catch (error) {
            console.error('Preview render error:', error);
            if (previewLoading) {
                previewLoading.style.display = 'block';
                previewLoading.innerHTML = '<i class="ph-bold ph-warning-circle"></i> Preview error. Click Refresh.';
            }
        } finally {
            isPreviewUpdating = false;
        }
    }

    // Auto-refresh preview with debounce
    const autoRefreshInputs = [watermarkText, watermarkFontSize, watermarkColor, watermarkWeight, 
                                watermarkOpacity, watermarkRotation, pageScope, tileMode, imageWidth];
    autoRefreshInputs.forEach(input => {
        input.addEventListener('input', () => debouncedPreview());
        input.addEventListener('change', () => debouncedPreview());
    });
    
    watermarkOpacity.addEventListener('input', () => {
        opacityValue.textContent = `${watermarkOpacity.value}%`;
        debouncedPreview();
    });
    
    watermarkRotation.addEventListener('input', () => {
        rotationValue.textContent = `${watermarkRotation.value}°`;
        debouncedPreview();
    });
    
    watermarkColor.addEventListener('input', (e) => {
        colorValue.textContent = e.target.value;
        debouncedPreview();
    });
    
    pageScope.addEventListener('change', () => {
        if (pageScope.value === 'range') {
            rangeInputWrapper.classList.remove('hidden-panel');
        } else {
            rangeInputWrapper.classList.add('hidden-panel');
        }
        debouncedPreview();
    });
    
    pageRangeInput.addEventListener('input', () => {
        if (pageScope.value === 'range') debouncedPreview();
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
    
    refreshPreviewBtn.addEventListener('click', () => {
        if (currentFile) renderStablePreview();
    });

    // File upload handling
    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) processUploadDocument(e.target.files[0]);
        });
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
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
            
            await renderStablePreview();

        } catch (error) {
            console.error(error);
            alert('Error loading PDF file.');
            dropZone.classList.remove('hidden');
        }
    }

    // Preview Full PDF button
    if (previewFullBtn) {
        previewFullBtn.addEventListener('click', async () => {
            if (!currentFile) return;
            if (watermarkType === 'image' && !uploadedImageData) {
                logStatus('Please upload an image for the watermark first.', 'var(--brand-color)');
                return;
            }
            
            logStatus('Generating preview... <i="ph-bold ph-spinner ph-spin"></i>', 'var(--text-muted)');
            
            try {
                const modifiedBytes = await generateWatermarkedPdf();
                const previewBlob = new Blob([modifiedBytes], { type: 'application/pdf' });
                if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
                previewBlobUrl = URL.createObjectURL(previewBlob);
                pdfPreviewFrame.src = previewBlobUrl;
                pdfModal.classList.add('active');
                logStatus('', '');
            } catch (err) {
                console.error(err);
                logStatus('Error generating preview.', 'var(--brand-color)');
            }
        });
    }

    // Download button
    if (convertBtn) {
        convertBtn.addEventListener('click', async () => {
            if (watermarkType === 'image' && !uploadedImageData) {
                logStatus('Please upload an image for the watermark.', 'var(--brand-color)');
                return;
            }
            
            logStatus('Adding watermark... <i class="ph-bold ph-spinner ph-spin"></i>', 'var(--text-muted)');
            convertBtn.disabled = true;

            try {
                const modifiedBytes = await generateWatermarkedPdf();
                const outputBlob = new Blob([modifiedBytes], { type: 'application/pdf' });
                const downloadUrl = URL.createObjectURL(outputBlob);

                const anchor = document.createElement('a');
                anchor.href = downloadUrl;
                anchor.download = currentFile.name.replace(/\.[^/.]+$/, "") + "_watermarked.pdf";
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
                
                setTimeout(() => URL.revokeObjectURL(downloadUrl), 60000);
                logStatus(`<i class="ph-fill ph-check-circle" style="color:#10B981;"></i> Success! Watermark added.`, '#10B981');

            } catch (err) {
                console.error(err);
                logStatus('Error adding watermark.', 'var(--brand-color)');
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
            
            if (watermarkType === 'image' && !uploadedImageData) {
                logStatus('Please upload an image for the watermark first.', 'var(--brand-color)');
                return;
            }
            
            showToolSelectionModal();
        });
    }
    
    // Get current PDF bytes for continue
    async function getCurrentPdfBytesForContinue() {
        return await generateWatermarkedPdf();
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
                <button class="tool-choice-btn" data-tool="add-page-numbers.html">
                    <i class="ph-bold ph-list-numbers"></i> Add Page Numbers
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

    // View Original button
    if (viewOriginalBtn) {
        viewOriginalBtn.addEventListener('click', () => {
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
        uploadedImageData = null;
        watermarkImageInput.value = '';
        imagePreviewArea.classList.add('hidden-panel');
        
        if (previewCanvas) {
            previewCanvas.width = 0;
            previewCanvas.height = 0;
            previewCanvas.style.display = 'none';
            const ctx = previewCanvas.getContext('2d');
            ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        }
        if (previewLoading) {
            previewLoading.style.display = 'block';
            previewLoading.innerHTML = '<i class="ph-bold ph-upload"></i> Upload a PDF to see preview';
        }

        if (sourceUploadedBlobUrl) URL.revokeObjectURL(sourceUploadedBlobUrl);
        if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
        sourceUploadedBlobUrl = null;
        previewBlobUrl = null;

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
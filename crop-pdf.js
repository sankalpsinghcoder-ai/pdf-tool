// --- FIXMYPDF: CROP PDF ENGINE WITH 8-POINT CROPPER --- //

document.addEventListener('DOMContentLoaded', () => {

    // UI Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const optionsPanel = document.getElementById('options-panel');
    
    const fileNameDisplay = document.getElementById('file-name-display').querySelector('span');
    const pageCountDisplay = document.getElementById('page-count-display');
    
    const cropCanvas = document.getElementById('crop-canvas');
    const canvasWrapper = document.getElementById('canvas-wrapper');
    const cropOverlay = document.getElementById('crop-overlay');
    
    // 8 handles
    const handles = {
        nw: document.getElementById('handle-nw'),
        n: document.getElementById('handle-n'),
        ne: document.getElementById('handle-ne'),
        w: document.getElementById('handle-w'),
        e: document.getElementById('handle-e'),
        sw: document.getElementById('handle-sw'),
        s: document.getElementById('handle-s'),
        se: document.getElementById('handle-se')
    };
    
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    const pageIndicator = document.getElementById('page-indicator');
    const applyCropBtn = document.getElementById('apply-crop-btn');
    const resetCropBtn = document.getElementById('reset-crop-btn');
    const previewFullBtn = document.getElementById('preview-full-btn');
    const removeFileBtn = document.getElementById('remove-file-btn');
    const statusMessage = document.getElementById('status-message');

    const pdfModal = document.getElementById('pdf-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const pdfPreviewFrame = document.getElementById('pdf-preview-frame');

    let currentFile = null;
    let fileBinaryBytes = null;
    let totalDocumentPages = 0;
    let sourceUploadedBlobUrl = null;
    let previewBlobUrl = null;
    
    let pdfDocument = null;
    let currentPageNum = 1;
    let originalPageWidth = 0;
    let originalPageHeight = 0;
    let displayScale = 1;
    
    // Store crop settings for each page
    let pageCrops = {};
    
    // Crop box coordinates (in original PDF coordinates)
    let cropBox = { x: 0, y: 0, width: 0, height: 0 };
    
    // Drag state
    let isDragging = false;
    let activeHandle = null;
    let dragStart = { x: 0, y: 0 };
    let originalCropBox = null;

    // Initialize PDF.js
    const pdfEngine = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    pdfEngine.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

    // Save current crop for current page
    function saveCurrentPageCrop() {
        if (currentPageNum && cropBox.width > 0 && cropBox.height > 0) {
            pageCrops[currentPageNum] = { ...cropBox };
        }
    }

    // Load crop for specific page
    function loadPageCrop(pageNum) {
        if (pageCrops[pageNum]) {
            cropBox = { ...pageCrops[pageNum] };
        } else {
            // Default: full page crop
            cropBox = {
                x: 0,
                y: 0,
                width: originalPageWidth,
                height: originalPageHeight
            };
        }
    }

    // Update overlay and handle positions
    function updateOverlayAndHandles() {
        if (!cropCanvas.width || !cropCanvas.height) return;
        
        const left = (cropBox.x / originalPageWidth) * cropCanvas.width;
        const top = (cropBox.y / originalPageHeight) * cropCanvas.height;
        const width = (cropBox.width / originalPageWidth) * cropCanvas.width;
        const height = (cropBox.height / originalPageHeight) * cropCanvas.height;
        
        // Update overlay
        cropOverlay.style.display = 'block';
        cropOverlay.style.left = `${left}px`;
        cropOverlay.style.top = `${top}px`;
        cropOverlay.style.width = `${width}px`;
        cropOverlay.style.height = `${height}px`;
        
        // Update all 8 handles
        const handleSize = 12;
        const halfHandle = handleSize / 2;
        
        // Corner handles
        handles.nw.style.display = 'block';
        handles.nw.style.left = `${left - halfHandle}px`;
        handles.nw.style.top = `${top - halfHandle}px`;
        
        handles.ne.style.display = 'block';
        handles.ne.style.left = `${left + width - halfHandle}px`;
        handles.ne.style.top = `${top - halfHandle}px`;
        
        handles.sw.style.display = 'block';
        handles.sw.style.left = `${left - halfHandle}px`;
        handles.sw.style.top = `${top + height - halfHandle}px`;
        
        handles.se.style.display = 'block';
        handles.se.style.left = `${left + width - halfHandle}px`;
        handles.se.style.top = `${top + height - halfHandle}px`;
        
        // Edge handles
        handles.n.style.display = 'block';
        handles.n.style.left = `${left + width/2 - halfHandle}px`;
        handles.n.style.top = `${top - halfHandle}px`;
        
        handles.s.style.display = 'block';
        handles.s.style.left = `${left + width/2 - halfHandle}px`;
        handles.s.style.top = `${top + height - halfHandle}px`;
        
        handles.w.style.display = 'block';
        handles.w.style.left = `${left - halfHandle}px`;
        handles.w.style.top = `${top + height/2 - halfHandle}px`;
        
        handles.e.style.display = 'block';
        handles.e.style.left = `${left + width - halfHandle}px`;
        handles.e.style.top = `${top + height/2 - halfHandle}px`;
    }

    // Page navigation
    prevPageBtn.addEventListener('click', async () => {
        if (currentPageNum > 1) {
            saveCurrentPageCrop();
            currentPageNum--;
            await loadPage(currentPageNum);
            updatePageIndicator();
        }
    });

    nextPageBtn.addEventListener('click', async () => {
        if (currentPageNum < totalDocumentPages) {
            saveCurrentPageCrop();
            currentPageNum++;
            await loadPage(currentPageNum);
            updatePageIndicator();
        }
    });

    function updatePageIndicator() {
        pageIndicator.textContent = `Page ${currentPageNum} / ${totalDocumentPages}`;
    }

    // Load and render current page
    async function loadPage(pageNum) {
        if (!pdfDocument) return;
        
        try {
            const page = await pdfDocument.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1 });
            
            originalPageWidth = viewport.width;
            originalPageHeight = viewport.height;
            
            // Calculate display scale to fit in container
            const container = document.querySelector('.crop-canvas-container');
            const maxWidth = container.clientWidth - 40;
            displayScale = Math.min(1, maxWidth / originalPageWidth);
            
            const displayWidth = originalPageWidth * displayScale;
            const displayHeight = originalPageHeight * displayScale;
            
            cropCanvas.width = displayWidth;
            cropCanvas.height = displayHeight;
            
            const renderContext = {
                canvasContext: cropCanvas.getContext('2d'),
                viewport: page.getViewport({ scale: displayScale })
            };
            
            await page.render(renderContext).promise;
            
            // Load crop settings for this page
            loadPageCrop(pageNum);
            updateOverlayAndHandles();
            
        } catch (error) {
            console.error('Error loading page:', error);
        }
    }

    // Reset current page crop to full page
    function resetCurrentPageCrop() {
        cropBox = {
            x: 0,
            y: 0,
            width: originalPageWidth,
            height: originalPageHeight
        };
        pageCrops[currentPageNum] = { ...cropBox };
        updateOverlayAndHandles();
    }

    resetCropBtn.addEventListener('click', () => {
        resetCurrentPageCrop();
    });

    // Get mouse position in original PDF coordinates
    function getMousePos(e) {
        const rect = cropCanvas.getBoundingClientRect();
        const scaleX = originalPageWidth / cropCanvas.width;
        const scaleY = originalPageHeight / cropCanvas.height;
        
        let clientX, clientY;
        
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        const canvasX = (clientX - rect.left) * scaleX;
        const canvasY = (clientY - rect.top) * scaleY;
        
        return {
            x: Math.max(0, Math.min(originalPageWidth, canvasX)),
            y: Math.max(0, Math.min(originalPageHeight, canvasY))
        };
    }

    // Resize crop box based on handle and mouse movement
    function resizeCrop(handle, mousePos) {
        let newBox = { ...originalCropBox };
        
        switch (handle) {
            case 'nw':
                newBox.x = Math.min(originalCropBox.x + originalCropBox.width - 20, Math.max(0, mousePos.x));
                newBox.width = originalCropBox.width + (originalCropBox.x - newBox.x);
                newBox.y = Math.min(originalCropBox.y + originalCropBox.height - 20, Math.max(0, mousePos.y));
                newBox.height = originalCropBox.height + (originalCropBox.y - newBox.y);
                break;
            case 'n':
                newBox.y = Math.min(originalCropBox.y + originalCropBox.height - 20, Math.max(0, mousePos.y));
                newBox.height = originalCropBox.height + (originalCropBox.y - newBox.y);
                break;
            case 'ne':
                newBox.y = Math.min(originalCropBox.y + originalCropBox.height - 20, Math.max(0, mousePos.y));
                newBox.height = originalCropBox.height + (originalCropBox.y - newBox.y);
                newBox.width = Math.max(20, mousePos.x - originalCropBox.x);
                break;
            case 'w':
                newBox.x = Math.min(originalCropBox.x + originalCropBox.width - 20, Math.max(0, mousePos.x));
                newBox.width = originalCropBox.width + (originalCropBox.x - newBox.x);
                break;
            case 'e':
                newBox.width = Math.max(20, mousePos.x - originalCropBox.x);
                break;
            case 'sw':
                newBox.x = Math.min(originalCropBox.x + originalCropBox.width - 20, Math.max(0, mousePos.x));
                newBox.width = originalCropBox.width + (originalCropBox.x - newBox.x);
                newBox.height = Math.max(20, mousePos.y - originalCropBox.y);
                break;
            case 's':
                newBox.height = Math.max(20, mousePos.y - originalCropBox.y);
                break;
            case 'se':
                newBox.width = Math.max(20, mousePos.x - originalCropBox.x);
                newBox.height = Math.max(20, mousePos.y - originalCropBox.y);
                break;
        }
        
        // Ensure box stays within page bounds
        if (newBox.x + newBox.width > originalPageWidth) {
            newBox.width = originalPageWidth - newBox.x;
        }
        if (newBox.y + newBox.height > originalPageHeight) {
            newBox.height = originalPageHeight - newBox.y;
        }
        
        return newBox;
    }

    // Mouse/Touch events for cropping
    function startDrag(e, handle = null) {
        e.preventDefault();
        activeHandle = handle;
        const pos = getMousePos(e);
        
        if (activeHandle) {
            isDragging = true;
            originalCropBox = { ...cropBox };
            dragStart = pos;
        } else if (pos.x >= cropBox.x && pos.x <= cropBox.x + cropBox.width &&
                   pos.y >= cropBox.y && pos.y <= cropBox.y + cropBox.height) {
            isDragging = true;
            dragStart = { x: pos.x - cropBox.x, y: pos.y - cropBox.y };
        }
    }

    function onDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const pos = getMousePos(e);
        
        if (activeHandle) {
            const newBox = resizeCrop(activeHandle, pos);
            if (newBox.width >= 20 && newBox.height >= 20) {
                cropBox = newBox;
                updateOverlayAndHandles();
            }
        } else {
            let newX = pos.x - dragStart.x;
            let newY = pos.y - dragStart.y;
            
            newX = Math.max(0, Math.min(newX, originalPageWidth - cropBox.width));
            newY = Math.max(0, Math.min(newY, originalPageHeight - cropBox.height));
            
            cropBox.x = newX;
            cropBox.y = newY;
            updateOverlayAndHandles();
        }
    }

    function endDrag() {
        isDragging = false;
        activeHandle = null;
        saveCurrentPageCrop();
    }

    // Mouse event listeners
    cropCanvas.addEventListener('mousedown', (e) => startDrag(e, null));
    
    // Handle button listeners
    for (const [handle, element] of Object.entries(handles)) {
        if (element) {
            element.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                startDrag(e, handle);
            });
        }
    }
    
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', endDrag);
    
    // Touch events for mobile
    cropCanvas.addEventListener('touchstart', (e) => startDrag(e, null));
    for (const [handle, element] of Object.entries(handles)) {
        if (element) {
            element.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                startDrag(e, handle);
            });
        }
    }
    window.addEventListener('touchmove', onDrag);
    window.addEventListener('touchend', endDrag);

    // Generate cropped PDF
    async function generateCroppedPdf() {
        if (!fileBinaryBytes) return null;
        
        // Save current page crop before generating
        saveCurrentPageCrop();
        
        const pdfDoc = await PDFLib.PDFDocument.load(fileBinaryBytes);
        const pages = pdfDoc.getPages();
        
        for (let pageNum = 1; pageNum <= totalDocumentPages; pageNum++) {
            const crop = pageCrops[pageNum];
            if (crop && crop.width > 0 && crop.height > 0) {
                const page = pages[pageNum - 1];
                const { height } = page.getSize();
                
                // Convert to PDF coordinates (Y from bottom)
                const cropX = crop.x;
                const cropY = height - (crop.y + crop.height);
                const cropWidth = crop.width;
                const cropHeight = crop.height;
                
                page.setCropBox(cropX, cropY, cropX + cropWidth, cropY + cropHeight);
                page.setMediaBox(cropX, cropY, cropX + cropWidth, cropY + cropHeight);
            }
        }
        
        return await pdfDoc.save();
    }

    // Apply crop and download
    applyCropBtn.addEventListener('click', async () => {
        if (!currentFile) return;
        
        logStatus('Cropping PDF... <i class="ph-bold ph-spinner ph-spin"></i>', 'var(--text-muted)');
        applyCropBtn.disabled = true;
        
        try {
            const modifiedBytes = await generateCroppedPdf();
            if (!modifiedBytes) throw new Error('Failed to generate cropped PDF');
            
            const outputBlob = new Blob([modifiedBytes], { type: 'application/pdf' });
            const downloadUrl = URL.createObjectURL(outputBlob);
            
            const anchor = document.createElement('a');
            anchor.href = downloadUrl;
            anchor.download = currentFile.name.replace(/\.[^/.]+$/, "") + "_cropped.pdf";
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            
            setTimeout(() => URL.revokeObjectURL(downloadUrl), 60000);
            
            logStatus(`<i class="ph-fill ph-check-circle" style="color:#10B981;"></i> Success! Cropped ${totalDocumentPages} page(s).`, '#10B981');
            
        } catch (err) {
            console.error(err);
            logStatus('Error cropping PDF.', 'var(--brand-color)');
        } finally {
            applyCropBtn.disabled = false;
        }
    });

    // Preview full PDF
    previewFullBtn.addEventListener('click', async () => {
        if (!currentFile) return;
        
        logStatus('Generating preview... <i class="ph-bold ph-spinner ph-spin"></i>', 'var(--text-muted)');
        
        try {
            const modifiedBytes = await generateCroppedPdf();
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
        pageCrops = {};

        try {
            fileBinaryBytes = await file.arrayBuffer();
            sourceUploadedBlobUrl = URL.createObjectURL(new Blob([fileBinaryBytes], { type: 'application/pdf' }));

            pdfDocument = await pdfEngine.getDocument({ data: fileBinaryBytes.slice(0) }).promise;
            totalDocumentPages = pdfDocument.numPages;
            pageCountDisplay.textContent = `Contains ${totalDocumentPages} page${totalDocumentPages > 1 ? 's' : ''}`;

            optionsPanel.classList.remove('hidden-panel');
            
            currentPageNum = 1;
            await loadPage(currentPageNum);
            updatePageIndicator();

        } catch (error) {
            console.error(error);
            alert('Error loading PDF file.');
            dropZone.classList.remove('hidden');
        }
    }

    // Reset state
    const resetApplicationState = () => {
        currentFile = null;
        fileBinaryBytes = null;
        totalDocumentPages = 0;
        pdfDocument = null;
        pageCrops = {};
        fileInput.value = '';
        
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
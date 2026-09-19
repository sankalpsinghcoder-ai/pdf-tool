// --- FIXMYPDF: DELETE PDF PAGES ARCHITECTURE PIPELINE --- //

document.addEventListener('DOMContentLoaded', () => {

    // UI elements connections mappings
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const optionsPanel = document.getElementById('options-panel');
    
    const fileNameDisplay = document.getElementById('file-name-display').querySelector('span');
    const pageCountDisplay = document.getElementById('page-count-display');
    const selectionMode = document.getElementById('selection-mode');
    const rangeInputWrapper = document.getElementById('range-input-wrapper');
    const pageRangeInput = document.getElementById('page-range-input');
    const thumbnailsGrid = document.getElementById('thumbnails-grid');
    
    const selectAllPill = document.getElementById('select-all-pill');
    const clearAllPill = document.getElementById('clear-all-pill');
    
    const convertBtn = document.getElementById('convert-btn');
    const removeFileBtn = document.getElementById('remove-file-btn');
    const viewPdfBtn = document.getElementById('view-pdf-btn');
    const statusMessage = document.getElementById('status-message');

    const pdfModal = document.getElementById('pdf-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const pdfPreviewFrame = document.getElementById('pdf-preview-frame');

    let currentFile = null;
    let fileBinaryBytes = null;
    let totalDocumentPages = 0;
    // This Set tracks pages marked for DELETION
    let deletePagesSet = new Set();
    let sourceUploadedBlobUrl = null;

    // Click event to open explorer safely
    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', (e) => { 
            if (e.target.files.length > 0) processUploadDocument(e.target.files[0]); 
        });

        // Drag and drop event listener loops
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

    // Toggle view layout modes visibility based on selection changes
    if (selectionMode) {
        selectionMode.addEventListener('change', () => {
            if (selectionMode.value === 'all') {
                rangeInputWrapper.classList.add('hidden-panel');
                for (let i = 1; i <= totalDocumentPages; i++) deletePagesSet.add(i);
                synchronizeThumbnailsHighlighting();
            } else {
                rangeInputWrapper.classList.remove('hidden-panel');
                updateSelectionUiFromSet();
            }
        });
    }

    if (pageRangeInput) {
        pageRangeInput.addEventListener('input', () => {
            parseInputStringRangeToSet();
            synchronizeThumbnailsHighlighting();
        });
    }

    if (selectAllPill) {
        selectAllPill.addEventListener('click', () => {
            selectionMode.value = 'range';
            rangeInputWrapper.classList.remove('hidden-panel');
            for (let i = 1; i <= totalDocumentPages; i++) deletePagesSet.add(i);
            updateInputStringFromSet();
            synchronizeThumbnailsHighlighting();
        });
    }

    if (clearAllPill) {
        clearAllPill.addEventListener('click', () => {
            selectionMode.value = 'range';
            rangeInputWrapper.classList.remove('hidden-panel');
            deletePagesSet.clear();
            pageRangeInput.value = '';
            synchronizeThumbnailsHighlighting();
        });
    }

    // ========================================================
    // Pipeline Layer: Unpack PDF Architecture and Thumbnails
    // ========================================================

    async function processUploadDocument(file) {
        if (file.type !== 'application/pdf') {
            alert('Please select a valid PDF file.');
            return;
        }

        const pdfEngine = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
        if (!pdfEngine) {
            alert('PDF rendering engine could not be initiated local environment.');
            return;
        }

        pdfEngine.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

        currentFile = file;
        fileNameDisplay.textContent = file.name;
        dropZone.classList.add('hidden');

        try {
            fileBinaryBytes = await file.arrayBuffer();
            
            // Build original source URL for live view tracking safely
            const originalBlobSource = new Blob([fileBinaryBytes], { type: 'application/pdf' });
            if (sourceUploadedBlobUrl) URL.revokeObjectURL(sourceUploadedBlobUrl);
            sourceUploadedBlobUrl = URL.createObjectURL(originalBlobSource);

            const loadedPdfInstance = await pdfEngine.getDocument({ 
                data: fileBinaryBytes.slice(0) 
            }).promise;

            totalDocumentPages = loadedPdfInstance.numPages;
            pageCountDisplay.textContent = `Contains ${totalDocumentPages} page${totalDocumentPages > 1 ? 's' : ''}`;

            thumbnailsGrid.innerHTML = '';
            deletePagesSet.clear();

            for (let i = 1; i <= totalDocumentPages; i++) {
                await generateSinglePageThumbnail(loadedPdfInstance, i);
            }

            selectionMode.value = 'range';
            rangeInputWrapper.classList.remove('hidden-panel');
            pageRangeInput.value = '';

            optionsPanel.classList.remove('hidden-panel');
            logStatus('', '');
            
            // Update continue section with filename
            updateContinueSection();

        } catch (error) {
            console.error(error);
            alert('Error loading PDF architecture.');
            dropZone.classList.remove('hidden');
        }
    }

    async function generateSinglePageThumbnail(pdfInstance, pageNum) {
        try {
            const architecturalPage = await pdfInstance.getPage(pageNum);
            const standardViewport = architecturalPage.getViewport({ scale: 0.25 });

            const thumbnailCard = document.createElement('div');
            thumbnailCard.className = 'thumbnail-card';
            thumbnailCard.setAttribute('data-page-id', pageNum);

            // Cross-Overlay design component
            const deleteBadge = document.createElement('div');
            deleteBadge.className = 'delete-overlay-badge';
            deleteBadge.innerHTML = '<i class="ph-bold ph-x"></i>';
            thumbnailCard.appendChild(deleteBadge);

            const canvasContainer = document.createElement('div');
            canvasContainer.className = 'canvas-container-frame';

            const canvasNode = document.createElement('canvas');
            const renderContext = canvasNode.getContext('2d');
            canvasNode.height = standardViewport.height;
            canvasNode.width = standardViewport.width;

            canvasContainer.appendChild(canvasNode);
            thumbnailCard.appendChild(canvasContainer);

            const counterBadge = document.createElement('span');
            counterBadge.className = 'page-badge';
            counterBadge.textContent = `Page ${pageNum}`;
            thumbnailCard.appendChild(counterBadge);

            thumbnailsGrid.appendChild(thumbnailCard);

            await architecturalPage.render({ canvasContext: renderContext, viewport: standardViewport }).promise;

            thumbnailCard.addEventListener('click', () => {
                if (selectionMode.value === 'all') {
                    selectionMode.value = 'range';
                    rangeInputWrapper.classList.remove('hidden-panel');
                }

                if (deletePagesSet.has(pageNum)) {
                    deletePagesSet.delete(pageNum);
                } else {
                    deletePagesSet.add(pageNum);
                }

                updateInputStringFromSet();
                synchronizeThumbnailsHighlighting();
            });

        } catch (err) {
            console.error(err);
        }
    }

    // ========================================================
    // Synchronization Mappings & Live Previews Processor
    // ========================================================

    function synchronizeThumbnailsHighlighting() {
        document.querySelectorAll('.thumbnail-card').forEach(card => {
            const pageId = parseInt(card.getAttribute('data-page-id'), 10);
            
            if (deletePagesSet.has(pageId)) {
                card.classList.add('marked-delete');
            } else {
                card.classList.remove('marked-delete');
            }
        });
    }

    function updateInputStringFromSet() {
        if (deletePagesSet.size === 0) {
            pageRangeInput.value = '';
            return;
        }
        const sortedArray = Array.from(deletePagesSet).sort((a, b) => a - b);
        let structuralTokens = [];
        let rangeStart = sortedArray[0];
        let rangeEnd = sortedArray[0];

        for (let i = 1; i < sortedArray.length; i++) {
            if (sortedArray[i] === rangeEnd + 1) {
                rangeEnd = sortedArray[i];
            } else {
                if (rangeStart === rangeEnd) {
                    structuralTokens.push(rangeStart);
                } else {
                    structuralTokens.push(`${rangeStart}-${rangeEnd}`);
                }
                rangeStart = sortedArray[i];
                rangeEnd = sortedArray[i];
            }
        }
        if (rangeStart === rangeEnd) {
            structuralTokens.push(rangeStart);
        } else {
            structuralTokens.push(`${rangeStart}-${rangeEnd}`);
        }

        pageRangeInput.value = structuralTokens.join(', ');
    }

    function parseInputStringRangeToSet() {
        deletePagesSet.clear();
        const cleanRawInput = pageRangeInput.value.replace(/\s+/g, '');
        if (!cleanRawInput) return;

        const primaryCommaTokens = cleanRawInput.split(',');

        primaryCommaTokens.forEach(token => {
            if (token.includes('-')) {
                const innerHyphenParts = token.split('-');
                const minRangeBound = parseInt(innerHyphenParts[0], 10);
                const maxRangeBound = parseInt(innerHyphenParts[1], 10);

                if (!isNaN(minRangeBound) && !isNaN(maxRangeBound)) {
                    const low = Math.min(minRangeBound, maxRangeBound);
                    const high = Math.min(Math.max(minRangeBound, maxRangeBound), totalDocumentPages);
                    for (let p = low; p <= high; p++) {
                        if (p >= 1 && p <= totalDocumentPages) deletePagesSet.add(p);
                    }
                }
            } else {
                const targetSinglePage = parseInt(token, 10);
                if (!isNaN(targetSinglePage) && targetSinglePage >= 1 && targetSinglePage <= totalDocumentPages) {
                    deletePagesSet.add(targetSinglePage);
                }
            }
        });
    }

    function updateSelectionUiFromSet() {
        if (deletePagesSet.size === 0) {
            pageRangeInput.value = '';
        } else {
            updateInputStringFromSet();
        }
        synchronizeThumbnailsHighlighting();
    }

    // ========================================================
    // Pipeline Layer: High-Quality Lossless Removal Engine
    // ========================================================

    if (convertBtn) {
        convertBtn.addEventListener('click', async () => {
            if (deletePagesSet.size === 0) {
                logStatus('Please mark at least one page to process exclusion properties.', 'var(--brand-color)');
                return;
            }

            if (deletePagesSet.size === totalDocumentPages) {
                logStatus('Cannot save an empty PDF document. Retain at least one page.', 'var(--brand-color)');
                return;
            }

            logStatus('Compiling new file layouts... <i class="ph-bold ph-spinner ph-spin"></i>', 'var(--text-muted)');
            convertBtn.disabled = true;

            try {
                const operatingPdfDoc = await PDFLib.PDFDocument.load(fileBinaryBytes);
                
                // Sort array in strict reverse chronological sequence to avoid runtime mutations offset crashes
                const sortedPagesToDrop = Array.from(deletePagesSet).sort((a, b) => b - a);

                sortedPagesToDrop.forEach(pageIndex => {
                    operatingPdfDoc.removePage(pageIndex - 1);
                });

                const transformedBytes = await operatingPdfDoc.save({ useObjectStreams: false });
                const outputBinaryBlob = new Blob([transformedBytes], { type: 'application/pdf' });
                const downloadUrl = URL.createObjectURL(outputBinaryBlob);

                const automatedTriggerAnchor = document.createElement('a');
                automatedTriggerAnchor.href = downloadUrl;
                automatedTriggerAnchor.download = currentFile.name.replace(/\.[^/.]+$/, "") + "_edited.pdf";
                document.body.appendChild(automatedTriggerAnchor);
                automatedTriggerAnchor.click();
                
                document.body.removeChild(automatedTriggerAnchor);
                setTimeout(() => URL.revokeObjectURL(downloadUrl), 60000);

                logStatus('<i class="ph-fill ph-check-circle" style="color:#10B981;"></i> Success! High-quality file downloaded.', '#10B981');

            } catch (err) {
                console.error(err);
                logStatus('Error compiling modifications settings.', 'var(--brand-color)');
            } finally {
                convertBtn.disabled = false;
            }
        });
    }

    // ========================================================
    // Apply Changes & Continue Button (No Download)
    // ========================================================
    
    const applyAndContinueBtn = document.getElementById('apply-and-continue-btn');
    
    if (applyAndContinueBtn) {
        applyAndContinueBtn.addEventListener('click', async () => {
            if (deletePagesSet.size === 0) {
                logStatus('Please mark at least one page to delete first.', 'var(--brand-color)');
                return;
            }

            if (deletePagesSet.size === totalDocumentPages) {
                logStatus('Cannot save an empty PDF document. Retain at least one page.', 'var(--brand-color)');
                return;
            }

            // Show tool selection modal
            showToolSelectionModal();
        });
    }
    
    // Tool selection modal for continue editing
    function showToolSelectionModal() {
        // Create modal overlay
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
                <button class="tool-choice-btn" data-tool="pdf-to-jpg.html">
                    <i class="ph-bold ph-image"></i> PDF to JPG
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
        
        // Add styles for buttons
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
                
                // Show loading state on button
                btn.innerHTML = '<i class="ph-bold ph-spinner ph-spin"></i> Saving...';
                btn.disabled = true;
                
                try {
                    // Apply deletions and save PDF
                    const operatingPdfDoc = await PDFLib.PDFDocument.load(fileBinaryBytes);
                    const sortedPagesToDrop = Array.from(deletePagesSet).sort((a, b) => b - a);
                    sortedPagesToDrop.forEach(pageIndex => {
                        operatingPdfDoc.removePage(pageIndex - 1);
                    });
                    const modifiedBytes = await operatingPdfDoc.save();
                    
                    // Save to PDFState
                    if (typeof PDFState !== 'undefined') {
                        PDFState.savePdf(modifiedBytes, currentFile.name, modifiedBytes.byteLength);
                    }
                    
                    // Remove modal and redirect
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

    // ========================================================
    // Utility Control Functions Reset & Handlers
    // ========================================================

    if (viewPdfBtn) {
        viewPdfBtn.addEventListener('click', () => {
            if (!sourceUploadedBlobUrl) return;
            pdfPreviewFrame.src = sourceUploadedBlobUrl;
            pdfModal.classList.add('active');
        });
    }

    const resetApplicationState = () => {
        currentFile = null;
        fileBinaryBytes = null;
        totalDocumentPages = 0;
        fileInput.value = '';
        thumbnailsGrid.innerHTML = '';
        deletePagesSet.clear();

        if (sourceUploadedBlobUrl) URL.revokeObjectURL(sourceUploadedBlobUrl);
        sourceUploadedBlobUrl = null;

        optionsPanel.classList.add('hidden-panel');
        dropZone.classList.remove('hidden');
        logStatus('', '');
        
        // Clear continue section filename
        const continueFileName = document.getElementById('continue-file-name');
        if (continueFileName) continueFileName.textContent = '';
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

    // ==================================================
    // CONTINUE EDITING - Integration
    // ==================================================
    
    // Update continue section with filename
    function updateContinueSection() {
        const continueFileName = document.getElementById('continue-file-name');
        if (continueFileName && currentFile) {
            continueFileName.textContent = currentFile.name;
        }
    }
    
    // Setup continue buttons (bottom section)
    function setupContinueButtons() {
        const continueBtns = document.querySelectorAll('.continue-tool-btn');
        
        continueBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                
                if (!currentFile) {
                    alert('Please upload a PDF file first.');
                    return;
                }
                
                if (deletePagesSet.size === 0) {
                    alert('Please mark at least one page to delete before continuing.');
                    return;
                }
                
                if (deletePagesSet.size === totalDocumentPages) {
                    alert('Cannot continue with an empty PDF. Please keep at least one page.');
                    return;
                }
                
                // Show loading state on button
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="ph-bold ph-spinner ph-spin"></i><span>Saving...</span>';
                btn.style.opacity = '0.7';
                btn.disabled = true;
                
                try {
                    // Apply deletions
                    const operatingPdfDoc = await PDFLib.PDFDocument.load(fileBinaryBytes);
                    const sortedPagesToDrop = Array.from(deletePagesSet).sort((a, b) => b - a);
                    sortedPagesToDrop.forEach(pageIndex => {
                        operatingPdfDoc.removePage(pageIndex - 1);
                    });
                    const modifiedBytes = await operatingPdfDoc.save();
                    
                    // Save to session storage
                    if (typeof PDFState !== 'undefined') {
                        PDFState.savePdf(modifiedBytes, currentFile.name, modifiedBytes.byteLength);
                    }
                    
                    // Get target tool
                    const targetTool = btn.getAttribute('data-tool');
                    
                    // Redirect
                    window.location.href = targetTool;
                    
                } catch (error) {
                    console.error('Error saving PDF:', error);
                    alert('Error applying changes. Please try again.');
                } finally {
                    btn.innerHTML = originalHTML;
                    btn.style.opacity = '1';
                    btn.disabled = false;
                }
            });
        });
    }
    
    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
    
    // Call setup when DOM is ready
    if (document.querySelector('.continue-tool-btn')) {
        setupContinueButtons();
    }
    
    // Auto-load stored PDF if exists
    if (typeof PDFState !== 'undefined' && PDFState.hasPdf()) {
        const stored = PDFState.loadPdf();
        if (stored && !currentFile) {
            const file = new File([stored.pdfBytes], stored.name, { type: 'application/pdf' });
            processUploadDocument(file);
            PDFState.clearPdf();
        }
    } else if (localStorage.getItem('fixmypdf_current_pdf') && !currentFile) {
        // Fallback for localStorage
        const base64 = localStorage.getItem('fixmypdf_current_pdf');
        const name = localStorage.getItem('fixmypdf_current_name');
        if (base64 && name) {
            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            const file = new File([bytes], name, { type: 'application/pdf' });
            processUploadDocument(file);
            localStorage.removeItem('fixmypdf_current_pdf');
            localStorage.removeItem('fixmypdf_current_name');
        }
    }

}); // END OF DOMContentLoaded
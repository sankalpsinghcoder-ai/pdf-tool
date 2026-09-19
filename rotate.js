// --- FIXMYPDF: ROTATE PDF PRO ENGINE PIPELINE --- //

document.addEventListener('DOMContentLoaded', () => {

    // UI elements connections mappings
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const optionsPanel = document.getElementById('options-panel');
    
    const fileNameDisplay = document.getElementById('file-name-display').querySelector('span');
    const pageCountDisplay = document.getElementById('page-count-display');
    const selectionMode = document.getElementById('selection-mode');
    const rotationAngle = document.getElementById('rotation-angle');
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
    let selectedPagesSet = new Set();
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

    // Dynamic rotation live updates observer hook
    if (rotationAngle) {
        rotationAngle.addEventListener('change', () => {
            synchronizeThumbnailsHighlighting();
        });
    }

    // Toggle view layout modes visibility based on selection changes
    if (selectionMode) {
        selectionMode.addEventListener('change', () => {
            if (selectionMode.value === 'range') {
                rangeInputWrapper.classList.remove('hidden-panel');
                updateSelectionUiFromSet();
            } else {
                rangeInputWrapper.classList.add('hidden-panel');
                for (let i = 1; i <= totalDocumentPages; i++) selectedPagesSet.add(i);
                synchronizeThumbnailsHighlighting();
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
            for (let i = 1; i <= totalDocumentPages; i++) selectedPagesSet.add(i);
            updateInputStringFromSet();
            synchronizeThumbnailsHighlighting();
        });
    }

    if (clearAllPill) {
        clearAllPill.addEventListener('click', () => {
            selectionMode.value = 'range';
            rangeInputWrapper.classList.remove('hidden-panel');
            selectedPagesSet.clear();
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
            selectedPagesSet.clear();

            for (let i = 1; i <= totalDocumentPages; i++) {
                selectedPagesSet.add(i);
                await generateSinglePageThumbnail(loadedPdfInstance, i);
            }

            selectionMode.value = 'all';
            rangeInputWrapper.classList.add('hidden-panel');
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
            thumbnailCard.className = 'thumbnail-card selected-page';
            thumbnailCard.setAttribute('data-page-id', pageNum);

            // Added explicit rotational viewport wrapper node element 
            const rotationWrapper = document.createElement('div');
            rotationWrapper.className = 'canvas-rotation-wrapper';

            const canvasNode = document.createElement('canvas');
            const renderContext = canvasNode.getContext('2d');
            canvasNode.height = standardViewport.height;
            canvasNode.width = standardViewport.width;

            rotationWrapper.appendChild(canvasNode);
            thumbnailCard.appendChild(rotationWrapper);

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

                if (selectedPagesSet.has(pageNum)) {
                    selectedPagesSet.delete(pageNum);
                } else {
                    selectedPagesSet.add(pageNum);
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
        const liveActiveAngle = rotationAngle ? rotationAngle.value : '0';

        document.querySelectorAll('.thumbnail-card').forEach(card => {
            const pageId = parseInt(card.getAttribute('data-page-id'), 10);
            const rotationWrapperNode = card.querySelector('.canvas-rotation-wrapper');
            
            if (selectedPagesSet.has(pageId)) {
                card.classList.add('selected-page');
                // Apply rotation transform properties dynamically to selected pages
                if (rotationWrapperNode) {
                    rotationWrapperNode.style.transform = `rotate(${liveActiveAngle}deg)`;
                }
            } else {
                card.classList.remove('selected-page');
                // Reset non-selected pages back to flat orientation layout maps
                if (rotationWrapperNode) {
                    rotationWrapperNode.style.transform = 'rotate(0deg)';
                }
            }
        });
    }

    function updateInputStringFromSet() {
        if (selectedPagesSet.size === 0) {
            pageRangeInput.value = '';
            return;
        }
        const sortedArray = Array.from(selectedPagesSet).sort((a, b) => a - b);
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
        selectedPagesSet.clear();
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
                        if (p >= 1 && p <= totalDocumentPages) selectedPagesSet.add(p);
                    }
                }
            } else {
                const targetSinglePage = parseInt(token, 10);
                if (!isNaN(targetSinglePage) && targetSinglePage >= 1 && targetSinglePage <= totalDocumentPages) {
                    selectedPagesSet.add(targetSinglePage);
                }
            }
        });
    }

    function updateSelectionUiFromSet() {
        if (selectedPagesSet.size === 0) {
            pageRangeInput.value = '';
        } else {
            updateInputStringFromSet();
        }
        synchronizeThumbnailsHighlighting();
    }

    // ========================================================
    // Pipeline Layer: High-Quality Lossless Assembly Engine
    // ========================================================

    if (convertBtn) {
        convertBtn.addEventListener('click', async () => {
            if (selectionMode.value === 'range' && selectedPagesSet.size === 0) {
                logStatus('Please select at least one page to apply rotation properties.', 'var(--brand-color)');
                return;
            }

            logStatus('Injecting rotation structures... <i class="ph-bold ph-spinner ph-spin"></i>', 'var(--text-muted)');
            convertBtn.disabled = true;

            try {
                // Read original binary byte structures losslessly
                const operatingPdfDoc = await PDFLib.PDFDocument.load(fileBinaryBytes);
                const degreeAngleSetting = parseInt(rotationAngle.value, 10);
                const completePagesArray = operatingPdfDoc.getPages();

                for (let targetIndex = 1; targetIndex <= totalDocumentPages; targetIndex++) {
                    if (selectionMode.value === 'all' || selectedPagesSet.has(targetIndex)) {
                        const contextualPage = completePagesArray[targetIndex - 1];
                        const currentExistingAngle = contextualPage.getRotation().angle;
                        
                        const compositeNewAngle = (currentExistingAngle + degreeAngleSetting) % 360;
                        contextualPage.setRotation(PDFLib.degrees(compositeNewAngle));
                    }
                }

                // CRITICAL: useObjectStreams: false preserves metadata pipelines without downsampling objects
                const transformedBytes = await operatingPdfDoc.save({ useObjectStreams: false });
                const outputBinaryBlob = new Blob([transformedBytes], { type: 'application/pdf' });
                const downloadUrl = URL.createObjectURL(outputBinaryBlob);

                const automatedTriggerAnchor = document.createElement('a');
                automatedTriggerAnchor.href = downloadUrl;
                automatedTriggerAnchor.download = currentFile.name.replace(/\.[^/.]+$/, "") + "_rotated.pdf";
                document.body.appendChild(automatedTriggerAnchor);
                automatedTriggerAnchor.click();
                
                // Cleanup thread references allocation safely
                document.body.removeChild(automatedTriggerAnchor);
                setTimeout(() => URL.revokeObjectURL(downloadUrl), 60000);

                logStatus('<i class="ph-fill ph-check-circle" style="color:#10B981;"></i> Success! High-quality file downloaded.', '#10B981');

            } catch (err) {
                console.error(err);
                logStatus('Error compiling layout changes.', 'var(--brand-color)');
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
            if (selectionMode.value === 'range' && selectedPagesSet.size === 0) {
                logStatus('Please select at least one page to rotate first.', 'var(--brand-color)');
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
                    // Apply rotations and save PDF
                    const operatingPdfDoc = await PDFLib.PDFDocument.load(fileBinaryBytes);
                    const degreeAngleSetting = parseInt(rotationAngle.value, 10);
                    const completePagesArray = operatingPdfDoc.getPages();

                    for (let targetIndex = 1; targetIndex <= totalDocumentPages; targetIndex++) {
                        if (selectionMode.value === 'all' || selectedPagesSet.has(targetIndex)) {
                            const contextualPage = completePagesArray[targetIndex - 1];
                            const currentExistingAngle = contextualPage.getRotation().angle;
                            const compositeNewAngle = (currentExistingAngle + degreeAngleSetting) % 360;
                            contextualPage.setRotation(PDFLib.degrees(compositeNewAngle));
                        }
                    }
                    
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
        selectedPagesSet.clear();

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
                
                if (selectionMode.value === 'range' && selectedPagesSet.size === 0) {
                    alert('Please select at least one page to rotate before continuing.');
                    return;
                }
                
                // Show loading state on button
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="ph-bold ph-spinner ph-spin"></i><span>Saving...</span>';
                btn.style.opacity = '0.7';
                btn.disabled = true;
                
                try {
                    // Apply rotations
                    const operatingPdfDoc = await PDFLib.PDFDocument.load(fileBinaryBytes);
                    const degreeAngleSetting = parseInt(rotationAngle.value, 10);
                    const completePagesArray = operatingPdfDoc.getPages();

                    for (let targetIndex = 1; targetIndex <= totalDocumentPages; targetIndex++) {
                        if (selectionMode.value === 'all' || selectedPagesSet.has(targetIndex)) {
                            const contextualPage = completePagesArray[targetIndex - 1];
                            const currentExistingAngle = contextualPage.getRotation().angle;
                            const compositeNewAngle = (currentExistingAngle + degreeAngleSetting) % 360;
                            contextualPage.setRotation(PDFLib.degrees(compositeNewAngle));
                        }
                    }
                    
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
    
    // Call setup when DOM is ready
    if (document.querySelector('.continue-tool-btn')) {
        setupContinueButtons();
    }
    
    // Auto-load stored PDF if exists (handled by auto-loader.js now)
    // The auto-loader.js will handle this automatically

}); // END OF DOMContentLoaded
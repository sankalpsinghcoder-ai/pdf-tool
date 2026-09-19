// --- FIXMYPDF: REORDER PDF PAGES PROCESSING ARCHITECTURE ENGINE --- //

document.addEventListener('DOMContentLoaded', () => {

    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const optionsPanel = document.getElementById('options-panel');
    
    const fileNameDisplay = document.getElementById('file-name-display').querySelector('span');
    const pageCountDisplay = document.getElementById('page-count-display');
    const reorderCanvas = document.getElementById('reorder-canvas');
    
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
    
    let layoutOrderArray = []; 
    let sourceUploadedBlobUrl = null;
    
    let activeSelectedCard = null;
    let draggingCardElement = null;

    // Matches rotate.js perfectly - simple and browser-friendly
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

        const pdfEngine = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
        if (!pdfEngine) {
            alert('PDF rendering engine could not be initiated.');
            return;
        }
        
        // Matches rotate.js initialization 
        pdfEngine.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

        currentFile = file;
        fileNameDisplay.textContent = file.name;

        try {
            fileBinaryBytes = await file.arrayBuffer();
            
            const originalBlobSource = new Blob([fileBinaryBytes], { type: 'application/pdf' });
            if (sourceUploadedBlobUrl) URL.revokeObjectURL(sourceUploadedBlobUrl);
            sourceUploadedBlobUrl = URL.createObjectURL(originalBlobSource);

            // Matches rotate.js binary handling
            const loadedPdfInstance = await pdfEngine.getDocument({ 
                data: fileBinaryBytes.slice(0) 
            }).promise;

            totalDocumentPages = loadedPdfInstance.numPages;
            pageCountDisplay.textContent = `Contains ${totalDocumentPages} page${totalDocumentPages > 1 ? 's' : ''}`;

            layoutOrderArray = Array.from({ length: totalDocumentPages }, (_, i) => i + 1);
            
            await renderInteractiveStructuralGrid(loadedPdfInstance);

            dropZone.classList.add('hidden-panel');
            optionsPanel.classList.remove('hidden-panel');
            logStatus('', '');

        } catch (error) {
            console.error(error);
            alert('Error rendering visual page matrix maps.');
            dropZone.classList.remove('hidden-panel');
            optionsPanel.classList.add('hidden-panel');
        }
    }

    async function renderInteractiveStructuralGrid(pdfInstance) {
        reorderCanvas.innerHTML = '';
        activeSelectedCard = null;
        reorderCanvas.classList.remove('insertion-mode-active');

        for (let idx = 0; idx < layoutOrderArray.length; idx++) {
            const structuralPageNum = layoutOrderArray[idx];
            reorderCanvas.appendChild(createInsertionGapPointer(idx));
            const elementCardNode = await buildVisualCardComponent(pdfInstance, structuralPageNum);
            reorderCanvas.appendChild(elementCardNode);
        }
        
        reorderCanvas.appendChild(createInsertionGapPointer(layoutOrderArray.length));
    }

    async function buildVisualCardComponent(pdfInstance, pageNum) {
        const architecturalPage = await pdfInstance.getPage(pageNum);
        const standardViewport = architecturalPage.getViewport({ scale: 0.4 }); 

        const cardContainer = document.createElement('div');
        cardContainer.className = 'thumbnail-card';
        cardContainer.setAttribute('data-assigned-page', pageNum);
        cardContainer.draggable = true;

        const canvasFrame = document.createElement('div');
        canvasFrame.className = 'canvas-container-frame';

        const canvasNode = document.createElement('canvas');
        const renderContext = canvasNode.getContext('2d');
        canvasNode.height = standardViewport.height;
        canvasNode.width = standardViewport.width;

        canvasFrame.appendChild(canvasNode);
        cardContainer.appendChild(canvasFrame);

        const badgeCounter = document.createElement('span');
        badgeCounter.className = 'page-badge';
        badgeCounter.textContent = `Page ${pageNum}`;
        cardContainer.appendChild(badgeCounter);

        architecturalPage.render({ canvasContext: renderContext, viewport: standardViewport }).promise;

        cardContainer.addEventListener('dragstart', (e) => {
            draggingCardElement = cardContainer;
            cardContainer.classList.add('dragging-element');
            e.dataTransfer.effectAllowed = 'move';
        });

        cardContainer.addEventListener('dragend', () => {
            cardContainer.classList.remove('dragging-element');
            document.querySelectorAll('.thumbnail-card').forEach(c => c.classList.remove('drag-over-receive'));
            draggingCardElement = null;
        });

        cardContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (draggingCardElement && draggingCardElement !== cardContainer) {
                cardContainer.classList.add('drag-over-receive');
            }
        });

        cardContainer.addEventListener('dragleave', () => {
            cardContainer.classList.remove('drag-over-receive');
        });

        cardContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!draggingCardElement || draggingCardElement === cardContainer) return;

            const originSourcePage = parseInt(draggingCardElement.getAttribute('data-assigned-page'), 10);
            const targetDropPage = parseInt(cardContainer.getAttribute('data-assigned-page'), 10);

            const sourceIdx = layoutOrderArray.indexOf(originSourcePage);
            const targetIdx = layoutOrderArray.indexOf(targetDropPage);

            if (sourceIdx > -1 && targetIdx > -1) {
                layoutOrderArray.splice(sourceIdx, 1);
                layoutOrderArray.splice(targetIdx, 0, originSourcePage);
                reRenderWithExistingEngineInstance(pdfInstance);
            }
        });

        cardContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (activeSelectedCard === cardContainer) {
                cardContainer.classList.remove('selected-active');
                activeSelectedCard = null;
                reorderCanvas.classList.remove('insertion-mode-active');
            } else {
                if (activeSelectedCard) activeSelectedCard.classList.remove('selected-active');
                cardContainer.classList.add('selected-active');
                activeSelectedCard = cardContainer;
                reorderCanvas.classList.add('insertion-mode-active');
            }
        });

        return cardContainer;
    }

    function createInsertionGapPointer(targetInsertionIndex) {
        const gapNode = document.createElement('div');
        gapNode.className = 'insertion-gap-target';
        gapNode.innerHTML = '<i class="ph-bold ph-caret-down"></i>';
        gapNode.setAttribute('data-insertion-index', targetInsertionIndex);

        gapNode.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!activeSelectedCard) return;

            const targetMovePage = parseInt(activeSelectedCard.getAttribute('data-assigned-page'), 10);
            const currentIdx = layoutOrderArray.indexOf(targetMovePage);

            if (currentIdx > -1) {
                layoutOrderArray.splice(currentIdx, 1);
                
                let dynamicLandingIdx = targetInsertionIndex;
                if (currentIdx < dynamicLandingIdx) {
                    dynamicLandingIdx--;
                }

                layoutOrderArray.splice(dynamicLandingIdx, 0, targetMovePage);
                
                const pdfEngine = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
                pdfEngine.getDocument({ data: fileBinaryBytes.slice(0) }).promise.then(instance => {
                    renderInteractiveStructuralGrid(instance);
                });
            }
        });

        return gapNode;
    }

    async function reRenderWithExistingEngineInstance(pdfInstance) {
        await renderInteractiveStructuralGrid(pdfInstance);
    }

    if (reorderCanvas) {
        reorderCanvas.addEventListener('click', () => {
            if (activeSelectedCard) {
                activeSelectedCard.classList.remove('selected-active');
                activeSelectedCard = null;
                reorderCanvas.classList.remove('insertion-mode-active');
            }
        });
    }

    if (convertBtn) {
        convertBtn.addEventListener('click', async () => {
            logStatus('Assembling layout matrix... <i class="ph-bold ph-spinner ph-spin"></i>', 'var(--text-muted)');
            convertBtn.disabled = true;

            try {
                const operatingPdfDoc = await PDFLib.PDFDocument.load(fileBinaryBytes);
                const completeOriginalDocument = await PDFLib.PDFDocument.load(fileBinaryBytes);
                
                const operationalPageCount = operatingPdfDoc.getPageCount();
                for (let i = operationalPageCount - 1; i >= 0; i--) {
                    operatingPdfDoc.removePage(i);
                }

                for (let step = 0; step < layoutOrderArray.length; step++) {
                    const originalSourceIndex = layoutOrderArray[step] - 1;
                    const [copiedPageObject] = await operatingPdfDoc.copyPages(completeOriginalDocument, [originalSourceIndex]);
                    operatingPdfDoc.addPage(copiedPageObject);
                }

                const transformedBytes = await operatingPdfDoc.save({ useObjectStreams: false });
                const outputBinaryBlob = new Blob([transformedBytes], { type: 'application/pdf' });
                const downloadUrl = URL.createObjectURL(outputBinaryBlob);

                const automatedTriggerAnchor = document.createElement('a');
                automatedTriggerAnchor.href = downloadUrl;
                automatedTriggerAnchor.download = currentFile.name.replace(/\.[^/.]+$/, "") + "_reordered.pdf";
                document.body.appendChild(automatedTriggerAnchor);
                automatedTriggerAnchor.click();
                
                document.body.removeChild(automatedTriggerAnchor);
                setTimeout(() => URL.revokeObjectURL(downloadUrl), 60000);

                logStatus('<i class="ph-fill ph-check-circle" style="color:#10B981;"></i> Success! Sorted high-quality file downloaded.', '#10B981');

            } catch (err) {
                console.error(err);
                logStatus('Error compiling structural transformations.', 'var(--brand-color)');
            } finally {
                convertBtn.disabled = false;
            }
        });
    }

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
        reorderCanvas.innerHTML = '';
        layoutOrderArray = [];
        activeSelectedCard = null;
        draggingCardElement = null;

        if (sourceUploadedBlobUrl) URL.revokeObjectURL(sourceUploadedBlobUrl);
        sourceUploadedBlobUrl = null;

        optionsPanel.classList.add('hidden-panel');
        dropZone.classList.remove('hidden-panel');
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
// --- FIXMYPDF: COMPRESS PDF LOGIC --- //

document.addEventListener('DOMContentLoaded', () => {

    // Initialize Worker with matching configuration CDN
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    // UI elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const optionsPanel = document.getElementById('options-panel');
    const fileNameDisplay = document.getElementById('file-name-display');
    const pageCountDisplay = document.getElementById('page-count-display');
    const compressionLevel = document.getElementById('compression-level');
    const compressBtn = document.getElementById('compress-btn');
    const statusMessage = document.getElementById('status-message');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');

    const removeFileBtn = document.getElementById('remove-file-btn');
    const viewPdfBtn = document.getElementById('view-pdf-btn');

    const pdfModal = document.getElementById('pdf-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const pdfPreviewFrame = document.getElementById('pdf-preview-frame');

    let currentFile = null;
    let originalPdfBytes = null; // Stored permanently as reference master
    let totalPages = 0;
    let pdfPreviewUrl = null;

    // ==================================================
    // Input/Upload Pipeline
    // ==================================================

    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleFile(e.target.files[0]);
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
    });

    async function handleFile(file) {
        if (file.type !== 'application/pdf') {
            alert('Please drop or select an authentic PDF layout.');
            return;
        }

        currentFile = file;
        fileNameDisplay.textContent = file.name;
        dropZone.classList.add('hidden');
        optionsPanel.classList.remove('hidden');
        compressBtn.disabled = true;
        statusMessage.textContent = 'Analyzing asset components...';
        statusMessage.style.color = 'var(--text-muted)';

        try {
            // Read into clean standard buffer array master
            const arrayBuffer = await file.arrayBuffer();
            originalPdfBytes = arrayBuffer;

            const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
            pdfPreviewUrl = URL.createObjectURL(blob);

            const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
            totalPages = pdfDoc.getPageCount();

            pageCountDisplay.textContent = `${totalPages} Pages`;
            statusMessage.textContent = '';
            compressBtn.disabled = false;

        } catch (error) {
            console.error(error);
            statusMessage.textContent = 'Unable to parse secure properties.';
            statusMessage.style.color = 'var(--brand-color)';
        }
    }

    // ==================================================
    // State Tear-down
    // ==================================================

    removeFileBtn.addEventListener('click', () => {
        currentFile = null;
        originalPdfBytes = null;
        totalPages = 0;
        fileInput.value = '';

        if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
        pdfPreviewUrl = null;

        optionsPanel.classList.add('hidden');
        progressContainer.style.display = 'none';
        progressBar.style.width = '0%';
        dropZone.classList.remove('hidden');
        statusMessage.textContent = '';
    });

    // ==================================================
    // Modal Viewport Engine
    // ==================================================

    viewPdfBtn.addEventListener('click', () => {
        if (!pdfPreviewUrl) return;
        pdfPreviewFrame.src = pdfPreviewUrl;
        pdfModal.classList.add('active');
    });

    const hideModal = () => {
        pdfModal.classList.remove('active');
        setTimeout(() => { pdfPreviewFrame.src = ''; }, 300);
    };

    closeModalBtn.addEventListener('click', hideModal);
    pdfModal.addEventListener('click', (e) => { if (e.target === pdfModal) hideModal(); });

    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // ==================================================
    // Core Compression Algorithm Engine
    // ==================================================

    compressBtn.addEventListener('click', async () => {
        if (!currentFile || !originalPdfBytes) return;

        compressBtn.disabled = true;
        compressBtn.innerHTML = `Optimizing... <i class="ph-bold ph-spinner ph-spin"></i>`;
        statusMessage.style.color = 'var(--text-muted)';
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';

        let pdfjsDoc = null;

        try {
            const level = compressionLevel.value;
            
            let renderScale = 1.25; 
            let imgQuality = 0.60;

            if (level === 'low') {
                renderScale = 1.60;
                imgQuality = 0.82;
            } else if (level === 'high') {
                renderScale = 0.85; 
                imgQuality = 0.38;
            }

            // FIX: Use .slice(0) to pass a fresh isolated byte allocation.
            // This leaves originalPdfBytes completely intact for future clicks!
            const isolatedBytes = new Uint8Array(originalPdfBytes.slice(0));
            
            pdfjsDoc = await pdfjsLib.getDocument({ data: isolatedBytes }).promise;
            const outputPdf = await PDFLib.PDFDocument.create();

            for (let i = 1; i <= pdfjsDoc.numPages; i++) {
                statusMessage.textContent = `Processing page ${i} of ${pdfjsDoc.numPages}...`;
                
                const progressPercent = (i / pdfjsDoc.numPages) * 100;
                progressBar.style.width = `${progressPercent}%`;

                const page = await pdfjsDoc.getPage(i);
                
                const originalViewport = page.getViewport({ scale: 1.0 });
                const renderViewport = page.getViewport({ scale: renderScale });

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = renderViewport.width;
                canvas.height = renderViewport.height;

                await page.render({
                    canvasContext: context,
                    viewport: renderViewport
                }).promise;

                const imageData = canvas.toDataURL('image/jpeg', imgQuality);
                const embeddedJpg = await outputPdf.embedJpg(imageData);

                const newPage = outputPdf.addPage([originalViewport.width, originalViewport.height]);
                newPage.drawImage(embeddedJpg, {
                    x: 0,
                    y: 0,
                    width: originalViewport.width,
                    height: originalViewport.height
                });
            }

            statusMessage.textContent = 'Packaging binary document files streams...';
            
            const compressedBytes = await outputPdf.save({ useObjectStreams: true });
            const compressedBlob = new Blob([compressedBytes], { type: 'application/pdf' });

            const originalSize = currentFile.size;
            const finalSize = compressedBlob.size;

            const downloadUrl = URL.createObjectURL(compressedBlob);
            const anchor = document.createElement('a');
            anchor.href = downloadUrl;
            anchor.download = `FixMyPDF_Compressed_${currentFile.name}`;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            URL.revokeObjectURL(downloadUrl);

            if (finalSize >= originalSize) {
                statusMessage.innerHTML = `
                    <i class="ph-fill ph-info"></i> Already Optimized!<br>
                    Original size was already efficiently packed (${formatBytes(originalSize)}).
                `;
                statusMessage.style.color = '#F59E0B'; 
            } else {
                const saving = ((originalSize - finalSize) / originalSize) * 100;
                statusMessage.innerHTML = `
                    <i class="ph-fill ph-check-circle"></i> Complete!<br>
                    Before: ${formatBytes(originalSize)} | After: ${formatBytes(finalSize)}<br>
                    Saved: <strong>${saving.toFixed(1)}% Smaller</strong>
                `;
                statusMessage.style.color = '#10B981'; 
            }

        } catch (error) {
            console.error(error);
            statusMessage.innerHTML = `<i class="ph-fill ph-warning-circle"></i> Processing pipeline breakdown. Try matching parameters again.`;
            statusMessage.style.color = 'var(--brand-color)';
        } finally {
            // Memory Management: Explicitly garbage collect the active worker task instance
            if (pdfjsDoc) {
                try { await pdfjsDoc.destroy(); } catch(e) { console.error(e); }
            }
            compressBtn.disabled = false;
            compressBtn.innerHTML = `Compress PDF <i class="ph-bold ph-arrows-in"></i>`;
        }
    });
});
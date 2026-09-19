// --- FIXMYPDF: SPLIT PDF LOGIC --- //

document.addEventListener('DOMContentLoaded', () => {
    
    // Core Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const optionsPanel = document.getElementById('options-panel');
    const fileNameDisplay = document.getElementById('file-name-display');
    const pageCountDisplay = document.getElementById('page-count-display');
    const pageRangeInput = document.getElementById('page-range');
    const splitBtn = document.getElementById('split-btn');
    const statusMessage = document.getElementById('status-message');

    // New UX Elements
    const removeFileBtn = document.getElementById('remove-file-btn');
    const viewPdfBtn = document.getElementById('view-pdf-btn');
    const pdfModal = document.getElementById('pdf-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const pdfPreviewFrame = document.getElementById('pdf-preview-frame');

    let currentFile = null;
    let totalPages = 0;
    let originalPdfBytes = null;
    let pdfPreviewUrl = null; // Stores the secure local URL for the preview

    // 1. Handle File Selection
    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if(e.target.files.length > 0) handleFile(e.target.files[0]);
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
        if(e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
    });

    // 2. Read the PDF to get page count & set up preview
    async function handleFile(file) {
        if (file.type !== 'application/pdf') {
            alert('Please select a valid PDF file.');
            return;
        }

        currentFile = file;
        fileNameDisplay.textContent = file.name;
        dropZone.classList.add('hidden'); 
        optionsPanel.classList.remove('hidden'); 
        
        statusMessage.textContent = "Analyzing PDF...";
        splitBtn.disabled = true;

        try {
            const arrayBuffer = await file.arrayBuffer();
            originalPdfBytes = arrayBuffer; 
            
            // Generate a secure local URL for the preview modal
            const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
            pdfPreviewUrl = URL.createObjectURL(blob);
            
            // Read PDF metadata
            const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
            totalPages = pdfDoc.getPageCount();
            
            pageCountDisplay.textContent = `${totalPages} Pages`;
            pageRangeInput.placeholder = `e.g., 1, 3, 5-${Math.min(10, totalPages)}`;
            
            statusMessage.textContent = "";
            splitBtn.disabled = false;
        } catch (error) {
            console.error(error);
            statusMessage.textContent = "Error reading PDF. It might be corrupted or encrypted.";
            statusMessage.style.color = "var(--brand-color)";
        }
    }

    // 3. NEW: Remove File Logic (UX Fix)
    removeFileBtn.addEventListener('click', () => {
        currentFile = null;
        totalPages = 0;
        originalPdfBytes = null;
        fileInput.value = ''; // Reset file input
        pageRangeInput.value = ''; // Clear text box
        
        // Revoke the preview URL from memory to prevent memory leaks
        if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
        pdfPreviewUrl = null;

        optionsPanel.classList.add('hidden');
        dropZone.classList.remove('hidden');
    });

    // 4. NEW: View PDF Modal Logic
    viewPdfBtn.addEventListener('click', () => {
        if (pdfPreviewUrl) {
            pdfPreviewFrame.src = pdfPreviewUrl; // Load the secure local file into iframe
            pdfModal.classList.add('active'); // Show modal
        }
    });

    // Close Modal when X is clicked
    closeModalBtn.addEventListener('click', () => {
        pdfModal.classList.remove('active');
        // Small delay to allow fade out animation before removing src
        setTimeout(() => { pdfPreviewFrame.src = ""; }, 300);
    });

    // Close modal if user clicks outside the modal content (on the blurred background)
    pdfModal.addEventListener('click', (e) => {
        if (e.target === pdfModal) {
            pdfModal.classList.remove('active');
            setTimeout(() => { pdfPreviewFrame.src = ""; }, 300);
        }
    });

    // 5. Helper Function: Convert "1, 3-5" into an array [1, 3, 4, 5]
    function parsePageRange(rangeStr, maxPages) {
        const pages = new Set();
        const parts = rangeStr.split(',');

        for (let part of parts) {
            part = part.trim();
            if (!part) continue;

            if (part.includes('-')) {
                const [start, end] = part.split('-').map(Number);
                if (start > 0 && end >= start && start <= maxPages) {
                    for (let i = start; i <= end; i++) {
                        pages.add(i);
                    }
                }
            } else {
                const num = Number(part);
                if (num > 0 && num <= maxPages) {
                    pages.add(num);
                }
            }
        }
        return Array.from(pages).sort((a, b) => a - b);
    }

    // 6. Perform the Split
    splitBtn.addEventListener('click', async () => {
        const rangeStr = pageRangeInput.value.trim();
        if (!rangeStr) { alert("Please enter the pages you want to extract."); return; }

        const pagesToExtract = parsePageRange(rangeStr, totalPages);
        if (pagesToExtract.length === 0) { alert("Invalid page range."); return; }

        statusMessage.textContent = "Splitting securely on your device...";
        statusMessage.style.color = "var(--text-muted)";
        splitBtn.disabled = true;
        splitBtn.innerHTML = `Processing... <i class="ph-bold ph-spinner ph-spin"></i>`;

        try {
            const pdfDoc = await PDFLib.PDFDocument.load(originalPdfBytes);
            const newPdf = await PDFLib.PDFDocument.create();
            const indicesToExtract = pagesToExtract.map(pageNum => pageNum - 1);
            
            const copiedPages = await newPdf.copyPages(pdfDoc, indicesToExtract);
            copiedPages.forEach(page => newPdf.addPage(page));

            const splitPdfBytes = await newPdf.save();
            const blob = new Blob([splitPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `FixMyPDF_Split_${currentFile.name}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            statusMessage.innerHTML = `<i class="ph-fill ph-check-circle"></i> Success! Extracted ${pagesToExtract.length} pages.`;
            statusMessage.style.color = "#10B981";

        } catch (error) {
            console.error(error);
            statusMessage.innerHTML = `<i class="ph-fill ph-warning-circle"></i> Error splitting PDF.`;
            statusMessage.style.color = "var(--brand-color)";
        } finally {
            splitBtn.disabled = false;
            splitBtn.innerHTML = `Split PDF <i class="ph-bold ph-scissors"></i>`;
        }
    });
});
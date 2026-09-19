// --- FIXMYPDF: MERGE PDF LOGIC --- //

document.addEventListener('DOMContentLoaded', () => {
    
    // Core Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');
    const mergeBtn = document.getElementById('merge-btn');
    const statusMessage = document.getElementById('status-message');

    // Modal Elements
    const pdfModal = document.getElementById('pdf-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const pdfPreviewFrame = document.getElementById('pdf-preview-frame');

    let selectedFiles = [];

    // 1. Make the entire drop-zone clickable to open file picker
    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
        fileInput.value = '';
    });

    // 2. Drag and Drop Effects
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
        handleFiles(e.dataTransfer.files);
    });

    // 3. Process Selected Files
    function handleFiles(files) {
        for (let file of files) {
            if (file.type === 'application/pdf') {
                selectedFiles.push(file);
            } else {
                alert(`"${file.name}" is not a PDF. Please select only PDF files.`);
            }
        }
        updateUI();
    }

    // 4. Update the Premium UI File List
    function updateUI() {
        fileList.innerHTML = ''; 
        
        selectedFiles.forEach((file, index) => {
            const li = document.createElement('li');
            li.className = 'file-item';
            
            li.innerHTML = `
                <div class="file-name">
                    <i class="ph-fill ph-file-pdf"></i>
                    ${index + 1}. ${file.name}
                </div>
                <div class="header-actions">
                    <button class="view-btn icon-btn" data-index="${index}" title="View file">
                        <i class="ph-bold ph-eye"></i> View
                    </button>
                    <button class="remove-btn icon-btn danger" data-index="${index}" title="Remove file">
                        <i class="ph-bold ph-trash"></i>
                    </button>
                </div>
            `;
            fileList.appendChild(li);
        });

        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = e.currentTarget.getAttribute('data-index');
                const fileToView = selectedFiles[index];
                
                const blob = new Blob([fileToView], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                
                pdfPreviewFrame.src = url;
                pdfModal.classList.add('active');
            });
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const indexToRemove = e.currentTarget.getAttribute('data-index');
                selectedFiles.splice(indexToRemove, 1);
                updateUI(); 
            });
        });

        if (selectedFiles.length >= 2) {
            mergeBtn.classList.remove('hidden');
        } else {
            mergeBtn.classList.add('hidden');
        }
    }

    // 5. Modal Close Logic
    closeModalBtn.addEventListener('click', () => {
        pdfModal.classList.remove('active');
        setTimeout(() => { pdfPreviewFrame.src = ""; }, 300);
    });

    pdfModal.addEventListener('click', (e) => {
        if (e.target === pdfModal) {
            pdfModal.classList.remove('active');
            setTimeout(() => { pdfPreviewFrame.src = ""; }, 300);
        }
    });

    // ==================================================
    // Core Merge Function (Reusable)
    // ==================================================

    async function generateMergedPdf() {
        if (selectedFiles.length < 2) return null;
        
        const mergedPdf = await PDFLib.PDFDocument.create();

        for (let file of selectedFiles) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        return await mergedPdf.save();
    }

    // 6. Secure Client-Side Merging using PDF-lib (Download)
    mergeBtn.addEventListener('click', async () => {
        if (selectedFiles.length < 2) {
            statusMessage.textContent = "Please add at least 2 PDF files to merge.";
            statusMessage.style.color = "var(--brand-color)";
            return;
        }

        statusMessage.textContent = "Merging securely on your device... Please wait.";
        statusMessage.style.color = "var(--text-muted)";
        mergeBtn.disabled = true;
        mergeBtn.innerHTML = `Processing... <i class="ph-bold ph-spinner ph-spin"></i>`;

        try {
            const mergedPdfFile = await generateMergedPdf();
            if (!mergedPdfFile) throw new Error('Merge failed');

            const blob = new Blob([mergedPdfFile], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'FixMyPDF_Merged.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            statusMessage.innerHTML = `<i class="ph-fill ph-check-circle"></i> Success! Your PDF has been merged.`;
            statusMessage.style.color = "#10B981";

        } catch (error) {
            console.error(error);
            statusMessage.innerHTML = `<i class="ph-fill ph-warning-circle"></i> An error occurred. Try again.`;
            statusMessage.style.color = "var(--brand-color)";
        } finally {
            mergeBtn.disabled = false;
            mergeBtn.innerHTML = `Merge PDFs <i class="ph-bold ph-arrow-right"></i>`;
        }
    });

    // ==================================================
    // APPLY CHANGES & CONTINUE EDITING
    // ==================================================
    
    const applyAndContinueBtn = document.getElementById('apply-and-continue-btn');
    
    if (applyAndContinueBtn) {
        applyAndContinueBtn.addEventListener('click', async () => {
            if (selectedFiles.length < 2) {
                statusMessage.textContent = "Please add at least 2 PDF files to merge.";
                statusMessage.style.color = "var(--brand-color)";
                return;
            }
            
            showToolSelectionModal();
        });
    }
    
    // Get current PDF bytes for continue
    async function getCurrentPdfBytesForContinue() {
        return await generateMergedPdf();
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
                <h3 style="margin: 10px 0 5px;">PDF Merged Successfully!</h3>
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
                <button class="tool-choice-btn" data-tool="pdf-to-jpg.html">
                    <i class="ph-bold ph-image"></i> PDF to JPG
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
                    statusMessage.textContent = 'Merging PDFs...';
                    const modifiedBytes = await getCurrentPdfBytesForContinue();
                    
                    if (modifiedBytes && typeof PDFState !== 'undefined') {
                        const fileName = `merged_document.pdf`;
                        PDFState.savePdf(modifiedBytes, fileName, modifiedBytes.byteLength);
                    }
                    
                    modalOverlay.remove();
                    window.location.href = targetTool;
                    
                } catch (error) {
                    console.error('Error saving PDF:', error);
                    alert('Error merging PDFs. Please try again.');
                    btn.innerHTML = btn.getAttribute('data-icon') + ' ' + btn.innerText;
                    btn.disabled = false;
                }
            });
        });
        
        document.getElementById('cancel-tool-choice').addEventListener('click', () => {
            modalOverlay.remove();
        });
    }

});
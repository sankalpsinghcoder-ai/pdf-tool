// --- FIXMYPDF: ADVANCED EXCEL TO PDF CONVERSION PIPELINE WITH COLUMN OVERFLOW & TEXT WRAPPING --- //

document.addEventListener('DOMContentLoaded', () => {

    // Component element hook configurations
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const optionsPanel = document.getElementById('options-panel');
    
    const fileNameDisplay = document.getElementById('file-name-display').querySelector('span');
    const sheetCountDisplay = document.getElementById('sheet-count-display');
    const sheetTabsRow = document.getElementById('sheet-tabs-row');
    const excelPreviewTable = document.getElementById('excel-preview-table');
    const pageOrientation = document.getElementById('page-orientation');
    const conversionScope = document.getElementById('conversion-scope');
    
    const convertBtn = document.getElementById('convert-btn');
    const removeFileBtn = document.getElementById('remove-file-btn');
    const viewPdfBtn = document.getElementById('view-pdf-btn');
    const statusMessage = document.getElementById('status-message');

    const pdfModal = document.getElementById('pdf-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const pdfPreviewFrame = document.getElementById('pdf-preview-frame');

    let currentFile = null;
    let workbookDataInstance = null;
    let selectedActiveSheetName = '';
    let generatedPdfBlobUrl = null;

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => { if (e.target.files.length > 0) parseSpreadsheetFile(e.target.files[0]); });

    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length > 0) parseSpreadsheetFile(e.dataTransfer.files[0]);
    });

    // ========================================================
    // Pipeline Layer: Workbook Data Initialization Component
    // ========================================================

    async function parseSpreadsheetFile(file) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
            logStatus('Please provide an authentic XLSX or XLS sheet document.', 'var(--brand-color)');
            return;
        }

        currentFile = file;
        fileNameDisplay.textContent = file.name;
        logStatus('Reading binary worksheet nodes... <i class="ph-bold ph-spinner ph-spin"></i>', 'var(--text-muted)');
        dropZone.classList.add('hidden');

        try {
            const rawArrayBuffer = await file.arrayBuffer();
            workbookDataInstance = XLSX.read(new Uint8Array(rawArrayBuffer), { type: 'array' });

            const sheetsList = workbookDataInstance.SheetNames;
            sheetCountDisplay.textContent = `Detected ${sheetsList.length} workbook sheet tab${sheetsList.length > 1 ? 's' : ''}`;
            
            sheetTabsRow.innerHTML = '';
            sheetsList.forEach((tabName, index) => {
                const sheetTabButton = document.createElement('div');
                sheetTabButton.className = `sheet-tab ${index === 0 ? 'active-sheet' : ''}`;
                sheetTabButton.textContent = tabName;
                sheetTabButton.addEventListener('click', () => swapActiveWorkbookTab(tabName, sheetTabButton));
                sheetTabsRow.appendChild(sheetTabButton);
            });

            selectedActiveSheetName = sheetsList[0];
            renderSheetGridPreview(selectedActiveSheetName);

            optionsPanel.classList.remove('hidden-panel');
            logStatus('', '');

        } catch (error) {
            console.error(error);
            logStatus('Failure unpacking spreadsheet properties.', 'var(--brand-color)');
            dropZone.classList.remove('hidden');
        }
    }

    function swapActiveWorkbookTab(tabName, clickedTabNode) {
        document.querySelectorAll('.sheet-tab').forEach(t => t.classList.remove('active-sheet'));
        clickedTabNode.classList.add('active-sheet');
        selectedActiveSheetName = tabName;
        renderSheetGridPreview(tabName);
    }

    function renderSheetGridPreview(sheetName) {
        const activeWorksheet = workbookDataInstance.Sheets[sheetName];
        const generatedHtmlMatrix = XLSX.utils.sheet_to_html(activeWorksheet, { editable: false });
        excelPreviewTable.innerHTML = generatedHtmlMatrix;
    }

    // Helper Layout Function: Compute Auto Text Wrapping Lines
    function splitTextIntoWrappedLines(text, font, fontSize, maxWidth) {
        const paragraphs = text.split('\n');
        const linesOutput = [];

        paragraphs.forEach(paragraph => {
            const words = paragraph.split(' ');
            let currentLine = '';

            words.forEach(word => {
                const testLine = currentLine ? currentLine + ' ' + word : word;
                const testWidth = font.widthOfTextAtSize(testLine, fontSize);
                
                if (testWidth > maxWidth && currentLine) {
                    linesOutput.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            });
            if (currentLine) linesOutput.push(currentLine);
        });

        return linesOutput;
    }

    // ========================================================
    // Core Excel to PDF Conversion (Reusable)
    // ========================================================

    async function generateExcelToPdf() {
        if (!workbookDataInstance) return null;

        const outputPdfDoc = await PDFLib.PDFDocument.create();
        const layoutDirectionSetting = pageOrientation.value;
        const chosenScopeSetting = conversionScope.value;

        const pageWidthMetric = layoutDirectionSetting === 'landscape' ? 792 : 612;
        const pageHeightMetric = layoutDirectionSetting === 'landscape' ? 612 : 792;

        const coreTextFont = await outputPdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
        const coreBoldFont = await outputPdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);

        let sheetsToProcessArray = chosenScopeSetting === 'all' ? workbookDataInstance.SheetNames : [selectedActiveSheetName];

        for (let targetSheet of sheetsToProcessArray) {
            const activeWorksheet = workbookDataInstance.Sheets[targetSheet];
            const structuredRowData = XLSX.utils.sheet_to_json(activeWorksheet, { header: 1 });

            if (structuredRowData.length === 0) continue; 

            const dynamicMaxColumns = Math.max(...structuredRowData.map(r => r.length));
            
            const maxColsPerPage = 7; 
            const columnChunks = [];
            
            for (let i = 0; i < dynamicMaxColumns; i += maxColsPerPage) {
                columnChunks.push({
                    startIdx: i,
                    endIdx: Math.min(i + maxColsPerPage, dynamicMaxColumns)
                });
            }

            for (let chunk of columnChunks) {
                let canvasPageElement = outputPdfDoc.addPage([pageWidthMetric, pageHeightMetric]);
                const marginHorizontal = 30;
                const marginVertical = 40;
                
                const fontSize = 9;
                const lineSpacingHeight = 12; 
                const cellPaddingOffset = 12;

                let trackingCursorY = pageHeightMetric - marginVertical;
                
                const colsInThisChunk = chunk.endIdx - chunk.startIdx;
                const calculatedColumnWidth = (pageWidthMetric - (marginHorizontal * 2)) / colsInThisChunk;
                const safeTextWidthLimit = calculatedColumnWidth - 8;

                let titleString = `Sheet: ${targetSheet}`;
                if (columnChunks.length > 1) {
                    titleString += ` (Cols ${chunk.startIdx + 1}-${chunk.endIdx})`;
                }
                
                canvasPageElement.drawText(titleString, {
                    x: marginHorizontal,
                    y: trackingCursorY + 12,
                    size: 11,
                    font: coreBoldFont,
                    color: PDFLib.rgb(0.06, 0.49, 0.25)
                });

                for (let rIndex = 0; rIndex < structuredRowData.length; rIndex++) {
                    const currentRowValues = structuredRowData[rIndex];
                    const activeFontInstance = rIndex === 0 ? coreBoldFont : coreTextFont;

                    let maxLinesInRow = 1;
                    const computedRowCellsCache = [];

                    for (let cIndex = chunk.startIdx; cIndex < chunk.endIdx; cIndex++) {
                        const cellRawValue = currentRowValues[cIndex] !== undefined ? String(currentRowValues[cIndex]).trim() : '';
                        
                        let wrappedLinesArray = [];
                        if (cellRawValue !== '') {
                            wrappedLinesArray = splitTextIntoWrappedLines(cellRawValue, activeFontInstance, fontSize, safeTextWidthLimit);
                        }
                        
                        if (wrappedLinesArray.length > maxLinesInRow) {
                            maxLinesInRow = wrappedLinesArray.length;
                        }

                        computedRowCellsCache.push({
                            textLines: wrappedLinesArray,
                            hasValue: cellRawValue !== ''
                        });
                    }

                    const calculatedRowHeight = (maxLinesInRow * lineSpacingHeight) + cellPaddingOffset;

                    if (trackingCursorY - calculatedRowHeight < marginVertical) {
                        canvasPageElement = outputPdfDoc.addPage([pageWidthMetric, pageHeightMetric]);
                        trackingCursorY = pageHeightMetric - marginVertical;
                    }

                    for (let localColIdx = 0; localColIdx < colsInThisChunk; localColIdx++) {
                        const trackingCursorX = marginHorizontal + (localColIdx * calculatedColumnWidth);
                        const cellDataObj = computedRowCellsCache[localColIdx];

                        canvasPageElement.drawRectangle({
                            x: trackingCursorX,
                            y: trackingCursorY - calculatedRowHeight,
                            width: calculatedColumnWidth,
                            height: calculatedRowHeight,
                            borderColor: PDFLib.rgb(0.88, 0.91, 0.94),
                            borderWidth: 0.7,
                            color: rIndex === 0 ? PDFLib.rgb(0.95, 0.96, 0.98) : PDFLib.rgb(1, 1, 1)
                        });

                        if (cellDataObj && cellDataObj.hasValue) {
                            let textOffsetTrackingY = trackingCursorY - 6 - fontSize;

                            cellDataObj.textLines.forEach(singleLineStr => {
                                const measuredLineWidth = activeFontInstance.widthOfTextAtSize(singleLineStr, fontSize);
                                const alignmentShiftX = chunk.startIdx === 0 && localColIdx === 0 ? 5 : (calculatedColumnWidth - measuredLineWidth) / 2;

                                canvasPageElement.drawText(singleLineStr, {
                                    x: trackingCursorX + Math.max(4, alignmentShiftX),
                                    y: textOffsetTrackingY,
                                    size: fontSize,
                                    font: activeFontInstance,
                                    color: rIndex === 0 ? PDFLib.rgb(0.05, 0.09, 0.16) : PDFLib.rgb(0.2, 0.25, 0.33)
                                });

                                textOffsetTrackingY -= lineSpacingHeight;
                            });
                        }
                    }
                    
                    trackingCursorY -= calculatedRowHeight;
                }
            }
        }

        if (outputPdfDoc.getPageCount() === 0) {
            return null;
        }

        return await outputPdfDoc.save();
    }

    // ========================================================
    // Convert Button (Download)
    // ========================================================

    convertBtn.addEventListener('click', async () => {
        logStatus('Compiling spreadsheet vectors... <i class="ph-bold ph-spinner ph-spin"></i>', 'var(--text-muted)');
        convertBtn.disabled = true;

        try {
            const integratedPdfBytes = await generateExcelToPdf();
            
            if (!integratedPdfBytes) {
                logStatus('Target workbook selection has no compilable sheet matrices.', 'var(--brand-color)');
                convertBtn.disabled = false;
                return;
            }

            const compiledBinaryBlob = new Blob([integratedPdfBytes], { type: 'application/pdf' });
            
            if (generatedPdfBlobUrl) URL.revokeObjectURL(generatedPdfBlobUrl);
            generatedPdfBlobUrl = URL.createObjectURL(compiledBinaryBlob);

            viewPdfBtn.classList.remove('hidden-panel');

            const autoExecutionAnchor = document.createElement('a');
            autoExecutionAnchor.href = generatedPdfBlobUrl;
            autoExecutionAnchor.download = currentFile.name.replace(/\.[^/.]+$/, "") + ".pdf";
            document.body.appendChild(autoExecutionAnchor);
            autoExecutionAnchor.click();
            document.body.removeChild(autoExecutionAnchor);

            logStatus('<i class="ph-fill ph-check-circle" style="color:#10B981;"></i> Success! Dynamic layouts compiled perfectly.', '#10B981');

        } catch (err) {
            console.error(err);
            logStatus('Error converting document properties.', 'var(--brand-color)');
        } finally {
            convertBtn.disabled = false;
        }
    });

    // ========================================================
    // APPLY CHANGES & CONTINUE EDITING
    // ========================================================
    
    const applyAndContinueBtn = document.getElementById('apply-and-continue-btn');
    
    if (applyAndContinueBtn) {
        applyAndContinueBtn.addEventListener('click', async () => {
            if (!currentFile || !workbookDataInstance) {
                logStatus('Please upload an Excel file first.', 'var(--brand-color)');
                return;
            }
            
            showToolSelectionModal();
        });
    }
    
    // Get current PDF bytes for continue
    async function getCurrentPdfBytesForContinue() {
        return await generateExcelToPdf();
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
                <h3 style="margin: 10px 0 5px;">Conversion Applied Successfully!</h3>
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
                    logStatus('Converting Excel to PDF...');
                    const modifiedBytes = await getCurrentPdfBytesForContinue();
                    
                    if (modifiedBytes && typeof PDFState !== 'undefined') {
                        PDFState.savePdf(modifiedBytes, currentFile.name.replace(/\.[^/.]+$/, "") + ".pdf", modifiedBytes.byteLength);
                    }
                    
                    modalOverlay.remove();
                    window.location.href = targetTool;
                    
                } catch (error) {
                    console.error('Error saving PDF:', error);
                    alert('Error applying conversion. Please try again.');
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

    viewPdfBtn.addEventListener('click', () => {
        if (!generatedPdfBlobUrl) return;
        pdfPreviewFrame.src = generatedPdfBlobUrl;
        pdfModal.classList.add('active');
    });

    const resetApplicationState = () => {
        currentFile = null;
        workbookDataInstance = null;
        selectedActiveSheetName = '';
        fileInput.value = '';
        excelPreviewTable.innerHTML = '';
        sheetTabsRow.innerHTML = '';

        if (generatedPdfBlobUrl) URL.revokeObjectURL(generatedPdfBlobUrl);
        generatedPdfBlobUrl = null;

        viewPdfBtn.classList.add('hidden-panel');
        optionsPanel.classList.add('hidden-panel');
        dropZone.classList.remove('hidden');
        logStatus('', '');
    };

    removeFileBtn.addEventListener('click', resetApplicationState);
    closeModalBtn.addEventListener('click', () => {
        pdfModal.classList.remove('active');
        setTimeout(() => { pdfPreviewFrame.src = ''; }, 300);
    });

    function logStatus(msg, hexColor) {
        statusMessage.innerHTML = msg;
        statusMessage.style.color = hexColor;
    }
});
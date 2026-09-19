// --- FIXMYPDF: WORD TO PDF CONVERTER --- //

document.addEventListener('DOMContentLoaded', () => {

    // UI Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const optionsPanel = document.getElementById('options-panel');
    
    const fileNameDisplay = document.getElementById('file-name-display').querySelector('span');
    const fileInfo = document.getElementById('file-info');
    const htmlPreview = document.getElementById('html-preview');
    const refreshPreviewBtn = document.getElementById('refresh-preview-btn');
    
    const pageSize = document.getElementById('page-size');
    const orientation = document.getElementById('orientation');
    
    const convertBtn = document.getElementById('convert-btn');
    const previewPdfBtn = document.getElementById('preview-pdf-btn');
    const removeFileBtn = document.getElementById('remove-file-btn');
    const statusMessage = document.getElementById('status-message');

    const pdfModal = document.getElementById('pdf-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const pdfPreviewFrame = document.getElementById('pdf-preview-frame');

    let currentFile = null;
    let currentHtmlContent = null;
    let previewBlobUrl = null;

    // Page size dimensions in points (1 point = 1/72 inch)
    const pageDimensions = {
        A4: { width: 595, height: 842 },
        Letter: { width: 612, height: 792 },
        Legal: { width: 612, height: 1008 },
        A3: { width: 842, height: 1191 }
    };

    // Get current page dimensions based on settings
    function getPageDimensions() {
        let dims = pageDimensions[pageSize.value];
        if (orientation.value === 'landscape') {
            return { width: dims.height, height: dims.width };
        }
        return dims;
    }

    // Convert Word document to HTML using mammoth.js
    async function convertWordToHtml(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target.result;
                    
                    // For DOCX files, use mammoth
                    if (file.name.endsWith('.docx')) {
                        const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
                        resolve(result.value);
                    } 
                    // For DOC files (older format)
                    else if (file.name.endsWith('.doc')) {
                        // Mammoth also supports .doc to some extent
                        const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
                        resolve(result.value);
                    }
                    // For plain text files
                    else if (file.name.endsWith('.txt')) {
                        const text = new TextDecoder('utf-8').decode(arrayBuffer);
                        const html = `<pre style="font-family: monospace; white-space: pre-wrap;">${escapeHtml(text)}</pre>`;
                        resolve(html);
                    }
                    else {
                        reject(new Error('Unsupported file format'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Render HTML preview
    function renderPreview(html) {
        htmlPreview.innerHTML = html;
    }

    // Generate PDF from HTML content
    async function htmlToPdf(htmlContent) {
        const { width, height } = getPageDimensions();
        
        // Create a new PDF document
        const pdfDoc = await PDFLib.PDFDocument.create();
        
        // Create a temporary div to measure content
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.width = `${width}px`;
        tempDiv.style.fontFamily = 'Calibri, Arial, sans-serif';
        tempDiv.style.fontSize = '12pt';
        tempDiv.style.lineHeight = '1.5';
        tempDiv.style.padding = '50px';
        tempDiv.innerHTML = htmlContent;
        document.body.appendChild(tempDiv);
        
        // Measure content height
        const contentHeight = tempDiv.scrollHeight;
        const contentWidth = tempDiv.scrollWidth;
        document.body.removeChild(tempDiv);
        
        // Calculate number of pages needed
        const pageContentHeight = height - 100; // 50px margins top and bottom
        const numberOfPages = Math.max(1, Math.ceil(contentHeight / pageContentHeight));
        
        // For each page, add content
        for (let pageNum = 0; pageNum < numberOfPages; pageNum++) {
            const page = pdfDoc.addPage([width, height]);
            
            // Create HTML for this page slice
            const startY = pageNum * pageContentHeight;
            const endY = Math.min(contentHeight, (pageNum + 1) * pageContentHeight);
            
            // Create a page-specific div
            const pageDiv = document.createElement('div');
            pageDiv.style.width = `${width - 100}px`;
            pageDiv.style.fontFamily = 'Calibri, Arial, sans-serif';
            pageDiv.style.fontSize = '12pt';
            pageDiv.style.lineHeight = '1.5';
            pageDiv.style.padding = '50px';
            pageDiv.style.position = 'absolute';
            pageDiv.style.left = '-9999px';
            pageDiv.style.top = `${-startY}px`;
            pageDiv.innerHTML = htmlContent;
            document.body.appendChild(pageDiv);
            
            // Convert to canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;
            
            // Draw white background
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, width, height);
            
            // Use html2canvas if available, otherwise fallback to simple rendering
            if (typeof html2canvas !== 'undefined') {
                const capturedCanvas = await html2canvas(pageDiv, {
                    scale: 2,
                    backgroundColor: 'white',
                    windowWidth: width,
                    windowHeight: height
                });
                ctx.drawImage(capturedCanvas, 0, 0, width, height);
            } else {
                // Simple text rendering fallback
                ctx.fillStyle = 'black';
                ctx.font = '12pt Calibri';
                const text = pageDiv.innerText;
                const lines = text.split('\n');
                let y = 70;
                for (const line of lines) {
                    if (y > height - 70) break;
                    ctx.fillText(line.substring(0, 100), 50, y);
                    y += 20;
                }
            }
            
            document.body.removeChild(pageDiv);
            
            // Embed the canvas image into PDF
            const imgData = canvas.toDataURL('image/png');
            const pngImage = await pdfDoc.embedPng(imgData);
            page.drawImage(pngImage, {
                x: 0,
                y: 0,
                width: width,
                height: height
            });
        }
        
        return await pdfDoc.save();
    }

    // Alternative: Use html2canvas CDN for better rendering
    function loadHtml2Canvas() {
        return new Promise((resolve, reject) => {
            if (typeof html2canvas !== 'undefined') {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Convert and download PDF
    async function convertToPdf(download = true) {
        if (!currentHtmlContent) {
            statusMessage.innerHTML = 'No document loaded.';
            return null;
        }
        
        statusMessage.innerHTML = 'Converting to PDF... <i class="ph-bold ph-spinner ph-spin"></i>';
        convertBtn.disabled = true;
        previewPdfBtn.disabled = true;
        
        try {
            await loadHtml2Canvas();
            const pdfBytes = await htmlToPdf(currentHtmlContent);
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            
            if (download) {
                const a = document.createElement('a');
                a.href = url;
                a.download = currentFile.name.replace(/\.(docx?|txt)$/i, '.pdf');
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                statusMessage.innerHTML = '<i class="ph-fill ph-check-circle" style="color:#10B981;"></i> PDF downloaded successfully!';
                statusMessage.style.color = '#10B981';
            }
            
            return { blob, url };
            
        } catch (error) {
            console.error(error);
            statusMessage.innerHTML = '<i class="ph-fill ph-warning-circle"></i> Error converting to PDF.';
            statusMessage.style.color = 'var(--brand-color)';
            return null;
        } finally {
            convertBtn.disabled = false;
            previewPdfBtn.disabled = false;
        }
    }

    // Preview PDF in modal
    async function previewPdf() {
        if (!currentHtmlContent) return;
        
        statusMessage.innerHTML = 'Generating preview... <i class="ph-bold ph-spinner ph-spin"></i>';
        
        try {
            const result = await convertToPdf(false);
            if (result && result.url) {
                if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
                previewBlobUrl = result.url;
                pdfPreviewFrame.src = previewBlobUrl;
                pdfModal.classList.add('active');
                statusMessage.innerHTML = '';
            }
        } catch (error) {
            console.error(error);
            statusMessage.innerHTML = 'Error generating preview.';
        }
    }

    // Process uploaded file
    async function processUpload(file) {
        const validExtensions = ['.doc', '.docx', '.txt'];
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!validExtensions.includes(ext)) {
            alert('Please select a Word document (.doc, .docx) or text file (.txt)');
            return;
        }

        currentFile = file;
        fileNameDisplay.textContent = file.name;
        fileInfo.textContent = `Size: ${formatFileSize(file.size)} | Converting...`;
        dropZone.classList.add('hidden');
        
        statusMessage.innerHTML = 'Reading document... <i class="ph-bold ph-spinner ph-spin"></i>';
        
        try {
            currentHtmlContent = await convertWordToHtml(file);
            renderPreview(currentHtmlContent);
            optionsPanel.classList.remove('hidden-panel');
            fileInfo.textContent = `Size: ${formatFileSize(file.size)} | Ready to convert`;
            statusMessage.innerHTML = '';
        } catch (error) {
            console.error(error);
            alert('Error reading Word document. Please make sure it\'s a valid file.');
            dropZone.classList.remove('hidden');
            optionsPanel.classList.add('hidden-panel');
            statusMessage.innerHTML = '';
        }
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Refresh preview
    refreshPreviewBtn.addEventListener('click', () => {
        if (currentHtmlContent) {
            renderPreview(currentHtmlContent);
            statusMessage.innerHTML = 'Preview refreshed!';
            setTimeout(() => {
                if (statusMessage.innerHTML === 'Preview refreshed!') statusMessage.innerHTML = '';
            }, 2000);
        }
    });

    // Event listeners
    convertBtn.addEventListener('click', () => convertToPdf(true));
    previewPdfBtn.addEventListener('click', previewPdf);

    // File upload handling
    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) processUpload(e.target.files[0]);
        });
        
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            if (e.dataTransfer.files.length > 0) processUpload(e.dataTransfer.files[0]);
        });
    }

    // Reset state
    const resetState = () => {
        currentFile = null;
        currentHtmlContent = null;
        fileInput.value = '';
        htmlPreview.innerHTML = '<p style="color: #94A3B8; text-align: center;">No document loaded</p>';
        optionsPanel.classList.add('hidden-panel');
        dropZone.classList.remove('hidden');
        statusMessage.innerHTML = '';
        if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
        previewBlobUrl = null;
    };

    removeFileBtn.addEventListener('click', resetState);
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            pdfModal.classList.remove('active');
            setTimeout(() => { pdfPreviewFrame.src = ''; }, 300);
        });
    }
    
    pdfModal.addEventListener('click', (e) => {
        if (e.target === pdfModal) {
            pdfModal.classList.remove('active');
            setTimeout(() => { pdfPreviewFrame.src = ''; }, 300);
        }
    });
});
// --- FIXMYPDF: PNG TO PDF CONVERTER --- //

document.addEventListener('DOMContentLoaded', () => {

    // UI Elements
    const imageDropZone = document.getElementById('image-drop-zone');
    const imageInput = document.getElementById('image-input');
    const imagesGrid = document.getElementById('images-grid');
    const imageCountDisplay = document.getElementById('image-count-display');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const sortByNameBtn = document.getElementById('sort-by-name-btn');
    const sortBySizeBtn = document.getElementById('sort-by-size-btn');
    const reverseOrderBtn = document.getElementById('reverse-order-btn');
    const pageSize = document.getElementById('page-size');
    const orientation = document.getElementById('orientation');
    const imageFit = document.getElementById('image-fit');
    const convertBtn = document.getElementById('convert-btn');
    const previewPdfBtn = document.getElementById('preview-pdf-btn');
    const statusMessage = document.getElementById('status-message');

    const pdfModal = document.getElementById('pdf-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const pdfPreviewFrame = document.getElementById('pdf-preview-frame');

    let images = [];
    let previewBlobUrl = null;
    let isProcessing = false;

    // Page dimensions in points (1pt = 1/72 inch)
    const pageDimensions = {
        A4: { width: 595, height: 842 },
        Letter: { width: 612, height: 792 },
        Legal: { width: 612, height: 1008 }
    };

    function showStatus(message, isError = false) {
        statusMessage.innerHTML = message;
        statusMessage.style.color = isError ? 'var(--brand-color)' : 'var(--text-muted)';
    }

    function clearStatus() {
        statusMessage.innerHTML = '';
    }

    function showSuccess(message) {
        statusMessage.innerHTML = `<i class="ph-fill ph-check-circle" style="color:#10B981;"></i> ${message}`;
        statusMessage.style.color = '#10B981';
        setTimeout(() => {
            if (statusMessage.innerHTML.includes(message)) {
                clearStatus();
            }
        }, 3000);
    }

    function showError(message) {
        statusMessage.innerHTML = `<i class="ph-fill ph-warning-circle"></i> ${message}`;
        statusMessage.style.color = 'var(--brand-color)';
        setTimeout(() => {
            if (statusMessage.innerHTML.includes(message)) {
                clearStatus();
            }
        }, 3000);
    }

    function updateImageCount() {
        const count = images.length;
        if (count === 0) {
            imageCountDisplay.textContent = 'No images added';
        } else {
            imageCountDisplay.textContent = `${count} PNG image${count > 1 ? 's' : ''} added`;
        }
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function renderGrid() {
        if (images.length === 0) {
            imagesGrid.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-muted); grid-column: 1 / -1;">
                    <i class="ph-bold ph-image" style="font-size: 3rem;"></i>
                    <p>No PNG images added yet. Click above to add images.</p>
                </div>
            `;
            updateImageCount();
            return;
        }

        imagesGrid.innerHTML = '';
        images.forEach((img, index) => {
            const card = document.createElement('div');
            card.className = 'image-card';
            card.setAttribute('data-index', index);
            card.draggable = true;
            
            card.innerHTML = `
                <div class="image-index">${index + 1}</div>
                <button class="remove-image-btn" data-index="${index}">
                    <i class="ph-bold ph-x"></i>
                </button>
                <img src="${img.dataUrl}" alt="${img.file.name}">
                <div class="image-info">
                    <div>${img.file.name.substring(0, 20)}${img.file.name.length > 20 ? '...' : ''}</div>
                    <div>${img.width} × ${img.height} px</div>
                    <div>${formatFileSize(img.size)}</div>
                </div>
            `;
            
            // Drag and drop reordering
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', index);
                card.classList.add('dragging');
            });
            
            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
            });
            
            card.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            
            card.addEventListener('drop', (e) => {
                e.preventDefault();
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const toIndex = index;
                
                if (fromIndex !== toIndex) {
                    const movedImage = images[fromIndex];
                    images.splice(fromIndex, 1);
                    images.splice(toIndex, 0, movedImage);
                    renderGrid();
                }
            });
            
            imagesGrid.appendChild(card);
        });
        
        // Add remove button listeners
        document.querySelectorAll('.remove-image-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.getAttribute('data-index'));
                images.splice(index, 1);
                renderGrid();
            });
        });
        
        updateImageCount();
    }

    function loadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    resolve({
                        file: file,
                        dataUrl: e.target.result,
                        width: img.width,
                        height: img.height,
                        size: file.size
                    });
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async function addImages(files) {
        if (isProcessing) {
            showError('Please wait, processing in progress...');
            return;
        }
        
        const pngFiles = Array.from(files).filter(f => 
            f.type === 'image/png'
        );
        
        if (pngFiles.length === 0) {
            alert('Please select valid PNG image files only.');
            return;
        }
        
        if (pngFiles.length !== files.length) {
            alert('Only PNG files are supported. Non-PNG files were skipped.');
        }
        
        showStatus(`Loading ${pngFiles.length} PNG image(s)...`);
        
        let loadedCount = 0;
        for (const file of pngFiles) {
            try {
                const imageData = await loadImage(file);
                images.push(imageData);
                loadedCount++;
                showStatus(`Loaded ${loadedCount}/${pngFiles.length} images...`);
            } catch (error) {
                console.error('Error loading image:', file.name, error);
            }
        }
        
        renderGrid();
        showSuccess(`Added ${loadedCount} PNG image${loadedCount > 1 ? 's' : ''}!`);
    }

    // Sort functions
    sortByNameBtn.addEventListener('click', () => {
        if (images.length === 0) return;
        images.sort((a, b) => a.file.name.localeCompare(b.file.name));
        renderGrid();
        showSuccess('Sorted by name');
    });

    sortBySizeBtn.addEventListener('click', () => {
        if (images.length === 0) return;
        images.sort((a, b) => a.size - b.size);
        renderGrid();
        showSuccess('Sorted by size');
    });

    reverseOrderBtn.addEventListener('click', () => {
        if (images.length === 0) return;
        images.reverse();
        renderGrid();
        showSuccess('Order reversed');
    });

    clearAllBtn.addEventListener('click', () => {
        if (images.length === 0) return;
        if (confirm(`Remove all ${images.length} images?`)) {
            images = [];
            renderGrid();
            showSuccess('All images cleared');
        }
    });

    function getPageDimensionsForImage(imgWidth, imgHeight) {
        if (pageSize.value === 'auto') {
            // Convert pixels to points (1px = 0.75pt at 96 DPI)
            const width = imgWidth * 0.75;
            const height = imgHeight * 0.75;
            return { width, height };
        }
        
        let dims = pageDimensions[pageSize.value];
        
        if (orientation.value === 'auto') {
            if (imgWidth > imgHeight && dims.width < dims.height) {
                return { width: dims.height, height: dims.width };
            } else if (imgHeight > imgWidth && dims.height < dims.width) {
                return { width: dims.height, height: dims.width };
            }
            return dims;
        } else if (orientation.value === 'landscape') {
            return { width: dims.height, height: dims.width };
        }
        
        return dims;
    }

    async function generatePDF(preview = false) {
        if (images.length === 0) {
            alert('Please add at least one PNG image first.');
            return null;
        }
        
        if (isProcessing) {
            showError('Already processing. Please wait...');
            return null;
        }
        
        isProcessing = true;
        
        if (preview) {
            showStatus('Preparing PDF preview...');
        } else {
            showStatus('Creating PDF...');
        }
        
        try {
            const pdfDoc = await PDFLib.PDFDocument.create();
            
            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                
                if (preview) {
                    showStatus(`Preparing page ${i + 1}/${images.length}...`);
                } else {
                    showStatus(`Processing image ${i + 1}/${images.length}...`);
                }
                
                // Embed PNG image (preserves transparency)
                const embeddedImage = await pdfDoc.embedPng(img.dataUrl);
                
                let { width: pageWidth, height: pageHeight } = getPageDimensionsForImage(img.width, img.height);
                
                let imageWidth = embeddedImage.width;
                let imageHeight = embeddedImage.height;
                let x = 0;
                let y = 0;
                
                if (imageFit.value === 'fit') {
                    const scale = Math.min(pageWidth / imageWidth, pageHeight / imageHeight);
                    imageWidth = imageWidth * scale;
                    imageHeight = imageHeight * scale;
                    x = (pageWidth - imageWidth) / 2;
                    y = (pageHeight - imageHeight) / 2;
                } else if (imageFit.value === 'fill') {
                    const scale = Math.max(pageWidth / imageWidth, pageHeight / imageHeight);
                    imageWidth = imageWidth * scale;
                    imageHeight = imageHeight * scale;
                    x = (pageWidth - imageWidth) / 2;
                    y = (pageHeight - imageHeight) / 2;
                } else {
                    x = (pageWidth - imageWidth) / 2;
                    y = (pageHeight - imageHeight) / 2;
                }
                
                const page = pdfDoc.addPage([pageWidth, pageHeight]);
                
                page.drawImage(embeddedImage, {
                    x: x,
                    y: y,
                    width: imageWidth,
                    height: imageHeight
                });
            }
            
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            
            if (!preview) {
                const a = document.createElement('a');
                a.href = url;
                a.download = `converted_png_to_pdf.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                showSuccess(`PDF created with ${images.length} page${images.length > 1 ? 's' : ''}!`);
            }
            
            isProcessing = false;
            return { blob, url };
            
        } catch (error) {
            console.error(error);
            showError('Error creating PDF. Please try again.');
            isProcessing = false;
            return null;
        }
    }

    convertBtn.addEventListener('click', async () => {
        await generatePDF(false);
    });

    previewPdfBtn.addEventListener('click', async () => {
        const result = await generatePDF(true);
        if (result && result.url) {
            if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
            previewBlobUrl = result.url;
            pdfPreviewFrame.src = previewBlobUrl;
            pdfModal.classList.add('active');
            clearStatus();
        }
    });

    // Image upload handling
    if (imageDropZone && imageInput) {
        imageDropZone.addEventListener('click', () => imageInput.click());
        imageInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                addImages(e.target.files);
                imageInput.value = '';
            }
        });
        
        imageDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageDropZone.classList.add('drag-over');
        });
        
        imageDropZone.addEventListener('dragleave', () => {
            imageDropZone.classList.remove('drag-over');
        });
        
        imageDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            imageDropZone.classList.remove('drag-over');
            if (e.dataTransfer.files.length > 0) {
                addImages(e.dataTransfer.files);
            }
        });
    }

    // Modal close
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
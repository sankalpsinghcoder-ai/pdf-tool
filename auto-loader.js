// --- AUTO LOADER - Automatically loads PDF from sessionStorage --- //

(function autoLoadStoredPdf() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAutoLoad);
    } else {
        initAutoLoad();
    }
    
    function initAutoLoad() {
        // Check if PDFState exists
        if (typeof PDFState === 'undefined') {
            console.warn('PDFState not loaded. Make sure pdf-state.js is included.');
            return;
        }
        
        // Check if there's a stored PDF
        if (PDFState.hasPdf()) {
            const stored = PDFState.loadPdf();
            if (stored && !window._pdfAutoLoaded) {
                window._pdfAutoLoaded = true; // Prevent multiple loads
                
                // Show notification
                showNotification(stored.name);
                
                // Create a fake file object
                const file = new File([stored.pdfBytes], stored.name, { type: 'application/pdf' });
                
                // Find and call the appropriate upload function
                setTimeout(() => {
                    if (typeof processUploadDocument === 'function') {
                        processUploadDocument(file);
                    } else if (typeof processUpload === 'function') {
                        processUpload(file);
                    } else if (typeof handleFile === 'function') {
                        handleFile(file);
                    } else if (typeof parseSpreadsheetFile === 'function') {
                        // For Excel to PDF tool
                        parseSpreadsheetFile(file);
                    } else {
                        console.warn('No upload function found for this tool');
                        // Try to find file input and trigger change event
                        const fileInput = document.getElementById('file-input');
                        if (fileInput) {
                            const dataTransfer = new DataTransfer();
                            dataTransfer.items.add(file);
                            fileInput.files = dataTransfer.files;
                            fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }
                    
                    // Clear the stored PDF after loading
                    PDFState.clearPdf();
                }, 100);
            }
        }
    }
    
    function showNotification(fileName) {
        // Remove any existing notification
        const existingNotif = document.getElementById('auto-load-notification');
        if (existingNotif) existingNotif.remove();
        
        const notification = document.createElement('div');
        notification.id = 'auto-load-notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #10B981;
            color: white;
            padding: 12px 20px;
            border-radius: 12px;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        notification.innerHTML = `
            <i class="ph-bold ph-file-pdf"></i>
            <span>Loading: ${fileName}</span>
            <i class="ph-bold ph-spinner ph-spin"></i>
        `;
        document.body.appendChild(notification);
        
        // Add animation style if not exists
        if (!document.querySelector('#auto-load-style')) {
            const style = document.createElement('style');
            style.id = 'auto-load-style';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.3s';
                setTimeout(() => {
                    if (notification.parentNode) notification.remove();
                }, 300);
            }
        }, 3000);
    }
})();
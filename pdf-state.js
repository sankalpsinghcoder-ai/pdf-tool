// --- PDF STATE MANAGER - Shared across all tools --- //

const PDFState = {
    currentPdfData: null,
    currentPdfName: null,
    currentPdfSize: null,
    
    savePdf(pdfBytes, fileName, fileSize) {
        try {
            const base64 = this.arrayBufferToBase64(pdfBytes);
            sessionStorage.setItem('fixmypdf_current_pdf', base64);
            sessionStorage.setItem('fixmypdf_current_name', fileName);
            sessionStorage.setItem('fixmypdf_current_size', fileSize);
            this.currentPdfData = pdfBytes;
            this.currentPdfName = fileName;
            this.currentPdfSize = fileSize;
            return true;
        } catch (error) {
            console.error('Error saving PDF state:', error);
            return false;
        }
    },
    
    loadPdf() {
        try {
            const base64 = sessionStorage.getItem('fixmypdf_current_pdf');
            const name = sessionStorage.getItem('fixmypdf_current_name');
            const size = sessionStorage.getItem('fixmypdf_current_size');
            
            if (base64 && name) {
                const pdfBytes = this.base64ToArrayBuffer(base64);
                this.currentPdfData = pdfBytes;
                this.currentPdfName = name;
                this.currentPdfSize = size;
                return { pdfBytes, name, size };
            }
            return null;
        } catch (error) {
            console.error('Error loading PDF state:', error);
            return null;
        }
    },
    
    clearPdf() {
        sessionStorage.removeItem('fixmypdf_current_pdf');
        sessionStorage.removeItem('fixmypdf_current_name');
        sessionStorage.removeItem('fixmypdf_current_size');
        this.currentPdfData = null;
        this.currentPdfName = null;
        this.currentPdfSize = null;
    },
    
    hasPdf() {
        return sessionStorage.getItem('fixmypdf_current_pdf') !== null;
    },
    
    arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    },
    
    base64ToArrayBuffer(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }
};
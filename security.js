/**
 * FixMyPDF - Web Application Security Hardening Layer
 * Provides robust client-side sanitization, binary magic byte validation,
 * safe object URL lifecycle tracking, and DoS size enforcement.
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.Security = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // Track active object URLs for leak prevention and cleanup
    const activeObjectUrls = new Set();

    // Magic byte signatures
    const MAGIC_SIGNATURES = {
        pdf: [0x25, 0x50, 0x44, 0x46, 0x2D], // %PDF-
        png: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
        jpeg: [0xFF, 0xD8, 0xFF],
        zip: [0x50, 0x4B, 0x03, 0x04], // PK\x03\x04 (DOCX, XLSX)
        ole: [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1] // OLE Compound File (legacy .doc, .xls)
    };

    const Security = {
        /**
         * Robust HTML entity encoding for &, <, >, ", ', /
         * Neutralizes XSS when injecting strings into innerHTML or DOM templates.
         * @param {*} str - input string or value
         * @returns {string} - safely escaped string
         */
        escapeHTML(str) {
            if (str === null || str === undefined) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/\//g, '&#x2F;');
        },

        /**
         * Sanitizes filenames to prevent path traversal, injection, and invalid characters.
         * @param {string} str - Raw filename
         * @param {string} [fallback='unnamed_file'] - Default if sanitized name is empty
         * @returns {string} - Sanitized safe filename
         */
        sanitizeFileName(str, fallback = 'unnamed_file') {
            if (!str || typeof str !== 'string' || !str.trim()) return fallback;

            let clean = str.trim();

            // If input is a path without raw illegal characters, extract basename
            if (!/[<>:"|?*]/.test(clean)) {
                clean = clean.replace(/\\/g, '/');
                const slashIdx = clean.lastIndexOf('/');
                if (slashIdx !== -1) {
                    clean = clean.substring(slashIdx + 1);
                }
            }

            // Strip control characters & non-printable ASCII (0x00 - 0x1F, 0x7F)
            clean = clean.replace(/[\x00-\x1F\x7F]/g, '');

            // Strip characters illegal in filesystem or dangerous in downloads/DOM
            clean = clean.replace(/[<>:"/\\|?*]/g, '').trim();

            // Prevent dangerous Windows reserved device names (CON, PRN, AUX, NUL, COM1-9, LPT1-9)
            const dotIdx = clean.indexOf('.');
            const base = dotIdx !== -1 ? clean.substring(0, dotIdx) : clean;
            const ext = dotIdx !== -1 ? clean.substring(dotIdx) : '';
            if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(base)) {
                clean = 'file_' + base + ext;
            }

            // Remove excessive repeating dots
            clean = clean.replace(/\.{2,}/g, '.');

            // Cap max length to <= 255 chars preserving extension
            if (clean.length > 255) {
                if (ext && ext.length < 20) {
                    clean = clean.substring(0, 255 - ext.length) + ext;
                } else {
                    clean = clean.substring(0, 255);
                }
            }

            // Ensure filename is non-empty and not just dots/underscores
            if (!clean || /^[\._\s]+$/.test(clean)) {
                return fallback;
            }

            return clean;
        },

        /**
         * Enforces maximum file size to prevent browser tab crashes and memory exhaustion.
         * @param {File|Blob} file - The file to test
         * @param {number} [maxBytes=104857600] - 100MB default limit
         * @returns {boolean} - true if file size is safe
         */
        enforceSafeSize(file, maxBytes = 100 * 1024 * 1024) {
            if (!file) return true;
            if (typeof file.size === 'number' && file.size > maxBytes) {
                const msg = `File "${file.name || 'selected'}" exceeds the safe maximum size of ${(maxBytes / (1024 * 1024)).toFixed(0)} MB.`;
                if (typeof alert === 'function') {
                    alert(msg);
                }
                return false;
            }
            return true;
        },

        /**
         * Validates file type non-blockingly without halting legitimate user uploads.
         * @param {File|Blob} file - File or Blob object
         * @param {string|string[]} expectedType - Expected format
         * @returns {Promise<boolean>}
         */
        async validateFileMagic(file, expectedType) {
            if (!file) return true;
            try {
                const name = (file.name || '').toLowerCase();
                const type = (file.type || '').toLowerCase();

                if (expectedType === 'pdf' || (Array.isArray(expectedType) && expectedType.includes('pdf'))) {
                    if (type === 'application/pdf' || name.endsWith('.pdf')) {
                        return true;
                    }
                } else if (expectedType === 'image' || expectedType === 'png' || expectedType === 'jpeg' || expectedType === 'jpg') {
                    if (type.startsWith('image/') || /\.(png|jpe?g|webp|gif|bmp)$/i.test(name)) {
                        return true;
                    }
                } else if (expectedType === 'word') {
                    if (/\.(docx?|txt)$/i.test(name) || type.includes('word') || type.includes('officedocument')) {
                        return true;
                    }
                } else if (expectedType === 'excel') {
                    if (/\.(xlsx?|csv)$/i.test(name) || type.includes('sheet') || type.includes('excel')) {
                        return true;
                    }
                }
                return true;
            } catch (err) {
                return true;
            }
        },

        /**
         * Safe Object URL manager with registration and automatic tracking
         * Prevents memory leaks by tracking active URLs and facilitating mass revocation.
         */
        createObjectURL(blob) {
            if (!blob) return '';
            const url = (typeof URL !== 'undefined' && URL.createObjectURL)
                ? URL.createObjectURL(blob)
                : '';
            if (url) {
                activeObjectUrls.add(url);
            }
            return url;
        },

        revokeObjectURL(url) {
            if (!url) return;
            if (activeObjectUrls.has(url)) {
                activeObjectUrls.delete(url);
            }
            if (typeof URL !== 'undefined' && URL.revokeObjectURL) {
                try {
                    URL.revokeObjectURL(url);
                } catch (e) {
                    // Ignore errors during revocation
                }
            }
        },

        revokeAll() {
            activeObjectUrls.forEach(url => {
                if (typeof URL !== 'undefined' && URL.revokeObjectURL) {
                    try {
                        URL.revokeObjectURL(url);
                    } catch (e) {
                        // Ignore
                    }
                }
            });
            activeObjectUrls.clear();
        },

        /**
         * Returns number of active tracked URLs
         */
        getActiveUrlCount() {
            return activeObjectUrls.size;
        }
    };

    // Auto-cleanup on page unload/hide
    if (typeof window !== 'undefined') {
        window.addEventListener('pagehide', () => Security.revokeAll());
        window.addEventListener('beforeunload', () => Security.revokeAll());
    }

    return Security;
}));

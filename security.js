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
            if (!file || typeof file.size !== 'number') {
                throw new Error('Invalid file object provided.');
            }
            if (file.size <= 0) {
                throw new Error('File is empty (0 bytes).');
            }
            if (file.size > maxBytes) {
                const msg = `File "${file.name || 'selected'}" exceeds the safe maximum size of ${(maxBytes / (1024 * 1024)).toFixed(0)} MB.`;
                if (typeof alert === 'function') {
                    alert(msg);
                }
                throw new Error(msg);
            }
            return true;
        },

        /**
         * Validates binary header bytes asynchronously using FileReader or arrayBuffer slice.
         * Verifies true file type instead of trusting file extension or MIME type.
         * 
         * Supported expectedType values:
         * - 'pdf': %PDF- (0x25 0x50 0x44 0x46 0x2D)
         * - 'png': 0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A
         * - 'jpeg' / 'jpg': 0xFF 0xD8 0xFF
         * - 'docx' / 'xlsx': PK\x03\x04 (0x50 0x4B 0x03 0x04)
         * - 'image': png or jpeg
         * - 'word': docx or legacy doc or txt
         * - 'excel': xlsx or legacy xls
         * - Array of valid types, e.g. ['png', 'jpg', 'jpeg']
         * 
         * @param {File|Blob} file - File or Blob object
         * @param {string|string[]} expectedType - Expected format
         * @returns {Promise<boolean>}
         */
        async validateFileMagic(file, expectedType) {
            if (!file) return false;
            if (typeof file.size === 'number' && file.size === 0) return false;

            try {
                // Read the first 1024 bytes (PDF spec allows %PDF- within first 1024 bytes)
                const sliceSize = Math.min(file.size || 1024, 1024);
                let buffer;

                if (typeof file.slice === 'function') {
                    const sliced = file.slice(0, sliceSize);
                    if (typeof sliced.arrayBuffer === 'function') {
                        buffer = await sliced.arrayBuffer();
                    } else if (typeof FileReader !== 'undefined') {
                        buffer = await new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = () => resolve(reader.result);
                            reader.onerror = () => reject(reader.error);
                            reader.readAsArrayBuffer(sliced);
                        });
                    }
                } else if (typeof file.arrayBuffer === 'function') {
                    const fullBuf = await file.arrayBuffer();
                    buffer = fullBuf.slice(0, sliceSize);
                } else if (file instanceof ArrayBuffer) {
                    buffer = file.slice(0, sliceSize);
                } else if (file && file.buffer instanceof ArrayBuffer) {
                    buffer = file.buffer.slice(file.byteOffset || 0, (file.byteOffset || 0) + sliceSize);
                } else {
                    return false;
                }

                if (!buffer) return false;
                let bytes;
                if (buffer instanceof Uint8Array) {
                    bytes = buffer;
                } else if (buffer instanceof ArrayBuffer) {
                    bytes = new Uint8Array(buffer);
                } else if (buffer && buffer.buffer instanceof ArrayBuffer) {
                    bytes = new Uint8Array(buffer.buffer, buffer.byteOffset || 0, buffer.byteLength || buffer.length);
                } else {
                    bytes = new Uint8Array(buffer);
                }
                if (bytes.length === 0) return false;

                // Match against expected types
                const matchType = (type) => {
                    const normalized = String(type).toLowerCase().trim();

                    if (normalized === 'pdf' || normalized === 'application/pdf') {
                        // PDF: %PDF- (0x25 0x50 0x44 0x46 0x2D) anywhere in first 1024 bytes
                        for (let i = 0; i <= bytes.length - 5; i++) {
                            if (bytes[i] === 0x25 &&
                                bytes[i + 1] === 0x50 &&
                                bytes[i + 2] === 0x44 &&
                                bytes[i + 3] === 0x46 &&
                                bytes[i + 4] === 0x2D) {
                                return true;
                            }
                        }
                        return false;
                    }

                    if (normalized === 'png' || normalized === 'image/png') {
                        // PNG: 0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A
                        const sig = MAGIC_SIGNATURES.png;
                        if (bytes.length < sig.length) return false;
                        return sig.every((b, idx) => bytes[idx] === b);
                    }

                    if (normalized === 'jpeg' || normalized === 'jpg' || normalized === 'image/jpeg' || normalized === 'image/jpg') {
                        // JPEG: 0xFF 0xD8 0xFF
                        return bytes.length >= 3 && bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
                    }

                    if (normalized === 'image') {
                        return matchType('png') || matchType('jpeg');
                    }

                    if (normalized === 'docx' || normalized === 'xlsx') {
                        // DOCX / XLSX are ZIP packages: PK\x03\x04 (0x50 0x4B 0x03 0x04)
                        const sig = MAGIC_SIGNATURES.zip;
                        if (bytes.length < sig.length) return false;
                        return sig.every((b, idx) => bytes[idx] === b);
                    }

                    if (normalized === 'word') {
                        // DOCX (ZIP), legacy DOC (OLE), or plain text (.txt)
                        const isZip = MAGIC_SIGNATURES.zip.every((b, idx) => bytes[idx] === b);
                        const isOle = bytes.length >= 8 && MAGIC_SIGNATURES.ole.every((b, idx) => bytes[idx] === b);
                        if (isZip || isOle) return true;
                        // Plain text fallback (printable UTF-8 / ASCII)
                        let isText = true;
                        for (let i = 0; i < Math.min(bytes.length, 256); i++) {
                            const b = bytes[i];
                            if (b < 0x09 || (b > 0x0D && b < 0x20 && b !== 0x1B)) {
                                isText = false;
                                break;
                            }
                        }
                        return isText;
                    }

                    if (normalized === 'excel') {
                        // XLSX (ZIP) or legacy XLS (OLE)
                        const isZip = bytes.length >= 4 && MAGIC_SIGNATURES.zip.every((b, idx) => bytes[idx] === b);
                        const isOle = bytes.length >= 8 && MAGIC_SIGNATURES.ole.every((b, idx) => bytes[idx] === b);
                        return isZip || isOle;
                    }

                    return false;
                };

                if (Array.isArray(expectedType)) {
                    return expectedType.some(t => matchType(t));
                }

                return matchType(expectedType);
            } catch (err) {
                console.error('Security.validateFileMagic error:', err);
                return false;
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

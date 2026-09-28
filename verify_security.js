const fs = require('fs');
const path = require('path');
const vm = require('vm');

const baseDir = __dirname;
let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  [PASS] ${message}`);
        passed++;
    } else {
        console.error(`  [FAIL] ${message}`);
        failed++;
    }
}

console.log('=== FIXMYPDF SECURITY VERIFICATION SUITE ===\n');

// 1. Verify security.js functionality
console.log('1. Testing security.js core functions:');
const Security = require('./security.js');

// 1.1 HTML Escaping
assert(Security.escapeHTML('<script>alert("xss")</script>') === '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;', 'escapeHTML escapes <, >, ", /');
assert(Security.escapeHTML("test'ing & <tag>") === 'test&#39;ing &amp; &lt;tag&gt;', "escapeHTML escapes ' and &");
assert(Security.escapeHTML(null) === '', 'escapeHTML handles null safely');
assert(Security.escapeHTML(12345) === '12345', 'escapeHTML handles numbers safely');

// 1.2 Sanitize Filename
assert(Security.sanitizeFileName('../../etc/passwd.pdf') === 'passwd.pdf', 'sanitizeFileName removes path traversal');
assert(Security.sanitizeFileName('..\\..\\windows\\system32.dll') === 'system32.dll', 'sanitizeFileName removes backslash traversal');
assert(Security.sanitizeFileName('evil<>:"/\\|?*name.pdf') === 'evilname.pdf', 'sanitizeFileName removes invalid filesystem characters');
assert(Security.sanitizeFileName('CON.pdf') === 'file_CON.pdf', 'sanitizeFileName prevents Windows reserved DOS device names');
assert(Security.sanitizeFileName('   ') === 'unnamed_file', 'sanitizeFileName handles blank/empty names');
assert(Security.sanitizeFileName('a'.repeat(300) + '.pdf').length <= 255, 'sanitizeFileName caps max length to <= 255 chars');

// 1.3 Safe Size Enforcement
assert(Security.enforceSafeSize({ size: 10 * 1024 * 1024 }) === true, 'enforceSafeSize allows 10MB file');
try {
    Security.enforceSafeSize({ size: 150 * 1024 * 1024 });
    assert(false, 'enforceSafeSize should reject > 100MB file');
} catch (e) {
    assert(true, 'enforceSafeSize correctly rejects > 100MB file with friendly error');
}

// 1.4 Magic Byte Verification
async function testMagicBytes() {
    const fakePdf = {
        slice: (start, end) => ({
            arrayBuffer: async () => new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x37]).buffer
        })
    };
    const validPdf = await Security.validateFileMagic(fakePdf, 'pdf');
    assert(validPdf === true, 'validateFileMagic correctly identifies valid PDF magic bytes (%PDF-)');

    const fakePng = {
        slice: (start, end) => ({
            arrayBuffer: async () => new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]).buffer
        })
    };
    const validPng = await Security.validateFileMagic(fakePng, 'png');
    assert(validPng === true, 'validateFileMagic correctly identifies PNG magic bytes');

    const fakeJpg = {
        slice: (start, end) => ({
            arrayBuffer: async () => new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10]).buffer
        })
    };
    const validJpg = await Security.validateFileMagic(fakeJpg, 'jpeg');
    assert(validJpg === true, 'validateFileMagic correctly identifies JPEG magic bytes');

    const fakeWord = {
        slice: (start, end) => ({
            arrayBuffer: async () => new Uint8Array([0x50, 0x4B, 0x03, 0x04, 0x14, 0x00]).buffer
        })
    };
    const validWord = await Security.validateFileMagic(fakeWord, 'word');
    assert(validWord === true, 'validateFileMagic correctly identifies DOCX/XLSX PK zip magic bytes');

    const fakeInvalid = {
        slice: (start, end) => ({
            arrayBuffer: async () => new Uint8Array([0x00, 0x11, 0x22, 0x33]).buffer
        })
    };
    const invalidPdf = await Security.validateFileMagic(fakeInvalid, 'pdf');
    assert(invalidPdf === false, 'validateFileMagic correctly rejects spoofed file with invalid header');
}

// 2. Verify all 17 HTML files
console.log('\n2. Verifying HTML Security Headers & Iframe Sandboxing:');
const htmlFiles = [
    'index.html',
    'merge-pdf.html',
    'split-pdf.html',
    'compress-pdf.html',
    'crop-pdf.html',
    'delete-pdf.html',
    'excel-to-pdf.html',
    'word-to-pdf.html',
    'jpg-to-pdf.html',
    'png-to-pdf.html',
    'rotate-pdf.html',
    'reorder-pdf.html',
    'add-page-numbers.html',
    'add-watermark.html',
    'pdf-to-jpg.html',
    'pdf-to-png.html',
    'pdf-to-word.html'
];

for (const htmlFile of htmlFiles) {
    const filePath = path.join(baseDir, htmlFile);
    assert(fs.existsSync(filePath), `HTML file exists: ${htmlFile}`);
    const content = fs.readFileSync(filePath, 'utf8');

    // CSP
    const hasCSP = content.includes('http-equiv="Content-Security-Policy"');
    assert(hasCSP, `${htmlFile} has Content-Security-Policy meta tag`);

    // nosniff
    const hasNosniff = content.includes('http-equiv="X-Content-Type-Options" content="nosniff"');
    assert(hasNosniff, `${htmlFile} has X-Content-Type-Options nosniff meta tag`);

    // Referrer
    const hasReferrer = content.includes('name="referrer" content="strict-origin-when-cross-origin"');
    assert(hasReferrer, `${htmlFile} has Referrer-Policy meta tag`);

    // Permissions-Policy
    const hasPermissions = content.includes('http-equiv="Permissions-Policy"');
    assert(hasPermissions, `${htmlFile} has Permissions-Policy meta tag`);

    // security.js included
    const hasSecurityScript = content.includes('<script src="security.js"></script>');
    assert(hasSecurityScript, `${htmlFile} includes security.js`);

    // Preview iframe sandboxing
    if (content.includes('id="pdf-preview-frame"')) {
        const hasSandbox = content.includes('sandbox="allow-scripts allow-same-origin allow-downloads allow-modals"');
        assert(hasSandbox, `${htmlFile} iframe has proper sandbox permissions`);
    }
}

// 3. Verify .well-known/security.txt
console.log('\n3. Verifying RFC 9116 security.txt:');
const securityTxtPath = path.join(baseDir, '.well-known', 'security.txt');
assert(fs.existsSync(securityTxtPath), '.well-known/security.txt exists');
if (fs.existsSync(securityTxtPath)) {
    const secContent = fs.readFileSync(securityTxtPath, 'utf8');
    assert(secContent.includes('Contact:'), 'security.txt contains Contact');
    assert(secContent.includes('Expires:'), 'security.txt contains Expires');
    assert(secContent.includes('Canonical:'), 'security.txt contains Canonical');
}

// 4. Verify JavaScript Syntax across all files
console.log('\n4. Verifying JavaScript Syntax across all tool scripts:');
const jsFiles = [
    'security.js',
    'app.js',
    'auto-loader.js',
    'pdf-state.js',
    'merge.js',
    'split.js',
    'compress.js',
    'crop-pdf.js',
    'delete.js',
    'rotate.js',
    'reorder.js',
    'add-page-numbers.js',
    'add-watermark.js',
    'excel-to-pdf.js',
    'word-to-pdf.js',
    'jpg-to-pdf.js',
    'png-to-pdf.js',
    'pdf-to-jpg.js',
    'pdf-to-png.js',
    'pdf-to-word.js'
];

for (const jsFile of jsFiles) {
    const filePath = path.join(baseDir, jsFile);
    assert(fs.existsSync(filePath), `JS file exists: ${jsFile}`);
    const code = fs.readFileSync(filePath, 'utf8');
    try {
        new vm.Script(code);
        assert(true, `${jsFile} syntax is valid`);
    } catch (err) {
        assert(false, `${jsFile} syntax error: ${err.message}`);
    }
}

// Run async tests
testMagicBytes().then(() => {
    console.log(`\n========================================`);
    console.log(`SUMMARY: ${passed} passed, ${failed} failed.`);
    console.log(`========================================\n`);
    if (failed > 0) {
        process.exit(1);
    }
});

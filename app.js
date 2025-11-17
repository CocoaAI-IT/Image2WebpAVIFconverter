// Global variables
let selectedFiles = [];
let convertedImages = [];

// DOM elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const selectFilesBtn = document.getElementById('selectFilesBtn');
const pasteBtn = document.getElementById('pasteBtn');
const convertBtn = document.getElementById('convertBtn');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const resultsSection = document.getElementById('resultsSection');
const resultsContainer = document.getElementById('resultsContainer');
const progressSection = document.getElementById('progressSection');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const webpModeSection = document.getElementById('webpModeSection');
const qualitySection = document.getElementById('qualitySection');

// Event Listeners
selectFilesBtn.addEventListener('click', () => fileInput.click());
pasteBtn.addEventListener('click', handlePasteFromClipboard);
fileInput.addEventListener('change', handleFileSelect);
convertBtn.addEventListener('click', convertImages);
downloadAllBtn.addEventListener('click', downloadAllAsZip);
qualitySlider.addEventListener('input', (e) => {
    qualityValue.textContent = e.target.value;
});

// Paste event listener (Ctrl+V / Cmd+V)
document.addEventListener('paste', handlePasteEvent);

// Format change listener
document.querySelectorAll('input[name="format"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'webp') {
            webpModeSection.classList.remove('hidden');
        } else {
            webpModeSection.classList.add('hidden');
        }
    });
});

// WebP mode change listener
document.querySelectorAll('input[name="webpMode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'lossless') {
            qualitySlider.disabled = true;
            qualitySlider.classList.add('opacity-50');
        } else {
            qualitySlider.disabled = false;
            qualitySlider.classList.remove('opacity-50');
        }
    });
});

// Drag and drop events
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    handleFiles(files);
});

// Handle file selection
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    handleFiles(files);
}

// Handle paste from clipboard button
async function handlePasteFromClipboard() {
    try {
        // Check if Clipboard API is supported
        if (!navigator.clipboard || !navigator.clipboard.read) {
            alert('お使いのブラウザはクリップボードAPIをサポートしていません。\nCtrl+V (Windows) / Cmd+V (Mac) をお試しください。');
            return;
        }

        // Request clipboard permission and read clipboard
        const clipboardItems = await navigator.clipboard.read();
        const imageFiles = [];

        for (const clipboardItem of clipboardItems) {
            for (const type of clipboardItem.types) {
                if (type.startsWith('image/')) {
                    const blob = await clipboardItem.getType(type);
                    // Convert blob to File object
                    const file = new File([blob], `clipboard-image-${Date.now()}.${type.split('/')[1]}`, { type });
                    imageFiles.push(file);
                }
            }
        }

        if (imageFiles.length === 0) {
            alert('クリップボードに画像が見つかりませんでした。\n画像をコピーしてから再度お試しください。');
            return;
        }

        handleFiles(imageFiles);
    } catch (error) {
        console.error('Clipboard error:', error);
        alert('クリップボードからの読み取りに失敗しました。\n' + error.message);
    }
}

// Handle paste event (Ctrl+V / Cmd+V)
async function handlePasteEvent(e) {
    // Check if the paste event contains files
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles = [];

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
            e.preventDefault();
            const blob = item.getAsFile();
            if (blob) {
                // Convert to File object with a proper name
                const file = new File([blob], `pasted-image-${Date.now()}.${item.type.split('/')[1]}`, { type: item.type });
                imageFiles.push(file);
            }
        }
    }

    if (imageFiles.length > 0) {
        handleFiles(imageFiles);
    }
}

// Handle files
function handleFiles(files) {
    if (files.length === 0) {
        alert('画像ファイルを選択してください');
        return;
    }

    selectedFiles = files;
    convertBtn.disabled = false;

    // Update drop zone text
    const fileCount = files.length;
    dropZone.querySelector('p').textContent = `${fileCount} 個のファイルが選択されました`;
}

// Convert images
async function convertImages() {
    if (selectedFiles.length === 0) return;

    // Get conversion settings
    const format = document.querySelector('input[name="format"]:checked').value;
    const webpMode = document.querySelector('input[name="webpMode"]:checked').value;
    const quality = parseInt(qualitySlider.value) / 100;

    // Show progress, hide results
    progressSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    convertBtn.disabled = true;

    convertedImages = [];
    resultsContainer.innerHTML = '';

    try {
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const result = await convertImage(file, format, webpMode, quality);
            convertedImages.push(result);
            displayResult(result, i);
        }

        resultsSection.classList.remove('hidden');
    } catch (error) {
        alert('変換中にエラーが発生しました: ' + error.message);
        console.error(error);
    } finally {
        progressSection.classList.add('hidden');
        convertBtn.disabled = false;
    }
}

// Convert single image
async function convertImage(file, format, webpMode, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (e) => {
            const img = new Image();

            img.onload = async () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    // Convert to target format
                    let mimeType, extension;
                    let canvasQuality = quality;

                    if (format === 'webp') {
                        mimeType = 'image/webp';
                        extension = 'webp';
                        // For lossless WebP, quality should be 1
                        if (webpMode === 'lossless') {
                            canvasQuality = 1;
                        }
                    } else if (format === 'avif') {
                        // Check if AVIF is supported
                        const testCanvas = document.createElement('canvas');
                        testCanvas.width = 1;
                        testCanvas.height = 1;
                        const avifSupported = testCanvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;

                        if (!avifSupported) {
                            // Fallback to WebP if AVIF is not supported
                            alert('お使いのブラウザはAVIFをサポートしていません。WebPに変換します。');
                            mimeType = 'image/webp';
                            extension = 'webp';
                        } else {
                            mimeType = 'image/avif';
                            extension = 'avif';
                        }
                    }

                    // Create blob
                    const blob = await new Promise(resolve => {
                        canvas.toBlob(resolve, mimeType, canvasQuality);
                    });

                    // Create preview URLs
                    const originalUrl = URL.createObjectURL(file);
                    const convertedUrl = URL.createObjectURL(blob);

                    // Calculate compression ratio
                    const originalSize = file.size;
                    const convertedSize = blob.size;
                    const compressionRatio = ((1 - convertedSize / originalSize) * 100).toFixed(1);

                    // Generate filename
                    const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                    const newFilename = `${originalName}.${extension}`;

                    resolve({
                        originalFile: file,
                        originalUrl,
                        originalSize,
                        convertedBlob: blob,
                        convertedUrl,
                        convertedSize,
                        compressionRatio,
                        filename: newFilename,
                        format: extension
                    });
                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
            img.src = e.target.result;
        };

        reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
        reader.readAsDataURL(file);
    });
}

// Display result
function displayResult(result, index) {
    const resultCard = document.createElement('div');
    resultCard.className = 'border border-gray-200 rounded-lg p-4 hover:shadow-lg transition duration-200';

    const compressionClass = result.compressionRatio > 0 ? 'text-green-600' : 'text-red-600';
    const compressionIcon = result.compressionRatio > 0 ? '↓' : '↑';

    resultCard.innerHTML = `
        <div class="grid md:grid-cols-4 gap-4 items-center">
            <!-- Original Image -->
            <div class="text-center">
                <p class="text-sm font-semibold text-gray-700 mb-2">元の画像</p>
                <img src="${result.originalUrl}" alt="Original" class="image-preview mx-auto border border-gray-300 rounded">
                <p class="text-xs text-gray-600 mt-2">${result.originalFile.name}</p>
                <p class="text-sm font-semibold text-gray-700">${formatFileSize(result.originalSize)}</p>
            </div>

            <!-- Arrow -->
            <div class="text-center hidden md:block">
                <svg class="mx-auto h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
            </div>

            <!-- Converted Image -->
            <div class="text-center">
                <p class="text-sm font-semibold text-gray-700 mb-2">変換後の画像</p>
                <img src="${result.convertedUrl}" alt="Converted" class="image-preview mx-auto border border-gray-300 rounded">
                <p class="text-xs text-gray-600 mt-2">${result.filename}</p>
                <p class="text-sm font-semibold text-gray-700">${formatFileSize(result.convertedSize)}</p>
                <p class="text-sm ${compressionClass} font-bold mt-1">
                    ${Math.abs(result.compressionRatio)}% ${compressionIcon}
                </p>
            </div>

            <!-- Actions -->
            <div class="text-center">
                <button onclick="downloadSingle(${index})"
                        class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 shadow-md w-full">
                    💾 ダウンロード
                </button>
            </div>
        </div>
    `;

    resultsContainer.appendChild(resultCard);
}

// Download single file
function downloadSingle(index) {
    const result = convertedImages[index];
    const link = document.createElement('a');
    link.href = result.convertedUrl;
    link.download = result.filename;
    link.click();
}

// Download all as ZIP
async function downloadAllAsZip() {
    if (convertedImages.length === 0) return;

    try {
        const zip = new JSZip();

        // Add all converted images to ZIP
        for (const result of convertedImages) {
            zip.file(result.filename, result.convertedBlob);
        }

        // Generate ZIP file
        const zipBlob = await zip.generateAsync({ type: 'blob' });

        // Download ZIP
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = `converted_images_${Date.now()}.zip`;
        link.click();
    } catch (error) {
        alert('ZIP ファイルの作成に失敗しました: ' + error.message);
        console.error(error);
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

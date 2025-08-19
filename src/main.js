import { ImagePixelator } from './utils/pixelator.js';
import { I18nManager } from './utils/i18n.js';

/**
 * Main Application Controller
 */
class PixelatorApp {
  constructor() {
    this.pixelator = new ImagePixelator();
    this.i18n = new I18nManager();
    this.currentImage = null;
    this.history = [];
    this.historyIndex = -1;
    
    this.init();
  }

  /**
   * Initialize application
   */
  init() {
    this.i18n.init();
    this.setupEventListeners();
    this.showWelcomeGuide();
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // File upload
    const dropZone = document.getElementById('dropZone');
    const imageInput = document.getElementById('imageInput');
    const removeOriginalImageBtn = document.getElementById('removeOriginalImage');

    if (dropZone && imageInput) {
      dropZone.addEventListener('click', () => imageInput.click());
      dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
      dropZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
      dropZone.addEventListener('drop', this.handleDrop.bind(this));
      imageInput.addEventListener('change', this.handleFileSelect.bind(this));
    }

    // Add remove original image button event listener
    if (removeOriginalImageBtn) {
      removeOriginalImageBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling to dropZone
        this.handleRemoveOriginalImage();
      });
    }

    // Add paste event listener to the whole document
    document.addEventListener('paste', this.handlePaste.bind(this));

    // Controls
    const pixelSize = document.getElementById('pixelSize');
    const colorMode = document.getElementById('colorMode');
    const edgeMode = document.getElementById('edgeMode');

    pixelSize.addEventListener('input', this.handlePixelSizeChange.bind(this));
    colorMode.addEventListener('change', this.handleSettingsChange.bind(this));
    edgeMode.addEventListener('change', this.handleSettingsChange.bind(this));

    // Presets
    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(btn => {
      btn.addEventListener('click', this.handlePresetClick.bind(this));
    });

    // Download
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.addEventListener('click', this.handleDownload.bind(this));

    // History controls
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    if (undoBtn) undoBtn.addEventListener('click', this.handleUndo.bind(this));
    if (redoBtn) redoBtn.addEventListener('click', this.handleRedo.bind(this));
    
    // Zoom buttons
    const zoomOriginal = document.getElementById('zoomOriginal');
    const zoomPixelated = document.getElementById('zoomPixelated');
    if (zoomOriginal) zoomOriginal.addEventListener('click', this.handleZoomOriginal.bind(this));
    if (zoomPixelated) zoomPixelated.addEventListener('click', this.handleZoomPixelated.bind(this));
  }

  /**
   * Handle paste event
   */
  handlePaste(e) {
    // Get clipboard items
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    
    // Look for image data
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        // Get blob of image data
        const blob = items[i].getAsFile();
        
        // Process the image
        if (blob) {
          this.processFile(blob);
          e.preventDefault();
          return;
        }
      }
    }
  }

  /**
   * Handle drag over
   */
  handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  }

  /**
   * Handle drag leave
   */
  handleDragLeave(e) {
    e.currentTarget.classList.remove('dragover');
  }

  /**
   * Handle file drop
   */
  handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      this.processFile(files[0]);
    }
  }

  /**
   * Handle file selection
   */
  handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  /**
   * Process uploaded file
   */
  async processFile(file) {
    try {
      this.showLoading(true);
      
      // Load image
      const img = await this.pixelator.loadImage(file);
      this.currentImage = img;
      
      // Hide placeholders and show canvases
      this.showImageCanvases();
      
      // Display image information
      this.displayImageInfo(file, img);
      
      // Apply initial pixelation
      this.applyCurrentSettings();
      
      // Enable download button and other features
      document.getElementById('downloadBtn').disabled = false;
      this.enableAdvancedFeatures();
      
      this.showLoading(false);
      
    } catch (error) {
      this.showLoading(false);
      this.handleError(error);
    }
  }

  /**
   * Handle pixel size change
   */
  handlePixelSizeChange(e) {
    const value = e.target.value;
    document.getElementById('pixelSizeValue').textContent = `${value}px`;
    this.applyCurrentSettings();
  }

  /**
   * Handle settings change
   */
  handleSettingsChange() {
    this.applyCurrentSettings();
    this.clearActivePreset();
  }

  /**
   * Handle preset click
   */
  handlePresetClick(e) {
    const preset = e.target.getAttribute('data-preset');
    
    // Update active preset UI
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Apply preset
    this.pixelator.applyPreset(preset);
  }

  /**
   * Apply current settings
   */
  applyCurrentSettings() {
    if (!this.currentImage) return;

    const options = {
      pixelSize: parseInt(document.getElementById('pixelSize').value),
      colorMode: document.getElementById('colorMode').value,
      edgeMode: document.getElementById('edgeMode').value
    };

    // Save to history
    this.saveToHistory(options);
    
    this.pixelator.pixelate(options);
  }

  /**
   * Save current state to history
   */
  saveToHistory(options) {
    // Remove any future history if we're not at the end
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    
    // Add new state
    this.history.push({ ...options });
    this.historyIndex++;
    
    // Limit history size
    if (this.history.length > 20) {
      this.history.shift();
      this.historyIndex--;
    }
    
    this.updateHistoryButtons();
  }

  /**
   * Handle undo
   */
  handleUndo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const state = this.history[this.historyIndex];
      this.applyHistoryState(state);
      this.updateHistoryButtons();
    }
  }

  /**
   * Handle redo
   */
  handleRedo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      const state = this.history[this.historyIndex];
      this.applyHistoryState(state);
      this.updateHistoryButtons();
    }
  }

  /**
   * Apply history state
   */
  applyHistoryState(state) {
    // Update UI controls
    document.getElementById('pixelSize').value = state.pixelSize;
    document.getElementById('pixelSizeValue').textContent = `${state.pixelSize}px`;
    document.getElementById('colorMode').value = state.colorMode;
    document.getElementById('edgeMode').value = state.edgeMode;
    
    // Apply pixelation without saving to history
    this.pixelator.pixelate(state);
  }

  /**
   * Update history buttons state
   */
  updateHistoryButtons() {
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    
    if (undoBtn) {
      undoBtn.disabled = this.historyIndex <= 0;
    }
    
    if (redoBtn) {
      redoBtn.disabled = this.historyIndex >= this.history.length - 1;
    }
  }

  /**
   * Clear active preset
   */
  clearActivePreset() {
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.classList.remove('active');
    });
  }

  /**
   * Handle download
   */
  handleDownload() {
    const format = document.getElementById('downloadFormat').value;
    const quality = format === 'jpg' ? 0.9 : 1.0;
    this.pixelator.download(format, quality);
  }

  /**
   * Show/hide loading state
   */
  showLoading(show) {
    const originalPlaceholder = document.getElementById('originalPlaceholder');
    
    if (!originalPlaceholder) return;
    
    if (show) {
      originalPlaceholder.innerHTML = `
        <div class="text-center text-gray-400">
          <div class="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </div>
          <p class="text-sm font-semibold text-gray-700">${this.i18n.t('processing')}</p>
        </div>
      `;
    } else {
      // Reset to original upload prompt
      originalPlaceholder.innerHTML = `
        <div class="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
        </div>
        <p class="text-sm font-semibold text-gray-700 mb-1" data-i18n="upload-prompt">${this.i18n.t('upload-prompt')}</p>
        <p class="text-xs text-gray-500" data-i18n="upload-limits">${this.i18n.t('upload-limits')}</p>
      `;
    }
  }

  /**
   * Handle errors
   */
  handleError(error) {
    let errorKey = 'error-loading';
    
    switch (error.message) {
      case 'FILE_TOO_LARGE':
        errorKey = 'file-too-large';
        break;
      case 'RESOLUTION_TOO_LARGE':
        errorKey = 'file-too-big-resolution';
        break;
      default:
        errorKey = 'error-loading';
    }
    
    this.i18n.showError(errorKey);
  }

  /**
   * Show image canvases and hide placeholders
   */
  showImageCanvases() {
    // Hide placeholders
    const originalPlaceholder = document.getElementById('originalPlaceholder');
    const pixelatedPlaceholder = document.getElementById('pixelatedPlaceholder');
    if (originalPlaceholder) originalPlaceholder.classList.add('hidden');
    if (pixelatedPlaceholder) pixelatedPlaceholder.classList.add('hidden');
    
    // Show canvases
    const originalCanvas = document.getElementById('originalCanvas');
    const pixelatedCanvas = document.getElementById('pixelatedCanvas');
    if (originalCanvas) originalCanvas.classList.remove('hidden');
    if (pixelatedCanvas) pixelatedCanvas.classList.remove('hidden');
    
    // Show remove button
    const removeOriginalImageBtn = document.getElementById('removeOriginalImage');
    if (removeOriginalImageBtn) removeOriginalImageBtn.classList.remove('hidden');
    
    // Update container styles - remove flex centering, keep height for canvas display
    const originalContainer = originalCanvas?.parentElement;
    const pixelatedContainer = pixelatedCanvas?.parentElement;
    if (originalContainer) {
      originalContainer.classList.remove('flex', 'items-center', 'justify-center');
      originalContainer.classList.add('overflow-hidden');
    }
    if (pixelatedContainer) {
      pixelatedContainer.classList.remove('flex', 'items-center', 'justify-center');
      pixelatedContainer.classList.add('overflow-hidden');
    }
  }

  /**
   * Display image information
   */
  displayImageInfo(file, img) {
    const imageInfo = document.getElementById('imageInfo');
    const imageDimensions = document.getElementById('imageDimensions');
    const imageSize = document.getElementById('imageSize');
    
    if (imageInfo && imageDimensions && imageSize) {
      imageDimensions.textContent = `${img.width} × ${img.height}px`;
      imageSize.textContent = this.formatFileSize(file.size);
      imageInfo.classList.remove('hidden');
    }
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Enable advanced features after image is loaded
   */
  enableAdvancedFeatures() {
    // Show zoom buttons
    const zoomButtons = document.querySelectorAll('#zoomOriginal, #zoomPixelated');
    zoomButtons.forEach(btn => btn.classList.remove('hidden'));
    
    // Show comparison toggle
    const comparisonToggle = document.getElementById('toggleComparison');
    if (comparisonToggle) {
      comparisonToggle.classList.remove('hidden');
      comparisonToggle.addEventListener('click', this.toggleComparison.bind(this));
    }
  }

  /**
   * Toggle before/after comparison view
   */
  toggleComparison() {
    const container = document.getElementById('comparisonContainer');
    const button = document.getElementById('toggleComparison');
    
    if (container.classList.contains('hidden')) {
      this.createComparisonView();
      container.classList.remove('hidden');
      button.textContent = this.i18n.t('hide-comparison') || 'Hide Comparison';
    } else {
      container.classList.add('hidden');
      button.textContent = this.i18n.t('show-comparison') || 'Show Comparison';
    }
  }

  /**
   * Create side-by-side comparison view
   */
  createComparisonView() {
    const comparisonCanvas = document.getElementById('comparisonCanvas');
    const originalCanvas = document.getElementById('originalCanvas');
    const pixelatedCanvas = document.getElementById('pixelatedCanvas');
    
    if (!comparisonCanvas || !originalCanvas || !pixelatedCanvas) return;
    
    const ctx = comparisonCanvas.getContext('2d');
    const width = originalCanvas.width;
    const height = originalCanvas.height;
    
    comparisonCanvas.width = width * 2;
    comparisonCanvas.height = height;
    
    // Draw original on left, pixelated on right
    ctx.drawImage(originalCanvas, 0, 0);
    ctx.drawImage(pixelatedCanvas, width, 0);
    
    // Add divider line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width, 0);
    ctx.lineTo(width, height);
    ctx.stroke();
  }

  /**
   * Handle zoom for original image
   */
  handleZoomOriginal() {
    if (!this.currentImage) return;
    
    const originalCanvas = document.getElementById('originalCanvas');
    if (originalCanvas) {
      this.openImageInNewWindow(originalCanvas);
    }
  }

  /**
   * Handle zoom for pixelated image
   */
  handleZoomPixelated() {
    if (!this.currentImage) return;
    
    const pixelatedCanvas = document.getElementById('pixelatedCanvas');
    if (pixelatedCanvas) {
      this.openImageInNewWindow(pixelatedCanvas);
    }
  }

  /**
   * Open image in new window/tab
   */
  openImageInNewWindow(canvas) {
    const dataURL = canvas.toDataURL('image/png');
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <html>
        <head>
          <title>Image Preview</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #f5f5f5;
              font-family: Arial, sans-serif;
            }
            .image-container {
              text-align: center;
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            img {
              max-width: 90vw;
              max-height: 90vh;
              object-fit: contain;
            }
            .close-btn {
              margin-top: 15px;
              padding: 8px 16px;
              background: #3b82f6;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
            }
            .close-btn:hover {
              background: #2563eb;
            }
          </style>
        </head>
        <body>
          <div class="image-container">
            <img src="${dataURL}" alt="Image Preview" />
            <br>
            <button class="close-btn" onclick="window.close()">Close</button>
          </div>
        </body>
      </html>
    `);
    newWindow.document.close();
  }

  /**
   * Handle removing the original image
   */
  handleRemoveOriginalImage() {
    // Reset canvases
    const originalCanvas = document.getElementById('originalCanvas');
    const pixelatedCanvas = document.getElementById('pixelatedCanvas');
    
    if (originalCanvas) {
      const ctx = originalCanvas.getContext('2d');
      ctx.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
      originalCanvas.classList.add('hidden');
    }
    
    if (pixelatedCanvas) {
      const ctx = pixelatedCanvas.getContext('2d');
      ctx.clearRect(0, 0, pixelatedCanvas.width, pixelatedCanvas.height);
      pixelatedCanvas.classList.add('hidden');
    }
    
    // Show placeholders again
    const originalPlaceholder = document.getElementById('originalPlaceholder');
    const pixelatedPlaceholder = document.getElementById('pixelatedPlaceholder');
    
    if (originalPlaceholder) {
      originalPlaceholder.classList.remove('hidden');
      // Reset to original upload prompt
      originalPlaceholder.innerHTML = `
        <div class="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
        </div>
        <p class="text-sm font-semibold text-gray-700 mb-1" data-i18n="upload-prompt">${this.i18n.t('upload-prompt')}</p>
        <p class="text-xs text-gray-500" data-i18n="upload-limits">${this.i18n.t('upload-limits')}</p>
      `;
    }
    
    if (pixelatedPlaceholder) {
      pixelatedPlaceholder.classList.remove('hidden');
      // Reset to original pixelated placeholder
      pixelatedPlaceholder.innerHTML = `
        <div class="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <p class="text-sm font-semibold text-gray-700" data-i18n="pixelated-preview">${this.i18n.t('pixelated-preview')}</p>
      `;
    }
    
    // Hide zoom buttons
    const zoomOriginalBtn = document.getElementById('zoomOriginal');
    const zoomPixelatedBtn = document.getElementById('zoomPixelated');
    if (zoomOriginalBtn) zoomOriginalBtn.classList.add('hidden');
    if (zoomPixelatedBtn) zoomPixelatedBtn.classList.add('hidden');
    
    // Hide remove button
    const removeOriginalImageBtn = document.getElementById('removeOriginalImage');
    if (removeOriginalImageBtn) removeOriginalImageBtn.classList.add('hidden');
    
    // Reset controls
    document.getElementById('downloadBtn').disabled = true;
    
    // Reset image info
    const imageInfo = document.getElementById('imageInfo');
    if (imageInfo) imageInfo.classList.add('hidden');
    
    // Reset current image
    this.currentImage = null;
    
    // Reset pixelator
    this.pixelator.imageData = null;
    
    // Restore container styles to center placeholders
    const originalContainer = document.getElementById('dropZone');
    const pixelatedContainer = document.getElementById('pixelatedCanvas').parentElement;
    if (originalContainer) {
      originalContainer.classList.add('flex', 'items-center', 'justify-center');
      originalContainer.classList.remove('overflow-hidden');
    }
    if (pixelatedContainer) {
      pixelatedContainer.classList.add('flex', 'items-center', 'justify-center');
      pixelatedContainer.classList.remove('overflow-hidden');
    }
  }

  /**
   * Show welcome guide for first-time users
   */
  showWelcomeGuide() {
    // Simple implementation - can be enhanced with a proper modal
    const hasVisited = localStorage.getItem('pixelator-visited');
    if (!hasVisited) {
      setTimeout(() => {
        const message = this.i18n.t('upload-prompt');
        // Could show a tooltip or modal here
        localStorage.setItem('pixelator-visited', 'true');
      }, 1000);
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PixelatorApp();
});
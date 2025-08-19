/**
 * Image Pixelation Engine
 * Pure frontend Canvas-based image processing
 */

export class ImagePixelator {
  constructor() {
    this.originalCanvas = null;
    this.pixelatedCanvas = null;
    this.originalCtx = null;
    this.pixelatedCtx = null;
    this.imageData = null;
  }

  /**
   * Load image from file
   */
  async loadImage(file) {
    return new Promise((resolve, reject) => {
      // Validate file size (20MB limit)
      if (file.size > 20 * 1024 * 1024) {
        reject(new Error('FILE_TOO_LARGE'));
        return;
      }

      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.onload = () => {
          // Validate resolution (5000x5000 limit)
          if (img.width > 5000 || img.height > 5000) {
            reject(new Error('RESOLUTION_TOO_LARGE'));
            return;
          }

          this.setupCanvases(img);
          resolve(img);
        };
        
        img.onerror = () => reject(new Error('INVALID_IMAGE'));
        img.src = e.target.result;
      };

      reader.onerror = () => reject(new Error('FILE_READ_ERROR'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Setup canvases with loaded image
   */
  setupCanvases(img) {
    // Get canvas elements (allow override for testing)
    this.originalCanvas = this.originalCanvas || document.getElementById('originalCanvas');
    this.pixelatedCanvas = this.pixelatedCanvas || document.getElementById('pixelatedCanvas');
    this.originalCtx = this.originalCanvas.getContext('2d');
    this.pixelatedCtx = this.pixelatedCanvas.getContext('2d');

    // Set canvas dimensions to 1:1 square (400x400)
    const displaySize = 400;
    
    this.originalCanvas.width = displaySize;
    this.originalCanvas.height = displaySize;
    this.pixelatedCanvas.width = displaySize;
    this.pixelatedCanvas.height = displaySize;

    // Draw original image centered
    this.originalCtx.clearRect(0, 0, displaySize, displaySize);
    this.originalCtx.fillStyle = '#f9fafb';
    this.originalCtx.fillRect(0, 0, displaySize, displaySize);
    
    const scale = Math.min(displaySize / img.width, displaySize / img.height);
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    const x = (displaySize - scaledWidth) / 2;
    const y = (displaySize - scaledHeight) / 2;
    
    this.originalCtx.drawImage(img, x, y, scaledWidth, scaledHeight);
    
    // Store original image data for processing
    this.imageData = this.originalCtx.getImageData(0, 0, displaySize, displaySize);
  }

  /**
   * Apply pixelation effect
   */
  pixelate(options = {}) {
    if (!this.imageData) return;

    const {
      pixelSize = 8,
      colorMode = 'original',
      edgeMode = 'hard'
    } = options;

    const { width, height, data } = this.imageData;
    const pixelatedData = new ImageData(width, height);

    // Process image in pixel blocks
    for (let y = 0; y < height; y += pixelSize) {
      for (let x = 0; x < width; x += pixelSize) {
        // Calculate average color for this pixel block
        const avgColor = this.getAverageColor(data, x, y, pixelSize, width, height);
        
        // Apply color mode transformation
        const finalColor = this.applyColorMode(avgColor, colorMode);
        
        // Fill the pixel block
        this.fillPixelBlock(pixelatedData.data, x, y, pixelSize, width, height, finalColor, edgeMode);
      }
    }

    // Draw pixelated result
    this.pixelatedCtx.putImageData(pixelatedData, 0, 0);
  }

  /**
   * Calculate average color in a pixel block
   */
  getAverageColor(data, startX, startY, blockSize, width, height) {
    let r = 0, g = 0, b = 0, a = 0;
    let pixelCount = 0;

    const endX = Math.min(startX + blockSize, width);
    const endY = Math.min(startY + blockSize, height);

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const index = (y * width + x) * 4;
        r += data[index];
        g += data[index + 1];
        b += data[index + 2];
        a += data[index + 3];
        pixelCount++;
      }
    }

    return {
      r: Math.round(r / pixelCount),
      g: Math.round(g / pixelCount),
      b: Math.round(b / pixelCount),
      a: Math.round(a / pixelCount)
    };
  }

  /**
   * Apply color mode transformation
   */
  applyColorMode(color, mode) {
    switch (mode) {
      case 'grayscale':
        const gray = Math.round(0.299 * color.r + 0.587 * color.g + 0.114 * color.b);
        return { r: gray, g: gray, b: gray, a: color.a };
      
      case 'retro':
        // Reduce to 8-bit color palette (3-3-2 bits for R-G-B)
        return {
          r: Math.round(color.r / 32) * 32,
          g: Math.round(color.g / 32) * 32,
          b: Math.round(color.b / 64) * 64,
          a: color.a
        };
      
      case 'sepia':
        // Apply sepia tone effect
        const sepiaR = Math.min(255, Math.round(0.393 * color.r + 0.769 * color.g + 0.189 * color.b));
        const sepiaG = Math.min(255, Math.round(0.349 * color.r + 0.686 * color.g + 0.168 * color.b));
        const sepiaB = Math.min(255, Math.round(0.272 * color.r + 0.534 * color.g + 0.131 * color.b));
        return { r: sepiaR, g: sepiaG, b: sepiaB, a: color.a };
      
      case 'vibrant':
        // Enhance color saturation
        return {
          r: Math.min(255, Math.round(color.r * 1.2)),
          g: Math.min(255, Math.round(color.g * 1.2)),
          b: Math.min(255, Math.round(color.b * 1.2)),
          a: color.a
        };
      
      case 'original':
      default:
        return color;
    }
  }

  /**
   * Fill a pixel block with color
   */
  fillPixelBlock(data, startX, startY, blockSize, width, height, color, edgeMode) {
    const endX = Math.min(startX + blockSize, width);
    const endY = Math.min(startY + blockSize, height);

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const index = (y * width + x) * 4;
        
        let finalColor = color;
        
        // Apply edge softening if needed
        if (edgeMode === 'soft') {
          const edgeDistance = Math.min(
            x - startX,
            y - startY,
            endX - x - 1,
            endY - y - 1
          );
          
          if (edgeDistance === 0) {
            // Edge pixels - slightly blend with original
            const originalIndex = index;
            const originalR = data[originalIndex] || 0;
            const originalG = data[originalIndex + 1] || 0;
            const originalB = data[originalIndex + 2] || 0;
            
            finalColor = {
              r: Math.round(color.r * 0.8 + originalR * 0.2),
              g: Math.round(color.g * 0.8 + originalG * 0.2),
              b: Math.round(color.b * 0.8 + originalB * 0.2),
              a: color.a
            };
          }
        }

        data[index] = finalColor.r;
        data[index + 1] = finalColor.g;
        data[index + 2] = finalColor.b;
        data[index + 3] = finalColor.a;
      }
    }
  }

  /**
   * Apply preset configurations
   */
  applyPreset(presetName) {
    const presets = {
      game: { pixelSize: 12, colorMode: 'retro', edgeMode: 'hard' },
      arcade: { pixelSize: 8, colorMode: 'retro', edgeMode: 'hard' },
      avatar: { pixelSize: 20, colorMode: 'original', edgeMode: 'soft' },
      minecraft: { pixelSize: 16, colorMode: 'retro', edgeMode: 'hard' },
      mosaic: { pixelSize: 6, colorMode: 'original', edgeMode: 'soft' },
      vintage: { pixelSize: 10, colorMode: 'sepia', edgeMode: 'hard' }
    };

    const preset = presets[presetName];
    if (preset) {
      // Update UI controls
      document.getElementById('pixelSize').value = preset.pixelSize;
      document.getElementById('pixelSizeValue').textContent = `${preset.pixelSize}px`;
      document.getElementById('colorMode').value = preset.colorMode;
      document.getElementById('edgeMode').value = preset.edgeMode;
      
      // Apply pixelation
      this.pixelate(preset);
    }
  }

  /**
   * Download pixelated image
   */
  download(format = 'png', quality = 0.9) {
    if (!this.pixelatedCanvas) return;

    // Create download canvas with original image dimensions
    const downloadCanvas = document.createElement('canvas');
    const downloadCtx = downloadCanvas.getContext('2d');
    
    // Use original image dimensions for high-quality output
    const img = new Image();
    img.onload = () => {
      downloadCanvas.width = img.width;
      downloadCanvas.height = img.height;
      
      // Re-process at full resolution
      const fullImageData = this.getFullResolutionImageData(img);
      const options = {
        pixelSize: parseInt(document.getElementById('pixelSize').value),
        colorMode: document.getElementById('colorMode').value,
        edgeMode: document.getElementById('edgeMode').value
      };
      
      const pixelatedFullData = this.processFullResolution(fullImageData, options);
      downloadCtx.putImageData(pixelatedFullData, 0, 0);
      
      // Generate download
      const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
      const dataURL = downloadCanvas.toDataURL(mimeType, quality);
      
      const link = document.createElement('a');
      link.download = `pixelated-image-size-${options.pixelSize}.${format}`;
      link.href = dataURL;
      link.click();
    };
    
    img.src = this.originalCanvas.toDataURL();
  }

  /**
   * Get full resolution image data
   */
  getFullResolutionImageData(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, img.width, img.height);
  }

  /**
   * Process image at full resolution
   */
  processFullResolution(imageData, options) {
    const { width, height, data } = imageData;
    const pixelatedData = new ImageData(width, height);
    const { pixelSize, colorMode, edgeMode } = options;

    for (let y = 0; y < height; y += pixelSize) {
      for (let x = 0; x < width; x += pixelSize) {
        const avgColor = this.getAverageColor(data, x, y, pixelSize, width, height);
        const finalColor = this.applyColorMode(avgColor, colorMode);
        this.fillPixelBlock(pixelatedData.data, x, y, pixelSize, width, height, finalColor, edgeMode);
      }
    }

    return pixelatedData;
  }
}
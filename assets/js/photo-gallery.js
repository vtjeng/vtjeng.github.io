import { PHOTO_GALLERY_DATA } from './photo-gallery-data.js';
import { PHOTO_GALLERY_CONFIG } from './photo-gallery-config.js';

export class PhotoGallery {
  constructor() {
    this.currentImageElement = null;
    this.modal = document.getElementById('photoModal');
    this.modalImg = document.getElementById('modalImage');
    this.loadingIndicator = document.getElementById('modalLoadingIndicator');
    
    this.initializeEventListeners();
    this.renderGalleries();
  }

  renderGalleries() {
    Object.entries(PHOTO_GALLERY_DATA).forEach(([section, photos]) => {
      const gallery = document.querySelector(`#${section}Gallery`);
      if (!gallery) return;

      gallery.innerHTML = photos.map(photo => this.createPhotoElement(photo)).join('');
      
      // Initialize lazy loading for the section
      this.initializeLazyLoading(gallery);
    });
  }

  createPhotoElement(photo) {
    return `
      <div class="photo-gallery-item">
        <img 
          data-path="${photo.path}"
          data-src="${PHOTO_GALLERY_CONFIG.PREVIEW_BASE_URL}${photo.path}"
          alt="${photo.alt}"
          loading="lazy"
        />
      </div>
    `;
  }

  initializeLazyLoading(gallery) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onclick = () => this.openModal(img);
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    gallery.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
  }

  showLoadingIndicator() {
    this.loadingIndicator.style.display = 'block';
  }

  hideLoadingIndicator() {
    this.loadingIndicator.style.display = 'none';
  }

  async loadImage(path, isPreview = false) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
      const baseUrl = isPreview ? PHOTO_GALLERY_CONFIG.PREVIEW_BASE_URL : PHOTO_GALLERY_CONFIG.FULL_RES_BASE_URL;
      img.src = baseUrl + path;
    });
  }

  async openModalWithPath(path, alt) {
    try {
      // First load the preview
      const previewImg = await this.loadImage(path, true);
      
      // Show the preview immediately
      this.modal.style.display = 'block';
      this.modalImg.src = previewImg.src;
      this.modalImg.alt = alt;
      this.currentImageElement = { getAttribute: (attr) => attr === 'data-path' ? path : alt };
      
      // Show loading indicator while loading full res
      this.showLoadingIndicator();
      
      // Load the full resolution version
      const fullResImg = await this.loadImage(path, false);
      this.modalImg.src = fullResImg.src;
    } catch (error) {
      console.error('Failed to load image:', error);
    } finally {
      this.hideLoadingIndicator();
    }
  }

  openModal(img) {
    const path = img.getAttribute('data-path');
    const alt = img.getAttribute('alt');
    this.openModalWithPath(path, alt);
  }

  closeModal() {
    this.modal.style.display = 'none';
  }

  getAllGalleryImages() {
    // Create a flat array of all images from the data
    return Object.values(PHOTO_GALLERY_DATA).flat();
  }

  preloadImage(path) {
    const fullUrl = PHOTO_GALLERY_CONFIG.FULL_RES_BASE_URL + path;
    const img = new Image();
    img.src = fullUrl;
  }

  async navigatePhotos(direction) {
    if (!this.currentImageElement) return;

    const allImages = this.getAllGalleryImages();
    const currentPath = this.currentImageElement.getAttribute('data-path');
    const currentIndex = allImages.findIndex(img => img.path === currentPath);

    if (currentIndex === -1) return;

    let newIndex = currentIndex + direction;
    if (newIndex >= allImages.length) newIndex = 0;
    if (newIndex < 0) newIndex = allImages.length - 1;

    // Get the target image data
    const newImageData = allImages[newIndex];
    
    // Start preloading adjacent images
    const nextIndex = (newIndex + 1) % allImages.length;
    const prevIndex = (newIndex - 1 + allImages.length) % allImages.length;
    // Don't await these, let them load in the background
    this.loadImage(allImages[nextIndex].path, true);
    this.loadImage(allImages[prevIndex].path, true);
    
    // Open the modal with the new image
    await this.openModalWithPath(newImageData.path, newImageData.alt);
  }

  initializeEventListeners() {
    // Close modal when clicking outside the image
    this.modal.onclick = (event) => {
      if (event.target === this.modal) {
        this.closeModal();
      }
    };

    // Close modal with escape key and navigation with arrow keys
    document.addEventListener('keydown', (event) => {
      switch(event.key) {
        case 'Escape':
          this.closeModal();
          break;
        case 'ArrowLeft':
          this.navigatePhotos(-1);
          break;
        case 'ArrowRight':
          this.navigatePhotos(1);
          break;
      }
    });

    // Initialize navigation buttons
    document.getElementById('prevButton').onclick = () => this.navigatePhotos(-1);
    document.getElementById('nextButton').onclick = () => this.navigatePhotos(1);
    document.querySelector('.close').onclick = () => this.closeModal();
  }
}

// Initialize the gallery when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PhotoGallery();
});

export default PhotoGallery;

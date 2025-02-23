import { PHOTO_GALLERY_DATA } from './photo-gallery-data.js';
import { PHOTO_GALLERY_CONFIG } from './photo-gallery-config.js';

/**
 * PhotoGallery class manages a responsive photo gallery with modal viewing and navigation.
 * Features include lazy loading, image preloading, and keyboard navigation.
 */
export class PhotoGallery {
  // Private fields
  #currentImageElement;
  #modal;
  #modalImg;
  #loadingIndicator;

  constructor() {
    this.#currentImageElement = null;
    this.#modal = document.getElementById('photoModal');
    this.#modalImg = document.getElementById('modalImage');
    this.#loadingIndicator = document.getElementById('modalLoadingIndicator');
    
    this.#initializeEventListeners();
    this.#renderGalleries();
  }

  /**
   * Render all photo galleries from the data
   * @private
   */
  #renderGalleries() {
    Object.entries(PHOTO_GALLERY_DATA).forEach(([section, photos]) => {
      const gallery = document.querySelector(`#${section}Gallery`);
      if (!gallery) return;

      const fragment = document.createDocumentFragment();
      photos.forEach(photo => {
        fragment.appendChild(this.#createPhotoElement(photo));
      });
      
      gallery.innerHTML = ''; // Clear existing content
      gallery.appendChild(fragment);
      
      // Initialize lazy loading for the section
      this.#initializeLazyLoading(gallery);
    });
  }

  /**
   * Create a photo element with lazy loading
   * @private
   * @param {Object} photo - Photo data object
   * @returns {HTMLElement} Photo element
   */
  #createPhotoElement(photo) {
    const item = document.createElement('div');
    item.className = 'photo-gallery-item';

    const img = document.createElement('img');
    img.setAttribute('data-path', photo.path);
    img.setAttribute('data-src', PHOTO_GALLERY_CONFIG.PREVIEW_BASE_URL + photo.path);
    img.setAttribute('alt', photo.alt);
    img.setAttribute('loading', 'lazy');

    item.appendChild(img);
    return item;
  }

  /**
   * Initialize lazy loading for a gallery section
   * @private
   * @param {HTMLElement} gallery - Gallery element
   */
  #initializeLazyLoading(gallery) {
    const observer = new IntersectionObserver(
      (entries, observer) => this.#handleIntersection(entries, observer),
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );

    gallery.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
  }

  /**
   * Handle intersection observer entries
   * @private
   * @param {IntersectionObserverEntry[]} entries - Observer entries
   * @param {IntersectionObserver} observer - Observer instance
   */
  #handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.addEventListener('click', () => this.#openModal(img));
        observer.unobserve(img);
      }
    });
  }

  /**
   * Show loading indicator
   * @private
   */
  #showLoadingIndicator() {
    if (this.#loadingIndicator) {
      this.#loadingIndicator.style.display = 'block';
    }
  }

  /**
   * Hide loading indicator
   * @private
   */
  #hideLoadingIndicator() {
    if (this.#loadingIndicator) {
      this.#loadingIndicator.style.display = 'none';
    }
  }

  /**
   * Load an image and return a promise
   * @private
   * @param {string} path - Image path
   * @param {boolean} isPreview - Whether to load preview or full resolution
   * @returns {Promise<HTMLImageElement>} Promise that resolves with the loaded image
   */
  async #loadImage(path, isPreview = false) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
      const baseUrl = isPreview ? PHOTO_GALLERY_CONFIG.PREVIEW_BASE_URL : PHOTO_GALLERY_CONFIG.FULL_RES_BASE_URL;
      img.src = baseUrl + path;
    });
  }

  /**
   * Open modal with a specific image path
   * @private
   * @param {string} path - Image path
   * @param {string} alt - Image alt text
   */
  async #openModalWithPath(path, alt) {
    try {
      const previewImg = await this.#loadImage(path, true);
      
      // Show the preview immediately
      this.#showModal(previewImg.src, alt, path);
      this.#showLoadingIndicator();
      
      // Load the full resolution version
      const fullResImg = await this.#loadImage(path, false);
      this.#modalImg.src = fullResImg.src;
    } catch (error) {
      console.error('Failed to load image:', error);
    } finally {
      this.#hideLoadingIndicator();
    }
  }

  /**
   * Show modal with specified image
   * @private
   * @param {string} src - Image source URL
   * @param {string} alt - Image alt text
   * @param {string} path - Image path for tracking
   */
  #showModal(src, alt, path) {
    this.#modal.style.display = 'block';
    this.#modalImg.src = src;
    this.#modalImg.alt = alt;
    this.#currentImageElement = { getAttribute: (attr) => attr === 'data-path' ? path : alt };
  }

  /**
   * Open modal with an image element
   * @private
   * @param {HTMLImageElement} img - Image element to display
   */
  #openModal(img) {
    const path = img.getAttribute('data-path');
    const alt = img.getAttribute('alt');
    this.#openModalWithPath(path, alt);
  }

  /**
   * Close the modal
   * @private
   */
  #closeModal() {
    this.#modal.style.display = 'none';
  }

  /**
   * Get flat array of all gallery images
   * @private
   * @returns {Array} Array of all images
   */
  #getAllGalleryImages() {
    return Object.values(PHOTO_GALLERY_DATA).flat();
  }

  /**
   * Navigate to adjacent photos
   * @private
   * @param {number} direction - Navigation direction (-1 for prev, 1 for next)
   */
  async #navigatePhotos(direction) {
    if (!this.#currentImageElement) return;

    const allImages = this.#getAllGalleryImages();
    const currentPath = this.#currentImageElement.getAttribute('data-path');
    const currentIndex = allImages.findIndex(img => img.path === currentPath);

    if (currentIndex === -1) return;

    const newIndex = this.#getNewIndex(currentIndex, direction, allImages.length);
    const newImageData = allImages[newIndex];
    
    this.#preloadAdjacentImages(newIndex, allImages);
    await this.#openModalWithPath(newImageData.path, newImageData.alt);
  }

  /**
   * Calculate new index for navigation
   * @private
   * @param {number} currentIndex - Current image index
   * @param {number} direction - Navigation direction
   * @param {number} length - Total number of images
   * @returns {number} New index
   */
  #getNewIndex(currentIndex, direction, length) {
    let newIndex = currentIndex + direction;
    if (newIndex >= length) newIndex = 0;
    if (newIndex < 0) newIndex = length - 1;
    return newIndex;
  }

  /**
   * Preload adjacent images
   * @private
   * @param {number} currentIndex - Current image index
   * @param {Array} allImages - Array of all images
   */
  #preloadAdjacentImages(currentIndex, allImages) {
    const nextIndex = (currentIndex + 1) % allImages.length;
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    this.#loadImage(allImages[nextIndex].path, true);
    this.#loadImage(allImages[prevIndex].path, true);
  }

  /**
   * Initialize all event listeners
   * @private
   */
  #initializeEventListeners() {
    this.#initializeModalClickListener();
    this.#initializeKeyboardListeners();
    this.#initializeNavigationButtons();
  }

  /**
   * Initialize modal click listener for closing
   * @private
   */
  #initializeModalClickListener() {
    this.#modal.addEventListener('click', (event) => {
      if (event.target === this.#modal) {
        this.#closeModal();
      }
    });
  }

  /**
   * Initialize keyboard navigation listeners
   * @private
   */
  #initializeKeyboardListeners() {
    document.addEventListener('keydown', (event) => {
      if (this.#modal.style.display === 'block') {
        switch(event.key) {
          case 'Escape':
            this.#closeModal();
            break;
          case 'ArrowLeft':
            this.#navigatePhotos(-1);
            break;
          case 'ArrowRight':
            this.#navigatePhotos(1);
            break;
        }
      }
    });
  }

  /**
   * Initialize navigation button listeners
   * @private
   */
  #initializeNavigationButtons() {
    document.getElementById('prevButton')
      .addEventListener('click', () => this.#navigatePhotos(-1));
    document.getElementById('nextButton')
      .addEventListener('click', () => this.#navigatePhotos(1));
    document.querySelector('.close')
      .addEventListener('click', () => this.#closeModal());
  }
}

// Initialize the gallery when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PhotoGallery();
});

export default PhotoGallery;

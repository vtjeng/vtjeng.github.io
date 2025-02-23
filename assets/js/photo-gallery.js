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

  openModal(img) {
    this.modal.style.display = 'block';
    this.currentImageElement = img;
    this.modalImg.src = img.src;
    this.showLoadingIndicator();

    const fullResUrl = img.src.replace(
      PHOTO_GALLERY_CONFIG.PREVIEW_BASE_URL,
      PHOTO_GALLERY_CONFIG.FULL_RES_BASE_URL
    );

    const tempImg = new Image();
    tempImg.onload = () => {
      this.modalImg.src = fullResUrl;
      this.hideLoadingIndicator();
    };
    tempImg.onerror = () => {
      console.error('Failed to load full resolution image');
      this.hideLoadingIndicator();
    };
    tempImg.src = fullResUrl;
  }

  closeModal() {
    this.modal.style.display = 'none';
  }

  navigatePhotos(direction) {
    if (!this.currentImageElement) return;

    const galleryItems = document.querySelectorAll('.photo-gallery-item img');
    const galleryArray = Array.from(galleryItems);
    const currentIndex = galleryArray.indexOf(this.currentImageElement);

    if (currentIndex === -1) return;

    let newIndex = currentIndex + direction;
    if (newIndex >= galleryArray.length) newIndex = 0;
    if (newIndex < 0) newIndex = galleryArray.length - 1;

    this.openModal(galleryArray[newIndex]);
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

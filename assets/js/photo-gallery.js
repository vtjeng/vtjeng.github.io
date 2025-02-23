// Initialize image sources on page load
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".photo-gallery-item img").forEach((img) => {
    const path = img.getAttribute("data-path");
    img.src = `${PHOTO_GALLERY_CONFIG.PREVIEW_BASE_URL}${path}`;
  });
});

let currentImageElement = null;

function openModal(img) {
  var modal = document.getElementById("photoModal");
  var modalImg = document.getElementById("modalImage");
  modal.style.display = "block";
  currentImageElement = img;
  // Convert preview URL to full-res URL
  modalImg.src = img.src.replace(PHOTO_GALLERY_CONFIG.PREVIEW_BASE_URL, PHOTO_GALLERY_CONFIG.FULL_RES_BASE_URL);
}

function closeModal() {
  var modal = document.getElementById("photoModal");
  modal.style.display = "none";
}

// Close modal when clicking outside the image
window.onclick = function(event) {
  var modal = document.getElementById("photoModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Close modal with escape key
document.addEventListener('keydown', function(event) {
  if (event.key === "Escape") {
    var modal = document.getElementById("photoModal");
    modal.style.display = "none";
  } else if (event.key === "ArrowLeft") {
    navigatePhotos(-1);
  } else if (event.key === "ArrowRight") {
    navigatePhotos(1);
  }
});

function navigatePhotos(direction) {
  if (!currentImageElement) return;
  
  const galleryItems = document.querySelectorAll('.photo-gallery-item img');
  const galleryArray = Array.from(galleryItems);
  const currentIndex = galleryArray.indexOf(currentImageElement);
  
  if (currentIndex === -1) return;
  
  let newIndex = currentIndex + direction;
  
  // Loop around if we reach the end or beginning
  if (newIndex >= galleryArray.length) newIndex = 0;
  if (newIndex < 0) newIndex = galleryArray.length - 1;
  
  const newImage = galleryArray[newIndex];
  openModal(newImage);
}

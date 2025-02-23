function openModal(img) {
  var modal = document.getElementById("photoModal");
  var modalImg = document.getElementById("modalImage");
  modal.style.display = "block";
  // Convert preview URL to full-res URL
  modalImg.src = img.src.replace('/previews/', '/full_res/');
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
  }
});

const fileInput = document.getElementById("animal-pic-file");

window.addEventListener('paste', e => {
  fileInput.files = e.clipboardData.files;
});
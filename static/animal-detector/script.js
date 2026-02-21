const fileInput = document.getElementById("animal-pic-file");
const imagePreview = document.getElementById("image-preview");

window.addEventListener('paste', e => {
    fileInput.files = e.clipboardData.files;
});

fileInput.onchange = previewImage;

function previewImage() {
    if (fileInput.files && fileInput.files[0]) {
        imagePreview.src = URL.createObjectURL(fileInput.files[0])
    }
}

document.getElementById("send").addEventListener("click", function () {
    if (fileInput.files && fileInput.files[0]) {
        upload(fileInput.files[0]);
    }
});

function upload(file) {
    console.log(file)
    var formdata = new FormData();
    formdata.append("image", file);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/identify", true);
    xhr.onload = function () {
        if (this.status = 200) {
            console.log(this.response);
        } else {
            console.error(xhr);
        }
        alert(this.response);
    };
    xhr.send(formdata);
}
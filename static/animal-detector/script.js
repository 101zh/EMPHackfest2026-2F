const fileInput = document.getElementById("animal-pic-file");
const imagePreview = document.getElementById("image-preview");

window.addEventListener('paste', e => {
    fileInput.files = e.clipboardData.files;
});

fileInput.onchange = previewImage;

function previewImage() {
    if (fileInput.files && fileInput.files[0]) {
        imagePreview.style.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(\"${URL.createObjectURL(fileInput.files[0])}\")`
        imagePreview.style.backgroundPosition = "center"
        imagePreview.style.backgroundSize = "cover"
        imagePreview.style.backgroundRepeat = "no-repeat"
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
    xhr.open("POST", "/identify", true);
    xhr.responseType = "json";
    xhr.onload = function () {

        if (this.status === 200) {
            const data = this.response;
            console.log(this.response);

            console.log(data);

            document.getElementById("resultBox").style.display = "block";
            document.getElementById("name").textContent = data.name;
            document.getElementById("endangered_status").textContent = data.animal_data.endangered_status;
            document.getElementById("is_invasive").textContent = data.animal_data.is_invasive;
            document.getElementById("population_count").textContent = data.animal_data.population_count;
            document.getElementById("native_region").textContent = data.animal_data.native_region;
            document.getElementById("fun_facts").textContent = data.animal_data.fun_facts;
        } else {
            console.error(xhr);
        }
    };
    xhr.send(formdata);
}
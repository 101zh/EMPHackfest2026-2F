const fileInput = document.getElementById("animal-pic-file");
const imagePreview = document.getElementById("image-preview");
const stateContainer = document.getElementById("state-container");
const stateSelect = document.getElementById("state")
const countrySelect = document.getElementById("country");

const waitingFacts = [
    "Octopuses have three hearts.",
    "A group of flamingos is called a flamboyance.",
    "Sea otters hold hands while they sleep.",
    "Some turtles can breathe through their rear ends.",
    "Crows can recognize human faces.",
    "A shrimp's heart is in its head.",
    "The immortal jellyfish can hit a 'reset' button and revert to its polyp stage.",
    "Wombats are the only animals that produce cube-shaped poop.",
    "A blue whale's heart is the size of a bumper car.",
    "Honeybees perform a 'waggle dance' to communicate the location of flowers.",
    "Cows have 'best friends' and get stressed when separated from them.",
    "Sloths can hold their breath underwater for up to 40 minutes.",
    "Platypuses do not have stomachs; their esophagus connects directly to their intestines.",
    "Hummingbirds have a heart rate that can reach 1,260 beats per minute."
];

let loadingFactInterval = null;
let loadingFactIndex = 0;

window.addEventListener('paste', e => {
    fileInput.files = e.clipboardData.files;
    previewImage()
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

countrySelect.addEventListener("change", function () {
    if (countrySelect.value === "USA") {
        stateContainer.style.display = "flex";
    } else {
        stateContainer.style.display = "none";
        stateSelect.value = "";
    }
});


document.getElementById("send").addEventListener("click", function () {
    if (fileInput.files && fileInput.files[0]) {
        upload(fileInput.files[0]);
    }
});

function startLoadingState() {
    if (loadingFactInterval) {
        clearInterval(loadingFactInterval);
    }

    loadingFactIndex = 0;
    document.getElementById("loadingFact").textContent = waitingFacts[loadingFactIndex];
    loadingFactInterval = setInterval(() => {
        loadingFactIndex = (loadingFactIndex + 1) % waitingFacts.length;
        document.getElementById("loadingFact").textContent = waitingFacts[loadingFactIndex];
    }, 2200);

    document.getElementById("send").disabled = true;
    document.getElementById("loadingBox").style.display = "flex";
    document.getElementById("resultBox").style.display = "none";
}

function stopLoadingState() {
    if (loadingFactInterval) {
        clearInterval(loadingFactInterval);
        loadingFactInterval = null;
    }

    document.getElementById("send").disabled = false;
    document.getElementById("loadingBox").style.display = "none";
}

function upload(file) {
    console.log(file)
    startLoadingState();
    var formdata = new FormData();
    formdata.append("image", file);
    formdata.append("country", countrySelect.value);
    formdata.append("state", stateSelect.value);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/identify", true);
    xhr.responseType = "json";
    xhr.onload = function () {
        stopLoadingState();

        if (this.status === 200) {
            const data = this.response;
            console.log(this.response);

            console.log(data);

            document.getElementById("resultBox").style.display = "flex";
            document.getElementById("name").textContent = data.name;
            document.getElementById("endangered_status").textContent = data.animal_data.endangered_status;
            document.getElementById("is_invasive").textContent = data.animal_data.is_invasive ? 'Yes ⚠️' : 'No';
            document.getElementById("population_count").textContent = data.animal_data.population_count;
            document.getElementById("native_region").textContent = data.animal_data.native_region;
            document.getElementById("fun_facts").textContent = data.animal_data.fun_facts;
            document.getElementById("report_link").innerHTML = `<a href="${data.animal_data.report_link}" target="_blank">${data.animal_data.report_link}</a>`;
        } else {
            console.error(xhr);
        }
    };
    xhr.onerror = function () {
        stopLoadingState();
        console.error(xhr);
    };
    xhr.send(formdata);
}

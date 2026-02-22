async function loadAnimals() {
    try {
        const response = await fetch('/animals');
        const animals = await response.json();

        const grid = document.querySelector('.pokedex-grid');
        grid.innerHTML = '';

        animals.forEach(animal => {
            const card = document.createElement('div');
            card.className = 'animal-card';

            card.innerHTML = `
                <img src="data:${animal.image_type};base64,${animal.image}" alt="${animal.name}">
                <h3>${animal.name}</h3>
            `;

            // Click event for the modal
            card.onclick = () => showDetails(animal);
            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading animals:", error);
    }
}

function showDetails(animal) {
    const modal = document.getElementById('animalModal');
    const details = document.getElementById('modal-details');

    // Fill the modal using your automated "info" object
    details.innerHTML = `
    <div class="modal-image-container">    
    <img class="modal-image" src="data:${animal.image_type};base64,${animal.image}" alt="${animal.name}">
    </div>
        <h2>${animal.name}</h2>
        <div class="stats">
            <p><strong>Endangerment Status:</strong> ${animal.info.endangered_status}</p>
            <p><strong>Invasiveness:</strong> ${animal.info.is_invasive ? 'Yes ⚠️' : 'No'}</p>
            <p><strong>Population:</strong> ${animal.info.population_count}</p>
            <p><strong>Native Region:</strong> ${animal.info.native_region}</p>
        </div>
        <hr>
        <p><strong>Fun Facts:</strong> ${animal.info.fun_facts}</p>
    `;
    modal.style.display = "block";
}

// Close the modal when X is clicked
document.querySelector('.close-button').onclick = () => {
    document.getElementById('animalModal').style.display = "none";
};

loadAnimals();
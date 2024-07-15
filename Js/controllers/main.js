import { servicesProducts } from "/Js/services/product-services.js";

const productContainer = document.querySelector("[data-product]");
const form = document.querySelector("[data-form]");

function createCard(name, price, image, id) {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        <div class="img-container">
            <img src="${image}" alt="${name}">
        </div>
        <div class="card-container-info">
            <p class="text">${name}</p>
            <div class="card-container--value">
                <p class="value text">$${price}</p>
            </div>
            <div class="delete"> 
            <button class="delete-button" data-id="${id}">
                    <img src="img/trash.png" alt="Eliminar">
            </button>
            </div>
        </div>
        
    `;

    productContainer.appendChild(card);
    return card;
}

const render = async () => {
    try {
        const listProducts = await servicesProducts.productList();

        listProducts.forEach(product => {
            createCard(product.name, product.price, product.image, product.id);
        });
    } catch (error) {
        console.error('Error al renderizar los productos:', error);
    }
};

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.querySelector("[data-name]").value;
    const price = document.querySelector("[data-price]").value;
    const image = document.querySelector("[data-image]").value;

    servicesProducts.createProducts(name, price, image)
        .then((res) => {
            console.log('Producto creado:', res);
        })
        .catch((err) => console.error('Error al crear el producto:', err));
});

productContainer.addEventListener("click", async (event) => {
    event.preventDefault();

    const removeButton = event.target.closest(".delete-button");
    if (removeButton) {
        const itemId = removeButton.dataset.id;
        try {
            await servicesProducts.deleteProducts(itemId); 
            console.log('Producto eliminado con éxito');
          
            const cardToRemove = removeButton.closest(".card");
            if (cardToRemove) {
                cardToRemove.remove(); 
            } else {
                console.error('No se pudo encontrar el elemento padre .card');
            }
        } catch (err) {
            console.error('Error al eliminar el producto:', err);
        }
    }
});



render();
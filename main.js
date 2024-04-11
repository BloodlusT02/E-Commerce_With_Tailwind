import products from "./api/product.db.json";

// Selecting elements
const menuButton = document.getElementById("menuButton");
const closeMenuButton = document.getElementById("closeMenuButton");
const navDialog = document.getElementById("nav-dialog");
const navLinks = document.querySelectorAll(".nav-link");

// Function to handle menu button click
const handleMenu = () => {
  navDialog.classList.toggle("hidden");
};

// Function to handle close menu button click
const handleCloseMenu = () => {
  navDialog.classList.add("hidden");
};

// Attaching event listeners
menuButton.addEventListener("click", handleMenu);
closeMenuButton.addEventListener("click", handleCloseMenu);

// Adding event listeners to nav links to close the menu when clicked
navLinks.forEach((link) => {
  link.addEventListener("click", handleCloseMenu);
});

const updateCartValue = (arrayLocalStorageProduct) => {
  const cartValueSpan = document.querySelector("#cartValue span");
  const mobileSpan = document.querySelector("#cartValueMobile span");
  if (cartValueSpan) {
    cartValueSpan.textContent = arrayLocalStorageProduct.length;
  }
  if (mobileSpan) {
    mobileSpan.textContent = arrayLocalStorageProduct.length;
  }
};

// Storing Products in Local Storage
const getCartProductFromLS = () => {
  let cartProducts = localStorage.getItem("cartProductLS");
  if (!cartProducts) {
    return [];
  }

  const parsedCartProduct = JSON.parse(cartProducts);
  updateCartValue(parsedCartProduct);
  return parsedCartProduct;
};
getCartProductFromLS();

// Displaying the json data
products.forEach((product) => {
  const cards = document.getElementById("Cards");
  let card = document.createElement("div");

  const cardId = `card${product.id}`;
  const stockId = `stockElement${product.id}`;
  const cartItem = `addToCart${product.id}`;

  card.innerHTML = `
  <div id="${cardId}" class="card bg-white rounded overflow-hidden xl:w-80 2xl:w-80">
    <img class="w-full h-56 object-cover md:h-64 lg:h-72" src="${product.product_image}" alt="product_img">
    <p class="text-xl pl-4 pr-3 font-semibold pt-2">${product.product_name}</p>
    <p class="text-sm pl-4 pr-3 py-3 text-gray-600">${product.product_description}</p>
    <p id="productPrice" class="font-medium pl-4 pr-3">$ ${product.product_price}</p>
    <p id="productStock" class="font-medium pl-4 pr-3">Total stock available: ${product.stock}</p>

    <div class="mt-2 flex justify-between px-3 items-center">
      <p>Quantity(Pieces)</p>
      <div id="${stockId}" class="flex border-2 rounded w-fit border-black md:mr-6">
        <button class="cardIncriment px-3 text-lg">+</button>
        <p class="productQuantity border-l-2 border-r-2 border-black px-3">01</p>
        <button class="cardDecriment px-3">-</button>
      </div>
    </div>
    <button id="${cartItem}" class="font-medium text-lg mx-4 mb-4 mt-6 py-1 px-8 rounded bg-[#025e6c] hover:bg-[#0e9594] transition text-white"><i class="ri-shopping-cart-line"></i> Add To Cart</button>
</div>`;

  cards.appendChild(card);

  // Making Quantity
  const stockElement = document.getElementById(stockId);
  stockElement.addEventListener("click", (event) => {
    const currentCardElement = document.getElementById(cardId);
    const productQuantity =
      currentCardElement.querySelector(".productQuantity");

    let quantity = parseInt(productQuantity.innerText);

    if (event.target.classList.contains("cardIncriment")) {
      if (quantity < product.stock) {
        quantity += 1;
      }
    }

    if (event.target.classList.contains("cardDecriment")) {
      if (quantity > 1) {
        quantity -= 1;
      }
    }

    productQuantity.innerText = quantity < 10 ? `0${quantity}` : quantity;
    productQuantity.setAttribute("data-quantity", quantity.toString());
  });

  // Add to cart
  const addToCart = document.getElementById(cartItem);
  addToCart.addEventListener("click", (event) => {
    let arrayLocalStorageProduct = getCartProductFromLS();
    const currentProductCard = event.target.closest(".card");

    let quantity = parseInt(
      currentProductCard.querySelector(".productQuantity").innerText
    );
    let price = parseFloat(
      currentProductCard
        .querySelector("#productPrice")
        .innerText.replace("$", "")
    );
    let id = product.id;
    let stock = parseInt(
      currentProductCard.querySelector("#productStock").innerText.split(":")[1]
    );

    let existingProductIndex = arrayLocalStorageProduct.findIndex(
      (product) => product.id === id
    );

    if (existingProductIndex !== -1) {
      // Product already exists in the cart
      if (quantity > 1) {
        // Increase quantity if greater than 1
        let totalQuantity =
          arrayLocalStorageProduct[existingProductIndex].quantity + quantity;
        if (totalQuantity <= stock) {
          arrayLocalStorageProduct[existingProductIndex].quantity =
            totalQuantity;
          arrayLocalStorageProduct[existingProductIndex].price =
            price * totalQuantity; // Update the price
        } else {
          alert("Cannot add more quantities. Stock limit reached.");
        }
      } else {
        // Notify user that the product is already in the cart with quantity 1
        alert("This product is already in your cart.");
      }
    } else {
      // Product doesn't exist in the cart, add it
      if (quantity <= stock) {
        arrayLocalStorageProduct.push({
          id,
          quantity: quantity,
          price: price * quantity,
        });
      } else {
        alert("Cannot add more quantities. Stock limit reached.");
      }
    }

    localStorage.setItem(
      "cartProductLS",
      JSON.stringify(arrayLocalStorageProduct)
    );

    updateCartValue(arrayLocalStorageProduct);
  });
});

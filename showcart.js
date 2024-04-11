import products from "./api/product.db.json";

// Selecting elements
const menuButton = document.getElementById("menuButton");
const closeMenuButton = document.getElementById("closeMenuButton");
const navDialog = document.getElementById("nav-dialog");
const navLinks = document.querySelectorAll(".nav-link");
const cartCntainer = document.getElementById("cart-container");

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
// This is Local Storage data
let cartProducts = getCartProductFromLS();

let filterProducts = products.filter((currentProduct) => {
  return cartProducts.some(
    (cartProduct) => cartProduct.id === currentProduct.id
  );
});

// Cart Fuction
const showCartProduct = () => {
  filterProducts.forEach((product) => {
    // id and price from json data
    let id = product.id;
    let price = product.product_price;
    const stockId = `stockElement${product.id}`;
    const cardId = `card${product.id}`;

    const fetchQuantityFromCart = () => {
      let exitingProduct = cartProducts.find(
        (currentProduct) => currentProduct.id === id
      );
      let quantity = 1;

      if (exitingProduct) {
        quantity = exitingProduct.quantity;
        price = exitingProduct.price;
      }
      return { quantity, price };
    };

    // Local Storage Data
    const localStorageActualData = fetchQuantityFromCart(id, price);

    let carts = document.createElement("div");
    carts.classList.add("cart");

    carts.innerHTML = `
        <div id="cart" class="cart bg-white shadow-2xl rounded overflow-hidden lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-3">
            <img class="object-cover w-full h-4/6 md:w-full md:h-96 lg:w-56 lg:h-40 lg:rounded" src="${
              product.product_image
            }" alt="cart_img">
            <h2 class="px-3 py-1 text-xl font-medium md:text-2xl lg:text-lg lg:font-semibold">${
              product.product_name
            }</h2>
            <h2 id="productPrice" class="px-3 text-xl font-medium md:text-2xl lg:text-lg lg:font-semibold">$ ${localStorageActualData.price.toFixed(
              2
            )}</h2>
            <div class="mt-2 items-center px-3 text-xl font-medium md:text-2xl lg:font-semibold">
            <div id="${stockId}" class="flex border-2 rounded w-fit border-black md:mr-6 lg:text-lg">
                <button class="cardIncriment px-5 text-lg">+</button>
                <p class="productQuantity border-l-2 border-r-2 border-black px-5" data-quantity="${
                  localStorageActualData.quantity
                }">${localStorageActualData.quantity}</p>
                <button class="cardDecriment px-6 lg:text-xl">-</button>
            </div>
            </div>
            <button id="remove${id}" class="mx-3 my-4 px-8 py-1 rounded hover:text-red-500 text-xl bg-black text-white font-medium md:text-2xl lg:text-lg lg:font-semibold">Remove <i class="ri-delete-bin-2-line"></i></button>
      </div>
        `;
    cartCntainer.appendChild(carts);

    // Remove From cart
    const removeFromCart = document.getElementById(`remove${id}`);
    removeFromCart.addEventListener("click", () => {
      const removeProductFromCart = () => {
        cartProducts = cartProducts.filter(
          (currentProduct) => currentProduct.id !== id
        );
        localStorage.setItem("cartProductLS", JSON.stringify(cartProducts));

        carts.remove();
        updateCartValue(cartProducts);
      };
      removeProductFromCart();
      updateCartProductTotal();
    });

    const stockElement = carts.querySelector(`#${stockId}`);
    const productQuantityElement =
      stockElement.querySelector(".productQuantity");
    const productPriceElement = carts.querySelector("#productPrice");

    // console.log(productPriceElement);

    // Incriment form cart
    stockElement
      .querySelector(".cardIncriment")
      .addEventListener("click", () => {
        let quantity = parseInt(
          productQuantityElement.getAttribute("data-quantity")
        );
        if (quantity < product.stock) {
          quantity++;
          productQuantityElement.textContent = quantity;
          productQuantityElement.setAttribute("data-quantity", quantity);
          const updatedPrice = quantity * product.product_price;
          productPriceElement.textContent = `$ ${updatedPrice.toFixed(2)}`;

          // Update the localStorage with the new quantity and price
          const existingProduct = cartProducts.find(
            (products) => products.id === product.id
          );
          if (existingProduct) {
            existingProduct.quantity = quantity;
            existingProduct.price = updatedPrice;
            localStorage.setItem("cartProductLS", JSON.stringify(cartProducts));
          }
        }
        updateCartProductTotal();
      });

    // Decriment form cart
    stockElement
      .querySelector(".cardDecriment")
      .addEventListener("click", () => {
        let quantity = parseInt(
          productQuantityElement.getAttribute("data-quantity")
        );
        if (quantity > 1) {
          quantity--;
          productQuantityElement.textContent = quantity;
          productQuantityElement.setAttribute("data-quantity", quantity);
          const updatedPrice = quantity * product.product_price;
          productPriceElement.textContent = `$ ${updatedPrice.toFixed(2)}`;

          // Update the localStorage with the new quantity and price
          const existingProduct = cartProducts.find(
            (products) => products.id === product.id
          );
          if (existingProduct) {
            existingProduct.quantity = quantity;
            existingProduct.price = updatedPrice;
            localStorage.setItem("cartProductLS", JSON.stringify(cartProducts));
          }
        }
        updateCartProductTotal();
      });
  });
};
showCartProduct();

// Total Price function
const updateCartProductTotal = () => {
    let initialValue = 0;
    let totalProductPrice = cartProducts.reduce((accumilator, currentProduct) => {
        let productPrice = parseInt(currentProduct.price) || 0;
        return accumilator + productPrice
    }, initialValue);
    
    console.log(totalProductPrice);


    const finalPrice = () => {
        const subTotal = document.getElementById("sub-total")
        const finalTotal = document.getElementById("final-total");
    
        subTotal.textContent = `$ ${ Number(totalProductPrice) }`
        finalTotal.textContent = `$ ${ Number(totalProductPrice + 1.1) }`
    };
    finalPrice();

};
updateCartProductTotal();
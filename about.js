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






















const accordians = document.querySelectorAll("#accordian");

accordians.forEach((accordian) => {
    const icon = accordian.querySelector(".icon");
    const answer = accordian.querySelector(".answer");

    accordian.addEventListener("click", () => {
        icon.classList.toggle("rotate-180");
        // answer.classList.toggle("max-h-0");
        // answer.classList.toggle("max-h-fit");

        if (answer.classList.contains("max-h-0")) {
            // Expand the answer
            answer.classList.remove("max-h-0");
            answer.classList.add("max-h-96", "transition-max-height", "ease-in");
        } else {
            // Collapse the answer
            answer.classList.remove("max-h-96", "transition-max-height", "ease-in");
            answer.classList.add("max-h-0");
        }
    })
})
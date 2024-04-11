import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"), // main file
                about: resolve(__dirname, "about.html"), // About us
                contact: resolve(__dirname, "contact.html"), // Contact Us
                products: resolve(__dirname, "products.html"), // Products
                cart: resolve(__dirname, "cart.html") // Your Cart
            }
        }
    }
});
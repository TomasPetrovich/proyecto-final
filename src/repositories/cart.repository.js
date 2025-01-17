const CartModel = require("../models/cart.model.js");
const TicketModel = require("../models/ticket.model.js");

class CartRepository {
    async createCart() {
        try {
            const nuevoCarrito = new CartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async getProductsFromCart(idCarrito) {
        try {
            const carrito = await CartModel.findById(idCarrito);
            if (!carrito) {
                console.log("No existe ese carrito con el id");
                return null;
            }
            return carrito;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async addProduct(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.getProductsFromCart(cartId);
            const existeProducto = carrito.products.find(item => item.product._id.toString() === productId);

            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productId, quantity });
            }

            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            throw new Error("Error al agregar el producto al carrito");
        }
    }

    async deleteProduct(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async updateProductsInCart(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = updatedProducts;

            cart.markModified('products');
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async updateQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                
                throw new Error('Carrito no encontrado');
            }
            
            
            const productIndex = cart.products.findIndex(item => item._id.toString() === productId);
        
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;


                cart.markModified('products');

                await cart.save();
                return cart;
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }

        } catch (error) {
            throw new Error("Error al actualizar las cantidades");
        }
    }

    async emptyCart(cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            return cart;

        } catch (error) {
            throw new Error("Error");
        }
    }

    async agregarProductosATicket(products, purchaser) {
        try {
            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calcularTotal(products),
                purchaser
            });
            await ticket.save();
            return ticket;
        } catch (error) {
            throw new Error("Error");
        }
    }
}

module.exports = CartRepository;
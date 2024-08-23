const TicketModel = require("../models/ticket.model.js");
const UserModel = require("../models/user.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const { generateUniqueCode, calcularTotal } = require("../utils/cartutils.js");
const EmailManager = require("../services/email.js");
const emailManager = new EmailManager();
const TicketRepository = require("../repositories/ticket.repository.js");
const ticketRepository = new TicketRepository();



class CartController {
    async newCart(req, res) {
        try {
            const nuevoCarrito = await cartRepository.createCart();
            res.json(nuevoCarrito);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async getProductsFromCart(req, res) {
        const carritoId = req.params.cid;
        try {
            const productos = await cartRepository.getProductsFromCart(carritoId);
            if (!productos) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
            res.json(productos);
        } catch (error) {
            res.status(500).send("Error");
        }
    }


    
    async addProduct(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = parseInt(req.body.quantity) || 1;
        console.log("Cantidad que recibo:", req.body.quantity);
        try {
            await cartRepository.addProduct(cartId, productId, quantity);
            const carritoID = (req.user.cart).toString();

            res.redirect(`/carts/${carritoID}`)
        } catch (error) {
            res.status(500).send("Error al agregar el producto al carrito");
        }
    }

    async deleteProduct(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const updatedCart = await cartRepository.deleteProduct(cartId, productId);
            res.json({
                status: 'success',
                message: 'Producto eliminado del carrito correctamente',
                updatedCart,
            });
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async updateProductsInCart(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;

        try {
            const updatedCart = await cartRepository.updateProductsInCart(cartId, updatedProducts);
            res.json(updatedCart);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async updateQuantity(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
        try {
            const updatedCart = await cartRepository.updateQuantity(cartId, productId, newQuantity);

            res.json({
                status: 'success',
                message: 'Cantidad del producto actualizada correctamente',
                updatedCart,
            });

        } catch (error) {
            res.status(500).send("Error al actualizar la cantidad de productos");
        }
    }

    async emptyCart(req, res) {
        const cartId = req.params.cid;
        try {
            const updatedCart = await cartRepository.emptyCart(cartId);

            res.json({
                status: 'success',
                message: 'Todos los productos del carrito fueron eliminados correctamente',
                updatedCart,
            });

        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async finalizePurchase(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartRepository.getProductsFromCart(cartId);
            const products = cart.products;

            const productosNoDisponibles = [];

            for (const item of products) {
                const productId = item.product;
                const product = await productRepository.getProductsById(productId);
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    productosNoDisponibles.push(productId);
                }
            }

            const userWithCart = await UserModel.findOne({ cart: cartId });
            
            const ticket = await ticketRepository.createTicket({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calcularTotal(cart.products),
                purchaser: userWithCart._id,
                products: cart.products
            });

            await cartRepository.emptyCart(cartId);

            await emailManager.enviarCorreoCompra(userWithCart.email, userWithCart.first_name, ticket._id);

            res.render("checkout", {
                cliente: userWithCart.first_name,
                email: userWithCart.email,
                numTicket: ticket._id
            });
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

}

module.exports = CartController;
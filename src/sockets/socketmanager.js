const socket = require("socket.io");
const ProductRepository = require("../repositories/product.repository.js");
const UserRepository = require("../repositories/user.repository.js"); // Importar el repositorio de usuarios
const productRepository = new ProductRepository();
const userRepository = new UserRepository(); // Instancia del repositorio de usuarios
const MessageModel = require("../models/message.model.js");

class SocketManager {
    constructor(httpServer) {
        this.io = socket(httpServer);
        this.initSocketEvents();
    }

    async initSocketEvents() {
        this.io.on("connection", async (socket) => {
            console.log("Un cliente se conectó");
            
            socket.emit("productos", await productRepository.getProducts());
            
            // Emitir lista de usuarios al conectar
            socket.emit("usuarios", await userRepository.getAllUsers());

            socket.on("eliminarProducto", async (id) => {
                await productRepository.deleteProduct(id);
                this.emitUpdatedProducts(socket);
            });

            socket.on("agregarProducto", async (producto) => {
                await productRepository.addProduct(producto);
                this.emitUpdatedProducts(socket);
            });

            socket.on("message", async (data) => {
                await MessageModel.create(data);
                const messages = await MessageModel.find();
                socket.emit("message", messages);
            });

            // Escuchar solicitud de usuarios
            socket.on("solicitarUsuarios", async () => {
                const users = await userRepository.getAllUsers();
                socket.emit("usuarios", users);
            });

            // Cambiar rol de usuario
            socket.on("cambiarRolUsuario", async ({ userId, role }) => {
                const user = await userRepository.findById(userId);
                if (user) {
                    user.role = role;
                    await user.save();
                    this.emitUpdatedUsers(socket); // Emitir lista actualizada de usuarios
                }
            });

            // Eliminar usuario
            socket.on("eliminarUsuario", async (userId) => {
                await userRepository.deleteUserById(userId);
                this.emitUpdatedUsers(socket); // Emitir lista actualizada de usuarios
            });
        });
    }

    async emitUpdatedProducts(socket) {
        socket.emit("productos", await productRepository.getProducts());
    }

    async emitUpdatedUsers(socket) {
        socket.emit("usuarios", await userRepository.getAllUsers());
    }
}

module.exports = SocketManager;

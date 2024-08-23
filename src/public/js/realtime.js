const socket = io(); 

// Escuchar productos desde el servidor y renderizarlos
socket.on("productos", (data) => {
    renderProductos(data);
});

// Escuchar usuarios desde el servidor y renderizarlos
socket.on("usuarios", (data) => {
    renderUsuarios(data);
});

// Renderizar productos en la vista
const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";
    
    productos.docs.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = ` 
            <p> ${item.title} </p>
            <p> ${item.price} </p>
            <button> Eliminar </button>
        `;

        contenedorProductos.appendChild(card);
        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item._id);
        });
    });
};

// Eliminar un producto
const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
};

// Enviar nuevo producto
document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
});

// Agregar un producto
const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
    };

    socket.emit("agregarProducto", producto);
};

// Renderizar usuarios en la vista
const renderUsuarios = (usuarios) => {
    const contenedorUsuarios = document.getElementById("contenedorUsuarios");
    contenedorUsuarios.innerHTML = "";

    usuarios.forEach(user => {
        const userCard = document.createElement("div");
        userCard.classList.add("user-card");

        userCard.innerHTML = `
            <p><strong>Nombre:</strong> ${user.first_name} ${user.last_name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Rol:</strong> ${user.role}</p>
            <form data-id="${user._id}" class="cambiarRolForm">
                <label for="role">Cambiar Rol:</label>
                <select name="role" class="roleSelect">
                    <option value="usuario" ${user.role === 'usuario' ? 'selected' : ''}>Usuario</option>
                    <option value="premium" ${user.role === 'premium' ? 'selected' : ''}>Premium</option>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                </select>
                <button type="submit">Cambiar</button>
            </form>
            <button class="eliminarUsuarioBtn" data-id="${user._id}">Eliminar Usuario</button>
        `;

        contenedorUsuarios.appendChild(userCard);

        // Cambiar rol del usuario
        userCard.querySelector('.cambiarRolForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const userId = this.getAttribute('data-id');
            const newRole = this.querySelector('.roleSelect').value;

            socket.emit('cambiarRolUsuario', { userId, role: newRole });
        });

        // Eliminar usuario
        userCard.querySelector('.eliminarUsuarioBtn').addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            socket.emit('eliminarUsuario', userId);
        });
    });
};

// Solicitar usuarios al servidor
socket.emit('solicitarUsuarios');

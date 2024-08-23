const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const cors = require("cors");
const path = require('path');
const config = require("./config/config.js")
const PUERTO = config.port;
require("./database.js");
const addLogger = require("./utils/logger.js")
const swaggerSetup = require('./utils/swagger.js');
swaggerSetup(app);


const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const mockingRouter = require('./routes/mocking.router.js');
const loggerTestRouter = require('./routes/logger.router.js');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(addLogger)

//Passport: 
app.use(passport.initialize());
initializePassport();
app.use(cookieParser());

//AuthMiddleware:
const authMiddleware = require("./middleware/authmiddleware.js");
app.use(authMiddleware);

//Handlebars:
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


//Rutas: 
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/", viewsRouter);
app.use('/api', mockingRouter);
app.use('/', loggerTestRouter);

const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

///Websockets: 
const SocketManager = require("./sockets/socketmanager.js");
new SocketManager(httpServer);
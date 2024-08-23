const mongoose = require("mongoose");
const config = require("./config/config.js")

mongoose.connect(config.mongoURI)
    .then(() => console.log("Conexión exitosa"))
    .catch(() => console.log("Vamos a morir, tenemos un error"))
    
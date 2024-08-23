const winston =  require("winston");


const niveles = {
    fatal: 0, 
    error: 1, 
    warning: 2,
    info: 3, 
    http: 4, 
    debug: 5
}



const loggerProduccion = winston.createLogger({
    levels: niveles, 
    transports: [
        new winston.transports.File({
            filename: "./errors.log", 
            level: "error"
        })
    ]
})



const logger = loggerProduccion



const addLogger = (req, res, next) => {
    req.logger = logger; 
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
}

module.exports = addLogger;
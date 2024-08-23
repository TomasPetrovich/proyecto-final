const express = require('express');
const router = express.Router();
const addLogger = require("../utils/logger.js")

router.get("/loggertest", (req, res) => {
    req.logger.http("Mensaje HTTP"); 
    req.logger.info("Mensaje INFO"); 
    req.logger.warning("Mensaje WARNING"); 
    req.logger.error("Mensaje ERROR"); 

    res.send("Logs generados");
})

module.exports = router
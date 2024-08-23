const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    mongoURI: process.env.MONGO_URL,
    port: process.env.PORT || 8080,
    secretKEY: process.env.SECRET_KEY,
    passEmail: process.env.PASS_EMAIL
};

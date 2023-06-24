require('dotenv').config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const secretKey = process.env.SECRET_KEY;

module.exports = {
    'secretKey': secretKey,
    'mongoUrl': `mongodb+srv://${username}:${password}@cluster0.n6ytt3m.mongodb.net/`
}
require('dotenv').config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

module.exports = {
    'secretKey': '12345-67890-09876-54321',
    'mongoUrl': `mongodb+srv://${username}:${password}@cluster0.n6ytt3m.mongodb.net/`
}
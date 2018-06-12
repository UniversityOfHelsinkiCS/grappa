require('dotenv').config()

const { TOKEN_SECRET, DATABASE_URL } = process.env

module.exports = {
    DATABASE_URL, TOKEN_SECRET
}

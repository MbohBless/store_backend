module.exports = {
    'secretKey': process.env.ENCRYPTION_SECRET,
    'mongoUrl': 'mongodb://localhost:27017/confusion',
    'facebook': {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    }
}
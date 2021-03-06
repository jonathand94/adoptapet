module.exports = {
    secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret',
    mongo : {
        uri: process.env.NODE_ENV === 'production' ? process.env.MONGO_URI : 'mongodb://localhost:27017/mydbname'
    }
}


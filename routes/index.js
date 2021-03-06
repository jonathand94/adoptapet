const router = require('express').Router()

router.get('/', (req, res) => {
    res.send('Welcome to Backend fundamentals')
})

router.use('/users', require('./userRoutes'))

module.exports = router
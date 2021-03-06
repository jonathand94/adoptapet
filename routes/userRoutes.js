const router = require('express').Router()
const auth = require('./auth')

const {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    login
} = require('../controllers/userController')

router.post('/login', login)
router.get('/', auth.required, getUsers)
router.post('/', createUser)
router.put('/', auth.required, updateUser)
router.delete('/', auth.required, deleteUser)

module.exports = router
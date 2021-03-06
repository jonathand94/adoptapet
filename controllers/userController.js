const passport = require('passport')
const { use } = require('passport')
const User = require('../models/User')

function createUser(req, res, next) { 
    const userData = req.body,
          password = userData.password

    delete userData.password

    const user = new User(userData)
    user.createPassword(password)

    user.save().then(user => {
        return res.status(201).json(user)
    }).catch(next)
}

function getUsers(req, res) { 
    User.find({}, (error, data) => {
        if(error) {
            return res.status(404).json(error)
        } else {
            return res.status(200).json(data)
        }
    })
}

function updateUser(req, res, next) { 
    User.findById(req.query.id).then(user => {
        if (!user) { return res.sendStatus(401) }
        const newUserData = req.body
        
        if (typeof newUserData.username != 'undefined') {
            user.username = newUserData.username
        }

        if (typeof newUserData.name != 'undefined') {
            user.name = newUserData.name
        }

        if (typeof newUserData.lastName != 'undefined') {
            user.lastName = newUserData.lastName
        }

        if (typeof newUserData.email != 'undefined') {
            user.email = newUserData.email
        }

        user.save().then(updatedUser => {
            console.log(updatedUser);
            res.status(201).json(updatedUser.publicData())
        }).catch(next)
    }).catch(next)
}

function deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.query.id }).then( r => {
        res.status(200).send(`Usuario ${ req.query.id } eliminado: ${ r }`)
    })
}

function login(req, res, next) {
    if (!req.body.email) {
        return res.status(422).json({ error: { message: 'El email no puede estar vacio'}})
    }

    if (!req.body.password) {
        return res.status(422).json({ error: { message: 'El password no puede estar vacio'}})
    }

    passport.authenticate('local', { session: false}, function(err, user, info) {
        if (err) { return next(err) }

        if (user) {
            user.token = user.generateJWT()
            return res.json({ user: user.toAuthJSON() })
        } else {
            return res.status(422).json(info)
        }
    })(req, res, next)
}

module.exports = {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    login
}
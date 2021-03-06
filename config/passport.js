const passport = require('passport')                       //Importando passport, middleware para autenticación.
const LocalStrategy = require('passport-local').Strategy   //Importando estrategia autenticación. --> passport-local
const mongoose = require('mongoose')
const User = require('../models/User')

passport.use(new LocalStrategy({                            //Configurando elementos utilizados para habilitar sesión.
  usernameField: 'email',
  passwordField: 'password'
}, function (email, password, done) {
    User.findOne({ email: email }).then(function (user) {
        if (!user) {
            return done(null, false, { error: { meesage: 'No hay usuario' } })
        }
        if (!user.validatePassword(password)) {
            return done(null, false, { error: { meesage: 'No se puede validar la contraseña' } })
        }
        return done(null, user)
    }).catch(done)
}))
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const secret = require('../config').secret

const { Schema, model } = require('mongoose')

const User = new Schema({
    username: { type: String, require: true},
    name: String,
    lastName: String,
    email: String,
    password: String,
    hash: String,
    salt: String
})

User.methods.createPassword = function (password) { 
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

User.methods.validatePassword = function (password) { 
    console.log(this.salt);
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
    return this.hash === hash
}

User.methods.generateJWT = function() {
    const today = new Date()
    const expireDate = new Date(today)
    expireDate.setDate(today.getDate() + 60)

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(expireDate.getTime() / 1000)
    }, secret)
}

User.methods.toAuthJSON = function() {
    return {
        username: this.username,
        email: this.email,
        token: this.generateJWT()
    }
}

User.methods.publicData = function() {
    return {
        username: this.username,
        email: this.email
    }
}

module.exports = model('User', User)
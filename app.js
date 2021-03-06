var express     = require('express'),
    bodyParser  = require('body-parser'),
    cors        = require('cors')

const { connect } = require('mongoose')

const mongoConfig = require('./config').mongo

const CONNECTION = mongoConfig.uri
console.log('Mongo URI: ' + CONNECTION);
const OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

var app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require('./config/passport')

app.use('/api', require('./routes'))

app.use(function(req, res, next) {
    console.log(req.params)
   var error = new Error('Not Found')
   error.status = 404
   next(error)
})

connect(CONNECTION, OPTIONS, MongoError => {
    if(MongoError) {
        console.log(MongoError)
    }

    var server = app.listen(process.env.PORT || 3000, function() {
        console.log('Este server esta escuchando en el puerto: ' + server.address().port)
        console.log('Se establecio la conexion con MongoDB Atlas');
    })
})
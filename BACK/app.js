const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const path = require('path')
const helmet = require('helmet');

// ROUTE
const usersRoute = require('./routes/users')
const actualityRoute = require('./routes/actuality')
const profileRoute = require('./routes/profile')

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next();
  });
  
// SECURISE LES EN-TETES
app.use(helmet());

// PARSE LE BODY EN JSON
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// ASSOCIE LE CHEMIN '/images' AU DOSSIER 'images'
app.use('/images/post', express.static(path.join(__dirname, 'images/post')))
app.use('/images/profile', express.static(path.join(__dirname, 'images/profile')))

app.use('/api/auth', usersRoute)
app.use('/api/actuality', actualityRoute)
app.use('/api/profile', profileRoute)

// EXPORT LE CONTENU
module.exports = app;
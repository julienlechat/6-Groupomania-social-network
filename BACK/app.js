const express = require('express')
const app = express();
const bodyParser = require('body-parser')

// ROUTE
const usersRoute = require('./routes/users')

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next();
  });

// PARSE LE BODY EN JSON
app.use(bodyParser.json())

app.use('/api/auth', usersRoute)

// EXPORT LE CONTENU
module.exports = app;
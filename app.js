const path = require('path')

const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const solutionRoutes = require('./routes/solutionRoutes')
const { syncAllSolutions } = require('./util/syncAllSolutions')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.use('/solutions', solutionRoutes)

/* app.get('/', (req, res) => {
  res.send('hello')
}) */

const mongoDbClusterUser = process.env.MONGODB_CLUSTER_USER
const mongoDbClusterPassword = process.env.MONGODB_CLUSTER_PASSWORD
const mongoDbDbName = process.env.MONGODB_DB_NAME

mongoose
.connect(`mongodb+srv://${mongoDbClusterUser}:${mongoDbClusterPassword}@${mongoDbDbName}.svzktk8.mongodb.net/`)
.then(() => {
	console.log('mongodb connected at ' + Date.now());
})
.catch((err) => console.log(err));

app.listen(3000)
console.log('Server Started at ' + Date.now());
syncAllSolutions()
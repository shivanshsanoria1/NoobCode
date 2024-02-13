const path = require('path')

const express = require('express')
const mongoose = require('mongoose')
const cron = require('node-cron')
require('dotenv').config()

const solutionRoutes = require('./routes/solutionRoutes')
const { syncAllSolutions } = require('./util/syncAllSolutions')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.use('/solutions', solutionRoutes)

app.listen(4000)
console.log(`Server Started at: ${new Date().toISOString()}`)

const mongoDbClusterUser = process.env.MONGODB_CLUSTER_USER
const mongoDbClusterPassword = process.env.MONGODB_CLUSTER_PASSWORD
const mongoDbDbName = process.env.MONGODB_DB_NAME

mongoose
.connect(`mongodb+srv://${mongoDbClusterUser}:${mongoDbClusterPassword}@${mongoDbDbName}.svzktk8.mongodb.net/`)
.then(() => {
	console.log(`mongodb connected at: ${new Date().toISOString()}`)
})
.catch((err) => console.log(err));

cron.schedule('0 0 0 * * *', () => {
  console.log(`Cron Job Started at: ${new Date().toISOString()}`)
  // sync all solutions with database at 00:00:00 everyday
  syncAllSolutions()
})

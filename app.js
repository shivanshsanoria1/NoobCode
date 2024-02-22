const path = require('path')

const express = require('express')
const mongoose = require('mongoose')
const cron = require('node-cron')
require('dotenv').config()

const solutionRoutes = require('./routes/solution')
const solutionStatsRoutes = require('./routes/solutionStats')
const { get404 } = require('./middleware/errorHandler')
const { syncAllSolutions } = require('./util/syncAllSolutions')

const PORT = process.env.PORT || 4000

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.use('/solutions', solutionRoutes)
app.use('/solution-stats', solutionStatsRoutes)
app.use(get404)

app.listen(PORT)
console.log(`Server Started at: ${new Date().toISOString()}`)

const mongoDbClusterUser = process.env.MONGODB_CLUSTER_USER
const mongoDbClusterPassword = process.env.MONGODB_CLUSTER_PASSWORD
const mongoDbDbName = process.env.MONGODB_DB_NAME

// connection uri: `mongodb+srv://${mongoDbClusterUser}:${mongoDbClusterPassword}@${mongoDbDbName}.svzktk8.mongodb.net/`
mongoose
.connect('mongodb://127.0.0.1:27017/noobcode_local')
.then(() => {
	console.log(`mongodb connected at: ${new Date().toISOString()}`)
})
.catch((err) => {
  console.log('MONGODB CONNECTION ERROR')
  console.log(err)
});

// sync all solutions with database at 00:00:00 everyday
cron.schedule('0 0 0 * * *', () => {
  console.log(`Cron Job Started at: ${new Date().toISOString()}`)
  syncAllSolutions()
})

//syncAllSolutions()
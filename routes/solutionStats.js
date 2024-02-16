const express = require('express');

const solutionStats = require('../controllers/solutionStats')

const router = express.Router();

router.get('/', solutionStats.getSolutionStats)

module.exports = router;
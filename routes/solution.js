const express = require('express');

const solutionController = require('../controllers/solution')

const router = express.Router();

router.get('/', solutionController.getSolution)

module.exports = router;